import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    console.log('Loading users from backend API...');
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        console.log('All users from backend:', users);
        this.users = users.filter(user => user.role === 'USER');
        console.log('Filtered USER role users:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  toggleStatus(user: any) {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updatedUser = { ...user, status: newStatus };
    
    this.userService.updateUser(user.id, updatedUser).subscribe({
      next: (response) => {
        user.status = newStatus;
      },
      error: (error) => {
        console.error('Error updating user status:', error);
      }
    });
  }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
