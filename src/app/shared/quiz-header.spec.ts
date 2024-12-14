import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizHeaderComponent } from './quiz-header.component';
import { QuizStateService } from '../core/services/quiz-state.service';
import { By } from '@angular/platform-browser';
import { QuizCategory } from '../core/models/quiz.model';
import { BehaviorSubject } from 'rxjs';

describe('QuizHeaderComponent', () => {
  let component: QuizHeaderComponent;
  let fixture: ComponentFixture<QuizHeaderComponent>;
  let quizStateService: jest.Mocked<QuizStateService>;
  let selectedCategorySubject: BehaviorSubject<QuizCategory | undefined>;

  beforeEach(async () => {
    selectedCategorySubject = new BehaviorSubject<QuizCategory | undefined>(undefined);

    quizStateService = {
      resetQuiz: jest.fn(),
      selectedCategory$: selectedCategorySubject.asObservable()
    } as any;

    await TestBed.configureTestingModule({
      imports: [QuizHeaderComponent],
      providers: [
        { provide: QuizStateService, useValue: quizStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize with subscription', () => {
    expect(component).toBeTruthy();
    expect(component['subscription']).toBeDefined();
  });

  it('should emit themeToggled event when theme button is clicked', () => {
    const themeToggleSpy = jest.spyOn(component.themeToggled, 'emit');
    const themeButton = fixture.debugElement.query(By.css('.toggle-button'));

    themeButton.nativeElement.click();

    expect(themeToggleSpy).toHaveBeenCalledWith(true);
    expect(component.isDarkTheme).toBe(true);
  });

  it('should update view when selectedCategory$ emits new quiz', () => {
    const mockQuiz: QuizCategory = {
      title: 'HTML',
      icon: 'assets/html-icon.svg',
      questions: []
    };

    selectedCategorySubject.next(mockQuiz);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.quiz-icon'));
    const titleElement = fixture.debugElement.query(By.css('.quiz-name'));

    expect(iconElement).toBeTruthy();
    expect(titleElement).toBeTruthy();
    expect(iconElement.nativeElement.src).toContain(mockQuiz.icon);
    expect(titleElement.nativeElement.textContent).toBe(mockQuiz.title);
  });

  it('should return correct background colors for quiz types', () => {
    expect(component.getIconBackground('HTML')).toBe('var(--icon-html)');
    expect(component.getIconBackground('CSS')).toBe('var(--icon-css)');
    expect(component.getIconBackground('JavaScript')).toBe('var(--icon-js)');
    expect(component.getIconBackground('Accessibility')).toBe('var(--icon-accessibility)');
    expect(component.getIconBackground('Unknown')).toBe('transparent');
  });

  it('should call quizStateService.resetQuiz when quit is confirmed', () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    component.quitQuiz();
    expect(quizStateService.resetQuiz).toHaveBeenCalled();
  });

  it('should not call quizStateService.resetQuiz when quit is cancelled', () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => false);
    component.quitQuiz();
    expect(quizStateService.resetQuiz).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jest.fn();
    component['subscription'] = { unsubscribe: unsubscribeSpy } as any;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});