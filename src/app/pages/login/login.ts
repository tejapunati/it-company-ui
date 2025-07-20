import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    role: 'USER' // Default role
  };
  
  errorMessage = '';
  isLoading = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }
  
  login(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginData.email, this.loginData.password, this.loginData.role)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.redirectBasedOnRole();
        },
        error: (error) => {
          this.isLoading = false;
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Login failed. Please check your credentials and try again.';
          }
        }
      });
  }
  
  redirectBasedOnRole(): void {
    if (this.authService.isParentAdmin()) {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.authService.isAdmin()) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}