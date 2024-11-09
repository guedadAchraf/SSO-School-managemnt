import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Welcome {{ username }}</h1>
      <div class="stats">
        <div *ngIf="isAdmin">
          <h2>School Statistics</h2>
          <p>Total Students: {{ totalStudents }}</p>
          <p>Total Teachers: {{ totalTeachers }}</p>
        </div>
        <div *ngIf="isStudent">
          <h2>My Courses</h2>
          <ul>
            <li *ngFor="let course of courses">
              {{ course.name }} - Grade: {{ course.grade }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  private keycloak = inject(KeycloakService);

  username = '';
  isAdmin = false;
  isStudent = false;
  totalStudents = 0;
  totalTeachers = 0;
  courses: any[] = [];

  ngOnInit() {
    this.username = this.keycloak.getUsername();
    this.isAdmin = this.keycloak.isUserInRole('admin');
    this.isStudent = this.keycloak.isUserInRole('student');

    if (this.isAdmin) {
      this.loadAdminStats();
    } else if (this.isStudent) {
      this.loadStudentCourses();
    }
  }

  private loadAdminStats() {
    this.apiService.getStudents().subscribe(data => this.totalStudents = data.length);
    this.apiService.getTeachers().subscribe(data => this.totalTeachers = data.length);
  }

  private loadStudentCourses() {
    this.apiService.getCourses().subscribe(data => this.courses = data);
  }
}