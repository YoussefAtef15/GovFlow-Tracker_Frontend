import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CitizenService, DashboardStats, ServiceCategory, RequestItem, CitizenDashboardData } from '../../services/citizen.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './citizen-dashboard.html',
  styleUrls: ['./citizen-dashboard.css']
})
export class CitizenDashboardComponent implements OnInit {
  // Signals for reactive state management
  dashboardData = signal<CitizenDashboardData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Properties for search functionality
  searchQuery = '';
  filteredCategories = signal<ServiceCategory[]>([]);

  constructor(
    private citizenService: CitizenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.citizenService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        // Initialize the filtered list with all categories
        this.filteredCategories.set(data.categories);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load dashboard data. Please try again later.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  protected getInitials(fullName: string): string {
    if (!fullName) return '';

    const parts = fullName.trim().split(/\s+/);

    // لو أقل من كلمتين → رجع أول حرف بس
    if (parts.length < 2) {
      return parts[0][0].toUpperCase();
    }

    // أول حرف من أول اسم + أول حرف من تاني اسم
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }


  // Method to filter service categories based on the search query
  filterCategories(): void {
    const allCategories = this.dashboardData()?.categories ?? [];
    if (!this.searchQuery) {
      this.filteredCategories.set(allCategories);
      return;
    }
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    const filtered = allCategories.filter(category =>
      category.name.toLowerCase().includes(lowerCaseQuery) ||
      category.description.toLowerCase().includes(lowerCaseQuery)
    );
    this.filteredCategories.set(filtered);
  }
}
