import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizHeaderComponent } from '../shared/quiz-header.component';
import { By } from '@angular/platform-browser';

describe('QuizHeaderComponent', () => {
  let component: QuizHeaderComponent;
  let fixture: ComponentFixture<QuizHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuizHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit themeToggled event when theme button is clicked', () => {
    const themeToggleSpy = jest.spyOn(component.themeToggled, 'emit');
    const themeButton = fixture.debugElement.query(By.css('.toggle-button'));

    themeButton.nativeElement.click();

    expect(themeToggleSpy).toHaveBeenCalled();
  });

 it('should render the icon and title based on the selected quiz', () => {
      const mockQuiz = {
        title: 'Test Quiz',
        icon: 'assets/html-icon.svg',
        questions: []
      };

      component.selectedQuiz = mockQuiz;

      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.quiz-icon'));
      const titleElement = fixture.debugElement.query(By.css('.quiz-name'));

      expect(iconElement.nativeElement.src).toContain(mockQuiz.icon);
      expect(iconElement.nativeElement.alt).toBe(mockQuiz.title + ' icon');
      expect(iconElement.styles['background-color']).toBe('transparent');

      expect(titleElement.nativeElement.textContent).toBe(mockQuiz.title);
  });
});