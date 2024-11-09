import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="chart-container" style="position: relative; height:300px;">
      <canvas [attr.id]="chartId"></canvas>
    </div>
  `
})
export class ChartComponent implements OnInit {
  @Input() data: any;
  @Input() type: string = 'line';
  @Input() options: any = {};
  
  protected chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
  private chart: any;

  ngOnInit() {
    setTimeout(() => {
      this.createChart();
    }, 0);
  }

  private createChart() {
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context');
      return;
    }

    this.chart = new Chart(ctx, {
      type: this.type as any,
      data: this.data,
      options: {
        ...this.options,
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
} 