import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizCategory } from '../models/quiz.model';
import { QuizState } from '../models/quiz-state.model';
import { QuizError, QuizErrorHandler } from '../../utils/error-handler';

export enum ViewState {
  START_MENU = 'START_MENU',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
}

@Injectable({
  providedIn: 'root'
})
export class QuizStateService {
  private readonly STORAGE_KEY = 'quiz-state';
  private readonly VIEW_STATE_KEY = 'view_state';
  private readonly _quizState: QuizState;

  private readonly selectedCategorySubject = new BehaviorSubject<QuizCategory | undefined>(undefined);
  private readonly viewStateSubject = new BehaviorSubject<ViewState>(ViewState.START_MENU);

  readonly selectedCategory$ = this.selectedCategorySubject.asObservable();
  readonly viewState$ = this.viewStateSubject.asObservable();

  constructor() {
    this._quizState = this.initializeState();
  }

  get quizState(): QuizState {
    return { ...this._quizState };
  }

  private initializeState(): QuizState {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      const savedView = localStorage.getItem(this.VIEW_STATE_KEY);

      if (savedState) {
        const state = JSON.parse(savedState);
        if (state.currentCategory) {
          this.selectedCategorySubject.next(state.currentCategory);
        }
        this.viewStateSubject.next(savedView as ViewState || ViewState.START_MENU);
        return state;
      }
    } catch (error) {
      QuizErrorHandler.handleError(error);
    }

    return this.getDefaultState();
  }

  private getDefaultState(): QuizState {
    return {
      currentCategory: null,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      score: 0,
      totalQuestions: 0,
      isQuizCompleted: false
    };
  }

  private persistState(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._quizState));
    localStorage.setItem(this.VIEW_STATE_KEY, this.viewStateSubject.getValue());
  }

  selectCategory(category: QuizCategory): void {
    try {
      if (!category) throw new QuizError('Invalid category selected', 'STATE');

      Object.assign(this._quizState, {
        currentCategory: category,
        totalQuestions: category.questions.length,
        currentQuestionIndex: 0,
        selectedAnswers: [],
        score: 0,
        isQuizCompleted: false
      });

      this.selectedCategorySubject.next(category);
      this.viewStateSubject.next(ViewState.QUIZ);
      this.persistState();
    } catch (error) {
      QuizErrorHandler.handleError(error);
    }
  }

  submitAnswer(answer: string): boolean {
    const currentQuestion = this._quizState.currentCategory?.questions[this._quizState.currentQuestionIndex];
    const isCorrect = currentQuestion?.answer === answer;

    this._quizState.selectedAnswers[this._quizState.currentQuestionIndex] = answer;
    if (isCorrect) this._quizState.score++;

    this.persistState();
    return isCorrect;
  }

  nextQuestion(): void {
    if (this._quizState.currentQuestionIndex < this._quizState.totalQuestions - 1) {
      this._quizState.currentQuestionIndex++;
    } else {
      this._quizState.isQuizCompleted = true;
      this.viewStateSubject.next(ViewState.RESULT);
    }
    this.persistState();
  }

  resetQuiz(): void {
    Object.assign(this._quizState, this.getDefaultState());
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.setItem(this.VIEW_STATE_KEY, ViewState.START_MENU);
    this.viewStateSubject.next(ViewState.START_MENU);
  }
}