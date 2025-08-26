import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    avatar: '',
    createdAt: new Date(),
    nationalId: '',
    address: '',
    notifications: {
      email: true,
      sms: true,
      marketing: false
    }
  };

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  isEditing = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  saveMessage = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.profileService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = {
          ...profile,
          nationalId: profile.nationalId || '123456789',
          address: profile.address || '123 Main Street, City, State 12345',
          notifications: profile.notifications || {
            email: true,
            sms: true,
            marketing: false
          }
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      }
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.saveMessage = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.selectedFile = null;
    this.previewUrl = null;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.loadUserProfile();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        this.saveMessage = 'Please select an image file';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.saveMessage = 'Image size should be less than 2MB';
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.saveMessage = 'New passwords do not match';
      return;
    }

    if (this.newPassword.length < 8) {
      this.saveMessage = 'Password must be at least 8 characters long';
      return;
    }

    this.isLoading = true;
    this.profileService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        this.saveMessage = response.message;
        this.isLoading = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.saveMessage = 'Error changing password. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // حفظ التعديلات
  saveProfile(): void {
    this.isLoading = true;
    this.saveMessage = '';

    this.profileService.updateProfile(this.userProfile, this.selectedFile).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.selectedFile = null;
        this.previewUrl = null;
        this.saveMessage = 'Profile updated successfully!';
        this.isLoading = false;

        this.userProfile = response;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.saveMessage = 'Error updating profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onNotificationChange(type: keyof typeof this.userProfile.notifications, event: any): void {
    if (this.isEditing) {
      this.userProfile.notifications[type] = event.target.checked;
    }
  }

  getInitials(): string {
    return this.userProfile.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  goBack(): void {
    this.router.navigate(['/employee-dashboard']);
  }

  isPasswordValid(): boolean {
    return this.newPassword.length >= 8 && this.newPassword === this.confirmPassword;
  }

  canSaveChanges(): boolean {
    return this.isEditing && !this.isLoading;
  }
}
