import { Component, OnInit, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // استخدام effect للاستجابة لتغيرات currentUser
    effect(() => {
      const user = this.authService.currentUser();
      this.isLoggedIn = user !== null;
      this.userName = user?.fullName || '';
    });
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  // دالة للحصول على المستخدم الحالي من AuthService
  currentUser(): any {
    return this.authService.currentUser();
  }

  // دالة للتنقل إلى Dashboard المناسب بناءً على دور المستخدم
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
  }

  // دالة للتحقق من حالة تسجيل الدخول
  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();

    if (this.isLoggedIn) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        this.userName = user.fullName || '';
      }
    }
  }

  // دالة لتسجيل الخروج
  logout(): void {
    this.authService.logout();
  }
}
