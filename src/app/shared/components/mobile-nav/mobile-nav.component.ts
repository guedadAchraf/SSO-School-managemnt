import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-gray-600 bg-opacity-75"
        (click)="close.emit()"
      ></div>

      <div
        class="relative flex flex-col w-full max-w-xs pt-5 pb-4 bg-white"
        [@slideIn]
      >
        <div class="absolute top-0 right-0 pt-2 pr-2">
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            (click)="close.emit()"
          >
            <span class="sr-only">Close sidebar</span>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <div class="flex-shrink-0 px-4">
          <img class="h-8 w-auto" src="assets/logo.svg" alt="Logo">
        </div>

        <div class="mt-5 flex-1 h-0 overflow-y-auto">
          <nav class="px-2">
            <div class="space-y-1">
              <a
                *ngFor="let item of menuItems"
                [routerLink]="item.route"
                routerLinkActive="bg-gray-100 text-gray-900"
                class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <svg
                  class="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  [innerHTML]="item.icon"
                ></svg>
                {{ item.label }}
              </a>
            </div>
          </nav>
        </div>

        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex-shrink-0 w-full group block">
            <div class="flex items-center">
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {{ userName }}
                </p>
                <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {{ userRole }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MobileNavComponent {
  @Input() isOpen = false;
  @Input() menuItems: any[] = [];
  @Input() userName = '';
  @Input() userRole = '';
  @Output() close = new EventEmitter<void>();
}