
import React from 'react';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isAnswered: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ onPrevious, onNext, isFirstQuestion, isLastQuestion, isAnswered }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center">
      <button 
        onClick={onPrevious} 
        disabled={isFirstQuestion}
        className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button 
        onClick={onNext}
        disabled={!isAnswered}
        className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLastQuestion ? 'Finish Quiz' : 'Next'}
      </button>
    </div>
  );
};
