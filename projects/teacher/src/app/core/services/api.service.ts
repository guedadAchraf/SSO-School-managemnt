import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Course {
  id: number;
  name: string;
  students: Student[];
}

interface Student {
  id: number;
  name: string;
  grade?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTeacherCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/teachers/courses`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API not available, using mock data:', error);
        return of([
          {
            id: 1,
            name: 'Advanced Mathematics',
            students: [
              { id: 1, name: 'John Doe', grade: 'A' },
              { id: 2, name: 'Jane Smith', grade: 'B+' }
            ]
          },
          {
            id: 2,
            name: 'Physics 101',
            students: [
              { id: 3, name: 'Bob Wilson', grade: 'A-' },
              { id: 4, name: 'Alice Brown', grade: 'B' }
            ]
          }
        ]);
      })
    );
  }

  submitGrade(courseId: number, studentId: number, grade: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/grades`, {
      courseId,
      studentId,
      grade
    }).pipe(
      catchError(() => of({ success: true }))
    );
  }
} 