import type { FileMetadata } from '../types';

export const validateFile = async (file: File, existingFiles: string[]): Promise<string | null> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Max size: 10MB
  if (file.size > 10 * 1024 * 1024) {
    return 'File size exceeds 10MB limit';
  }

  // Allowed types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'];
  if (!allowedTypes.includes(file.type)) {
    return 'Unsupported file type';
  }

  // Duplicate detection (by name)
  if (existingFiles.includes(file.name)) {
    return 'Duplicate file detected';
  }

  return null;
};

export const uploadFileMock = async (
  _fileMetadata: FileMetadata,
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        onProgress(progress);
        clearInterval(interval);
        
        // Simulate random failure (5% chance)
        if (Math.random() < 0.05) {
          reject(new Error('Network error during upload'));
        } else {
          resolve();
        }
      } else {
        onProgress(progress);
      }
    }, 300);
  });
};
