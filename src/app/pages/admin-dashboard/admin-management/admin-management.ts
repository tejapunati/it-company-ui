import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-management.html',
  styleUrls: ['./admin-management.css']
})
export class AdminManagementComponent implements OnInit {
  admins: any[] = [];

  ngOnInit() {
    this.loadAdmins();
  }
  
  loadAdmins() {
    // Load sample admins
    this.admins = [
      { id: 1, name: 'John Admin', email: 'john@company.com', role: 'admin', status: 'active' },
      { id: 2, name: 'Sarah Manager', email: 'sarah@company.com', role: 'parent-admin', status: 'active' }
    ];
    
    // Load from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const adminUsers = storedUsers.filter((user: any) => user.role === 'admin' || user.role === 'parent-admin');
      this.admins = [...this.admins, ...adminUsers];
    }
  }
  
  toggleStatus(admin: any) {
    admin.status = admin.status === 'active' ? 'inactive' : 'active';
    this.saveAdmins();
  }
  
  deleteAdmin(adminId: number) {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.admins = this.admins.filter(admin => admin.id !== adminId);
      this.saveAdmins();
    }
  }
  
  saveAdmins() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const createdAdmins = this.admins.filter(admin => admin.id > 2);
      localStorage.setItem('allUsers', JSON.stringify(createdAdmins));
    }
  }
}