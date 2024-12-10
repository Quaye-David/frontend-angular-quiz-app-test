import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

//Components
import { StartMenuComponent } from './features/start-menu/start-menu.component';
import { QuizHeaderComponent } from './shared/quiz-header.component';
import { QuizComponent } from './features/quiz/quiz.component';
import { ResultsComponent } from './features/results/results.component';

//Services
import { QuizDataService } from './core/services/quiz-data.service';
import { QuizStateService, ViewState } from './core/services/quiz-state.service';
import { Observable } from 'rxjs';
import { ThemeService } from './core/services/theme.service';

// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StartMenuComponent, QuizHeaderComponent, QuizComponent, ResultsComponent],
  providers: [QuizDataService, QuizStateService, ThemeService],
  templateUrl:'./app.component.html'
})
export class AppComponent {
  viewState$: Observable<ViewState>;

  constructor(
    @Inject(QuizStateService) private readonly quizStateService: QuizStateService,
    public readonly themeService: ThemeService
  ) {
    this.viewState$ = this.quizStateService.viewState$;
  }
}