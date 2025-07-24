import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-management.html',
  styleUrls: ['./admin-management.css']
})
export class AdminManagementComponent implements OnInit {
  admins: any[] = [];
  showAddForm = false;
  newAdmin = {
    name: '',
    email: '',
    password: '',
    phone: '',
    department: ''
  };
  
  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isParentAdmin()) {
      this.loadAdmins();
    }
  }
  
  loadAdmins() {
    this.adminService.getAllAdmins().subscribe({
      next: (admins) => {
        this.admins = admins;
      },
      error: (error) => {
        console.error('Error loading admins:', error);
      }
    });
  }
  
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }
  
  addAdmin() {
    if (!this.newAdmin.name || !this.newAdmin.email || !this.newAdmin.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    this.adminService.createAdmin(this.newAdmin).subscribe({
      next: (admin) => {
        this.admins.push(admin);
        this.resetForm();
        this.showAddForm = false;
        alert('Admin created successfully!');
      },
      error: (error) => {
        console.error('Error creating admin:', error);
        alert('Error creating admin: ' + (error.error?.message || error.message));
      }
    });
  }
  
  resetForm() {
    this.newAdmin = {
      name: '',
      email: '',
      password: '',
      phone: '',
      department: ''
    };
  }
  
  deleteAdmin(adminId: string) {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(adminId).subscribe({
        next: () => {
          this.admins = this.admins.filter(admin => admin.id !== adminId);
          alert('Admin deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting admin:', error);
          alert('Error deleting admin');
        }
      });
    }
  }
}