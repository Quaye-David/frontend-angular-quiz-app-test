import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { QuizStateService, ViewState } from './quiz-state.service';
import { QuizCategory } from '../models/quiz.model';
import { BehaviorSubject } from 'rxjs';

const mockCategory: QuizCategory = {
  title: 'Science',
  icon: 'science-icon',
  questions: [
    { question: 'What is the boiling point of water?', options: ['100°C', '0°C'], answer: '100°C' },
  ],
};

describe('QuizStateService', () => {
  let service: QuizStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizStateService);
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default state if no state is saved', () => {
      const initialState = service.quizState;
      expect(initialState.currentCategory).toBeNull();
      expect(initialState.currentQuestionIndex).toBe(0);
      expect(initialState.score).toBe(0);

      let currentViewState: ViewState | undefined;
      service.viewState$.subscribe(state => {
        currentViewState = state;
      });
      expect(currentViewState).toBe(ViewState.START_MENU);
    });
  });

  describe('Answer Submission', () => {
    it('should submit a correct answer', () => {
      service.selectCategory(mockCategory);
      const isCorrect = service.submitAnswer('100°C');

      const updatedState = service.quizState;
      expect(isCorrect).toBe(true);
      expect(updatedState.score).toBe(1);
      expect(updatedState.selectedAnswers[0]).toBe('100°C');
      expect(localStorage.getItem('quiz-state')).toContain('100°C');
    });

    it('should submit an incorrect answer', () => {
      service.selectCategory(mockCategory);
      const isCorrect = service.submitAnswer('0°C');

      const updatedState = service.quizState;
      expect(isCorrect).toBe(false);
      expect(updatedState.score).toBe(0);
      expect(updatedState.selectedAnswers[0]).toBe('0°C');
    });
  });

  describe('Navigation', () => {
    it('should navigate to next question or result', fakeAsync(() => {
      const multiQuestionCategory: QuizCategory = {
        title: 'History',
        icon: 'history-icon',
        questions: [
          { question: 'Q1', options: ['Columbus', 'Vespucci'], answer: 'Columbus' },
          { question: 'Q2', options: ['Washington', 'Lincoln'], answer: 'Washington' },
        ],
      };

      let currentViewState: ViewState | undefined;
      service.viewState$.subscribe(state => {
        currentViewState = state;
      });

      service.selectCategory(multiQuestionCategory);
      tick();
      expect(currentViewState).toBe(ViewState.QUIZ);

      service.nextQuestion();
      tick();
      expect(service.quizState.currentQuestionIndex).toBe(1);
      expect(currentViewState).toBe(ViewState.QUIZ);

      service.nextQuestion();
      tick();
      expect(service.quizState.isQuizCompleted).toBe(true);
      expect(currentViewState).toBe(ViewState.RESULT);
    }));

    it('should reset the quiz state', fakeAsync(() => {
      service.selectCategory(mockCategory);
      let currentViewState: ViewState | undefined;
      service.viewState$.subscribe(state => {
        currentViewState = state;
      });

      service.resetQuiz();
      tick();

      const resetState = service.quizState;
      expect(resetState.currentCategory).toBeNull();
      expect(resetState.score).toBe(0);
      expect(resetState.selectedAnswers).toEqual([]);
      expect(resetState.currentQuestionIndex).toBe(0);
      expect(resetState.isQuizCompleted).toBe(false);
      expect(currentViewState).toBe(ViewState.START_MENU);
      expect(localStorage.getItem('quiz-state')).toBeNull();
      expect(localStorage.getItem('view_state')).toBe(ViewState.START_MENU);
    }));
  });

  describe('State Management', () => {
    it('should select a category and update state', fakeAsync(() => {
      let currentViewState: ViewState | undefined;
      const subscription = service.viewState$.subscribe(state => {
        currentViewState = state;
      });

      service.selectCategory(mockCategory);
      tick();

      const updatedState = service.quizState;
      expect(updatedState.currentCategory).toEqual(mockCategory);
      expect(updatedState.totalQuestions).toBe(1);
      expect(updatedState.isQuizCompleted).toBe(false);
      expect(currentViewState).toBe(ViewState.QUIZ);
      expect(localStorage.getItem('quiz-state')).toBe(JSON.stringify(updatedState));
      expect(localStorage.getItem('view_state')).toBe(ViewState.QUIZ);

      subscription.unsubscribe();
    }));

    // it('should restore saved state on initialization', () => {
    //   const savedState = {
    //     currentCategory: mockCategory,
    //     currentQuestionIndex: 1,
    //     selectedAnswers: ['100°C'],
    //     score: 1,
    //     totalQuestions: 1,
    //     isQuizCompleted: false
    //   };

    //   // Clear any existing state
    //   localStorage.clear();

    //   // Setup localStorage with saved state
    //   localStorage.setItem('quiz-state', JSON.stringify(savedState));
    //   localStorage.setItem('view_state', ViewState.QUIZ);

    //   // Create new service instance to trigger initialization
    //   const newService = TestBed.inject(QuizStateService);

    //   // Verify complete state restoration
    //   expect(newService.quizState).toEqual(savedState);

    //   // Verify BehaviorSubject states
    //   let currentCategory: QuizCategory | undefined;
    //   let viewState: ViewState | undefined;

    //   newService.selectedCategory$.subscribe(category => currentCategory = category);
    //   newService.viewState$.subscribe(state => viewState = state);

    //   expect(currentCategory).toEqual(mockCategory);
    //   expect(viewState).toBe(ViewState.QUIZ);
    // });
  });

  // describe('Error Handling', () => {
  //   it('should handle invalid category selection', () => {
  //     service.selectCategory(null as any);
  //     expect(service.quizState).toEqual(service['getDefaultState']());
  //   });

  //   it('should handle localStorage errors during initialization', () => {
  //     jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
  //       throw new Error('Storage error');
  //     });
  //     const newService = TestBed.inject(QuizStateService);
  //     expect(newService.quizState).toEqual(newService['getDefaultState']());
  //   });

  //   it('should handle localStorage errors during persistence', () => {
  //     jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
  //       throw new Error('Storage error');
  //     });
  //     service.selectCategory(mockCategory);
  //     expect(service.quizState.currentCategory).toEqual(mockCategory);
  //   });
  // });
});