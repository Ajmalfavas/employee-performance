import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError, delay, BehaviorSubject } from 'rxjs';
import { Employee, PerformanceMetrics, ApiResponse } from '../types/employee.types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  // Using Signal for state management
  private loadingSignal = signal<boolean>(false);
  public isLoading = this.loadingSignal.asReadonly();

  private errorSignal = signal<string | null>(null);
  public error = this.errorSignal.asReadonly();

  // Computed signal for total employees
  private employeeCount = computed(() => this.employeesSubject.value.length);

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    setTimeout(() => {
      try {
        const mockEmployees = this.generateMockEmployees();
        this.employeesSubject.next(mockEmployees);
        this.loadingSignal.set(false);
      } catch (error) {
        this.errorSignal.set('Failed to load employees');
        this.loadingSignal.set(false);
      }
    }, 1000);
  }

  public getEmployees(): Observable<ApiResponse<Employee[]>> {
    return of({ data: this.employeesSubject.value }).pipe(delay(500));
  }

  public getEmployeeById(id: string): Observable<ApiResponse<Employee>> {
    const employee = this.employeesSubject.value.find(emp => emp.id === id);
    
    if (!employee) {
      return throwError(() => new Error('Employee not found'));
    }

    return of({ data: employee, message: 'Employee retrieved successfully' }).pipe(delay(300));
  }

  public getPerformanceMetrics(employeeId: string): Observable<ApiResponse<PerformanceMetrics>> {
    const employee = this.employeesSubject.value.find(emp => emp.id === employeeId);
    
    if (!employee || !employee.performance) {
      return throwError(() => new Error('Performance metrics not found'));
    }

    return of({ data: employee.performance }).pipe(delay(300));
  }

  public createEmployee(employee: Omit<Employee, 'id'>): Observable<ApiResponse<Employee>> {
    const newEmployee: Employee = {
      ...employee,
      id: this.generateId()
    };

    this.employeesSubject.next([...this.employeesSubject.value, newEmployee]);
    
    return of({ 
      data: newEmployee, 
      message: 'Employee created successfully' 
    }).pipe(delay(500));
  }

  public updateEmployee(id: string, employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    const currentEmployees = this.employeesSubject.value;
    const index = currentEmployees.findIndex(emp => emp.id === id);

    if (index === -1) {
      return throwError(() => new Error('Employee not found'));
    }

    const updatedEmployee: Employee = {
      ...currentEmployees[index],
      ...employee,
      id
    };

    const updatedEmployees = [...currentEmployees];
    updatedEmployees[index] = updatedEmployee;
    this.employeesSubject.next(updatedEmployees);

    return of({ 
      data: updatedEmployee, 
      message: 'Employee updated successfully' 
    }).pipe(delay(500));
  }

  public deleteEmployee(id: string): Observable<ApiResponse<boolean>> {
    const currentEmployees = this.employeesSubject.value;
    const filteredEmployees = currentEmployees.filter(emp => emp.id !== id);

    if (currentEmployees.length === filteredEmployees.length) {
      return throwError(() => new Error('Employee not found'));
    }

    this.employeesSubject.next(filteredEmployees);

    return of({ 
      data: true, 
      message: 'Employee deleted successfully' 
    }).pipe(delay(500));
  }

  public getEmployeeCount(): number {
    return this.employeeCount();
  }

  private generateId(): string {
    return `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMockEmployees(): Employee[] {
    return [
      {
        id: 'EMP-1',
        name: 'John Doe',
        department: 'Engineering',
        position: 'Senior Developer',
        email: 'john.doe@toppersedge.com',
        phone: '+1-234-567-8900',
        joinDate: '2022-01-15',
        performance: {
          employeeId: 'EMP-1',
          period: 'Q4 2024',
          overallScore: 92,
          categories: [
            { name: 'Technical Skills', score: 95, maxScore: 100 },
            { name: 'Communication', score: 90, maxScore: 100 },
            { name: 'Problem Solving', score: 92, maxScore: 100 },
            { name: 'Team Collaboration', score: 88, maxScore: 100 }
          ]
        }
      },
      {
        id: 'EMP-2',
        name: 'Jane Smith',
        department: 'Product',
        position: 'Product Manager',
        email: 'jane.smith@toppersedge.com',
        phone: '+1-234-567-8901',
        joinDate: '2021-06-20',
        performance: {
          employeeId: 'EMP-2',
          period: 'Q4 2024',
          overallScore: 87,
          categories: [
            { name: 'Strategic Planning', score: 90, maxScore: 100 },
            { name: 'Stakeholder Management', score: 85, maxScore: 100 },
            { name: 'Analytics', score: 88, maxScore: 100 },
            { name: 'Leadership', score: 82, maxScore: 100 }
          ]
        }
      },
      {
        id: 'EMP-3',
        name: 'Mike Johnson',
        department: 'Design',
        position: 'UX Designer',
        email: 'mike.johnson@toppersedge.com',
        phone: '+1-234-567-8902',
        joinDate: '2023-03-10',
        performance: {
          employeeId: 'EMP-3',
          period: 'Q4 2024',
          overallScore: 89,
          categories: [
            { name: 'User Research', score: 92, maxScore: 100 },
            { name: 'UI Design', score: 90, maxScore: 100 },
            { name: 'Prototyping', score: 88, maxScore: 100 },
            { name: 'Design Systems', score: 85, maxScore: 100 }
          ]
        }
      },
      {
        id: 'EMP-4',
        name: 'Sarah Wilson',
        department: 'Engineering',
        position: 'Frontend Developer',
        email: 'sarah.wilson@toppersedge.com',
        phone: '+1-234-567-8903',
        joinDate: '2022-09-05',
        performance: {
          employeeId: 'EMP-4',
          period: 'Q4 2024',
          overallScore: 85,
          categories: [
            { name: 'Technical Skills', score: 88, maxScore: 100 },
            { name: 'Code Quality', score: 87, maxScore: 100 },
            { name: 'Documentation', score: 80, maxScore: 100 },
            { name: 'Innovation', score: 85, maxScore: 100 }
          ]
        }
      },
      {
        id: 'EMP-5',
        name: 'David Brown',
        department: 'Marketing',
        position: 'Marketing Manager',
        email: 'david.brown@toppersedge.com',
        phone: '+1-234-567-8904',
        joinDate: '2023-01-15',
        performance: {
          employeeId: 'EMP-5',
          period: 'Q4 2024',
          overallScore: 90,
          categories: [
            { name: 'Campaign Management', score: 92, maxScore: 100 },
            { name: 'Analytics', score: 88, maxScore: 100 },
            { name: 'Content Creation', score: 91, maxScore: 100 },
            { name: 'Brand Strategy', score: 89, maxScore: 100 }
          ]
        }
      }
    ];
  }
}

