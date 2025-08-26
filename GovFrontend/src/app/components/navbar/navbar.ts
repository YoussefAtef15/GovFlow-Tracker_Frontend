import { Component, signal, WritableSignal, effect, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  // ✅ تم تعريف المتغير هنا بدون إعطائه قيمة أولية
  currentUser: WritableSignal<any | null>;

  showNotifications = signal(false);
  showUserMenu = signal(false);

  notifications = signal<Notification[]>([]);
  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    // ✅ تم إسناد القيمة هنا داخل الـ constructor بعد أن أصبح authService متاحًا
    this.currentUser = this.authService.currentUser;

    // effect لمراقبة تغيير حالة المستخدم وجلب الإشعارات
    effect(() => {
      if (this.currentUser()) {
        this.loadNotifications();
      } else {
        this.notifications.set([]);
      }
    });
  }

  get userInitial(): string {
    const name = this.currentUser()?.fullName;
    return name ? name.charAt(0).toUpperCase() : '';
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (data) => this.notifications.set(data.slice(0, 5)), // عرض أحدث 5 فقط
      error: (err) => console.error('Failed to load notifications in navbar', err)
    });
  }


  navigateHome(): void {
    const role = this.currentUser()?.role;

    if (role?.toUpperCase() === 'CITIZEN') {
      // المواطن فقط يروح للهوم
      this.router.navigate(['/']);
    } else {
      // لو مش مواطن → متعملش حاجة (أو ممكن توديه للدashboard بتاعه لو حابب)
      console.log('Logo click disabled for non-citizen roles.');
    }
  }


  // دالة للتنقل إلى لوحة التحكم المناسبة
  navigateToDashboard(): void {
    const role = this.currentUser()?.role;
    let route: string;

    switch (role?.toUpperCase()) {
      case 'CITIZEN':
        route = '/citizen-dashboard';
        break;
      case 'EMPLOYEE':
        route = '/employee-dashboard';
        break;
      case 'MANAGER':
        route = '/manager-dashboard';
        break;
      default:
        route = '/'; // صفحة افتراضية
    }
    this.router.navigate([route]);
    this.showUserMenu.set(false); // إغلاق القائمة بعد النقر
  }

  logout() {
    this.authService.logout();
  }

  // إغلاق القوائم عند النقر في أي مكان آخر في الصفحة
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-wrapper')) {
      this.showNotifications.set(false);
    }
    if (!target.closest('.dropdown-wrapper')) {
      this.showUserMenu.set(false);
    }
  }
}
