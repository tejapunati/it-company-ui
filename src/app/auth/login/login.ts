import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  role = ''; // "admin" or "user"

  constructor(private router: Router) {}

  login() {
    // Simulated login logic
    if (this.role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.role === 'user') {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
