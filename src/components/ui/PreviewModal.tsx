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
    setBlobUrl(null);
  }, [asset]);

  if (!isOpen || !asset) return null;

  const isImage = asset.type.startsWith('image/');
  const isVideo = asset.type.startsWith('video/');
  const isPDF = asset.type === 'application/pdf';

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = asset.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 md:p-8" onClick={onClose}>
      <section className="relative w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-slate-100">
              {isImage ? <ImageIcon className="h-5 w-5 text-violet-300" /> :
               isVideo ? <Film className="h-5 w-5 text-sky-300" /> :
               isPDF ? <FileText className="h-5 w-5 text-rose-300" /> :
               <FileIcon className="h-5 w-5 text-slate-400" />}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-white">{asset.name}</h2>
              <p className="truncate text-xs uppercase tracking-[0.24em] text-slate-500">{asset.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex gap-2 border-slate-700 text-slate-200 hover:bg-slate-800 transition-none" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-200 hover:bg-slate-800 transition-none" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="grid h-full min-h-[calc(90vh-80px)] grid-cols-1 md:grid-cols-[2fr_360px] overflow-hidden">
          <div className="relative overflow-hidden bg-slate-950 p-6 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {isImage && blobUrl ? (
                <img
                  src={blobUrl}
                  alt={asset.name}
                  className="max-h-full max-w-full rounded-2xl object-contain"
                />
              ) : isVideo && blobUrl ? (
                <video
                  src={blobUrl}
                  controls
                  className="max-h-full max-w-full rounded-2xl bg-black"
                />
              ) : isPDF && blobUrl ? (
                <iframe
                  src={blobUrl}
                  title={asset.name}
                  className="h-full w-full rounded-2xl bg-white"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-slate-900 p-10 text-center">
                  <FileIcon className="h-16 w-16 text-slate-500" />
                  <p className="text-sm text-slate-400">Preview not available for this file type.</p>
                  <Button variant="primary" size="sm" className="mt-3 gap-2 transition-none" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    Download file
                  </Button>
                </div>
              )}
            </div>
          </div>

          <aside className="border-t border-white/10 bg-slate-950/95 p-6 md:border-t-0 md:border-l flex flex-col gap-6 overflow-y-auto">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 mb-4">File details</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Size</p>
                    <p className="text-sm font-medium text-white">{(asset.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Uploaded</p>
                    <p className="text-sm font-medium text-white">{format(asset.uploadDate, 'PPP p')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Actions</p>
              <Button variant="primary" className="w-full gap-2 transition-none" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};
