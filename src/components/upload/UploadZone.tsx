import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Folder } from 'lucide-react';
import { useUploadStore } from '../../store/useUploadStore';
import { motion } from 'framer-motion';

export const UploadZone = () => {
  const { addFiles } = useUploadStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const rootProps = getRootProps();

  return (
    <div
      {...rootProps}
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300 shadow-xl shadow-black/5
        ${isDragActive 
          ? 'border-blue-500 bg-blue-500/10 ring-4 ring-blue-500/5' 
          : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-gray-900/30'}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01, translateY: -2 }}
        whileTap={{ scale: 0.99 }}
        className="h-full"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
        <motion.div 
          animate={isDragActive ? { y: [0, -12, 0], scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mb-6 rounded-2xl bg-blue-500/10 p-5 text-blue-500 group-hover:bg-blue-500/20 transition-colors shadow-inner"
        >
          <Upload className="h-10 w-10" />
        </motion.div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {isDragActive ? 'Drop to upload' : 'Click or drag files here'}
        </h3>
        <p className="mb-8 text-gray-500 dark:text-gray-400 max-w-[240px] leading-relaxed">
          Supports multiple files and folders. Max file size 50MB.
        </p>
        <div className="flex gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
            <File className="h-4 w-4" />
            <span>Files</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
            <Folder className="h-4 w-4" />
            <span>Folders</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </div>
  );
};
