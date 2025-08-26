import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { AuthService } from './auth.service';

// واجهات بيانات الموظفين
export interface Employee {
  id: number;
  name: string;
  email: string;
  avatar: string;
  department: string;
  position: string;
  hireDate: string;
  status: 'Active' | 'On Leave' | 'Suspended';
}

export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

// ✅ واجهة جديدة لبيانات تحديث الموظف
export interface UpdateEmployeePayload {
  fullName: string;
  email: string;
  roleId: number;
  departmentId: number;
}


// واجهات بيانات التقارير (تبقى كما هي)
export interface ReportStatValue { value: string; change?: number; }
export interface ReportStats { totalRequests: ReportStatValue; approved: ReportStatValue; rejected: ReportStatValue; avgProcessingTime: { value: string; change?: number }; }
export interface PerformanceMetric { department: string; totalRequests: number; approved: number; rejected: number; approvalRate: string; avgTime: number; slaCompliance: string; }
export interface ReportData { stats: ReportStats; performanceMetrics: PerformanceMetric[]; topPerformers?: TopPerformer[]; } // TopPerformers is optional for now
export interface TopPerformer { initials: string; name: string; department: string; requestsProcessed: number; approvalRate: string; avgTime: string; }


@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private baseUrl = 'http://localhost:8080/api/v1/manager';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ========== Employee Management Methods (Updated) ==========

  getEmployees(): Observable<Employee[]> {
    return this.http.get<UserDto[]>(`${this.baseUrl}/employees`, { headers: this.getAuthHeaders() })
      .pipe(
        map((userDtos: UserDto[]) => userDtos.map((dto: UserDto) => this.mapUserDtoToEmployee(dto)))
      );
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${id}`, { headers: this.getAuthHeaders() });
  }

  // ==================================================================
  // ✅ ===== START: الدالة الجديدة التي تمت إضافتها للتحديث ===== ✅
  // ==================================================================
  /**
   * Updates an employee's details.
   * @param id The ID of the employee to update.
   * @param employeeData The new data for the employee.
   * @returns An observable of the updated employee DTO.
   */
  updateEmployee(id: number, employeeData: UpdateEmployeePayload): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/employees/${id}`, employeeData, { headers: this.getAuthHeaders() });
  }
  // ==================================================================
  // ✅ ===== END: الدالة الجديدة التي تمت إضافتها ===== ✅
  // ==================================================================

  private mapUserDtoToEmployee(dto: UserDto): Employee {
    const nameParts = dto.fullName.trim().split(/\s+/);
    const initials = nameParts.length > 1
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    return {
      id: dto.id,
      name: dto.fullName,
      email: dto.email,
      avatar: initials,
      department: 'N/A', // This can be improved by fetching department name
      position: dto.role.charAt(0).toUpperCase() + dto.role.slice(1).toLowerCase(),
      hireDate: '2023-01-01', // Mock data
      status: 'Active' // Mock data
    };
  }

  // ========== Reports Dashboard Methods (Now connected to the REAL API) ==========

  getReportData(): Observable<ReportData> {
    // ✅ تم تغيير هذه الدالة لتستدعي الـ API الحقيقي بدلاً من البيانات الوهمية
    return this.http.get<ReportData>(`${this.baseUrl}/reports`, { headers: this.getAuthHeaders() });
  }
}
