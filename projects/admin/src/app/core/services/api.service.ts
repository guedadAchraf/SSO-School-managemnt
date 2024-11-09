import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Stats {
  students: number;
  teachers: number;
  courses: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API not available, using mock data:', error);
        return of({
          students: 1250,
          teachers: 75,
          courses: 48
        });
      })
    );
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`).pipe(
      catchError(() => of([]))
    );
  }

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers`).pipe(
      catchError(() => of([]))
    );
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`).pipe(
      catchError(() => of([]))
    );
  }

  createStudent(student: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students`, student).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating student:', error);
        return of({ success: false, error: error.message });
      })
    );
  }

  createTeacher(teacher: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teachers`, teacher).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating teacher:', error);
        return of({ success: false, error: error.message });
      })
    );
  }

  createCourse(course: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, course).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating course:', error);
        return of({ success: false, error: error.message });
      })
    );
  }
} 