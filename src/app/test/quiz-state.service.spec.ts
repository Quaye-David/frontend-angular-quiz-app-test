import { TestBed } from '@angular/core/testing';
import { QuizStateService, ViewState } from '../core/services/quiz-state.service';
import { QuizCategory, QuizQuestion } from '../core/models/quiz.model';

describe('QuizStateService', () => {
  let stateService: QuizStateService;
  let mockData: QuizCategory[];
  let mockQuestions: QuizQuestion[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizStateService]
    });
    stateService = TestBed.inject(QuizStateService);

    mockQuestions = [
      {
        question: 'What is 1 + 1?',
        options: ['1', '2', '3', '4'],
        answer: '2'
      },
      {
        question: 'What is 2 + 2?',
        options: ['2', '3', '4', '5'],
        answer: '4'
      }
    ];

    mockData = [
      {
        title: 'JavaScript',
        icon: 'js-icon',
        questions: mockQuestions
      }
    ];
  });

  it('should be created', () => {
    expect(stateService).toBeTruthy();
  });

  it('should select a category and update state', () => {
    stateService.selectCategory(mockData[0]);
    expect(stateService.quizState.currentCategory).toEqual(mockData[0]);
    expect(stateService.quizState.totalQuestions).toBe(mockQuestions.length);
    expect(stateService.quizState.currentQuestionIndex).toBe(0);
    expect(stateService.quizState.selectedAnswers).toEqual([]);
    expect(stateService.quizState.score).toBe(0);
    expect(stateService.quizState.isQuizCompleted).toBe(false);
  });

  it('should submit an answer and update state', () => {
    stateService.selectCategory(mockData[0]);
    const isCorrect = stateService.submitAnswer('2');
    expect(isCorrect).toBe(true);
    expect(stateService.quizState.selectedAnswers[0]).toBe('2');
    expect(stateService.quizState.score).toBe(1);
  });

  it('should move to the next question and update state', () => {
    stateService.selectCategory(mockData[0]);
    stateService.submitAnswer('2');
    stateService.nextQuestion();
    expect(stateService.quizState.currentQuestionIndex).toBe(1);
    expect(stateService.quizState.isQuizCompleted).toBe(false);
  });

  it('should complete the quiz and update state', () => {
    stateService.selectCategory(mockData[0]);
    stateService.submitAnswer('2');
    stateService.nextQuestion();
    stateService.submitAnswer('4');
    stateService.nextQuestion();
    expect(stateService.quizState.currentQuestionIndex).toBe(1);
    expect(stateService.quizState.isQuizCompleted).toBe(true);
    stateService.viewState$.subscribe(viewState => {
      expect(viewState).toBe(ViewState.RESULT);
    });
  });

  it('should reset the quiz and update state', () => {
    stateService.selectCategory(mockData[0]);
    stateService.submitAnswer('2');
    stateService.resetQuiz();
    expect(stateService.quizState.currentCategory).toBeNull();
    expect(stateService.quizState.currentQuestionIndex).toBe(0);
    expect(stateService.quizState.selectedAnswers).toEqual([]);
    expect(stateService.quizState.score).toBe(0);
    expect(stateService.quizState.totalQuestions).toBe(0);
    expect(stateService.quizState.isQuizCompleted).toBe(false);
    stateService.viewState$.subscribe(viewState => {
      expect(viewState).toBe(ViewState.START_MENU);
    });
  });
});