import { QuizCategory, QuizQuestion } from '../core/models/quiz.model';

export class QuizValidators {
  static validateQuizData(data: any): data is { quizzes: QuizCategory[] } {
    if (!data || !Array.isArray(data.quizzes)) {
      return false;
    }
    return data.quizzes.every(QuizValidators.validateCategory);
  }

  static validateCategory(category: any): category is QuizCategory {
    if (
      typeof category.title !== 'string' ||
      typeof category.icon !== 'string' ||
      !Array.isArray(category.questions)
    ) {
      return false;
    }
    return category.questions.every(QuizValidators.validateQuestion);
  }

  static validateQuestion(question: any): question is QuizQuestion {
    if (
      typeof question.question !== 'string' ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      typeof question.answer !== 'string' ||
      !question.options.includes(question.answer)
    ) {
      return false;
    }
    return true;
  }
}