import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartMenuComponent } from './start-menu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuizDataService } from '../../core/services/quiz-data.service';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';
import { By } from '@angular/platform-browser';

describe('StartMenuComponent', () => {
  let component: StartMenuComponent;
  let fixture: ComponentFixture<StartMenuComponent>;
  let quizDataService: jest.Mocked<QuizDataService>;
  let quizStateService: jest.Mocked<QuizStateService>;

  const mockQuizData: QuizCategory[] = [
    {
      title: 'HTML',
      icon: 'assets/html-icon.svg',
      questions: []
    },
    {
      title: 'CSS',
      icon: 'assets/css-icon.svg',
      questions: []
    }
  ];

  beforeEach(async () => {
    quizDataService = {
      loadQuizData: jest.fn().mockResolvedValue(mockQuizData)
    } as any;

    quizStateService = {
      selectCategory: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [StartMenuComponent, HttpClientTestingModule],
      providers: [
        { provide: QuizDataService, useValue: quizDataService },
        { provide: QuizStateService, useValue: quizStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StartMenuComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create with default values', () => {
      expect(component).toBeTruthy();
      expect(component.quizCategories).toEqual([]);
      expect(component.isDataLoaded).toBeFalsy();
      expect(component.isDarkTheme).toBeFalsy();
    });

    it('should load quiz data on init', async () => {
      await component.ngOnInit();
      expect(quizDataService.loadQuizData).toHaveBeenCalled();
      expect(component.quizCategories).toEqual(mockQuizData);
      expect(component.isDataLoaded).toBeTruthy();
    });
  });

  describe('UI Elements', () => {
    it('should show loading state initially', () => {
      fixture.detectChanges();
      const loadingElement = fixture.debugElement.query(By.css('.loading'));
      expect(loadingElement?.nativeElement.textContent).toContain('Loading quizzes...');
    });

    it('should display quiz list after loading', async () => {
      await component.ngOnInit();
      fixture.detectChanges();

      const quizItems = fixture.debugElement.queryAll(By.css('.quiz-item'));
      expect(quizItems.length).toBe(mockQuizData.length);
    });

    it('should display correct quiz titles', async () => {
      await component.ngOnInit();
      fixture.detectChanges();

      const quizTitles = fixture.debugElement.queryAll(By.css('.quiz-title'));
      expect(quizTitles[0].nativeElement.textContent.trim()).toBe(mockQuizData[0].title);
    });
  });

  describe('User Interactions', () => {
    it('should trigger quiz selection', async () => {
      await component.ngOnInit();
      fixture.detectChanges();

      const firstQuiz = fixture.debugElement.query(By.css('.quiz-item'));
      firstQuiz.triggerEventHandler('click', null);

      expect(quizStateService.selectCategory).toHaveBeenCalledWith(mockQuizData[0]);
    });
  });

   describe('Error Handling', () => {
      let consoleSpy: jest.SpyInstance;

      beforeEach(() => {
          consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      });

      afterEach(() => {
          consoleSpy.mockRestore();
      });

      it('should handle empty quiz data', async () => {
          quizDataService.loadQuizData.mockResolvedValueOnce([]);

          await component.ngOnInit();
          fixture.detectChanges();

          expect(component.isDataLoaded).toBeTruthy();
          expect(component.quizCategories).toEqual([]);

          const noQuizzesMessage = fixture.debugElement.query(By.css('.no-quizzes'));
          expect(noQuizzesMessage).toBeTruthy();
      });
  });
});