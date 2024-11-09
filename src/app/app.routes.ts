import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'students',
    loadComponent: () => import('./features/students/students.component')
      .then(m => m.StudentsComponent),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'teacher'] }
  },
  {
    path: 'teachers',
    loadComponent: () => import('./features/teachers/teachers.component')
      .then(m => m.TeachersComponent),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  }
];