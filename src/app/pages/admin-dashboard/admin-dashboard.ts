import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivityService, Activity } from '../../services/activity.service';
import { environment } from '../../../environments/environment';
import { EmailWidgetComponent } from '../../components/email-widget/email-widget.component';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive, EmailWidgetComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  
  constructor(
    private authService: AuthService, 
    private activityService: ActivityService,
    private http: HttpClient,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.activityService.activities$.subscribe(activities => {
      this.recentActivities = activities;
    });
    this.calculateStats();
  }
  totalUsers = 0;
  totalAdmins = 0;
  activeProjects = 0;
  pendingApprovals = 0;
  totalTimesheets = 0;
  
  calculateStats() {
    this.http.get<any>(`${environment.apiUrl}/stats/dashboard`).subscribe({
      next: (stats) => {
        console.log('Dashboard stats from backend:', stats);
        this.totalUsers = stats.totalUsers || 0;
        this.totalAdmins = stats.totalAdmins || 0;
        this.pendingApprovals = stats.pendingApprovals || 0;
        this.activeProjects = stats.activeProjects || 0;
        this.totalTimesheets = stats.totalTimesheets || 0;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.totalUsers = 0;
        this.totalAdmins = 0;
        this.pendingApprovals = 0;
        this.activeProjects = 0;
        this.totalTimesheets = 0;
      }
    });
  }

  recentActivities: Activity[] = [];
  
  isParentAdmin(): boolean {
    return this.authService.isParentAdmin();
  }
  
  getCurrentUserName(): string {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.name || 'Admin';
  }
  
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
