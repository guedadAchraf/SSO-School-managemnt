import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-interactive-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="relative">
      <div class="absolute top-2 right-2 flex gap-2">
        <button
          *ngFor="let period of timePeriods"
          (click)="changePeriod(period)"
          [class]="'px-3 py-1 text-sm rounded-full transition-colors ' + 
            (selectedPeriod === period ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200')"
        >
          {{ period }}
        </button>
      </div>
      <canvas
        baseChart
        [type]="type"
        [data]="chartData"
        [options]="chartOptions"
        (chartHover)="onHover($event)"
        (chartClick)="onClick($event)"
      >
      </canvas>
    </div>
    <div *ngIf="hoveredData" class="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-semibold">{{ hoveredData.label }}</h4>
      <p class="text-sm text-gray-600">Value: {{ hoveredData.value }}</p>
    </div>
  `
})
export class InteractiveChartComponent implements OnInit {
  @Input() type: ChartType = 'line';
  @Input() initialData!: any;
  @Input() options?: ChartConfiguration['options'];

  chartData: any;
  chartOptions: any;
  timePeriods = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];
  selectedPeriod = '1M';
  hoveredData: { label: string; value: number } | null = null;

  ngOnInit() {
    this.chartData = this.initialData;
    this.chartOptions = {
      ...this.options,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          cornerRadius: 8,
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy',
          },
          pan: { enabled: true },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  changePeriod(period: string) {
    this.selectedPeriod = period;
    // Simulate data update based on period
    this.updateChartData(period);
  }

  onHover(event: any) {
    if (event.active.length > 0) {
      const datasetIndex = event.active[0].datasetIndex;
      const index = event.active[0].index;
      this.hoveredData = {
        label: this.chartData.labels[index],
        value: this.chartData.datasets[datasetIndex].data[index],
      };
    } else {
      this.hoveredData = null;
    }
  }

  onClick(event: any) {
    if (event.active.length > 0) {
      // Handle click event - could navigate to detailed view
      console.log('Chart clicked:', event.active[0]);
    }
  }

  private updateChartData(period: string) {
    // Simulate API call to get data for different time periods
    const newData = this.generateDataForPeriod(period);
    this.chartData = {
      ...this.chartData,
      datasets: [{
        ...this.chartData.datasets[0],
        data: newData
      }]
    };
  }

  private generateDataForPeriod(period: string): number[] {
    // Simulate different data ranges based on period
    const points = period === '1W' ? 7 : 
                  period === '1M' ? 30 :
                  period === '3M' ? 90 :
                  period === '6M' ? 180 :
                  period === '1Y' ? 365 : 730;
    
    return Array.from({ length: points }, () => 
      Math.floor(Math.random() * 100) + 50
    );
  }
}