// results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  currentQuiz?: QuizCategory;
  score = 0;
  totalQuestions = 0;

  constructor(private readonly quizStateService: QuizStateService) {}

  ngOnInit() {
    const state = this.quizStateService.quizState;
    this.currentQuiz = state.currentCategory as QuizCategory;
    this.score = state.score;
    this.totalQuestions = state.totalQuestions;
  }

  getIconBackground(quizTitle: string): string {
    const backgroundMap: { [key: string]: string } = {
      HTML: 'var(--icon-html)',
      CSS: 'var(--icon-css)',
      JavaScript: 'var(--icon-js)',
      Accessibility: 'var(--icon-accessibility)',
    };
    return backgroundMap[quizTitle] || 'transparent';
  }

  retryQuiz() {
    if (this.currentQuiz) {
      this.quizStateService.selectCategory(this.currentQuiz);
    }
  }
}
