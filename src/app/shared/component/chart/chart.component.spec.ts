import { TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import * as echarts from 'echarts';

describe('ChartComponent', () => {
  let setOptionSpy: jasmine.Spy;
  let resizeSpy: jasmine.Spy;
  let disposeSpy: jasmine.Spy;

  beforeEach(async () => {
    setOptionSpy = jasmine.createSpy('setOption');
    resizeSpy = jasmine.createSpy('resize');
    disposeSpy = jasmine.createSpy('dispose');

    spyOn(echarts, 'init').and.returnValue({
      setOption: setOptionSpy,
      resize: resizeSpy,
      dispose: disposeSpy
    } as any);

    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    }).compileComponents();
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

    expect(echarts.init).toHaveBeenCalled();
    expect(setOptionSpy).toHaveBeenCalled();
    const lastArg = setOptionSpy.calls.mostRecent().args[0];
    expect(lastArg.series[0].type).toBe('bar');
  });

  it('builds pie options', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    const cmp = fixture.componentInstance;
    cmp.chartType = 'pie';
    cmp.categories = [
      { name: 'Engineering', value: 5 },
      { name: 'Design', value: 3 }
    ];
    fixture.detectChanges();
    const lastArg = setOptionSpy.calls.mostRecent().args[0];
    expect(lastArg.series[0].type).toBe('pie');
  });

  it('disposes on destroy', () => {
    const fixture = TestBed.createComponent(ChartComponent);
    fixture.detectChanges();
    fixture.destroy();
    expect(disposeSpy).toHaveBeenCalled();
  });
});


