import { Component, ElementRef, Input, OnChanges, OnDestroy, AfterViewInit, SimpleChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `
    <div #container style="width: 100%; height: 320px;"></div>
  `
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() chartType: 'bar' | 'pie' | 'radar' | 'line' = 'bar';
  // categories can be either array of primitive labels with parallel values handled by bar/line,
  // or array of { name, value } for pie-like data, or radar indicators via objects
  @Input() categories: any[] = [];

  @ViewChild('container', { static: true }) private containerRef!: ElementRef<HTMLDivElement>;
  private chartInstance: echarts.ECharts | null = null;

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.updateChart();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    window.removeEventListener('resize', this.resizeHandler);
  }

  private resizeHandler = () => {
    if (this.chartInstance) this.chartInstance.resize();
  };

  private initChart(): void {
    if (!this.containerRef?.nativeElement) return;
    this.chartInstance = echarts.init(this.containerRef.nativeElement);
    window.addEventListener('resize', this.resizeHandler);
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chartInstance) return;
    const option = this.buildOptions();
    this.chartInstance.setOption(option, { notMerge: true });
  }

  private buildOptions(): echarts.EChartsOption {
    if (this.chartType === 'pie') {
      // expects categories like [{ name, value }, ...]
      return {
        title: { text: this.title, left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [
          {
            type: 'pie',
            radius: '60%',
            data: this.categories as any[],
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' } }
          }
        ]
      };
    }

    if (this.chartType === 'radar') {
      // expects categories like [{ name, score, maxScore }]
      const indicators = (this.categories || []).map((c: any) => ({ name: c.name, max: c.maxScore || 100 }));
      const values = (this.categories || []).map((c: any) => c.score || 0);
      return {
        title: { text: this.title, left: 'center' },
        tooltip: {},
        radar: { indicator: indicators },
        series: [
          {
            type: 'radar',
            data: [ { value: values, name: this.title } ]
          }
        ]
      };
    }

    // bar/line: expects categories like [{ name, value }]
    const labels = (this.categories || []).map((c: any) => c.name);
    const values = (this.categories || []).map((c: any) => c.value);
    return {
      title: { text: this.title, left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: labels },
      yAxis: { type: 'value' },
      series: [
        {
          type: this.chartType,
          data: values,
          smooth: this.chartType === 'line'
        }
      ]
    };
  }
}


