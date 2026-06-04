import { create } from 'zustand';
import type { Asset, SortField, SortOrder, ViewMode } from '../types';
import { db } from '../api/db';

interface AssetState {
  assets: Asset[];
  viewMode: ViewMode;
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  selectedIds: string[];
  isLoading: boolean;
  
  fetchAssets: () => Promise<void>;
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
  removeMultipleAssets: (ids: string[]) => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSort: (field: SortField, order: SortOrder) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  reorderAssets: (startIndex: number, endIndex: number) => Promise<void>;
  renameAsset: (id: string, newName: string) => Promise<void>;
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  viewMode: 'list',
  searchQuery: '',
  sortField: 'uploadDate',
  sortOrder: 'desc',
  selectedIds: [],
  isLoading: false,

  fetchAssets: async () => {
    set({ isLoading: true });
    try {
      const storedAssets = await db.assets.orderBy('order').toArray();
      const assets: Asset[] = storedAssets.map(sa => ({
        id: sa.id,
        name: sa.name,
        size: sa.size,
        type: sa.type,
        uploadDate: sa.uploadDate,
        previewUrl: sa.previewUrl,
        fileBlob: sa.fileBlob,
        status: 'success'
      }));
      set({ assets });
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setAssets: (assets) => set({ assets }),

  addAsset: async (asset) => {
    const { assets } = get();
    const order = assets.length;
    
    if (asset.fileBlob) {
      await db.assets.add({
        id: asset.id,
        name: asset.name,
        size: asset.size,
        type: asset.type,
        uploadDate: asset.uploadDate,
        fileBlob: asset.fileBlob,
        previewUrl: asset.previewUrl,
        order
      });
    }
    
    set((state) => ({ assets: [asset, ...state.assets] }));
  },

  removeAsset: async (id) => {
    await db.assets.delete(id);
    set((state) => ({
      assets: state.assets.filter((a) => a.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }));
  },

  removeMultipleAssets: async (ids) => {
    await db.assets.bulkDelete(ids);
    set((state) => ({
      assets: state.assets.filter((a) => !ids.includes(a.id)),
      selectedIds: state.selectedIds.filter((sid) => !ids.includes(sid)),
    }));
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSort: (sortField, sortOrder) => set({ sortField, sortOrder }),
  toggleSelection: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds.filter((sid) => sid !== id)
      : [...state.selectedIds, id],
  })),
  clearSelection: () => set({ selectedIds: [] }),

  reorderAssets: async (startIndex, endIndex) => {
    const { assets } = get();
    const newAssets = [...assets];
    const [removed] = newAssets.splice(startIndex, 1);
    newAssets.splice(endIndex, 0, removed);
    
    // Update order in DB
    const updates = newAssets.map((asset, index) => 
      db.assets.update(asset.id, { order: index })
    );
    await Promise.all(updates);

    set({ assets: newAssets });
  },

  renameAsset: async (id, newName) => {
    await db.assets.update(id, { name: newName });
    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, name: newName } : a)),
    }));
  },
}));
