import { TestBed } from '@angular/core/testing';
import { QuizDataService } from './quiz-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QuizError } from '../../utils/error-handler';

describe('QuizDataService', () => {
  let service: QuizDataService;
  let httpMock: HttpTestingController;

  const validMockData = {
    quizzes: [
      {
        title: 'HTML',
        icon: 'html-icon.svg',
        questions: [
          {
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Multi Language'],
            answer: 'Hyper Text Markup Language'
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizDataService]
    });
    service = TestBed.inject(QuizDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Core Functionality', () => {
    it('should create service', () => {
      expect(service).toBeTruthy();
    });

    it('should load and validate quiz data successfully', async () => {
      const promise = service.loadQuizData();
      const req = httpMock.expectOne('data.json');
      req.flush(validMockData);

      const data = await promise;
      expect(data).toEqual(validMockData.quizzes);
      expect(service.quizData).toEqual(validMockData.quizzes);
    });
  });

  describe('Validation', () => {
      it('should throw error for missing required fields', async () => {
        const invalidData = {
          quizzes: [{
            title: 'HTML'
            // missing icon and questions
          }]
        };

        try {
          const promise = service.loadQuizData();
          httpMock.expectOne('data.json').flush(invalidData);
          await promise;
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(QuizError);
        }
      });

      it('should validate question structure', async () => {
        const invalidQuestionData = {
          quizzes: [{
            title: 'HTML',
            icon: 'html-icon.svg',
            questions: [{
              question: '',  // empty question
              options: ['Option 1'],  // only one option
              answer: 'Option 2'  // answer not in options
            }]
          }]
        };

        try {
          const promise = service.loadQuizData();
          httpMock.expectOne('data.json').flush(invalidQuestionData);
          await promise;
          fail('Should have thrown an error');
        } catch (error) {
          expect(error).toBeInstanceOf(QuizError);
        }
      });
  });

  describe('Error Handling', () => {
    it('should handle empty quiz data', async () => {
      try {
        const promise = service.loadQuizData();
        httpMock.expectOne('data.json').flush({ quizzes: [] });
        await promise;
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(QuizError);
      }
    });

    it('should handle invalid data structure', async () => {
      try {
        const promise = service.loadQuizData();
        httpMock.expectOne('data.json').flush({ invalid: 'structure' });
        await promise;
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(QuizError);
      }
    });
  });
});