import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">School Management System</h2>
          <p class="mt-2 text-sm text-gray-600">Admin Portal</p>
          <p *ngIf="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
        </div>
        <button
          (click)="login()"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in with SSO
        </button>
      </div>
    </div>
  `
})
export class LoginComponent {
  private keycloak = inject(KeycloakService);
  private router = inject(Router);
  error: string = '';

  async login() {
    try {
      await this.keycloak.login({
        redirectUri: window.location.origin + '/dashboard'
      });
    } catch (err) {
      console.error('Login error:', err);
      this.error = 'Failed to initialize login. Please try again.';
    }
  }
} 