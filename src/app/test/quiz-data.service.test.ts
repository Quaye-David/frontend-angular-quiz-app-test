import { TestBed } from '@angular/core/testing';
import { QuizDataService } from '../core/services/quiz-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('QuizDataService', () => {
  let service: QuizDataService;
  let httpMock: HttpTestingController;

  const mockData = {
    quizzes: [
      {
        title: 'Science',
        icon: 'science-icon',
        questions: [
          { question: 'What is H2O?', options: ['Water', 'Oxygen'], answer: 'Water' },
        ],
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizDataService],
    });
    service = TestBed.inject(QuizDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load quiz data successfully', async () => {
    const promise = service.loadQuizData();
    const req = httpMock.expectOne('data.json'); // Expecting a request to data.json
    expect(req.request.method).toBe('GET'); // Verifying HTTP method
    req.flush(mockData); // Mocking the response

    const data = await promise;
    expect(data).toEqual(mockData.quizzes); // Verifying the returned data
    expect(service.quizData).toEqual(mockData.quizzes); // Verifying the service state
  });

  it('should get category by name', async () => {
    const promise = service.loadQuizData();
    const req = httpMock.expectOne('data.json');
    req.flush(mockData); // Mocking the response
    await promise;

    const category = service.getCategoryByName('Science');
    expect(category).toBeDefined();
    expect(category?.title).toBe('Science');
  });

  it('should return undefined for non-existing category', async () => {
    const promise = service.loadQuizData();
    const req = httpMock.expectOne('data.json');
    req.flush(mockData); // Mocking the response
    await promise;

    const category = service.getCategoryByName('Math');
    expect(category).toBeUndefined();
  });
});
