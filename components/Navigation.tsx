
import React from 'react';

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onToggleNavigator: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onPrevious, onNext, isFirstQuestion, isLastQuestion, onToggleNavigator }) => {
  return (
    <div className="
      fixed bottom-0 left-0 right-0 z-10 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 flex justify-between items-center
      sm:static sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:mt-8 sm:pt-6
    ">
      <button 
        onClick={onPrevious} 
        disabled={isFirstQuestion}
        className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <button
        onClick={onToggleNavigator}
        className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
        aria-label="Open question navigator"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      <button 
        onClick={onNext}
        className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLastQuestion ? 'Finish Quiz' : 'Next'}
      </button>
    </div>
  );
};
