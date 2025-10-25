import React from 'react';
import { type Answer, type Question } from '../types';
import { motion } from 'framer-motion';

interface ResultCardProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
  onChangeQuiz: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ answers, questions, onRestart, onChangeQuiz }) => {
  const correctAnswersCount = answers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const score = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <motion.div 
      key="result-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Quiz Complete!</h2>
      <p className="text-slate-300 text-lg mb-6">Here's how you did:</p>
      
      <div className="mb-8">
        <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor()}`}>{Math.round(score)}%</div>
        <p className="text-slate-400 mt-2">
          You answered <span className="font-bold text-white">{correctAnswersCount}</span> out of <span className="font-bold text-white">{totalQuestions}</span> questions correctly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-10 py-4 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transition-all transform hover:scale-105"
        >
          Try Again
        </button>
         <button
          onClick={onChangeQuiz}
          className="w-full sm:w-auto px-10 py-4 bg-slate-700 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-600 transition-colors"
        >
          Change Quiz
        </button>
      </div>
    </motion.div>
  );
};
