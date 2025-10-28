import { Component, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  exportData = signal<any[]>([]);

  constructor(
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
  }

  onThemeChange(theme: 'light' | 'dark'): void {
    this.themeService.setTheme(theme);
  }
}