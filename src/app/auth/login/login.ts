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
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    // Auto-detect role based on email if not provided
    if (!this.role) {
      if (this.email === 'admin@ssrmtech.com') {
        this.role = 'ADMIN';
      } else if (this.email === 'parentadmin@ssrmtech.com') {
        this.role = 'PARENT_ADMIN';
      } else {
        this.role = 'USER';
      }
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.email, this.password, this.role).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.isLoading = false;
        
        // Display success message
        const successElement = document.createElement('div');
        successElement.className = 'backend-connection-success';
        successElement.innerHTML = `
          <div class="success-icon">✓</div>
          <div class="success-message">
            <strong>Login Successful!</strong>
            <p>Welcome back, ${response.name}!</p>
          </div>
        `;
        document.body.appendChild(successElement);
        
        // Remove the success message after 3 seconds
        setTimeout(() => {
          successElement.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(successElement);
          }, 500);
        }, 3000);
        
        // Check if the user is an admin based on the response
        const isAdmin = response.role.toUpperCase() === 'ADMIN' || response.role.toUpperCase() === 'PARENT_ADMIN';
        
        if (isAdmin) {
          this.router.navigate(['/admin-dashboard']);
        } else {
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
          this.errorMessage = error.error?.message || error.message || 'Unknown error';
        }
      }
    });
  }
}