import { Injectable, signal, computed, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<Theme>(
    (localStorage.getItem('theme') as Theme) || 'light'
  );

  public theme = this.themeSignal.asReadonly();

  public isDarkMode = computed(() => this.themeSignal() === 'dark');

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.toggle('dark-theme', theme === 'dark');
      localStorage.setItem('theme', theme);
    });
  }

  public toggleTheme(): void {
    this.themeSignal.update(currentTheme => 
      currentTheme === 'light' ? 'dark' : 'light'
    );
  }

  public setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }
}

