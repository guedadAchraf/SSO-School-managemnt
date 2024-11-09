import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../auth/auth.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Admin endpoints
  getStats(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/stats`);
  }

  getStudents(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/students`);
  }

  getTeachers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teachers`);
  }

  getCourses(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/courses`);
  }

  // Student endpoints
  getStudentCourses(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/student/courses`);
  }

  getStudentGrades(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/student/grades`);
  }

  // Teacher endpoints
  getTeacherCourses(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teacher/courses`);
  }

  submitGrade(courseId: string, studentId: string, grade: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/teacher/grades`, {
      courseId,
      studentId,
      grade
    });
  }

  submitAttendance(courseId: string, date: string, attendance: any[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/teacher/attendance`, {
      courseId,
      date,
      attendance
    });
  }
}