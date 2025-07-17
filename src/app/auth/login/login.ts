import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class LoginComponent {
  email = '';
  password = '';
  role = '';
  errorMessage = '';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    console.log('Login clicked - Email:', this.email, 'Password:', this.password, 'Role:', this.role);
    
    if (!this.email || !this.password || !this.role) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // For debugging - show what we're sending to the service
    console.log('Calling AuthService login with:', {
      email: this.email,
      password: this.password,
      role: this.role
    });
    
    this.authService.login(this.email, this.password, this.role).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.isLoading = false;
        
        if (this.role === 'admin' || this.role === 'parent-admin') {
          console.log('Navigating to admin dashboard');
          this.router.navigate(['/admin-dashboard']);
        } else {
          console.log('Navigating to user dashboard');
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        } else {
          this.errorMessage = `Login failed: ${error.error?.message || error.message || 'Unknown error'}`;
        }
      }
    });
  }
}