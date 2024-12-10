import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  isDarkTheme = false;

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      this.setDarkTheme(true);
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkTheme);
  }

  private setDarkTheme(isDark: boolean): void {
    this.isDarkTheme = isDark;
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }
}