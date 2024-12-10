import { Injectable } from '@angular/core';
import { QuizCategory, QuizQuestion } from '../models/quiz.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class QuizDataService {
  private quizData: QuizCategory[] = [];
  private readonly REQUIRED_FIELDS = ['title', 'icon', 'questions'] as const;

  constructor(private readonly http: HttpClient) {}

  public async loadQuizData(): Promise<QuizCategory[]> {
    try {
      const data = await lastValueFrom(this.http.get<any>('data.json'));
      this.validateData(data);
      this.quizData = data.quizzes;
      return this.quizData;
    } catch (error) {
      QuizErrorHandler.handleError(error);
      throw error;
    }
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

// Validate the fields
  private validateFields(category: QuizCategory, index: number): void {
    this.REQUIRED_FIELDS.forEach(field => {
      if (!category[field]) {
        throw new QuizError(`Missing ${field} in category ${index}`, 'VALIDATION');
      }
    });
  }

  //Validate the questions
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

  //Check if the question is valid
  private isValidQuestion(question: QuizQuestion): boolean {
    return Boolean(
      question.question?.trim() &&
      Array.isArray(question.options) &&
      question.options.length > 1 &&
      question.answer?.trim() &&
      question.options.includes(question.answer)
    );
  }

  //Get the category by name
  getCategoryByName(title: string): QuizCategory | undefined {
    return this.quizData.find(category => category.title === title);
  }
}