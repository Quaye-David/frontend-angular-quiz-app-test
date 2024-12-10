import { QuizCategory } from './quiz.model';

export interface QuizState {
  currentCategory: QuizCategory | null;
  currentQuestionIndex: number;
  selectedAnswers: string[];
  score: number;
  totalQuestions: number;
  isQuizCompleted: boolean;
}