import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { QuizDataService } from "../core/services/quiz-data.service";
import { QuizCategory, QuizQuestion } from "../core/models/quiz.model";
import { QuizError } from "../utils/error-handler";

describe('QuizDataService', () => {
  let service: QuizDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [QuizDataService, provideHttpClientTesting()]
    });
    service = TestBed.inject(QuizDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load quiz data successfully', async () => {
    const mockData = { quizzes: [{ title: 'JavaScript', icon: 'js-icon', questions: [] }] };
    service.loadQuizData().then(data => {
      expect(data).toEqual(mockData.quizzes);
    });

    const req = httpMock.expectOne('data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should throw QuizError for invalid data structure', async () => {
    const mockData = { invalid: 'data' };

    service.loadQuizData().catch(error => {
      expect(error).toBeInstanceOf(QuizError);
      if (error instanceof QuizError) {
        expect(error.message).toBe('Invalid quiz data structure');
      }
    });

    const req = httpMock.expectOne('data.json');
    req.flush(mockData);
  });

  it('should throw QuizError for missing required fields', () => {
    const invalidCategory = { title: 'JavaScript', icon: 'js-icon' }; // Missing questions field

    expect(() => service['validateFields'](invalidCategory as QuizCategory, 0)).toThrowError(QuizError);
  });

  it('should throw QuizError for invalid questions', () => {
    const invalidQuestion = { question: 'What is JS?', options: ['A', 'B'], answer: 'C' }; // Answer not in options

    expect(() => service['validateQuestions']([invalidQuestion as QuizQuestion], 'JavaScript')).toThrowError(QuizError);
  });

  it('should return a quiz category by name', () => {
    const mockData = [{ title: 'JavaScript', icon: 'js-icon', questions: [] }];
    service['quizData'] = mockData;

    const category = service.getCategoryByName('JavaScript');
    expect(category).toEqual(mockData[0]);
  });

  it('should return undefined for unknown category name', () => {
    const mockData = [{ title: 'JavaScript', icon: 'js-icon', questions: [] }];
    service['quizData'] = mockData;

    const category = service.getCategoryByName('Unknown');
    expect(category).toBeUndefined();
  });
});