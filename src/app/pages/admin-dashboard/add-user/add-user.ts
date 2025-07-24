import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

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
    role: 'USER'
  };
  
  errorMessage = '';
  successMessage = '';

  constructor(
    public router: Router,
    private userService: UserService
  ) {}

  addUser() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill in required fields (Name, Email, Password)';
      return;
    }

    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'User created successfully!';
        this.errorMessage = '';
        
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard/users']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.errorMessage = error.error?.message || 'Error creating user';
        this.successMessage = '';
      }
    });
  }
}