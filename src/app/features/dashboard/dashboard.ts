import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { Employee, PerformanceMetrics } from '../../types/employee.types';
import { EmployeeCardComponent } from '../../shared/component/employee-card/employee-card.component';
import { EmployeeFormComponent } from '../../shared/component/employee-form/employee-form.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, EmployeeCardComponent, EmployeeFormComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  employees$: Observable<Employee[]>;
  selectedEmployee: Employee | null = null;
  showForm = signal(false);
  isEditing = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);
  chartType = signal<'bar' | 'line'>('bar');

  constructor(private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.employees$;
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: () => {},
      error: (err) => this.error.set('Failed to load employees')
    });
  }

  onViewDetails(employeeId: string): void {
    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (response) => {
        this.selectedEmployee = response.data;
        this.isEditing.set(false);
        this.showForm.set(true);
      },
      error: () => this.error.set('Failed to load employee details')
    });
  }

  onEditEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
    this.isEditing.set(true);
    this.showForm.set(true);
  }

  onDeleteEmployee(employeeId: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.isLoading.set(true);
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.error.set(null);
          if (this.selectedEmployee?.id === employeeId) {
            this.closeForm();
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.error.set('Failed to delete employee');
        }
      });
    }
  }

  onAddNew(): void {
    this.selectedEmployee = null;
    this.isEditing.set(false);
    this.showForm.set(true);
  }

  onSubmitForm(employeeData: Omit<Employee, 'id'>): void {
    this.isLoading.set(true);
    
    if (this.isEditing()) {
      this.updateEmployee(employeeData);
    } else {
      this.createEmployee(employeeData);
    }
  }

  private createEmployee(employeeData: Omit<Employee, 'id'>): void {
    this.employeeService.createEmployee(employeeData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showForm.set(false);
        this.error.set(null);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to create employee');
      }
    });
  }

  private updateEmployee(employeeData: Partial<Employee>): void {
    if (!this.selectedEmployee) return;

    this.employeeService.updateEmployee(this.selectedEmployee.id, employeeData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.showForm.set(false);
        this.error.set(null);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'Failed to update employee');
      }
    });
  }

  closeForm(): void {
    this.showForm.set(false);
    this.selectedEmployee = null;
    this.isEditing.set(false);
  }

  toggleChartType(): void {
    this.chartType.set(this.chartType() === 'bar' ? 'line' : 'bar');
  }

  getAverageScore(employees: Employee[]): number {
    if (employees.length === 0) return 0;
    const total = employees.reduce((sum, emp) => sum + (emp.performance?.overallScore || 0), 0);
    return Math.round(total / employees.length);
  }

  getTopPerformers(employees: Employee[]): number {
    return employees.filter(emp => (emp.performance?.overallScore || 0) >= 90).length;
  }
}