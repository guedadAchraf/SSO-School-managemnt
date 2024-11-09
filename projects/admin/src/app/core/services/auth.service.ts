import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak = inject(KeycloakService);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.updateAuthenticationStatus();
  }

  private updateAuthenticationStatus() {
    this.isAuthenticatedSubject.next(this.keycloak.isLoggedIn());
  }

  login(redirectUri?: string): Observable<boolean> {
    return from(this.keycloak.login({
      redirectUri: redirectUri || window.location.origin + '/dashboard'
    })).pipe(
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        throw new Error('Failed to initialize login');
      })
    );
  }

  logout(): Observable<void> {
    return from(this.keycloak.logout(window.location.origin));
  }

  getUsername(): string {
    return this.keycloak.getUsername();
  }

  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }
} 