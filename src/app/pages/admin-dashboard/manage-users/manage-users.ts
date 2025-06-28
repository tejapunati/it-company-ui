import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  imports: [CommonModule],
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css']
})
export class ManageUsersComponent {
  users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'User', status: 'active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Admin', status: 'pending' }
  ];

  toggleStatus(user: any) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
  }
}
