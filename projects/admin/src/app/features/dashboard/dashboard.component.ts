import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent, StatCardComponent],
  template: `
    <div class="space-y-6">
      <header class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">School Dashboard</h1>
          <p class="text-gray-600">Welcome, {{ username }}</p>
        </div>
        <div class="flex gap-4">
          <button class="btn btn-primary">Generate Report</button>
          <button class="btn btn-primary">Export Data</button>
          <button class="btn bg-red-600 text-white hover:bg-red-700" (click)="logout()">
            Logout
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <stat-card
          title="Total Students"
          [value]="totalStudents"
          icon="users"
          trend="+5.25%"
          trendDirection="up"
        ></stat-card>
        <stat-card
          title="Total Teachers"
          [value]="totalTeachers"
          icon="academic-cap"
          trend="+2.15%"
          trendDirection="up"
        ></stat-card>
        <stat-card
          title="Total Courses"
          [value]="totalCourses"
          icon="book-open"
          trend="+3.45%"
          trendDirection="up"
        ></stat-card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-xl font-semibold mb-4">Enrollment Trends</h3>
          <chart
            [data]="enrollmentData"
            type="line"
            [options]="chartOptions"
          ></chart>
        </div>
        <div class="card">
          <h3 class="text-xl font-semibold mb-4">Performance Overview</h3>
          <chart
            [data]="performanceData"
            type="bar"
            [options]="chartOptions"
          ></chart>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card col-span-2">
          <h3 class="text-xl font-semibold mb-4">Recent Activities</h3>
          <div class="space-y-4">
            <div *ngFor="let activity of recentActivities" class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <div [class]="'badge ' + activity.badgeClass">{{ activity.type }}</div>
              <div class="flex-1">
                <p class="font-medium">{{ activity.description }}</p>
                <p class="text-sm text-gray-500">{{ activity.timestamp | date:'medium' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3 class="text-xl font-semibold mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button class="btn btn-primary w-full" (click)="addNewStudent()">Add New Student</button>
            <button class="btn btn-primary w-full" (click)="addNewTeacher()">Add New Teacher</button>
            <button class="btn btn-primary w-full" (click)="createCourse()">Create Course</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private apiService = inject(ApiService);
  private keycloak = inject(KeycloakService);
  private router = inject(Router);
  
  username = '';
  totalStudents = 0;
  totalTeachers = 0;
  totalCourses = 0;
  
  enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Student Enrollment',
      data: [650, 750, 800, 850, 900, 950],
      borderColor: '#4f46e5'
    }]
  };

  performanceData = {
    labels: ['Math', 'Science', 'English', 'History', 'Art'],
    datasets: [{
      label: 'Average Grade',
      data: [85, 78, 82, 88, 92],
      backgroundColor: '#818cf8'
    }]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  recentActivities = [
    {
      type: 'New Student',
      description: 'John Doe enrolled in Computer Science',
      timestamp: new Date(),
      badgeClass: 'badge-success'
    },
    {
      type: 'Grade Update',
      description: 'Math Class grades updated by Prof. Smith',
      timestamp: new Date(Date.now() - 3600000),
      badgeClass: 'badge-warning'
    }
  ];

  constructor() {
    this.initializeUserInfo();
  }

  ngOnInit() {
    this.loadStats();
  }

  private async initializeUserInfo() {
    if (await this.keycloak.isLoggedIn()) {
      try {
        const userProfile = await this.keycloak.loadUserProfile();
        this.username = userProfile.username ?? '';
        
        // Verify admin role
        if (!this.keycloak.isUserInRole('admin')) {
          console.error('User does not have admin role');
          await this.router.navigate(['/unauthorized']);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    } else {
      await this.router.navigate(['/login']);
    }
  }

  async logout() {
    try {
      await this.keycloak.logout(window.location.origin);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  private loadStats() {
    this.apiService.getStats().subscribe({
      next: stats => {
        this.totalStudents = stats.students;
        this.totalTeachers = stats.teachers;
        this.totalCourses = stats.courses;
      },
      error: error => {
        console.error('Error loading stats:', error);
        // Use fallback data if API fails
        this.totalStudents = 1250;
        this.totalTeachers = 75;
        this.totalCourses = 48;
      }
    });
  }

  addNewStudent() {
    this.apiService.createStudent({
      name: 'New Student',
      email: 'student@example.com',
      grade: '9'
    }).subscribe({
      next: (response) => {
        console.log('Student created:', response);
        this.loadStats();
        this.addActivity('New Student', 'New student added to the system');
      },
      error: (error) => console.error('Error creating student:', error)
    });
  }

  addNewTeacher() {
    this.apiService.createTeacher({
      name: 'New Teacher',
      email: 'teacher@example.com',
      department: 'Science'
    }).subscribe({
      next: (response) => {
        console.log('Teacher created:', response);
        this.loadStats();
        this.addActivity('New Teacher', 'New teacher added to the system');
      },
      error: (error) => console.error('Error creating teacher:', error)
    });
  }

  createCourse() {
    this.apiService.createCourse({
      name: 'New Course',
      department: 'Science',
      capacity: 30
    }).subscribe({
      next: (response) => {
        console.log('Course created:', response);
        this.loadStats();
        this.addActivity('New Course', 'New course created');
      },
      error: (error) => console.error('Error creating course:', error)
    });
  }

  private addActivity(type: string, description: string) {
    this.recentActivities.unshift({
      type,
      description,
      timestamp: new Date(),
      badgeClass: 'badge-success'
    });
    // Keep only the last 5 activities
    if (this.recentActivities.length > 5) {
      this.recentActivities.pop();
    }
  }
}