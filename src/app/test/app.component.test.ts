import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from '../app.component';
import { StartMenuComponent } from '../features/start-menu/start-menu.component';
import { QuizHeaderComponent } from '../shared/quiz-header.component';
import { QuizComponent } from '../features/quiz/quiz.component';
import { ResultsComponent } from '../features/results/results.component';
import { QuizStateService, ViewState } from '../core/services/quiz-state.service';
import { ThemeService } from '../core/services/theme.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockQuizStateService: Partial<QuizStateService>;
  let mockThemeService: Partial<ThemeService>;

  beforeEach(async () => {
    mockQuizStateService = {
      viewState$: of(ViewState.START_MENU),
    };

    mockThemeService = {
      isDarkTheme: false,
      toggleTheme: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule here
        AppComponent,
        StartMenuComponent,
        QuizHeaderComponent,
        QuizComponent,
        ResultsComponent,
      ],
      providers: [
        { provide: QuizStateService, useValue: mockQuizStateService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should render QuizHeaderComponent', () => {
    const header = fixture.debugElement.query(By.directive(QuizHeaderComponent));
    expect(header).toBeTruthy();
  });

  it('should render StartMenuComponent when viewState is START_MENU', () => {
    (mockQuizStateService.viewState$ as any) = of(ViewState.START_MENU);
    fixture.detectChanges();
    const startMenu = fixture.debugElement.query(By.directive(StartMenuComponent));
    expect(startMenu).toBeTruthy();
  });

  // it('should render QuizComponent when viewState is QUIZ', () => {
  //   (mockQuizStateService.viewState$ as any) = of(ViewState.QUIZ); // Emit QUIZ state
  //   fixture.detectChanges(); // Trigger change detection
  //   const quiz = fixture.debugElement.query(By.directive(QuizComponent));
  //   expect(quiz).toBeTruthy(); // Ensure QuizComponent is rendered
  // });

  // it('should render ResultsComponent when viewState is RESULT', () => {
  //   (mockQuizStateService.viewState$ as any) = of(ViewState.RESULT); // Emit RESULT state
  //   fixture.detectChanges(); // Trigger change detection
  //   const results = fixture.debugElement.query(By.directive(ResultsComponent));
  //   expect(results).toBeTruthy(); // Ensure ResultsComponent is rendered
  // });

  it('should pass isDarkTheme to QuizHeaderComponent', () => {
    const header = fixture.debugElement.query(By.directive(QuizHeaderComponent));
    expect(header.componentInstance.isDarkTheme).toBe(mockThemeService.isDarkTheme);
  });

  // it('should call toggleTheme when themeToggled is emitted', () => {
  //   const header = fixture.debugElement.query(By.directive(QuizHeaderComponent));
  //   header.triggerEventHandler('themeToggled', null);
  //   expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  // });
});
