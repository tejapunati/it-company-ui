import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivityService, Activity } from '../../services/activity.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  
  constructor(private authService: AuthService, private activityService: ActivityService) {}
  
  ngOnInit() {
    this.activityService.activities$.subscribe(activities => {
      this.recentActivities = activities;
    });
    this.calculateStats();
  }
  totalUsers = 0;
  activeProjects = 0;
  pendingApprovals = 0;
  monthlyHours = 0;
  
  calculateStats() {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Calculate total users
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      this.totalUsers = allUsers.length + 2; // +2 for default users
      
      // Calculate pending approvals
      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      const pendingUserApprovals = pendingUsers.filter((u: any) => u.status === 'pending').length;
      const pendingTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
      const pendingTimesheetApprovals = pendingTimesheets.filter((t: any) => t.status === 'pending').length;
      this.pendingApprovals = pendingUserApprovals + pendingTimesheetApprovals;
      
      // Calculate monthly hours (approved timesheets)
      const approvedTimesheets = pendingTimesheets.filter((t: any) => t.status === 'approved');
      this.monthlyHours = approvedTimesheets.reduce((total: number, t: any) => total + (t.totalHours || 0), 0);
      
      // Active projects (simulate based on users)
      this.activeProjects = Math.ceil(this.totalUsers / 4); // 1 project per 4 users
    }
  }

  recentActivities: Activity[] = [];
  
  isParentAdmin(): boolean {
    return this.authService.isParentAdmin();
  }
}
