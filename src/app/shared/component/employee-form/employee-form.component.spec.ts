import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { EmployeeFormComponent } from './employee-form.component';
import { Employee } from '../../../core/types/employee.types';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  const mockEmployee: Employee = {
    id: 'EMP-1',
    name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'john.doe@test.com',
    phone: '+1-234-567-8900',
    joinDate: '2022-01-15'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.ngOnInit();
    expect(component.employeeForm).toBeDefined();
    expect(component.employeeForm.get('name')?.value).toBe('');
  });

  it('should populate form when employee is provided', () => {
    component.employee = mockEmployee;
    component.ngOnInit();
    expect(component.employeeForm.get('name')?.value).toBe(mockEmployee.name);
    expect(component.employeeForm.get('email')?.value).toBe(mockEmployee.email);
  });

  it('should emit submitForm event when form is valid', () => {
    component.ngOnInit();
    spyOn(component.submitForm, 'emit');
    
    component.employeeForm.patchValue({
      name: 'Test User',
      department: 'Engineering',
      position: 'Developer',
      email: 'test@example.com',
      phone: '+1-234-567-8900',
      joinDate: '2024-01-01'
    });

    component.onSubmit();
    expect(component.submitForm.emit).toHaveBeenCalled();
  });

  it('should not emit submitForm event when form is invalid', () => {
    component.ngOnInit();
    spyOn(component.submitForm, 'emit');
    component.onSubmit();
    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });

  it('should emit cancel event', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should validate email format', () => {
    component.ngOnInit();
    const emailControl = component.employeeForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone number format', () => {
    component.ngOnInit();
    const phoneControl = component.employeeForm.get('phone');
    phoneControl?.setValue('invalid-phone');
    expect(phoneControl?.hasError('pattern')).toBeTruthy();
    phoneControl?.setValue('+1-234-567-8900');
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should return error message for required field', () => {
    component.ngOnInit();
    component.employeeForm.get('name')?.markAsTouched();
    expect(component.getErrorMessage('name')).toBeTruthy();
  });
});

