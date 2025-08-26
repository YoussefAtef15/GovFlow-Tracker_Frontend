import { Component, inject } from '@angular/core'; // 👈 [1] Add inject
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagerAnalyticsComponent } from '../manager-analytics/manager-analytics.component';
import { EmployeePerformanceComponent } from '../employee-performance/employee-performance.component';
import { SystemAlertsComponent } from '../system-alerts/system-alerts.component';
import { AuthService } from '../../services/auth.service'; // 👈 [2] Import the service

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ManagerAnalyticsComponent,
    EmployeePerformanceComponent,
    SystemAlertsComponent,
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css'],
})
export class ManagerDashboardComponent {
  // 👈 [3] Inject AuthService and get the current user signal
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  // 👈 [4] Helper function to get initials from the user's name
  getInitials(fullName: string | undefined): string {
    if (!fullName) {
      return '';
    }
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  }
}
