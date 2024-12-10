import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  public currentQuiz?: QuizCategory;
  public currentQuestionIndex: number = 0;
  public totalQuestions: number = 0;
  public selectedAnswer: string = '';
  public isAnswerSubmitted: boolean = false;
  public errorMessage: string = "";
  public correctIcon: string = '';
  public wrongIcon: string = '';

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly quizStateService: QuizStateService) {}

  public ngOnInit(): void {
    const state = this.quizStateService.quizState;
    this.currentQuiz = state.currentCategory as QuizCategory;
    this.currentQuestionIndex = state.currentQuestionIndex;
    this.totalQuestions = state.totalQuestions;
    this.selectedAnswer = state.selectedAnswers[this.currentQuestionIndex] || '';
    this.isAnswerSubmitted = this.selectedAnswer !== '';
  }

  public getProgress(): number {
    return ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
  }

  public selectAnswer(answer: string): void {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswer = answer;
      this.errorMessage = '';
    }
  }

  public submitAnswer(): void {
    if (!this.selectedAnswer) {
      this.errorMessage = 'Please select an answer before submitting';
      return;
    }
    this.errorMessage = '';
    this.isAnswerSubmitted = true;
    this.quizStateService.submitAnswer(this.selectedAnswer);
  }

  public nextQuestion(): void {
    this.quizStateService.nextQuestion();
    this.selectedAnswer = '';
    this.isAnswerSubmitted = false;
    this.currentQuestionIndex = this.quizStateService.quizState.currentQuestionIndex;

    // Update isAnswerSubmitted based on persisted answers
    this.selectedAnswer = this.quizStateService.quizState.selectedAnswers[this.currentQuestionIndex] || '';
    this.isAnswerSubmitted = this.selectedAnswer !== '';
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}