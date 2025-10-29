import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should emit employees', (done) => {
    service.employees$.subscribe((list) => {
      if (list.length > 0) {
        expect(Array.isArray(list)).toBeTrue();
        done();
      }
    });
  });

  it('should create and delete employee', (done) => {
    service.createEmployee({
      name: 'Test User',
      department: 'QA',
      position: 'Tester',
      email: 't@t.com',
      phone: '000',
      joinDate: '2024-01-01'
    }).subscribe(({ data }) => {
      const id = data.id;
      service.deleteEmployee(id).subscribe(({ data: ok }) => {
        expect(ok).toBeTrue();
        done();
      });
    });
  });
});


