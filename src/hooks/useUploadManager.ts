import { useCallback, useEffect } from 'react';
import { useUploadStore } from '../store/useUploadStore';
import { useAssetStore } from '../store/useAssetStore';
import { validateFile, uploadFileMock } from '../api/uploadService';
import type { Asset } from '../types';

export const useUploadManager = () => {
  const { queue, updateFileStatus, removeFile } = useUploadStore();
  const { assets, addAsset } = useAssetStore();

  const processQueue = useCallback(async () => {
    const idleFiles = queue.filter((f) => f.status === 'idle');
    
    // Process up to 3 files concurrently
    const activeUploads = queue.filter((f) => f.status === 'uploading' || f.status === 'validating').length;
    const slotsAvailable = 3 - activeUploads;

    if (idleFiles.length > 0 && slotsAvailable > 0) {
      const filesToProcess = idleFiles.slice(0, slotsAvailable);

      filesToProcess.forEach(async (fileMetadata) => {
        try {
          // 1. Validation
          updateFileStatus(fileMetadata.id, 'validating');
          const existingFileNames = assets.map((a) => a.name);
          const validationError = await validateFile(fileMetadata.file, existingFileNames);

          if (validationError) {
            updateFileStatus(fileMetadata.id, 'failed', 0, validationError);
            return;
          }

          // 2. Upload
          updateFileStatus(fileMetadata.id, 'uploading', 0);
          await uploadFileMock(fileMetadata, (progress) => {
            updateFileStatus(fileMetadata.id, 'uploading', progress);
          });

          // 3. Success
          updateFileStatus(fileMetadata.id, 'success', 100);
          
          // Add to assets library
          const newAsset: Asset = {
            id: fileMetadata.id,
            name: fileMetadata.name,
            size: fileMetadata.size,
            type: fileMetadata.type,
            uploadDate: new Date(),
            previewUrl: fileMetadata.previewUrl,
            status: 'success',
            fileBlob: fileMetadata.file, // Pass the original file as blob
          };
          await addAsset(newAsset);

          // Remove from queue after a short delay
          setTimeout(() => {
            removeFile(fileMetadata.id);
          }, 2000);

        } catch (error) {
          updateFileStatus(fileMetadata.id, 'failed', 0, (error as Error).message);
        }
      });
    }
  }, [queue, assets, updateFileStatus, addAsset, removeFile]);

  useEffect(() => {
    processQueue();
  }, [processQueue]);

  return { queue };
};
