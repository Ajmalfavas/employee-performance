import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ChartComponent } from '../../shared/component/chart/chart.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../types/employee.types';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, AsyncPipe, ChartComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements OnInit, OnDestroy {
  employees$!: Observable<Employee[]>;
  private sub = new Subscription();
  private latestEmployees: Employee[] = [];

  protected readonly chartType = signal<'bar' | 'pie' | 'radar' | 'line'>('bar');

  constructor(private readonly employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employees$ = this.employeeService.employees$ as Observable<Employee[]>;
    this.sub.add(this.employees$.subscribe(list => (this.latestEmployees = list)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Overall: use overallScore per employee
  getOverallCategories(employees: Employee[]) {
    return employees
      .filter(e => !!e.performance)
      .map(e => ({ name: e.name, value: e.performance!.overallScore }));
  }

  // Department distribution counts
  getDepartmentCategories(employees: Employee[]) {
    const counts = new Map<string, number>();
    for (const e of employees) counts.set(e.department, (counts.get(e.department) ?? 0) + 1);
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }

  // Performance score ranges
  getPerformanceRangeCategories(employees: Employee[]) {
    const buckets: { label: string; min: number; max: number; value: number }[] = [
      { label: '0-59', min: 0, max: 59, value: 0 },
      { label: '60-69', min: 60, max: 69, value: 0 },
      { label: '70-79', min: 70, max: 79, value: 0 },
      { label: '80-89', min: 80, max: 89, value: 0 },
      { label: '90-100', min: 90, max: 100, value: 0 },
    ];
    for (const e of employees) {
      const score = e.performance?.overallScore ?? 0;
      const bucket = buckets.find(b => score >= b.min && score <= b.max);
      if (bucket) bucket.value += 1;
    }
    return buckets.map(b => ({ name: b.label, value: b.value }));
  }
}
