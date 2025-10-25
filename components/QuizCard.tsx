import React, { useState, useEffect } from 'react';
import { type Question, type Option, type Answer } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  userAnswer?: Answer;
  onAnswer: (questionIndex: number, selectedOptionIndices: number[]) => void;
  onUnsubmit: (questionIndex: number) => void;
}

const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);


export const QuizCard: React.FC<QuizCardProps> = ({ question, questionIndex, userAnswer, onAnswer, onUnsubmit }) => {
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [expandedExplanations, setExpandedExplanations] = useState<number[]>([]);

  useEffect(() => {
    const submitted = !!userAnswer;
    setIsSubmitted(submitted);
    setSelectedOptionIndices(userAnswer?.selectedOptionIndices ?? []);
    if (!submitted) {
       setExpandedExplanations([]); // Collapse all explanations on new question
    }
  }, [userAnswer, questionIndex]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    
    if (question.isMultiSelect) {
      setSelectedOptionIndices(prev => 
        prev.includes(optionIndex)
          ? prev.filter(id => id !== optionIndex)
          : [...prev, optionIndex]
      );
    } else {
      setSelectedOptionIndices([optionIndex]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionIndices.length === 0) return;
    onAnswer(questionIndex, selectedOptionIndices);
    setIsSubmitted(true);
  };
  
  const handleUnsubmit = () => {
    onUnsubmit(questionIndex);
  }

  const handleToggleExplanation = (optionIndex: number) => {
    setExpandedExplanations(prev =>
      prev.includes(optionIndex)
        ? prev.filter(id => id !== optionIndex)
        : [...prev, optionIndex]
    );
  };

  const getOptionClasses = (option: Option, optionIndex: number): string => {
    const baseClasses = "w-full text-left p-4 my-2 rounded-lg border-2 transition-all duration-300 flex items-start group";
    
    if (isSubmitted) {
        if (option.isCorrect) {
            return `${baseClasses} bg-green-500/20 border-green-500 cursor-default`;
        }
        if (userAnswer?.selectedOptionIndices.includes(optionIndex)) {
            return `${baseClasses} bg-red-500/20 border-red-500 cursor-default`;
        }
        return `${baseClasses} bg-slate-700 border-slate-600 cursor-default`;
    }

    if (selectedOptionIndices.includes(optionIndex)) {
        return `${baseClasses} bg-cyan-500/30 border-cyan-400 cursor-pointer`;
    }

    return `${baseClasses} bg-slate-700 border-slate-600 hover:bg-slate-600/50 hover:border-slate-500 cursor-pointer`;
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-slate-100">{question.questionText}</h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index}>
            <div
              onClick={() => handleOptionSelect(index)}
              className={getOptionClasses(option, index)}
              role={question.isMultiSelect ? 'checkbox' : 'radio'}
              aria-checked={selectedOptionIndices.includes(index)}
              tabIndex={isSubmitted ? -1 : 0}
              onKeyDown={(e) => { if (!isSubmitted && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); handleOptionSelect(index); } }}
            >
              <div className="flex-shrink-0 w-6 h-6 mr-4 mt-1">
                {isSubmitted && option.isCorrect && <CheckCircleIcon className="w-6 h-6 text-green-400" />}
                {isSubmitted && !option.isCorrect && <XCircleIcon className="w-6 h-6 text-red-400" />}
                {!isSubmitted && (
                    question.isMultiSelect ? (
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-300 ${selectedOptionIndices.includes(index) ? 'border-cyan-400 bg-cyan-500' : 'border-slate-500 group-hover:border-cyan-500'}`}>
                           {selectedOptionIndices.includes(index) && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                    ) : (
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${selectedOptionIndices.includes(index) ? 'border-cyan-400 bg-cyan-500' : 'border-slate-500 group-hover:border-cyan-500'}`}>
                            {selectedOptionIndices.includes(index) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                    )
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-slate-200 break-words">{option.text}</p>
                {isSubmitted && (
                   <div className="mt-2">
                    <div className="hidden sm:block"> {/* Desktop: Show explanation directly */}
                      <p className={`text-sm ${option.isCorrect ? 'text-green-300' : 'text-red-300'} break-words`}>
                        {option.explanation}
                      </p>
                    </div>

                    <div className="block sm:hidden"> {/* Mobile: Show toggle button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExplanation(index);
                        }}
                        className="flex items-center text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                        aria-expanded={expandedExplanations.includes(index)}
                        aria-controls={`explanation-${index}`}
                      >
                        <span>{expandedExplanations.includes(index) ? 'Hide' : 'Show'} explanation</span>
                        <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform duration-300 ${expandedExplanations.includes(index) ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedExplanations.includes(index) && (
                          <motion.div
                            id={`explanation-${index}`}
                            className="overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className={`pt-2 text-sm ${option.isCorrect ? 'text-green-300' : 'text-red-300'} break-words`}>
                              {option.explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        {isSubmitted ? (
            <button 
                onClick={handleUnsubmit}
                className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-500 transition-all"
            >
                Unsubmit
            </button>
        ) : (
            <button 
                onClick={handleSubmit}
                disabled={selectedOptionIndices.length === 0}
                className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Submit
            </button>
        )}
      </div>
    </div>
  );
};