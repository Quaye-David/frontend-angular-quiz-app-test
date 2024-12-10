import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../core/services/quiz-state.service';
import { QuizCategory } from '../core/models/quiz.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="quiz-info">
        @if (selectedQuiz) {
          <img
            [src]="selectedQuiz.icon"
            [alt]="selectedQuiz.title + ' icon'"
            class="quiz-icon"
            [style.background-color]="getIconBackground(selectedQuiz.title)"
            (click)="quitQuiz()"
          />
          <span class="quiz-name">{{ selectedQuiz.title }}</span>
        }
      </div>
      <div class="theme-toggle" [class.dark]="isDarkTheme">
        <img src="assets/sunny.svg" class="theme-icon" alt="light theme" />
        <button class="toggle-button" (click)="toggleTheme()">
          <span class="toggle-slider"></span>
        </button>
        <img src="assets/moon.svg" class="theme-icon" alt="dark theme" />
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      padding-block: var(--spacing-xl);
      max-width: 80%;
    }

    .quiz-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-s);
    }

    .quiz-icon {
      width: 32px;
      height: 32px;
      padding: var(--spacing-xs);
      border-radius: 8px;
      cursor: pointer;
      transition: transform var(--transition-timing);
      &:hover {
        transform: scale(1.1);
      }
    }

    .quiz-name {
      font-weight: 600;
      color: var(--color-gray-700);
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .theme-icon {
      width: 24px;
      height: 24px;
    }

    .toggle-button {
      width: 48px;
      height: 28px;
      background: var(--color-purple);
      border-radius: 20px;
      position: relative;
      cursor: pointer;
      border: none;
      padding: 0;
    }

    .toggle-slider {
      position: absolute;
      width: 20px;
      height: 20px;
      background: var(--color-white);
      border-radius: 50%;
      left: 4px;
      top: 4px;
      transition: transform 0.3s ease;
    }

    .theme-toggle.dark .toggle-slider {
      transform: translateX(20px);
    }
  `]
})
export class QuizHeaderComponent implements OnInit, OnDestroy {
  @Input() isDarkTheme = false;
  @Output() themeToggled = new EventEmitter<boolean>();

  selectedQuiz?: QuizCategory;
  private subscription?: Subscription;

  constructor(private readonly quizStateService: QuizStateService) {}

  ngOnInit() {
    this.subscription = this.quizStateService.selectedCategory$.subscribe(
      quiz => this.selectedQuiz = quiz
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getIconBackground(quizTitle: string): string {
    const backgroundMap: Record<string, string> = {
      'HTML': 'var(--icon-html)',
      'CSS': 'var(--icon-css)',
      'JavaScript': 'var(--icon-js)',
      'Accessibility': 'var(--icon-accessibility)'
    };
    return backgroundMap[quizTitle] || 'transparent';
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.themeToggled.emit(this.isDarkTheme);
  }

  quitQuiz(): void {
    if (confirm('Are you sure you want to quit the quiz?')) {
      this.quizStateService.resetQuiz();
    }
  }
}