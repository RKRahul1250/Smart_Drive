import { create } from 'zustand';
import type { FileMetadata, FileStatus } from '../types';

interface UploadState {
  queue: FileMetadata[];
  addFiles: (files: File[]) => void;
  updateFileStatus: (id: string, status: FileStatus, progress?: number, error?: string) => void;
  removeFile: (id: string) => void;
  clearQueue: () => void;
  retryUpload: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  queue: [],
  addFiles: (files) => {
    const newFiles: FileMetadata[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'idle',
      progress: 0,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));
    set((state) => ({ queue: [...state.queue, ...newFiles] }));
  },
  updateFileStatus: (id, status, progress = 0, error) => {
    set((state) => ({
      queue: state.queue.map((f) =>
        f.id === id ? { ...f, status, progress, error } : f
      ),
    }));
  },
  removeFile: (id) => {
    set((state) => ({
      queue: state.queue.filter((f) => f.id !== id),
    }));
  },
  clearQueue: () => set({ queue: [] }),
  retryUpload: (id) => {
    set((state) => ({
      queue: state.queue.map((f) =>
        f.id === id ? { ...f, status: 'idle', progress: 0, error: undefined } : f
      ),
    }));
  },
}));
