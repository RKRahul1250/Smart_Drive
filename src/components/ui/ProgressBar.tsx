import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  status: string;
}

export const ProgressBar = ({ progress, status }: ProgressBarProps) => {
  const getColor = () => {
    if (status === 'failed') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (status === 'success') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    return 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5 text-[10px] font-bold uppercase tracking-wider">
        <span className="text-gray-400">{status}</span>
        <span className="text-blue-400">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className={`h-full rounded-full ${getColor()}`}
        />
      </div>
    </div>
  );
};
