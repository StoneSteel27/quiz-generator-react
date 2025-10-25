export interface Option {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  questionText: string;
  options: Option[];
  isMultiSelect?: boolean;
}

export interface Answer {
  questionIndex: number;
  selectedOptionIndices: number[];
  isCorrect: boolean;
}