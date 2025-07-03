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

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    console.log('Login clicked - Email:', this.email, 'Role:', this.role);
    
    if (!this.email || !this.password || !this.role) {
      this.errorMessage = 'Please fill in all fields';
      console.log('Missing fields');
      return;
    }

    console.log('Calling AuthService login...');
    const loginSuccess = this.authService.login(this.email, this.password, this.role);
    console.log('Login result:', loginSuccess);
    
    if (loginSuccess) {
      console.log('Login successful! Navigating to dashboard...');
      this.errorMessage = '';
      
      if (this.role === 'admin' || this.role === 'parent-admin') {
        console.log('Navigating to admin dashboard');
        this.router.navigate(['/admin-dashboard']);
      } else {
        console.log('Navigating to user dashboard');
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.errorMessage = 'Login failed. Please try again.';
      console.log('Login failed');
    }
  }


}
