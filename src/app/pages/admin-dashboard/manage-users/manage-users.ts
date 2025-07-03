import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsersComponent implements OnInit {
  users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'User', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Admin', status: 'pending' }
  ];

  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    // Load from localStorage (added users)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      console.log('Loaded users from storage:', storedUsers);
      this.users = [...this.users, ...storedUsers];
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
      const createdUsers = this.users.filter(user => user.id > 2); // Only save created users
      localStorage.setItem('allUsers', JSON.stringify(createdUsers));
    }
  }
}
