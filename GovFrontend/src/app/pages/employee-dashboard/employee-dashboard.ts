import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService, ServiceRequest, EmployeeDashboardData } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css']
})
export class EmployeeDashboardComponent implements OnInit {
  employee = {
    name: '',
    department: '',
    initial: ''
  };

  stats = {
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  };

  serviceRequests: ServiceRequest[] = [];
  filteredRequests: ServiceRequest[] = [];

  searchTerm: string = '';
  statusFilter: string = 'all';
  serviceFilter: string = 'all';

  isModalVisible = false;
  selectedRequest: ServiceRequest | null = null;
  selectedRequestDocuments: any[] = [];

  loading = true; // متغير لتتبع حالة التحميل

  constructor(private employeeService: EmployeeService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEmployeeData();
    this.loadDashboardData(); // استدعاء الدالة الرئيسية الجديدة
  }

  private loadEmployeeData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.employee.name = currentUser.fullName;
      this.employee.department = this.formatRole(currentUser.role);
      this.employee.initial = this.getInitials(currentUser.fullName);
    }
  }

  // الدالة الرئيسية التي تجلب كل البيانات
  loadDashboardData(): void {
    this.loading = true;
    this.employeeService.getEmployeeDashboardData().subscribe({
      next: (data: EmployeeDashboardData) => {
        // تحديث الإحصائيات
        this.stats = { pending: 0, underReview: 0, approved: 0, rejected: 0 };
        data.stats.forEach(stat => {
          switch(stat.label.toLowerCase()) {
            case 'pending': this.stats.pending = stat.count; break;
            case 'under review': this.stats.underReview = stat.count; break;
            case 'approved': this.stats.approved = stat.count; break;
            case 'rejected': this.stats.rejected = stat.count; break;
          }
        });

        // تحديث الطلبات
        this.serviceRequests = data.requests;
        this.applyFilters(); // تطبيق الفلاتر على البيانات الجديدة
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredRequests = this.serviceRequests.filter(request => {
      const matchesSearch = request.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.citizenName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || request.status.toLowerCase() === this.statusFilter.toLowerCase();
      // ملاحظة: فلتر الخدمة يحتاج إلى تحسين إذا كانت هناك أنواع خدمات كثيرة
      const matchesService = this.serviceFilter === 'all' || request.serviceType === this.serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }

  updateRequestStatus(requestId: string, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.employeeService.updateRequestStatus(requestId, newStatus.toUpperCase()).subscribe({
      next: () => {
        const request = this.serviceRequests.find(r => r.id === requestId);
        if (request) {
          request.status = newStatus;
          // إعادة حساب الإحصائيات بعد التغيير
          // this.calculateStats(); // يمكن إضافتها إذا أردت تحديث الإحصائيات فوراً
        }
      },
      error: (error) => console.error('Error updating request status:', error)
    });
  }

  approveRequest(requestId: string): void {
    this.updateSingleRequestStatus(requestId, 'APPROVED');
  }

  rejectRequest(requestId: string): void {
    this.updateSingleRequestStatus(requestId, 'REJECTED');
  }

  private updateSingleRequestStatus(requestId: string, newStatus: string): void {
    this.employeeService.updateRequestStatus(requestId, newStatus).subscribe({
      next: () => {
        const request = this.serviceRequests.find(r => r.id === requestId);
        if (request) {
          request.status = newStatus;
          // this.calculateStats();
        }
        this.applyFilters(); // تحديث عرض الجدول
      },
      error: (error) => console.error(`Error updating request ${requestId}:`, error)
    });
  }

  viewDocuments(requestId: string): void {
    this.selectedRequest = this.serviceRequests.find(r => r.id === requestId) || null;
    if (!this.selectedRequest) return;

    this.employeeService.getRequestDocuments(requestId).subscribe({
      next: (documents) => {
        this.selectedRequestDocuments = documents;
        this.isModalVisible = true;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        alert(`Could not load documents for Request ID: ${requestId}`);
      }
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedRequest = null;
    this.selectedRequestDocuments = [];
  }

  // الدوال المساعدة (تبقى كما هي)
  private formatRole(role: string): string { if (!role) return ''; return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(); }
  private getInitials(fullName: string): string { if (!fullName) return ''; const parts = fullName.trim().split(/\s+/); if (parts.length < 2) { return parts[0][0].toUpperCase(); } return (parts[0][0] + parts[1][0]).toUpperCase(); }
}
