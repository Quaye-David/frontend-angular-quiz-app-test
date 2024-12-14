import { TestBed } from '@angular/core/testing';
import { QuizCategory } from '../app/core/models/quiz.model';
import { ViewState } from '../app/core/services/quiz-state.service';

describe('Storage Operations', () => {
  const STORAGE_KEY = 'quiz-state';
  const VIEW_STATE_KEY = 'view_state';

  const mockQuizState = {
    currentCategory: {
      title: 'HTML',
      icon: 'html-icon.svg',
      questions: []
    } as QuizCategory,
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    totalQuestions: 0,
    isQuizCompleted: false
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Read Operations', () => {
    it('should return null for non-existent state', () => {
      const state = localStorage.getItem(STORAGE_KEY);
      expect(state).toBeNull();
    });

    it('should retrieve saved state', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQuizState));
      const state = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(state).toEqual(mockQuizState);
    });
  });

  describe('Write Operations', () => {
    it('should save state successfully', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQuizState));
      const savedState = localStorage.getItem(STORAGE_KEY);
      expect(savedState).not.toBeNull();
      expect(JSON.parse(savedState!)).toEqual(mockQuizState);
    });

    it('should update existing state', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQuizState));
      const updatedState = { ...mockQuizState, score: 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
      const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(savedState.score).toBe(1);
    });
  });

  describe('Delete Operations', () => {
    it('should remove state', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQuizState));
      localStorage.removeItem(STORAGE_KEY);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('should clear all storage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQuizState));
      localStorage.setItem(VIEW_STATE_KEY, ViewState.QUIZ);
      localStorage.clear();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle storage quota exceeded', () => {
      const largeData = new Array(10000000).fill('data');
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(largeData));
        fail('Should have thrown quota exceeded error');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    it('should handle invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');
      const parseState = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(parseState).toThrow();
    });
  });
});