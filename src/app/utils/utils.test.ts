// error-handler.test.ts
import { QuizError, QuizErrorHandler } from './error-handler';
import { QuizValidators } from './validators';
import { QuizCategory, QuizQuestion } from '../core/models/quiz.model';

describe('QuizError', () => {
  it('should create error with default type', () => {
    const error = new QuizError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.type).toBe('DATA_LOAD');
    expect(error.name).toBe('QuizError');
  });

  it('should create error with custom type', () => {
    const error = new QuizError('Validation failed', 'VALIDATION');
    expect(error.message).toBe('Validation failed');
    expect(error.type).toBe('VALIDATION');
  });
});

describe('QuizErrorHandler', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should handle QuizError', () => {
    const error = new QuizError('Quiz error', 'VALIDATION');
    QuizErrorHandler.handleError(error);
    expect(consoleSpy).toHaveBeenCalledWith('[VALIDATION Error]', 'Quiz error');
  });

  it('should handle standard Error', () => {
    const error = new Error('Standard error');
    QuizErrorHandler.handleError(error);
    expect(consoleSpy).toHaveBeenCalledWith('[Unexpected Error]', 'Standard error');
  });

  it('should handle unknown error', () => {
    const error = 'String error';
    QuizErrorHandler.handleError(error);
    expect(consoleSpy).toHaveBeenCalledWith('[Unknown Error]', 'String error');
  });
});

describe('QuizValidators', () => {
  const validQuestion: QuizQuestion = {
    question: 'Test question?',
    options: ['A', 'B', 'C'],
    answer: 'A'
  };

  const validCategory: QuizCategory = {
    title: 'Test Category',
    icon: 'test-icon',
    questions: [validQuestion]
  };

  describe('validateQuizData', () => {
    it('should validate correct quiz data', () => {
      const data = { quizzes: [validCategory] };
      expect(QuizValidators.validateQuizData(data)).toBe(true);
    });

    it('should reject invalid quiz data structure', () => {
      expect(QuizValidators.validateQuizData(null)).toBe(false);
      expect(QuizValidators.validateQuizData({})).toBe(false);
      expect(QuizValidators.validateQuizData({ quizzes: null })).toBe(false);
    });
  });

  describe('validateCategory', () => {
    it('should validate correct category', () => {
      expect(QuizValidators.validateCategory(validCategory)).toBe(true);
    });

    it('should reject invalid category', () => {
      const invalidCategory = { ...validCategory, title: null };
      expect(QuizValidators.validateCategory(invalidCategory)).toBe(false);
    });

    it('should reject category with missing icon', () => {
      const invalidCategory = { ...validCategory, icon: undefined };
      expect(QuizValidators.validateCategory(invalidCategory)).toBe(false);
    });

    it('should reject category with invalid questions array', () => {
      const invalidCategory = { ...validCategory, questions: 'not-an-array' };
      expect(QuizValidators.validateCategory(invalidCategory)).toBe(false);
    });
  });

  describe('validateQuestion', () => {
    it('should validate correct question', () => {
      expect(QuizValidators.validateQuestion(validQuestion)).toBe(true);
    });

    it('should reject question with invalid question text', () => {
      const invalidQuestion = { ...validQuestion, question: null };
      expect(QuizValidators.validateQuestion(invalidQuestion)).toBe(false);
    });

    it('should reject question with invalid options', () => {
      const invalidQuestion = { ...validQuestion, options: 'not-an-array' };
      expect(QuizValidators.validateQuestion(invalidQuestion)).toBe(false);
    });

    it('should reject question with too few options', () => {
      const invalidQuestion = { ...validQuestion, options: ['A'] };
      expect(QuizValidators.validateQuestion(invalidQuestion)).toBe(false);
    });

    it('should reject question with answer not in options', () => {
      const invalidQuestion = { ...validQuestion, answer: 'D' };
      expect(QuizValidators.validateQuestion(invalidQuestion)).toBe(false);
    });
  });
});