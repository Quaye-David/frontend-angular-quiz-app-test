import { Injectable } from '@angular/core';
import { QuizCategory, QuizQuestion } from '../models/quiz.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';

// quiz-data.service.ts
@Injectable({
  providedIn: 'root'
})
export class QuizDataService {
  private quizData: QuizCategory[] = [];
  private readonly REQUIRED_FIELDS = ['title', 'icon', 'questions'] as const;

  async loadQuizData(): Promise<QuizCategory[]> {
    try {
      const data = await this.fetchData();
      this.validateData(data);
      this.quizData = data.quizzes;
      return this.quizData;
    } catch (error) {
      QuizErrorHandler.handleError(error);
      throw error;
    }
  }

  private async fetchData(): Promise<any> {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new QuizError(`Failed to fetch quiz data. Status: ${response.status}`, 'DATA_LOAD');
    }
    return response.json();
  }

  private validateData(data: any): void {
    if (!data?.quizzes?.length) {
      throw new QuizError('Invalid quiz data structure', 'VALIDATION');
    }

    data.quizzes.forEach((category: QuizCategory, index: number) => {
      this.validateFields(category, index);
      this.validateQuestions(category.questions, category.title);
    });
  }

  private validateFields(category: QuizCategory, index: number): void {
    this.REQUIRED_FIELDS.forEach(field => {
      if (!category[field]) {
        throw new QuizError(`Missing ${field} in category ${index}`, 'VALIDATION');
      }
    });
  }

  private validateQuestions(questions: QuizQuestion[], categoryTitle: string): void {
    questions.forEach((question, index) => {
      if (!this.isValidQuestion(question)) {
        throw new QuizError(
          `Invalid question ${index} in category ${categoryTitle}`,
          'VALIDATION'
        );
      }
    });
  }

  private isValidQuestion(question: QuizQuestion): boolean {
    return Boolean(
      question.question?.trim() &&
      Array.isArray(question.options) &&
      question.options.length > 1 &&
      question.answer?.trim() &&
      question.options.includes(question.answer)
    );
  }

  getCategoryByName(title: string): QuizCategory | undefined {
    return this.quizData.find(category => category.title === title);
  }
}