import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UserProfile {
  address: string;
  nationalId: string;
  notifications: { email: boolean; sms: boolean; marketing: boolean };
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  avatar: string;
  createdAt: Date;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile: UserProfile;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private mockUserProfile: UserProfile = {
    id: 'EMP-2024-001',
    fullName: 'Sarah Mitchell',
    email: 'sarah.mitchell@government.gov',
    phone: '+1234567890',
    department: 'Traffic Department',
    position: 'Senior Officer',
    avatar: '',
    createdAt: new Date('2023-01-15'),
    notifications: {
      email: false,
      sms: false,
      marketing: false
    },
    address: '',
    nationalId: ''
  };

  constructor() { }

  getUserProfile(): Observable<UserProfile> {
    // محاكاة اتصال بالباكند
    return of({ ...this.mockUserProfile }).pipe(delay(800));
  }

  updateProfile(profile: UserProfile, avatarFile: File | null): Observable<UserProfile> {
    return new Observable(observer => {
      setTimeout(() => {
        if (avatarFile) {
          const reader = new FileReader();
          reader.onload = () => {
            this.mockUserProfile = {
              ...profile,
              avatar: reader.result as string
            };
            observer.next({ ...this.mockUserProfile });
            observer.complete();
          };
          reader.readAsDataURL(avatarFile);
        } else {
          this.mockUserProfile = { ...profile };
          observer.next({ ...this.mockUserProfile });
          observer.complete();
        }
      }, 1500);
    });
  }

  uploadAvatar(file: File): Observable<{ url: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => {
          observer.next({ url: reader.result as string });
          observer.complete();
        };
        reader.readAsDataURL(file);
      }, 1000);
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return of({ success: true, message: 'Password changed successfully' }).pipe(delay(1000));
  }
}
