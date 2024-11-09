import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2">
            <svg *ngIf="icon" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path *ngIf="icon === 'users'" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path *ngIf="icon === 'academic-cap'" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              <path *ngIf="icon === 'book-open'" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
            <p class="text-gray-500 text-sm">{{ title }}</p>
          </div>
          <h4 class="text-2xl font-bold mt-1">{{ value }}</h4>
        </div>
        <div [class]="'badge ' + getBadgeClass()">
          <span>{{ trend }}</span>
        </div>
      </div>
      <div class="mt-4">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() trend: string = '';
  @Input() trendDirection: 'up' | 'down' = 'up';
  @Input() icon: 'users' | 'academic-cap' | 'book-open' | undefined;

  getBadgeClass(): string {
    return this.trendDirection === 'up' ? 'badge-success' : 'badge-danger';
  }
} 