import { FileIcon, ImageIcon, Film, FileText, Trash2, Calendar, HardDrive, GripVertical, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Asset, ViewMode } from '../../types';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { useAssetStore } from '../../store/useAssetStore';
import { useEffect, useState, useRef } from 'react';

import { motion } from 'framer-motion';

interface AssetItemProps {
  asset: Asset;
  viewMode: ViewMode;
  onPreview: (asset: Asset) => void;
}

export const AssetItem = ({ asset, viewMode, onPreview }: AssetItemProps) => {
  const { removeAsset, selectedIds, toggleSelection, renameAsset } = useAssetStore();
  const isSelected = selectedIds.includes(asset.id);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(asset.previewUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(asset.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleRename = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newName.trim() && newName !== asset.name) {
      await renameAsset(asset.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewName(asset.name);
    setIsEditing(false);
  };

  useEffect(() => {
    // If the existing previewUrl is a blob URL from a previous session, it will be broken.
    // We generate a fresh one from the stored fileBlob.
    if (asset.fileBlob && asset.type.startsWith('image/')) {
      const url = URL.createObjectURL(asset.fileBlob);
      setThumbnailUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [asset.fileBlob, asset.type]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: asset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const getFileIcon = () => {
    if (asset.type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-purple-500" />;
    if (asset.type.startsWith('video/')) return <Film className="h-5 w-5 text-blue-500" />;
    if (asset.type === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    return <FileIcon className="h-5 w-5 text-gray-500" />;
  };

  if (viewMode === 'list') {
    return (
      <motion.div 
        ref={setNodeRef}
        style={style}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        whileHover={{ scale: 1.005, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
        className={`group flex items-center gap-4 rounded-lg border p-3 transition-all cursor-pointer
          ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800'}`}
        onClick={() => onPreview(asset)}
      >
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-200"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <input 
              type="checkbox" 
              checked={isSelected} 
              onChange={() => toggleSelection(asset.id)}
              className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-shrink-0 overflow-hidden">
          {thumbnailUrl ? (
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={thumbnailUrl} 
              alt={asset.name} 
              className="h-10 w-10 rounded object-cover" 
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-800">
              {getFileIcon()}
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0 grid grid-cols-4 gap-4">
          <div className="col-span-2 min-w-0">
            {isEditing ? (
              <form onSubmit={handleRename} className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-gray-800 border border-blue-500 rounded px-1.5 py-0.5 text-sm focus:outline-none text-white"
                  onBlur={() => handleRename()}
                />
                <button type="submit" className="text-green-500 hover:text-green-400 p-1">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={handleCancel} className="text-red-500 hover:text-red-400 p-1">
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <p className="truncate text-sm font-medium">{asset.name}</p>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="opacity-0 group-hover/title:opacity-100 p-1 hover:bg-gray-700 rounded transition-opacity"
                >
                  <Edit2 className="h-3 w-3 text-gray-400" />
                </motion.button>
              </div>
            )}
            <p className="text-xs text-gray-500">{asset.type}</p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <HardDrive className="h-3 w-3" />
              {(asset.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {format(asset.uploadDate, 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400" onClick={() => removeAsset(asset.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative rounded-xl border p-2 transition-all hover:shadow-xl cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-gray-950/50'}`}
      onClick={() => onPreview(asset)}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded bg-black/50 backdrop-blur-md shadow-sm text-gray-300 hover:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => toggleSelection(asset.id)}
            className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="aspect-square overflow-hidden rounded-lg bg-gray-900 mb-2 relative">
        {thumbnailUrl ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={thumbnailUrl} 
            alt={asset.name} 
            className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-600">
            {getFileIcon()}
          </div>
        )}
      </div>

      <div className="px-1">
        {isEditing ? (
          <form onSubmit={handleRename} className="flex items-center gap-1 mb-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-gray-800 border border-blue-500 rounded px-1 py-0.5 text-xs focus:outline-none text-white"
              onBlur={() => handleRename()}
            />
          </form>
        ) : (
          <div className="flex items-center justify-between gap-1 group/title mb-1">
            <p className="truncate text-sm font-medium">{asset.name}</p>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="opacity-0 group-hover/title:opacity-100 p-0.5 hover:bg-gray-800 rounded transition-opacity"
            >
              <Edit2 className="h-2.5 w-2.5 text-gray-400" />
            </motion.button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500">{(asset.size / 1024 / 1024).toFixed(2)} MB</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
            onClick={(e) => {
              e.stopPropagation();
              removeAsset(asset.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
