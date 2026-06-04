import { useEffect, useState } from 'react';
import { X, Download, FileText, ImageIcon, Film, FileIcon, Calendar, HardDrive } from 'lucide-react';
import type { Asset } from '../../types';
import { Button } from './Button';
import { format } from 'date-fns';

interface PreviewModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal = ({ asset, isOpen, onClose }: PreviewModalProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (asset?.fileBlob) {
      const url = URL.createObjectURL(asset.fileBlob);
      setBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const isImage = asset.type.startsWith('image/');
  const isVideo = asset.type.startsWith('video/');
  const isPDF = asset.type === 'application/pdf';
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = asset.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenPdfOnMobile = () => {
    if (!blobUrl) return;
    window.open(blobUrl, '_blank', 'noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[calc(100vh-2rem)] bg-white dark:bg-gray-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {isImage ? <ImageIcon className="h-5 w-5 text-purple-500" /> :
               isVideo ? <Film className="h-5 w-5 text-blue-500" /> :
               isPDF ? <FileText className="h-5 w-5 text-red-500" /> :
               <FileIcon className="h-5 w-5 text-gray-500" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold truncate leading-none mb-1">{asset.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">{asset.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row h-full">
          {/* Main Preview Area */}
          <div className="flex-grow bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 h-full overflow-hidden">
            {isImage && blobUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={blobUrl} 
                  alt={asset.name} 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            ) : isVideo && blobUrl ? (
              <div className="w-full h-full flex items-center justify-center">
                <video 
                  src={blobUrl} 
                  controls 
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                />
              </div>
            ) : isPDF && blobUrl ? (
              isMobile ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <div className="rounded-3xl bg-white/80 p-6 shadow-sm">
                    <FileText className="mx-auto mb-4 h-10 w-10 text-red-500" />
                    <p className="text-sm text-gray-500">
                      Some mobile browsers cannot display PDF previews inline. Tap Open PDF to view it in your device's built-in viewer.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-sm">
                    <Button variant="outline" size="sm" className="gap-2 w-full" onClick={handleOpenPdfOnMobile}>
                      <Download className="h-4 w-4" />
                      Open PDF
                    </Button>
                    <Button variant="primary" size="sm" className="gap-2 w-full" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <iframe 
                    src={blobUrl}
                    className="w-full h-full rounded-lg shadow-sm bg-white border-none"
                    title={asset.name}
                  />
                </div>
              )
            ) : (
              <div className="flex flex-col items-center text-center p-8">
                <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-sm mb-6">
                  <FileIcon className="h-20 w-20 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg">Preview not available for this file type</p>
                <Button variant="primary" className="mt-6 gap-2 h-12 px-8" onClick={handleDownload}>
                  <Download className="h-5 w-5" />
                  Download to View
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-gray-950 flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">File Details</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Size</p>
                    <p className="text-sm font-medium">{(asset.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Uploaded</p>
                    <p className="text-sm font-medium">{format(asset.uploadDate, 'PPP p')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Button variant="primary" className="w-full gap-2 md:hidden" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
