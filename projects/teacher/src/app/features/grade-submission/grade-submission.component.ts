import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Course {
  id: number;
  name: string;
  students: Student[];
  isExpanded?: boolean;
}

interface Student {
  id: number;
  name: string;
  grade?: string;
  attendance?: number;
  lastUpdated?: Date;
}

@Component({
  selector: 'app-grade-submission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <header class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Grade Submission</h1>
        <div class="flex gap-4">
          <button class="btn btn-primary" (click)="saveAllGrades()">Save All Changes</button>
          <button class="btn bg-gray-100 hover:bg-gray-200">Export Grades</button>
        </div>
      </header>

      <div class="space-y-6">
        <div *ngFor="let course of courses" class="card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">{{ course.name }}</h3>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{{ course.students.length }} Students</span>
              <button class="btn bg-gray-100 hover:bg-gray-200" (click)="toggleCourse(course)">
                <svg class="w-5 h-5" [class.rotate-180]="course.isExpanded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <div *ngIf="course.isExpanded" class="space-y-4">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-3 text-left">Student</th>
                    <th class="px-4 py-3 text-left">Current Grade</th>
                    <th class="px-4 py-3 text-left">Attendance</th>
                    <th class="px-4 py-3 text-left">Last Updated</th>
                    <th class="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let student of course.students" class="border-t">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {{ student.name.charAt(0) }}
                        </div>
                        <div>
                          <p class="font-medium">{{ student.name }}</p>
                          <p class="text-sm text-gray-500">{{ student.id }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <input
                        type="text"
                        [(ngModel)]="student.grade"
                        (change)="gradeChanged(course.id, student)"
                        class="input w-24"
                      />
                    </td>
                    <td class="px-4 py-3">
                      <span [class]="'badge ' + getAttendanceBadgeClass(student.attendance)">
                        {{ student.attendance }}%
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500">
                      {{ student.lastUpdated | date:'medium' }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2">
                        <button class="btn bg-gray-100 hover:bg-gray-200" (click)="viewHistory(student)">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                          </svg>
                        </button>
                        <button class="btn bg-gray-100 hover:bg-gray-200" (click)="addNote(student)">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GradeSubmissionComponent {
  private apiService = inject(ApiService);
  courses: Course[] = [];

  ngOnInit() {
    this.loadCourses();
  }

  private loadCourses() {
    this.apiService.getTeacherCourses().subscribe(courses => {
      this.courses = courses.map(course => ({
        ...course,
        isExpanded: false
      }));
    });
  }

  toggleCourse(course: Course) {
    course.isExpanded = !course.isExpanded;
  }

  gradeChanged(courseId: number, student: Student) {
    if (student.grade) {
      this.apiService.submitGrade(courseId, student.id, student.grade).subscribe(() => {
        student.lastUpdated = new Date();
      });
    }
  }

  saveAllGrades() {
    this.courses.forEach(course => {
      course.students.forEach((student: Student) => {
        if (student.grade) {
          this.apiService.submitGrade(course.id, student.id, student.grade).subscribe();
        }
      });
    });
  }

  getAttendanceBadgeClass(attendance?: number): string {
    if (!attendance) return 'badge-warning';
    if (attendance >= 90) return 'badge-success';
    if (attendance >= 75) return 'badge-warning';
    return 'badge-error';
  }

  viewHistory(student: Student) {
    console.log('View history for student:', student);
  }

  addNote(student: Student) {
    console.log('Add note for student:', student);
  }
}