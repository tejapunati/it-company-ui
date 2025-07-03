import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})
export class AddUserComponent {
  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    department: '',
    role: 'user',
    status: 'active'
  };
  
  errorMessage = '';
  successMessage = '';

  constructor(public router: Router) {}

  addUser() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in required fields (Name, Email, Password)';
      return;
    }

    // Store in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const newUser = {
        ...this.user,
        id: Date.now(),
        createdDate: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('allUsers', JSON.stringify(users));
    }

    this.successMessage = 'User added successfully!';
    
    // Reset form
    setTimeout(() => {
      this.router.navigate(['/admin-dashboard/users']);
    }, 2000);
  }
}