import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface ServiceRequestDto {
  id: number;
  serviceName: string;
  status: string;
  submittedDate?: Date;
  details: string;
  department: string;
  progress?: number;
  employeeComments?: string;
  uploadedDocuments: { name: string, type: 'pdf' | 'image' }[];
}

export interface Document {
  name: string;
  type: string;
}

export interface PayableService {
  id: string;
  name: string;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  serviceName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Failed';
}

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {
  private baseUrl = 'https://govflow-trackerfrontendjar-production.up.railway.app/v1/requests';
  private paymentsUrl = 'https://govflow-trackerfrontendjar-production.up.railway.app/api/payments';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getMyRequests(): Observable<ServiceRequestDto[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<ServiceRequestDto[]>(this.baseUrl, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  createRequest(formData: FormData): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.baseUrl, formData, { headers });
  }

  getPayableServices(): Observable<PayableService[]> {
    return this.http.get<PayableService[]>(`${this.paymentsUrl}/payable`, { headers: this.getAuthHeaders() });
  }

  getPaymentHistory(): Observable<PaymentRecord[]> {
    return this.http.get<PaymentRecord[]>(`${this.paymentsUrl}/history`, { headers: this.getAuthHeaders() });
  }

  uploadDocument(requestId: number, file: File): Observable<{success: boolean, fileName: string}> {
    // This simulates an upload and returns a success response.
    // In a real app, you would use FormData and an HTTP POST request.
    console.log(`Simulating upload for request ID ${requestId}:`, file.name);
    return of({ success: true, fileName: file.name });
  }
}
