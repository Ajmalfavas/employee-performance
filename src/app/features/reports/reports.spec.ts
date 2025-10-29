import { TestBed } from '@angular/core/testing';
import { Reports } from './reports';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../shared/component/chart/chart.component';
import { EmployeeService } from '../../services/employee.service';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../../types/employee.types';

describe('Reports', () => {
  const employees$ = new BehaviorSubject<Employee[]>([
    {
      id: 'E1',
      name: 'Alice',
      department: 'Engineering',
      position: '',
      email: '',
      phone: '',
      joinDate: '',
      performance: {
        employeeId: 'E1',
        period: 'Q1',
        overallScore: 92,
        categories: [
          { name: 'Technical Skills', score: 95, maxScore: 100 },
          { name: 'Communication', score: 90, maxScore: 100 }
        ]
      }
    },
    {
      id: 'E2',
      name: 'Bob',
      department: 'Design',
      position: '',
      email: '',
      phone: '',
      joinDate: '',
      performance: {
        employeeId: 'E2',
        period: 'Q1',
        overallScore: 75,
        categories: [
          { name: 'UI', score: 80, maxScore: 100 },
          { name: 'Research', score: 70, maxScore: 100 }
        ]
      }
    }
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, Reports, ChartComponent],
      providers: [
        { provide: EmployeeService, useValue: { employees$: employees$.asObservable() } }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Reports);
    const cmp = fixture.componentInstance;
    expect(cmp).toBeTruthy();
  });

  it('renders charts when employees are available', () => {
    const fixture = TestBed.createComponent(Reports);
    fixture.detectChanges();
    const charts = fixture.nativeElement.querySelectorAll('app-chart');
    expect(charts.length).toBeGreaterThan(0);
  });

  it('computes overall categories correctly', () => {
    const fixture = TestBed.createComponent(Reports);
    const cmp = fixture.componentInstance;
    const result = cmp.getOverallCategories(employees$.value);
    expect(result).toEqual([
      { name: 'Alice', value: 92 },
      { name: 'Bob', value: 75 }
    ]);
  });

  it('computes department categories as counts', () => {
    const fixture = TestBed.createComponent(Reports);
    const cmp = fixture.componentInstance;
    const result = cmp.getDepartmentCategories(employees$.value);
    const m = new Map(result.map((x) => [x.name, x.value]));
    expect(m.get('Engineering')).toBe(1);
    expect(m.get('Design')).toBe(1);
  });

  it('computes performance range buckets', () => {
    const fixture = TestBed.createComponent(Reports);
    const cmp = fixture.componentInstance;
    const result = cmp.getPerformanceRangeCategories(employees$.value);
    const m = new Map(result.map((x) => [x.name, x.value]));
    expect(m.get('70-79')).toBe(1);
    expect(m.get('90-100')).toBe(1);
  });
});

// duplicate block removed
