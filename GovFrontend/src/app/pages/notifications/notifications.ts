import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  // ✅ إضافة CommonModule لاستخدام ngFor, ngIf, DatePipe, etc.
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  isLoading = signal(true);

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadAllNotifications();
  }

  loadAllNotifications(): void {
    this.isLoading.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load all notifications', err);
        this.isLoading.set(false);
      }
    });
  }
}

