import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">Unauthorized Access</h2>
        <p class="mt-2 text-gray-600">You don't have permission to access this area.</p>
        <div class="mt-4">
          <a routerLink="/" class="text-indigo-600 hover:text-indigo-500">Return to Home</a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {} 