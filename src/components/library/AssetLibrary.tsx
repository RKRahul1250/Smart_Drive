import { useMemo, useState, useEffect } from 'react';
import { LayoutGrid, List, Search, ArrowUpDown, Trash2, Filter, Loader2 } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useAssetStore } from '../../store/useAssetStore';
import { AssetItem } from './AssetItem';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { PreviewModal } from '../ui/PreviewModal';
import type { Asset } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export const AssetLibrary = () => {
  const { 
    assets, 
    viewMode, 
    setViewMode, 
    searchQuery, 
    setSearchQuery,
    sortField,
    sortOrder,
    setSort,
    selectedIds,
    removeMultipleAssets,
    setAssets,
    fetchAssets,
    isLoading
  } = useAssetStore();

  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredAndSortedAssets = useMemo(() => {
    return assets
      .filter((asset) => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (searchQuery) return 0; 
        
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'name') return a.name.localeCompare(b.name) * factor;
        if (sortField === 'size') return (a.size - b.size) * factor;
        if (sortField === 'uploadDate') return (a.uploadDate.getTime() - b.uploadDate.getTime()) * factor;
        return 0;
      });
  }, [assets, searchQuery, sortField, sortOrder]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = assets.findIndex((a) => a.id === active.id);
      const newIndex = assets.findIndex((a) => a.id === over.id);
      
      const newAssets = arrayMove(assets, oldIndex, newIndex);
      setAssets(newAssets);
    }
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };

  return (
    <Card className="mb-12 overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-white">Asset Library</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-800 p-1 bg-gray-900/50">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className={`h-8 w-8 transition-all ${viewMode === 'list' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className={`h-8 w-8 transition-all ${viewMode === 'grid' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <AnimatePresence>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="gap-2 shadow-lg shadow-red-500/20"
                    onClick={() => removeMultipleAssets(selectedIds)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete ({selectedIds.length})
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading && assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-500 animate-pulse">Loading your assets...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-grow group">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-gray-600 dark:border-gray-500 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => toggleSort('uploadDate')}>
                  <ArrowUpDown className="h-4 w-4" />
                  Date
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-gray-600 dark:border-gray-500 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => toggleSort('name')}>
                  <ArrowUpDown className="h-4 w-4" />
                  Name
                </Button>
              </div>
            </div>

            {filteredAndSortedAssets.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 rounded-full bg-gray-900 p-6 shadow-inner">
                  <Filter className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-white">No assets found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-[200px] mx-auto">
                  {searchQuery ? 'Try adjusting your search query' : 'Start by uploading some files to your drive'}
                </p>
              </motion.div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredAndSortedAssets.map(a => a.id)}
                  strategy={viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
                >
                  <motion.div 
                    layout
                    className={viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredAndSortedAssets.map((asset) => (
                        <AssetItem 
                          key={asset.id} 
                          asset={asset} 
                          viewMode={viewMode} 
                          onPreview={(a) => setPreviewAsset(a)}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}
      </CardContent>

      <PreviewModal 
        asset={previewAsset}
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
      />
    </Card>
  );
};
