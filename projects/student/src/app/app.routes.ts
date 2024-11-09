import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./features/courses/courses.component').then(m => m.CoursesComponent)
  }
]; 