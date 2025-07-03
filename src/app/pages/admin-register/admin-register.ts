import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';

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
    department: '',
    phone: '',
    status: 'pending'
  };
  
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(private emailService: EmailService, private router: Router) {}

  register() {
    if (!this.admin.name || !this.admin.email || !this.admin.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    
    this.isSubmitting = true;
    
    // Add to pending approvals (simulate backend)
    const pendingAdmin = {
      ...this.admin,
      id: Date.now(),
      registrationDate: new Date().toISOString(),
      status: 'pending'
    };
    
    // Store in localStorage (simulate database) - browser only
    if (typeof window !== 'undefined' && window.localStorage) {
      const pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]');
      pendingAdmins.push(pendingAdmin);
      localStorage.setItem('pendingAdmins', JSON.stringify(pendingAdmins));
    }
    
    // Send email notification to parent admin
    this.emailService.sendAdminApprovalNotification(this.admin);
    
    this.successMessage = 'Registration submitted successfully! Parent admin has been notified for approval.';
    this.isSubmitting = false;
    
    // Reset form
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }
}
