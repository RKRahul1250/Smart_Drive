import { X, RefreshCcw, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useUploadStore } from '../../store/useUploadStore';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const UploadQueue = () => {
  const { queue, removeFile, retryUpload } = useUploadStore();

  if (queue.length === 0) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'validating': return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'uploading': return <RefreshCcw className="h-5 w-5 text-blue-500 animate-spin" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="mt-8 border-blue-500/20 shadow-lg shadow-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            Upload Queue
            <span className="text-sm font-normal text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
              {queue.length} file{queue.length !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence mode="popLayout">
            {queue.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-4 rounded-lg border border-gray-800 p-4 bg-gray-900/50 hover:bg-gray-900/80 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <div className="flex items-center gap-1">
                      {item.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-red-500/10 text-red-400"
                          onClick={() => retryUpload(item.id)}
                        >
                          <RefreshCcw className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-gray-800 text-gray-400"
                        onClick={() => removeFile(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {(item.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {item.status === 'failed' && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-red-400 mb-2 font-medium"
                    >
                      {item.error || 'Upload failed'}
                    </motion.p>
                  )}
                  
                  {(item.status === 'uploading' || item.status === 'success' || item.status === 'failed') && (
                    <ProgressBar progress={item.progress} status={item.status} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
