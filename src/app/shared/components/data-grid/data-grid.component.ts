import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overflow-hidden rounded-lg border border-gray-200">
      <div class="flex items-center justify-between p-4 bg-white">
        <div class="flex gap-4 items-center">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <svg class="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </div>
          <select
            [(ngModel)]="pageSize"
            (change)="onPageSizeChange()"
            class="border rounded-lg px-3 py-2"
          >
            <option [value]="10">10 per page</option>
            <option [value]="25">25 per page</option>
            <option [value]="50">50 per page</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            *ngFor="let action of actions"
            (click)="onAction.emit(action)"
            [class]="'px-4 py-2 rounded-lg ' + getActionClass(action.type)"
          >
            {{ action.label }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                *ngFor="let column of columns"
                (click)="sort(column.key)"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div class="flex items-center gap-2">
                  {{ column.label }}
                  <svg
                    *ngIf="sortColumn === column.key"
                    class="w-4 h-4"
                    [class.transform]="sortDirection === 'desc'"
                    [class.rotate-180]="sortDirection === 'desc'"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  </svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              *ngFor="let item of paginatedData"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                *ngFor="let column of columns"
                class="px-6 py-4 whitespace-nowrap"
                [ngSwitch]="column.type"
              >
                <span *ngSwitchCase="'badge'" [class]="'badge ' + getBadgeClass(item[column.key])">
                  {{ item[column.key] }}
                </span>
                <span *ngSwitchCase="'date'">
                  {{ item[column.key] | date:'medium' }}
                </span>
                <div *ngSwitchCase="'actions'" class="flex gap-2">
                  <button
                    *ngFor="let action of item.actions"
                    (click)="onRowAction.emit({ action: action, item: item })"
                    class="p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg class="w-5 h-5" [innerHTML]="action.icon"></svg>
                  </button>
                </div>
                <span *ngSwitchDefault>{{ item[column.key] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ filteredData.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                *ngFor="let page of pages"
                (click)="goToPage(page)"
                [class]="'relative inline-flex items-center px-4 py-2 border text-sm font-medium ' +
                  (currentPage === page
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50')"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DataGridComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() actions: any[] = [];
  @Output() onAction = new EventEmitter<any>();
  @Output() onRowAction = new EventEmitter<any>();

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  get filteredData() {
    return this.data
      .filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (!this.sortColumn) return 0;
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        return this.sortDirection === 'asc' 
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      });
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startIndex() {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex() {
    return Math.min(this.startIndex + this.pageSize, this.filteredData.length);
  }

  onSearch() {
    this.currentPage = 1;
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getActionClass(type: string): string {
    switch (type) {
      case 'primary': return 'bg-indigo-600 text-white hover:bg-indigo-700';
      case 'secondary': return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case 'danger': return 'bg-red-600 text-white hover:bg-red-700';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  }

  getBadgeClass(value: any): string {
    if (typeof value === 'number') {
      if (value >= 90) return 'badge-success';
      if (value >= 70) return 'badge-warning';
      return 'badge-danger';
    }
    return 'badge-info';
  }
}