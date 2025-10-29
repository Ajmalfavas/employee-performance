import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeCardComponent } from './employee-card.component';
import { Employee } from '../../../core/types/employee.types';

describe('EmployeeCardComponent', () => {
  let component: EmployeeCardComponent;
  let fixture: ComponentFixture<EmployeeCardComponent>;
  const mockEmployee: Employee = {
    id: 'EMP-1',
    name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'john.doe@test.com',
    phone: '+1-234-567-8900',
    joinDate: '2022-01-15',
    performance: {
      employeeId: 'EMP-1',
      period: 'Q4 2024',
      overallScore: 92,
      categories: []
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeCardComponent);
    component = fixture.componentInstance;
    component.employee = mockEmployee;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit viewDetails event', () => {
    spyOn(component.viewDetails, 'emit');
    component.onViewDetails();
    expect(component.viewDetails.emit).toHaveBeenCalledWith('EMP-1');
  });

  it('should emit editEmployee event', () => {
    spyOn(component.editEmployee, 'emit');
    component.onEdit();
    expect(component.editEmployee.emit).toHaveBeenCalledWith(mockEmployee);
  });

  it('should emit deleteEmployee event', () => {
    spyOn(component.deleteEmployee, 'emit');
    component.onDelete();
    expect(component.deleteEmployee.emit).toHaveBeenCalledWith('EMP-1');
  });

  it('should return correct performance color for high score', () => {
    expect(component.getPerformanceColor(95)).toBe('success');
  });

  it('should return correct performance color for medium score', () => {
    expect(component.getPerformanceColor(80)).toBe('warning');
  });

  it('should return correct performance color for low score', () => {
    expect(component.getPerformanceColor(60)).toBe('danger');
  });

  it('should get overall score', () => {
    expect(component.getOverallScore()).toBe(92);
  });
});

