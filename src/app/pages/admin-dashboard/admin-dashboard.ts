// admin-dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent {
  sections = [
    { title: 'Manage Users', route: '/admin-dashboard/users' },
    { title: 'View Timesheets', route: '/admin-dashboard/timesheets' },
    { title: 'Pay Management', route: '/admin-dashboard/pay' }
  ];
}
