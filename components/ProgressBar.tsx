
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-slate-400">
          Question {current} of {total}
        </p>
        <p className="text-sm font-bold text-cyan-400">{Math.round(progressPercentage)}%</p>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <motion.div 
          className="bg-cyan-500 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
