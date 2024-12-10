import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizDataService } from '../../core/services/quiz-data.service';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';


@Component({
  selector: 'app-start-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.css'
})
export class StartMenuComponent implements OnInit {
  isDataLoaded = false;
  quizCategories: QuizCategory[] = [];
  isDarkTheme = false;

  constructor(
    private readonly quizDataService: QuizDataService,
    private readonly quizStateService: QuizStateService,
  ) {}

  async ngOnInit() {
    try {
      this.quizCategories = await this.quizDataService.loadQuizData();
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Failed to load quiz data', error);
      this.isDataLoaded = false;
    }
  }

  getIconBackground(quizTitle: string): string {
    const backgroundMap: { [key: string]: string } = {
      'HTML': 'var(--icon-html)',
      'CSS': 'var(--icon-css)',
      'JavaScript': 'var(--icon-js)',
      'Accessibility': 'var(--icon-accessibility)'
    };
    return backgroundMap[quizTitle] || 'transparent';
  }

  selectQuiz(quiz: QuizCategory) {
    this.quizStateService.selectCategory(quiz);
  }
}