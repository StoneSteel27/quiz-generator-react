import React, { useState, useCallback, useEffect } from 'react';
import { QuizCard } from './components/QuizCard';
import { Navigation } from './components/Navigation';
import { ProgressBar } from './components/ProgressBar';
import { ResultCard } from './components/ResultCard';
import { QuestionNavigator } from './components/QuestionNavigator';
import { type Question, type Answer } from './types';
import { motion, AnimatePresence } from 'framer-motion';

// --- Confirmation Modal ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirmation-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="confirmation-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
              <div className="text-slate-400">{children}</div>
            </div>
            <footer className="px-6 py-4 bg-slate-800/50 flex justify-end items-center gap-3 border-t border-slate-700">
              <button onClick={onConfirm} className="px-4 py-2 w-full bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-500 transition-all">
                Confirm
              </button>
              <button onClick={onClose} className="px-4 py-2 w-full bg-slate-700 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors">
                Cancel
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Storage Utilities ---
const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const clearCookies = () => {
    setCookie('quizUrl', '', -1);
    setCookie('quizProgress', '', -1);
};

const clearLocalStorage = () => {
    localStorage.removeItem('localQuizData');
    localStorage.removeItem('localQuizProgress');
}

// --- Demo Data and Template ---
const DEMO_QUIZ_DATA: Question[] = [
  {
    "questionText": "What are the correct ways to write a component in React? (Select all that apply)",
    "isMultiSelect": true,
    "options": [
      {
        "text": "function MyComponent() { return <div>Hello</div>; }",
        "isCorrect": true,
        "explanation": "This is a standard functional component, the modern and recommended way to write React components."
      },
      {
        "text": "<component>MyComponent</component>",
        "isCorrect": false,
        "explanation": "This syntax is not valid for defining a component in JSX or JavaScript."
      },
      {
        "text": "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
        "isCorrect": true,
        "explanation": "This is a class component. While still valid, functional components with hooks are now more common."
      }
    ]
  },
  {
    "questionText": "What is the purpose of the `useEffect` hook?",
    "isMultiSelect": false,
    "options": [
      {
        "text": "To manage component state",
        "isCorrect": false,
        "explanation": "`useState` or `useReducer` are the hooks used for managing component state."
      },
      {
        "text": "To perform side effects in functional components",
        "isCorrect": true,
        "explanation": "`useEffect` is used for side effects like data fetching, subscriptions, or manually changing the DOM."
      },
      {
        "text": "To create a reference to a DOM element",
        "isCorrect": false,
        "explanation": "`useRef` is the hook used for creating references to DOM elements or for storing any mutable value."
      }
    ]
  }
];
const JSON_TEMPLATE = JSON.stringify(DEMO_QUIZ_DATA, null, 2);


// --- Manual Viewer Component ---
const ManualViewer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON_TEMPLATE).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto text-left py-8 px-4">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Quiz JSON Format</h1>
                <button onClick={onBack} className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition-colors">
                    &larr; Back to Loader
                </button>
            </header>
            <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-8 text-slate-300">
                <div className="relative border border-slate-700 p-4 rounded-lg">
                    <button onClick={handleCopy} className="absolute top-4 right-4 px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-500 transition-all text-sm disabled:bg-green-600">
                        {isCopied ? 'Copied!' : 'Copy Example'}
                    </button>
                    <h2 className="text-xl font-semibold text-slate-100 mb-3">Complete Example</h2>
                    <pre className="bg-slate-900/70 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{JSON_TEMPLATE}</code>
                    </pre>
                </div>
                
                 <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-100 border-b border-slate-600 pb-2">Structure Guide</h2>
                    <div>
                        <h3 className="text-lg font-bold text-cyan-400">The `Question` Object</h3>
                        <p className="text-sm text-slate-400 mb-2">Each object in the root array is a question.</p>
                        <ul className="list-disc list-inside space-y-1 text-sm bg-slate-700/50 p-4 rounded-md">
                            <li><code className="bg-slate-900 px-1 rounded-sm">questionText</code>: (String, required) The question itself.</li>
                            <li><code className="bg-slate-900 px-1 rounded-sm">options</code>: (Array, required) An array of `Option` objects.</li>
                            <li><code className="bg-slate-900 px-1 rounded-sm">isMultiSelect</code>: (Boolean, optional) Set to `true` for checkbox-style questions. Defaults to `false`.</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-cyan-400">The `Option` Object</h3>
                        <p className="text-sm text-slate-400 mb-2">Each object inside the `options` array is a choice.</p>
                         <ul className="list-disc list-inside space-y-1 text-sm bg-slate-700/50 p-4 rounded-md">
                            <li><code className="bg-slate-900 px-1 rounded-sm">text</code>: (String, required) The answer text.</li>
                            <li><code className="bg-slate-900 px-1 rounded-sm">isCorrect</code>: (Boolean, required) `true` if this is a correct answer.</li>
                            <li><code className="bg-slate-900 px-1 rounded-sm">explanation</code>: (String, required) Feedback shown after answering.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Quiz Loader Component ---
interface QuizLoaderProps {
  onUrlSubmit: (url: string) => void;
  onFileLoad: (file: File) => void;
  onTryDemo: () => void;
  onShowManual: () => void;
  isLoading: boolean;
  error?: string | null;
}
const QuizLoader: React.FC<QuizLoaderProps> = ({ onUrlSubmit, onFileLoad, onTryDemo, onShowManual, isLoading, error }) => {
  const [url, setUrl] = useState('');
  
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">JSON to Quiz</h1>
      <p className="text-slate-400 mt-2 mb-8">An interactive quiz generator.</p>
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8">
        <form onSubmit={handleUrlSubmit}>
          <label htmlFor="url-input" className="block text-left font-semibold mb-2 text-slate-300">Load from URL</label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/quiz.json or a Gist URL"
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
          <button type="submit" disabled={isLoading || !url} className="w-full mt-4 px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-md hover:bg-cyan-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed">
            {isLoading ? 'Loading...' : 'Load Quiz'}
          </button>
        </form>
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="flex-shrink mx-4 text-slate-500 font-semibold">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <div className="space-y-4">
           <label htmlFor="file-upload" className="w-full px-8 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-all cursor-pointer inline-block">
             Upload .json File
           </label>
           <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <button onClick={onTryDemo} disabled={isLoading} className="w-full px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-500 transition-all disabled:bg-slate-600">
                Try Demo Quiz
            </button>
            <button onClick={onShowManual} disabled={isLoading} className="w-full text-center text-cyan-400 font-semibold hover:text-cyan-300 transition-colors disabled:opacity-50 mt-2">
                View JSON Format Guide
            </button>
        </div>

        {error && <p className="mt-6 text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  )
}


type View = 'loader' | 'quiz' | 'manual';

const App: React.FC = () => {
  const [quizUrl, setQuizUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('loader');
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [isChangeQuizModalOpen, setIsChangeQuizModalOpen] = useState(false);

  // --- Data Loading and Initialization ---
  const initializeQuiz = (data: Question[], savedProgress?: Answer[]) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid quiz format. The JSON must be a non-empty array of questions.');
      }
      setQuestions(data);
      setAnswers(savedProgress || []);
      setCurrentQuestionIndex(0);
      setIsQuizFinished(false);
      setCurrentView('quiz');
  }

  const fetchQuizFromUrl = useCallback(async (url: string, savedProgress?: Answer[]) => {
    setIsLoading(true);
    setError(null);
    
    let fetchUrl = url;
    if (url.includes('gist.github.com') && !url.includes('gist.githubusercontent.com')) {
      fetchUrl = url.replace('gist.github.com', 'gist.githubusercontent.com') + '/raw';
    }

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`Failed to fetch. Status: ${response.status}`);
      const data: Question[] = await response.json();
      
      clearLocalStorage();
      initializeQuiz(data, savedProgress);
      setQuizUrl(url);
      setCookie('quizUrl', url, 365);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error loading quiz: ${errorMessage}`);
      clearCookies();
      setQuestions([]);
      setCurrentView('loader');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const loadQuizFromFile = (file: File) => {
    setIsLoading(true);
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error('Could not read file.');
            const data: Question[] = JSON.parse(text);
            
            clearCookies();
            initializeQuiz(data);
            setQuizUrl(null);
            localStorage.setItem('localQuizData', text);
            localStorage.setItem('localQuizProgress', '[]');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Error loading file: ${errorMessage}`);
            clearLocalStorage();
            setQuestions([]);
            setCurrentView('loader');
        } finally {
            setIsLoading(false);
        }
    };
    
    reader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(false);
    }
    
    reader.readAsText(file);
  };

  const handleTryDemo = () => {
    clearCookies();
    clearLocalStorage();
    setQuizUrl(null);
    setError(null);
    initializeQuiz(DEMO_QUIZ_DATA);
  };

  // --- Effects ---
  useEffect(() => {
    const savedUrl = getCookie('quizUrl');
    const localQuizData = localStorage.getItem('localQuizData');

    if (savedUrl) {
      try {
        const savedProgress = JSON.parse(getCookie('quizProgress') || '[]');
        fetchQuizFromUrl(savedUrl, savedProgress);
      } catch {
        fetchQuizFromUrl(savedUrl);
      }
    } else if (localQuizData) {
      try {
        const data = JSON.parse(localQuizData);
        const savedProgress = JSON.parse(localStorage.getItem('localQuizProgress') || '[]');
        initializeQuiz(data, savedProgress);
      } catch (e) {
         setError("Failed to load saved quiz from local storage. It might be corrupted.");
         clearLocalStorage();
         setCurrentView('loader');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setCurrentView('loader');
    }
  }, [fetchQuizFromUrl]);

  useEffect(() => {
    if (questions.length === 0 || currentView !== 'quiz') return;

    if (quizUrl) {
      setCookie('quizProgress', JSON.stringify(answers), 7);
    } else { 
      localStorage.setItem('localQuizProgress', JSON.stringify(answers));
    }
  }, [answers, quizUrl, questions.length, currentView]);

  // --- Quiz Interaction Handlers ---
  const handleAnswer = useCallback((questionIndex: number, selectedOptionIndices: number[]) => {
    const question = questions[questionIndex];
    if (!question) return;

    const correctOptionIndices = question.options
      .map((option, index) => ({ isCorrect: option.isCorrect, index }))
      .filter(o => o.isCorrect)
      .map(o => o.index);
      
    let isCorrect: boolean;
    if (question.isMultiSelect) {
      isCorrect = correctOptionIndices.length === selectedOptionIndices.length && 
                  correctOptionIndices.every(index => selectedOptionIndices.includes(index));
    } else {
      isCorrect = correctOptionIndices.length > 0 && selectedOptionIndices.length > 0 && correctOptionIndices[0] === selectedOptionIndices[0];
    }

    const newAnswer = { questionIndex, selectedOptionIndices, isCorrect };
    setAnswers(prev => {
        const existingIndex = prev.findIndex(a => a.questionIndex === questionIndex);
        if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newAnswer;
            return updated;
        }
        return [...prev, newAnswer].sort((a,b) => a.questionIndex - b.questionIndex);
    });
  }, [questions]);
  
  const handleUnsubmit = useCallback((questionIndex: number) => {
    setAnswers(prevAnswers => prevAnswers.filter(a => a.questionIndex !== questionIndex));
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsQuizFinished(false);
  };
  
  const changeQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setQuizUrl(null);
    setError(null);
    setCurrentQuestionIndex(0);
    setIsQuizFinished(false);
    clearCookies();
    clearLocalStorage();
    setCurrentView('loader');
  };
  
  // --- Conditional Rendering ---
  const renderContent = () => {
      if (isLoading && currentView === 'loader') {
        return <p>Loading session...</p>;
      }

      switch (currentView) {
        case 'manual':
          return <ManualViewer onBack={() => setCurrentView('loader')} />;
        
        case 'quiz':
          if (questions.length === 0) {
              // This can happen if initialization fails silently
              return <p>Error: No questions loaded.</p>
          }
          const currentQuestion = questions[currentQuestionIndex];
          const currentAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
          return (
             <div className="w-full max-w-2xl mx-auto">
                <ConfirmationModal
                    isOpen={isChangeQuizModalOpen}
                    onClose={() => setIsChangeQuizModalOpen(false)}
                    onConfirm={() => {
                        setIsChangeQuizModalOpen(false);
                        changeQuiz();
                    }}
                    title="Change Quiz?"
                >
                    <p>Are you sure? Your current progress will be reset.</p>
                </ConfirmationModal>
                <header className="flex justify-between items-center mb-4 sm:block sm:text-center sm:mb-6 sm:relative">
                  <h1 className="text-xl sm:text-4xl font-bold text-cyan-400">JSON to Quiz</h1>
                  <p className="hidden sm:block text-slate-400 mt-2">Test your knowledge with this interactive quiz.</p>
                  <button 
                    onClick={() => setIsChangeQuizModalOpen(true)} 
                    className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-lg transition-colors sm:absolute sm:top-0 sm:right-0 sm:py-1 sm:px-3 sm:rounded-md"
                  >
                    Change
                  </button>
                </header>
                
                <main className={`bg-slate-800 rounded-xl shadow-2xl shadow-slate-950/50 p-4 sm:p-6 md:p-8 relative overflow-hidden ${!isQuizFinished ? 'pb-24 sm:pb-8 md:pb-8' : ''}`}>
                    {!isQuizFinished && (
                        <QuestionNavigator
                            isOpen={isNavigatorOpen}
                            totalQuestions={questions.length}
                            answers={answers}
                            currentQuestionIndex={currentQuestionIndex}
                            onNavigate={(index) => {
                                setCurrentQuestionIndex(index);
                                setIsNavigatorOpen(false); // Close navigator on selection
                            }}
                            onClose={() => setIsNavigatorOpen(false)}
                        />
                    )}
                  <AnimatePresence mode="wait">
                    {isQuizFinished ? (
                      <ResultCard 
                        key="result"
                        answers={answers} 
                        questions={questions} 
                        onRestart={restartQuiz}
                        onChangeQuiz={changeQuiz}
                      />
                    ) : (
                      <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
                        <QuizCard 
                          question={currentQuestion}
                          questionIndex={currentQuestionIndex}
                          onAnswer={handleAnswer}
                          onUnsubmit={handleUnsubmit}
                          userAnswer={currentAnswer}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {!isQuizFinished && (
                    <Navigation 
                      onPrevious={handlePrevious}
                      onNext={handleNext}
                      isFirstQuestion={currentQuestionIndex === 0}
                      isLastQuestion={currentQuestionIndex === questions.length - 1}
                      onToggleNavigator={() => setIsNavigatorOpen(prev => !prev)}
                    />
                  )}
                </main>
              </div>
          );

        case 'loader':
        default:
          return <QuizLoader 
            onUrlSubmit={fetchQuizFromUrl} 
            onFileLoad={loadQuizFromFile} 
            onTryDemo={handleTryDemo}
            onShowManual={() => setCurrentView('manual')}
            isLoading={isLoading} 
            error={error} 
           />;
      }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;