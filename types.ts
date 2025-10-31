export interface Option {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  questionText: string;
  // Multiple choice
  options?: Option[];
  isMultiSelect?: boolean;
  // Numerical range
  numericalAnswer?: {
    min: number;
    max: number;
    explanation: string;
  };
}

export interface Answer {
  questionIndex: number;
  selectedOptionIndices?: number[];
  numericalValue?: number;
  isCorrect: boolean;
}