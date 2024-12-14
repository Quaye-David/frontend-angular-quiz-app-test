import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';
import { By } from '@angular/platform-browser';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let quizStateService: jest.Mocked<QuizStateService>;

  const mockQuizState = {
    currentCategory: {
      title: 'HTML',
      icon: 'assets/icons/html.svg',
      questions: []
    } as QuizCategory,
    score: 7,
    totalQuestions: 10
  };

  beforeEach(async () => {
    quizStateService = {
      quizState: mockQuizState,
      selectCategory: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [
        { provide: QuizStateService, useValue: quizStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct quiz state', () => {
      expect(component.currentQuiz).toBe(mockQuizState.currentCategory);
      expect(component.score).toBe(7);
      expect(component.totalQuestions).toBe(10);
    });
  });

  describe('UI Elements', () => {
    it('should display correct score', () => {
      const currentScore = fixture.debugElement.query(By.css('.current-score'));
      const totalScore = fixture.debugElement.query(By.css('.total-score'));

      expect(currentScore.nativeElement.textContent).toBe('7');
      expect(totalScore.nativeElement.textContent).toBe('out of 10');
    });

    it('should display quiz title', () => {
      const quizTitle = fixture.debugElement.query(By.css('.quiz-title'));
      expect(quizTitle.nativeElement.textContent).toBe('HTML');
    });

    it('should display quiz icon with correct background', () => {
      fixture.detectChanges();

      const backgroundColor = component.getIconBackground('HTML');

      expect(backgroundColor).toBe('var(--icon-html)');
    });
  });

  describe('Icon Background', () => {
    it('should return correct background colors for different quiz types', () => {
      expect(component.getIconBackground('HTML')).toBe('var(--icon-html)');
      expect(component.getIconBackground('CSS')).toBe('var(--icon-css)');
      expect(component.getIconBackground('JavaScript')).toBe('var(--icon-js)');
      expect(component.getIconBackground('Accessibility')).toBe('var(--icon-accessibility)');
      expect(component.getIconBackground('Unknown')).toBe('transparent');
    });
  });

  describe('User Interactions', () => {
    it('should call selectCategory when retry button is clicked', () => {
      const retryButton = fixture.debugElement.query(By.css('.retry-button'));
      retryButton.triggerEventHandler('click', null);

      expect(quizStateService.selectCategory).toHaveBeenCalledWith(mockQuizState.currentCategory);
    });

    it('should not call selectCategory if currentQuiz is undefined', () => {
      component.currentQuiz = undefined;
      const retryButton = fixture.debugElement.query(By.css('.retry-button'));
      retryButton.triggerEventHandler('click', null);

      expect(quizStateService.selectCategory).not.toHaveBeenCalled();
    });
  });
});