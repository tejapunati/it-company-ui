import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  };
  
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  register() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Store in pending registrations
    if (typeof window !== 'undefined' && window.localStorage) {
      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      const newUser = {
        ...this.user,
        id: Date.now(),
        status: 'pending',
        registrationDate: new Date().toISOString(),
        role: 'user'
      };
      pendingUsers.push(newUser);
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    }

    this.successMessage = 'Registration submitted! Please wait for admin approval before you can login.';
    

    
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }
}