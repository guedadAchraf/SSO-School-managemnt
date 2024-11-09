import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Course {
  id: string;
  name: string;
  teacher: string;
  grade?: number;
  schedule: string;
  room: string;
  semester: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <header class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">My Courses</h1>
        <div class="flex gap-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search courses..." 
              class="input pr-10"
              [(ngModel)]="searchTerm"
              (input)="filterCourses()"
            >
            <svg class="w-5 h-5 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </div>
          <select class="input w-48" [(ngModel)]="selectedSemester" (change)="filterCourses()">
            <option value="">All Semesters</option>
            <option value="Fall 2023">Fall 2023</option>
            <option value="Spring 2024">Spring 2024</option>
          </select>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let course of filteredCourses" class="card hover:scale-105">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">{{ course.name }}</h3>
            <span [class]="'badge ' + getGradeBadgeClass(course.grade)">
              {{ course.grade || 'N/A' }}
            </span>
          </div>
          
          <div class="space-y-3 text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              <span>{{ course.teacher }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              <span>{{ course.schedule }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              <span>{{ course.room }}</span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button class="btn btn-primary flex-1">View Details</button>
            <button class="btn bg-gray-100 hover:bg-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CoursesComponent {
  private apiService = inject(ApiService);
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm = '';
  selectedSemester = '';

  ngOnInit() {
    this.loadCourses();
  }

  private loadCourses() {
    this.apiService.getStudentCourses().subscribe((courses: Course[]) => {
      this.courses = courses;
      this.filterCourses();
    });
  }

  filterCourses() {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          course.teacher.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSemester = !this.selectedSemester || course.semester === this.selectedSemester;
      return matchesSearch && matchesSemester;
    });
  }

  getGradeBadgeClass(grade?: number): string {
    if (!grade) return 'badge-warning';
    if (grade >= 90) return 'badge-success';
    if (grade >= 70) return 'badge-warning';
    return 'badge-danger';
  }
}