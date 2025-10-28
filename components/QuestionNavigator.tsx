import React, { useState, useEffect } from 'react';
import { type Answer } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionNavigatorProps {
  isOpen: boolean;
  totalQuestions: number;
  answers: Answer[];
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 24;

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  isOpen,
  totalQuestions,
  answers,
  currentQuestionIndex,
  onNavigate,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // When modal opens, jump to the page with the current question
      const initialPage = Math.floor(currentQuestionIndex / ITEMS_PER_PAGE);
      setCurrentPage(initialPage);
    }
  }, [isOpen, currentQuestionIndex]);

  const getStatus = (index: number) => {
    const answer = answers.find(a => a.questionIndex === index);
    if (answer) {
      return answer.isCorrect ? 'correct' : 'incorrect';
    }
    return 'unanswered';
  };

  const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const questionsOnPage = Array.from({ length: totalQuestions }, (_, i) => i)
    .slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
     <AnimatePresence>
      {isOpen && (
        <motion.div
          key="navigator-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="navigator-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center p-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-slate-100">Question Navigator</h3>
              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="Close navigator">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="p-4 grid grid-cols-6 gap-2">
              {questionsOnPage.map((index) => {
                const status = getStatus(index);
                const isCurrent = index === currentQuestionIndex;

                let buttonClasses = "w-full aspect-square flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 border-2 ";
                
                if (isCurrent) {
                  buttonClasses += "border-cyan-400 scale-110 shadow-lg shadow-cyan-500/20 ";
                } else {
                  buttonClasses += "border-transparent ";
                }
                
                switch (status) {
                  case 'correct':
                    buttonClasses += "bg-green-600 hover:bg-green-500 text-white";
                    break;
                  case 'incorrect':
                    buttonClasses += "bg-red-600 hover:bg-red-500 text-white";
                    break;
                  default: // unanswered
                    buttonClasses += "bg-slate-700 hover:bg-slate-600 text-slate-300";
                    break;
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => onNavigate(index)}
                    className={buttonClasses}
                    aria-label={`Go to question ${index + 1}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {totalPages > 1 && (
              <footer className="p-4 border-t border-slate-700 flex justify-between items-center">
                <button onClick={handlePrevPage} disabled={currentPage === 0} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="font-semibold text-slate-400 text-sm">
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
