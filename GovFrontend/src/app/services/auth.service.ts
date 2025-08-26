import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface User {
  nationalId: any;
  id: number;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  currentUser = signal<User | null>(null);
  private storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = sessionStorage;
      this.loadUserFromStorage();
    }
  }

  private loadUserFromStorage(): void {
    const userJson = this.storage?.getItem('user');
    if (userJson) {
      this.currentUser.set(JSON.parse(userJson));
    }
  }

  login(nationalId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { nationalId, password }).pipe(
      tap(response => {
        if (response && response.token && response.user && this.storage) {
          this.storage.setItem('token', response.token);
          this.storage.setItem('user', JSON.stringify(response.user));
          this.currentUser.set(response.user);
          this.navigateToDashboard(response.user.role);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, userData);
  }

  logout(): void {
    if (this.storage) {
      this.storage.removeItem('token');
      this.storage.removeItem('user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.storage?.getItem('token');
  }

  getToken(): string | null {
    return this.storage?.getItem('token') ?? null;
  }

  private navigateToDashboard(role: string): void {
    let route: string;
    switch (role.toUpperCase()) {
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
        route = '/';
    }
    this.router.navigate([route]);
  }
}
