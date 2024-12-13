import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { QuizStateService, ViewState } from './quiz-state.service';
import { QuizCategory } from '../models/quiz.model';
import { BehaviorSubject } from 'rxjs';

// Mocked Data for Testing
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default state if no state is saved', () => {
    const initialState = service.quizState;

    // Test the initial state values
    expect(initialState.currentCategory).toBeNull();
    expect(initialState.currentQuestionIndex).toBe(0);
    expect(initialState.score).toBe(0);

    // Test view state using subscription
    let currentViewState: ViewState | undefined;
    service.viewState$.subscribe(state => {
      currentViewState = state;
    });

    expect(currentViewState).toBe(ViewState.START_MENU);
  });



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

  it('should navigate to next question or result', fakeAsync(() => {
    const multiQuestionCategory: QuizCategory = {
      title: 'History',
      icon: 'history-icon',
      questions: [
        { question: 'Who discovered America?', options: ['Columbus', 'Vespucci'], answer: 'Columbus' },
        { question: 'Who was the first president?', options: ['Washington', 'Lincoln'], answer: 'Washington' },
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
    // Arrange
    service.selectCategory(mockCategory);
    let currentViewState: ViewState | undefined;

    // Subscribe to viewState$ to track changes
    service.viewState$.subscribe(state => {
      currentViewState = state;
    });

    // Act
    service.resetQuiz();
    tick(); // Process any pending asynchronous operations

    // Assert
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

  it('should select a category and update state', fakeAsync(() => {
      // Arrange
      let currentViewState: ViewState | undefined;
      const subscription = service.viewState$.subscribe(state => {
        currentViewState = state;
      });

      // Act
      service.selectCategory(mockCategory);
      tick(); // Process any pending async operations

      // Assert
      const updatedState = service.quizState;
      expect(updatedState.currentCategory).toEqual(mockCategory);
      expect(updatedState.totalQuestions).toBe(1);
      expect(updatedState.isQuizCompleted).toBe(false);
      expect(currentViewState).toBe(ViewState.QUIZ);
      expect(localStorage.getItem('quiz-state')).toBe(JSON.stringify(updatedState));
      expect(localStorage.getItem('view_state')).toBe(ViewState.QUIZ);

      // Cleanup
      subscription.unsubscribe();
  }));
  describe('Error Handling', () => {
    it('should handle invalid category selection', () => {
      service.selectCategory(null as any);
      expect(service.quizState).toEqual(service['getDefaultState']());
    });

    it('should handle localStorage errors during initialization', () => {
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const newService = TestBed.inject(QuizStateService);
      expect(newService.quizState).toEqual(newService['getDefaultState']());
    });

    it('should handle localStorage errors during persistence', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      service.selectCategory(mockCategory);
      expect(service.quizState.currentCategory).toEqual(mockCategory);
    });
  });

  describe('State Management', () => {
    it('should restore saved state on initialization', () => {
      const savedState = {
        currentCategory: mockCategory,
        currentQuestionIndex: 1,
        selectedAnswers: ['100°C'],
        score: 1,
        totalQuestions: 1,
        isQuizCompleted: false
      };

      localStorage.setItem('quiz-state', JSON.stringify(savedState));
      localStorage.setItem('view_state', ViewState.QUIZ);

      const newService = TestBed.inject(QuizStateService);
      expect(newService.quizState).toEqual(savedState);
    });

    it('should properly handle selectedCategory$ subscription', (done) => {
      service.selectedCategory$.subscribe(category => {
        if (category) {
          expect(category).toEqual(mockCategory);
          done();
        }
      });

      service.selectCategory(mockCategory);
    });
  });

  describe('Quiz Flow', () => {
    it('should not advance question index beyond total questions', () => {
      service.selectCategory(mockCategory);
      service.nextQuestion();
      expect(service.quizState.currentQuestionIndex).toBe(0);
      expect(service.quizState.isQuizCompleted).toBe(true);
    });

    it('should maintain score and answers after quiz completion', () => {
      service.selectCategory(mockCategory);
      service.submitAnswer('100°C');
      service.nextQuestion();

      const finalState = service.quizState;
      expect(finalState.score).toBe(1);
      expect(finalState.selectedAnswers).toEqual(['100°C']);
      expect(finalState.isQuizCompleted).toBe(true);
    });
  });
});