import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Interface for the payload sent to the show method
export interface NotificationPayload {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://govflow-trackerfrontendjar-production.up.railway.app/api';

  // A Subject to broadcast notification messages
  private notificationSubject = new Subject<NotificationPayload>();

  // A public observable that components can subscribe to
  public notification$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Pushes a new notification to the notification stream.
   * Components subscribed to notification$ will receive this.
   * @param payload The notification data to display.
   */
  show(payload: NotificationPayload) {
    this.notificationSubject.next(payload);
  }

  /**
   * Fetches notifications for the current user from the backend.
   * @returns Observable containing an array of notifications.
   */
  getNotifications(): Observable<Notification[]> {
    const token = this.authService.getToken();
    if (!token) {
      // Return an empty observable if the user is not logged in
      return new Observable<Notification[]>(subscriber => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`, { headers });
  }

  /**
   * Other functions can be added here in the future
   * e.g., markAsRead(), deleteNotification(), etc.
   */
}
