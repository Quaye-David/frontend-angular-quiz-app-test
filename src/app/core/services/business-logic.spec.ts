import { TestBed } from '@angular/core/testing';
import { QuizStateService, ViewState } from './quiz-state.service';
import { QuizCategory } from '../models/quiz.model';
import { QuizState } from '../models/quiz-state.model';
import { firstValueFrom } from 'rxjs';

describe('QuizStateService', () => {
  let service: QuizStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizStateService]
    });
    service = TestBed.inject(QuizStateService);
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initializeState', () => {
    it('should load state from localStorage if available', async () => {
      const mockState: QuizState = {
        currentCategory: { title: 'HTML', icon: 'html-icon.svg', questions: [] },
        currentQuestionIndex: 1,
        selectedAnswers: ['A'],
        score: 1,
        totalQuestions: 1,
        isQuizCompleted: false
      };
      localStorage.setItem('quiz-state', JSON.stringify(mockState));
      localStorage.setItem('view_state', ViewState.QUIZ);

      const initializedState = service['initializeState']();
      const viewState = await firstValueFrom(service.viewState$);

      expect(initializedState).toEqual(mockState);
      expect(viewState).toBe(ViewState.QUIZ);
    });

    it('should return default state if localStorage is empty', async () => {
      const defaultState: QuizState = {
        currentCategory: null,
        currentQuestionIndex: 0,
        selectedAnswers: [],
        score: 0,
        totalQuestions: 0,
        isQuizCompleted: false
      };

      const initializedState = service['initializeState']();
      const viewState = await firstValueFrom(service.viewState$);

      expect(initializedState).toEqual(defaultState);
      expect(viewState).toBe(ViewState.START_MENU);
    });
  });

  describe('selectCategory', () => {
    it('should set the current category and update view state to QUIZ', async () => {
      const category: QuizCategory = {
        title: 'CSS',
        icon: 'css-icon.svg',
        questions: []
      };

      service.selectCategory(category);
      const viewState = await firstValueFrom(service.viewState$);

      expect(service.quizState.currentCategory).toEqual(category);
      expect(viewState).toBe(ViewState.QUIZ);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      const category: QuizCategory = {
        title: 'JavaScript',
        icon: 'js-icon.svg',
        questions: [
          { question: 'What is JS?', options: ['Language', 'Coffee', 'Script'], answer: 'Language' }
        ]
      };
      service.selectCategory(category);
    });

    it('should handle correct answer submission', () => {
      const isCorrect = service.submitAnswer('Language');
      expect(isCorrect).toBe(true);
      expect(service.quizState.score).toBe(1);
      expect(service.quizState.selectedAnswers).toContain('Language');
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('nextQuestion', () => {
    beforeEach(() => {
      const category: QuizCategory = {
        title: 'Accessibility',
        icon: 'accessibility-icon.svg',
        questions: [
          { question: 'What is aria-label?', options: ['Labeling', 'Styling'], answer: 'Labeling' },
          { question: 'What does ARIA stand for?', options: ['Accessible Rich Internet Applications', 'Advanced Random Internet Applications'], answer: 'Accessible Rich Internet Applications' }
        ]
      };
      service.selectCategory(category);
    });

    it('should complete quiz on last question', async () => {
      service.nextQuestion(); // Move to last question
      service.nextQuestion(); // Complete quiz

      const viewState = await firstValueFrom(service.viewState$);
      expect(service.quizState.isQuizCompleted).toBe(true);
      expect(viewState).toBe(ViewState.RESULT);
    });
  });

  describe('resetQuiz', () => {
    it('should reset to initial state', async () => {
      service.resetQuiz();

      const viewState = await firstValueFrom(service.viewState$);
      expect(service.quizState.currentCategory).toBeNull();
      expect(viewState).toBe(ViewState.START_MENU);
      expect(localStorage.removeItem).toHaveBeenCalledWith('quiz-state');
    });
  });
});