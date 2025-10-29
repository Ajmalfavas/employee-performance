import { TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import * as echarts from 'echarts';

// Create a mock echarts module
const createMockEChartsInstance = () => ({
  setOption: jasmine.createSpy('setOption'),
  resize: jasmine.createSpy('resize'),
  dispose: jasmine.createSpy('dispose')
});

describe('ChartComponent', () => {
  let mockEChartsInstance: any;
  let originalInit: typeof echarts.init;

  beforeEach(async () => {
    // Save original and replace with mock
    originalInit = echarts.init;
    mockEChartsInstance = createMockEChartsInstance();
    
    // Replace echarts.init with our spy
    (echarts as any).init = jasmine.createSpy('init').and.returnValue(mockEChartsInstance);

    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    }).compileComponents();
  });

  afterEach(() => {
    // Restore original
    (echarts as any).init = originalInit;
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('initializes and sets bar options', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    const cmp = fixture.componentInstance;
    cmp.title = 'Overall';
    cmp.chartType = 'bar';
    cmp.categories = [
      { name: 'Alice', value: 10 },
      { name: 'Bob', value: 20 }
    ];
    fixture.detectChanges();

    expect((echarts as any).init).toHaveBeenCalled();
    expect(mockEChartsInstance.setOption).toHaveBeenCalled();
    const lastArg = mockEChartsInstance.setOption.calls.mostRecent().args[0];
    expect(lastArg.series[0].type).toBe('bar');
  });

  it('builds pie options', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    const cmp = fixture.componentInstance;
    cmp.title = 'Departments';
    cmp.chartType = 'pie';
    cmp.categories = [
      { name: 'Engineering', value: 5 },
      { name: 'Design', value: 3 }
    ];
    fixture.detectChanges();
    const lastArg = mockEChartsInstance.setOption.calls.mostRecent().args[0];
    expect(lastArg.series[0].type).toBe('pie');
    expect(lastArg.series[0].data).toEqual([
      { name: 'Engineering', value: 5 },
      { name: 'Design', value: 3 }
    ]);
  });

  it('disposes on destroy', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    fixture.detectChanges();
    fixture.destroy();
    expect(mockEChartsInstance.dispose).toHaveBeenCalled();
  });
});
