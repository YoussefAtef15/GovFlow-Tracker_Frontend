import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  fullName = '';
  nationalId = '';
  phoneNumber = '';
  address = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'citizen';
  jobRoleCode = '';
  showRoleCode = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const nameParts = this.fullName.trim().split(/\s+/);
    if (nameParts.length < 4) {
      alert('Full name must contain at least 4 words.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userPayload = {
      fullName: this.fullName,
      nationalId: this.nationalId,
      phoneNumber: this.phoneNumber,
      address: this.address,
      email: this.email,
      password: this.password,
      role: this.role,
      jobRoleCode: this.jobRoleCode,
    };

    this.authService.register(userPayload).subscribe({
      next: (res) => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration Error:', err);
        const errorMessages = err.error?.errors?.join('\n') || err.error?.message || 'Unknown registration error';
        alert('Registration failed:\n' + errorMessages);
      }
    });
  }

  toggleRoleCode() {
    this.showRoleCode = this.role !== 'citizen';
  }
}
