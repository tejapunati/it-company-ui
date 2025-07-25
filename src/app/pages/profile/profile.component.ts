import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  isEditing = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  
  profileData = {
    name: '',
    email: '',
    phone: '',
    department: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadProfileData();
  }

  loadProfileData() {
    this.profileData.name = this.currentUser.name || '';
    this.profileData.email = this.currentUser.email || '';
    this.profileData.phone = this.currentUser.phone || '';
    this.profileData.department = this.currentUser.department || '';
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.clearMessages();
    
    if (!this.isEditing) {
      this.loadProfileData();
      this.clearPasswordFields();
    }
  }

  updateProfile() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    const updateData: any = {
      name: this.profileData.name,
      email: this.profileData.email,
      phone: this.profileData.phone,
      department: this.profileData.department
    };

    if (this.profileData.newPassword) {
      updateData.currentPassword = this.profileData.currentPassword;
      updateData.newPassword = this.profileData.newPassword;
    }

    const endpoint = `${environment.apiUrl}/users/profile`;

    this.http.put(endpoint, updateData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        this.isEditing = false;
        
        const updatedUser = { ...this.currentUser, ...updateData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        this.clearPasswordFields();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Profile update error:', error);
        this.errorMessage = error.error || error.message || 'Failed to update profile';
      }
    });
  }

  validateForm(): boolean {
    if (!this.profileData.name.trim()) {
      this.errorMessage = 'Name is required';
      return false;
    }

    if (!this.profileData.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.profileData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (this.profileData.newPassword) {
      if (!this.profileData.currentPassword) {
        this.errorMessage = 'Current password is required to change password';
        return false;
      }

      if (this.profileData.newPassword.length < 6) {
        this.errorMessage = 'New password must be at least 6 characters long';
        return false;
      }

      if (this.profileData.newPassword !== this.profileData.confirmPassword) {
        this.errorMessage = 'New passwords do not match';
        return false;
      }
    }

    return true;
  }

  clearPasswordFields() {
    this.profileData.currentPassword = '';
    this.profileData.newPassword = '';
    this.profileData.confirmPassword = '';
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  goBack() {
    if (this.currentUser.role === 'USER') {
      this.router.navigate(['/user-dashboard']);
    } else {
      this.router.navigate(['/admin-dashboard']);
    }
  }
}