import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

// هذه الـ Interfaces تصف شكل البيانات القادمة من الباك إند
export interface ServiceRequest {
  id: string;
  citizenName: string;
  serviceType: string;
  date: Date;
  priority: string;
  status: string;
  department: string;
}

export interface DashboardStats {
  label: string;
  count: number;
  icon: string;
  colorClass: string;
}

// واجهة جديدة لتجميع بيانات الداشبورد
export interface EmployeeDashboardData {
  stats: DashboardStats[];
  requests: ServiceRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // هذا هو الرابط للـ Controller الخاص بالموظف في الباك إند
  private baseUrl = 'https://govflow-trackerfrontendjar-production.up.railway.app/api/v1/employee';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // دالة للحصول على التوكن وإضافته للـ headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * دالة جديدة ومحسنة تجلب كل بيانات الداشبورد (الإحصائيات والطلبات) في طلب واحد
   */
  getEmployeeDashboardData(): Observable<EmployeeDashboardData> {
    const headers = this.getAuthHeaders();

    // نستخدم forkJoin لدمج طلبين API في طلب واحد
    return forkJoin({
      stats: this.http.get<DashboardStats[]>(`${this.baseUrl}/stats`, { headers }),
      requests: this.http.get<ServiceRequest[]>(`${this.baseUrl}/requests`, { headers })
    });
  }

  /**
   * دالة لتحديث حالة الطلب
   * @param requestId - رقم الطلب
   * @param status - الحالة الجديدة
   */
  updateRequestStatus(requestId: string, status: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { status: status }; // الباك إند يتوقع كائن يحتوي على الحالة
    return this.http.patch(`${this.baseUrl}/requests/${requestId}/status`, body, { headers });
  }

  /**
   * دالة لجلب مستندات طلب معين (للتطوير المستقبلي)
   * @param requestId - رقم الطلب
   */
  getRequestDocuments(requestId: string): Observable<any[]> {
    // هذا Endpoint لم يتم بناؤه بعد في الباك إند، لكننا نجهزه هنا
    // return this.http.get<any[]>(`${this.baseUrl}/requests/${requestId}/documents`, { headers: this.getAuthHeaders() });

    // سنرجع بيانات وهمية مؤقتًا حتى يتم بناء الـ API الخاص بها
    return new Observable(observer => {
      const mockDocuments = [
        { name: 'national_id.pdf', url: '#' },
        { name: 'request_form.pdf', url: '#' }
      ];
      observer.next(mockDocuments);
      observer.complete();
    });
  }
}
