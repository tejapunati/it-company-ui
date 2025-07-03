import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    // Load sample users
    this.users = [
      { id: 1, name: 'Alice Johnson', email: 'alice@company.com', role: 'user', status: 'active' },
      { id: 2, name: 'Bob Smith', email: 'bob@company.com', role: 'user', status: 'active' }
    ];
    
    // Load from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const regularUsers = storedUsers.filter((user: any) => user.role === 'user');
      this.users = [...this.users, ...regularUsers];
    }
  }
  
  toggleStatus(user: any) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.saveUsers();
  }
  
  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== userId);
      this.saveUsers();
    }
  }
  
  saveUsers() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const createdUsers = this.users.filter(user => user.id > 2);
      localStorage.setItem('allUsers', JSON.stringify(createdUsers));
    }
  }
}