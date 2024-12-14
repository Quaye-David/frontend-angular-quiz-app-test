import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { By } from '@angular/platform-browser';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let quizStateService: jest.Mocked<QuizStateService>;

  const mockQuizState = {
    currentCategory: {
      title: 'HTML',
      icon: 'html-icon.svg',
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Multi Language', 'Hyper Transfer Markup Language', 'None of the above'],
          answer: 'Hyper Text Markup Language'
        },
        {
          question: 'Second Question?',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          answer: 'Option 1'
        }
      ]
    },
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
    totalQuestions: 2,
    isQuizCompleted: false
  };

  beforeEach(async () => {
    quizStateService = {
      quizState: mockQuizState,
      submitAnswer: jest.fn(),
      nextQuestion: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        { provide: QuizStateService, useValue: quizStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with correct quiz state', () => {
    expect(component.currentQuiz).toBeDefined();
    expect(component.currentQuestionIndex).toBe(0);
    expect(component.totalQuestions).toBe(2);
    expect(component.selectedAnswer).toBe('');
    expect(component.isAnswerSubmitted).toBeFalsy();
  });

  it('should select answer correctly', () => {
    const answer = 'Hyper Text Markup Language';
    component.selectAnswer(answer);
    expect(component.selectedAnswer).toBe(answer);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when submitting without selection', () => {
    component.submitAnswer();
    expect(component.errorMessage).toBe('Please select an answer before submitting');
    expect(quizStateService.submitAnswer).not.toHaveBeenCalled();
  });

  it('should submit answer successfully', () => {
    const answer = 'Hyper Text Markup Language';
    component.selectAnswer(answer);
    component.submitAnswer();

    expect(component.isAnswerSubmitted).toBeTruthy();
    expect(quizStateService.submitAnswer).toHaveBeenCalledWith(answer);
    expect(component.errorMessage).toBe('');
  });

  it('should handle next question correctly', () => {
    component.nextQuestion();

    expect(quizStateService.nextQuestion).toHaveBeenCalled();
    expect(component.selectedAnswer).toBe('');
    expect(component.isAnswerSubmitted).toBeFalsy();
  });

  it('should calculate progress correctly', () => {
    expect(component.getProgress()).toBe(50); // 1/2 * 100
  });

  it('should cleanup subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should display correct button text based on question index', () => {
    component.isAnswerSubmitted = true;
    fixture.detectChanges();

    let nextButton = fixture.debugElement.query(By.css('.next-button'));
    expect(nextButton.nativeElement.textContent.trim()).toBe('Next Question');

    component.currentQuestionIndex = 1;
    fixture.detectChanges();

    nextButton = fixture.debugElement.query(By.css('.next-button'));
    expect(nextButton.nativeElement.textContent.trim()).toBe('Finish Quiz');
  });
});