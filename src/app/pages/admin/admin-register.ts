import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-register.html',
  styleUrls: ['./admin-register.css']
})
export class AdminRegisterComponent {
  admin = {
    name: '',
    email: '',
    password: '',
    status: 'pending' // default status
  };

  register() {
    // This would normally send data to backend
    console.log('Admin Registration Submitted:', this.admin);
    alert('Registration submitted. Awaiting approval by main admin.');
  }
}
