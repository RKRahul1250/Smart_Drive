import { useMemo, useEffect, useState, useRef } from 'react';
import { LayoutGrid, List, Search, ArrowUpDown, Trash2, Filter, Loader2, X, HardDrive, Calendar } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Asset } from '../../types';
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
import { format } from 'date-fns';
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
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!previewAsset) {
      setPreviewSource(null);
      return;
    }

    if (previewAsset.fileBlob) {
      const url = URL.createObjectURL(previewAsset.fileBlob);
      setPreviewSource(url);
      return () => URL.revokeObjectURL(url);
    }

    setPreviewSource(previewAsset.previewUrl ?? null);
  }, [previewAsset]);

  useEffect(() => {
    if (previewAsset && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [previewAsset]);

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
                className={`h-10 w-10 transition-all ${viewMode === 'list' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className={`h-10 w-10 transition-all ${viewMode === 'grid' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-5 w-5" />
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
        {previewAsset && (
          <div
            ref={previewRef}
            className="mb-6 rounded-3xl border border-gray-800 bg-gray-950 p-6"
          >
            <div className="mx-auto flex w-full max-w-6xl flex-col rounded-[2rem] border border-slate-800 bg-slate-950 p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">Preview</p>
                <p className="text-lg font-semibold text-white">{previewAsset.name}</p>
                <p className="text-xs text-gray-500">{previewAsset.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-gray-700 bg-gray-900 p-2 text-gray-400 transition duration-200 hover:bg-gray-800 hover:text-white active:scale-95"
                  onClick={() => setPreviewAsset(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
              <div className="rounded-3xl border border-gray-800 bg-black p-4 flex items-center justify-center min-h-[24rem]">
                {previewSource ? (
                  previewAsset.type.startsWith('image/') ? (
                    <img
                      src={previewSource}
                      alt={previewAsset.name}
                      className="h-full w-full max-h-[80vh] object-contain rounded-3xl"
                    />
                  ) : previewAsset.type.startsWith('video/') ? (
                    <video controls className="h-full w-full rounded-3xl bg-black">
                      <source src={previewSource} type={previewAsset.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : previewAsset.type === 'application/pdf' ? (
                    <iframe
                      src={previewSource}
                      title={previewAsset.name}
                      className="h-full w-full rounded-3xl bg-white"
                    />
                  ) : (
                    <object
                      data={previewSource}
                      type={previewAsset.type}
                      className="h-full w-full rounded-3xl bg-white"
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gray-900 text-center p-8 text-sm text-gray-400">
                        Preview not available in this browser. Use Download to open the file.
                      </div>
                    </object>
                  )
                ) : (
                  <div className="flex h-80 w-full items-center justify-center rounded-3xl bg-gray-900 text-center p-8 text-sm text-gray-400">
                    Preview not available for this file.
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">File details</p>
                  <div className="mt-4 space-y-4 text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="font-medium text-white">{(previewAsset.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Uploaded</p>
                        <p className="font-medium text-white">{format(previewAsset.uploadDate, 'PPP p')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">Actions</p>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    onClick={() => {
                      if (!previewSource) return;
                      const url = previewSource;
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = previewAsset.name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
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
                  <ArrowUpDown className="h-5 w-5" />
                  Date
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-gray-600 dark:border-gray-500 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => toggleSort('name')}>
                  <ArrowUpDown className="h-5 w-5" />
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
                  <div className={viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}>
                    {filteredAndSortedAssets.map((asset) => (
                      <AssetItem 
                        key={asset.id} 
                        asset={asset} 
                        viewMode={viewMode}
                        onPreview={() => setPreviewAsset(asset)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
