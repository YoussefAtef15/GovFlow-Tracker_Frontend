import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  // ✅ تم التأكد من وجود هذا المتغير
  nationalId = '';
  password = '';
  rememberMe = false;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.nationalId, this.password).subscribe({
      next: () => {
        console.log('Login successful!');
      },
      error: (err) => {
        alert('Login failed: ' + (err.error.message || 'Invalid credentials'));
      }
    });
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const icon = document.getElementById('passwordToggleIcon');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon?.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon?.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }
}
