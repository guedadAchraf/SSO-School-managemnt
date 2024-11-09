import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./features/grade-submission/grade-submission.component').then(m => m.GradeSubmissionComponent)
  }
]; 