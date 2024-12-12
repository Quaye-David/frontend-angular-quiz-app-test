import { StartMenuComponent } from "./start-menu.component";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { QuizDataService } from "../../core/services/quiz-data.service";

describe('StartMenuComponent', () => {
  let component: StartMenuComponent;
  let fixture: ComponentFixture<StartMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartMenuComponent, HttpClientTestingModule]
    })
.compileComponents();

    fixture = TestBed.createComponent(StartMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should load quiz data on initialization', async () => {
    // Arrange
    const mockData = [
      {
        title: 'HTML',
        icon: 'html-icon.svg',
        questions: []
      }
    ];

    // Get service instance
    const quizDataService = TestBed.inject(QuizDataService);

    // Spy on instance method, not static method
    const loadQuizDataSpy = jest
      .spyOn(quizDataService, 'loadQuizData')
      .mockResolvedValue(mockData);

    // Act
    await component.ngOnInit();

    // Assert
    expect(loadQuizDataSpy).toHaveBeenCalled();
    expect(component.quizCategories).toEqual(mockData);
    expect(component.isDataLoaded).toBe(true);
  });

  it('should set isDataLoaded to false when quiz data fails to load', async () => {
    // Arrange
    const quizDataService = TestBed.inject(QuizDataService);
    const loadQuizDataSpy = jest
      .spyOn(quizDataService, 'loadQuizData')
      .mockRejectedValue(new Error('Failed to load quiz data'));

    // Act
    await component.ngOnInit();

    // Assert
    expect(loadQuizDataSpy).toHaveBeenCalled();
    expect(component.isDataLoaded).toBe(false);
  });

  it('should return correct icon background based on quiz title', () => {
    // Arrange
    const quizTitle = 'HTML';
    const expectedBackground = 'var(--icon-html)';

    // Act
    const background = component.getIconBackground(quizTitle);

    // Assert
    expect(background).toBe(expectedBackground);
  });

  it('should return transparent background for unknown quiz title', () => {
    // Arrange
    const quizTitle = 'Unknown';
    const expectedBackground = 'transparent';

    // Act
    const background = component.getIconBackground(quizTitle);

    // Assert
    expect(background).toBe(expectedBackground);
  });

  it('should call quizStateService when selecting a quiz', () => {
    // Arrange
    const quiz = { title: 'HTML', icon: 'html-icon.svg', questions: [] };
    const quizStateService = (component as any).quizStateService;
    const selectCategorySpy = jest.spyOn(quizStateService, 'selectCategory');

    // Act
    component.selectQuiz(quiz);

    // Assert
    expect(selectCategorySpy).toHaveBeenCalledWith(quiz);
  });

it('should initialize with default values', () => {
    // Assert
    expect(component.quizCategories).toEqual([]);
    expect(component.isDataLoaded).toBe(false);
    expect(component.isDarkTheme).toBe(false);
  });
});

