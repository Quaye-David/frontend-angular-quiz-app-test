// quiz.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizStateService } from '../../core/services/quiz-state.service';
import { QuizCategory } from '../../core/models/quiz.model';
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  currentQuiz?: QuizCategory;
  currentQuestionIndex = 0;
  totalQuestions = 0;
  selectedAnswer = '';
  isAnswerSubmitted = false;
  errorMessage = "";
  correctIcon = '';
  wrongIcon = '';
  constructor(private readonly quizStateService: QuizStateService) {}

  ngOnInit() {
    const state = this.quizStateService.quizState;
    this.currentQuiz = state.currentCategory as QuizCategory;
    this.currentQuestionIndex = state.currentQuestionIndex;
    this.totalQuestions = state.totalQuestions;
    
  }

  getProgress(): number {
    return ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
  }

  selectAnswer(answer: string) {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswer = answer;
      this.errorMessage = '';
    }
  }

  submitAnswer() {
    if (!this.selectedAnswer) {
      this.errorMessage = 'Please select an answer before submitting';
      return;
    }
    this.errorMessage = '';
    this.isAnswerSubmitted = true;
    this.quizStateService.submitAnswer(this.selectedAnswer);
  }


  nextQuestion() {
    this.quizStateService.nextQuestion();
    this.selectedAnswer = '';
    this.isAnswerSubmitted = false;
    this.currentQuestionIndex = this.quizStateService.quizState.currentQuestionIndex;
  }
}