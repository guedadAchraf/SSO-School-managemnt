import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="fixed right-4 top-20 z-50 w-96 space-y-4">
      <div
        *ngFor="let notification of notifications$ | async"
        [@slideIn]
        [class]="'p-4 rounded-lg shadow-lg ' + getNotificationClass(notification.type)"
        role="alert"
      >
        <div class="flex items-center gap-3">
          <span [class]="'flex-shrink-0 w-2 h-2 rounded-full ' + getDotClass(notification.type)"></span>
          <div class="flex-1">
            <h4 class="font-semibold">{{ notification.title }}</h4>
            <p class="text-sm">{{ notification.message }}</p>
          </div>
          <button
            class="text-gray-500 hover:text-gray-700"
            (click)="dismissNotification(notification.id)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationCenterComponent {
  private notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-50 border-l-4 border-green-500';
      case 'warning': return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'error': return 'bg-red-50 border-l-4 border-red-500';
      default: return 'bg-blue-50 border-l-4 border-blue-500';
    }
  }

  getDotClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  }

  dismissNotification(id: string): void {
    this.notificationService.dismiss(id);
  }
}