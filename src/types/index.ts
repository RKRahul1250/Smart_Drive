export type FileStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'failed' | 'cancelled';

export interface FileMetadata {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  error?: string;
  uploadDate?: Date;
  previewUrl?: string;
}

export interface Asset extends Omit<FileMetadata, 'file' | 'status' | 'progress'> {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  previewUrl?: string;
  status: 'success';
  fileBlob?: Blob; // Added for persistence
}

export type SortField = 'name' | 'size' | 'uploadDate';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';
