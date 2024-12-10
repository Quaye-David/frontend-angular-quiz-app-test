export interface QuizCategory {
  title: string;
  icon: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface QuizIcon {
  type: string;
  path: string;
  content? : string;
}