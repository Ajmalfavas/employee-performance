import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../types/employee.types';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss'
})
export class EmployeeCardComponent {
  @Input() employee: Employee | null = null;
  @Output() viewDetails = new EventEmitter<string>();
  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<string>();

  onViewDetails(): void {
    if (this.employee) {
      this.viewDetails.emit(this.employee.id);
    }
  }

  onEdit(): void {
    if (this.employee) {
      this.editEmployee.emit(this.employee);
    }
  }

  onDelete(): void {
    if (this.employee) {
      this.deleteEmployee.emit(this.employee.id);
    }
  }

  getPerformanceColor(score: number): string {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'danger';
  }

  getOverallScore(): number {
    return this.employee?.performance?.overallScore || 0;
  }
}

