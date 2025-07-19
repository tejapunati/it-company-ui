import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivityService, Activity } from '../../services/activity.service';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  
  constructor(
    private authService: AuthService, 
    private activityService: ActivityService,
    private http: HttpClient
  ) {}
  
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
    // Get user stats from backend
    this.http.get<any>(`${environment.apiUrl}/stats/dashboard`).subscribe(
      (stats) => {
        this.totalUsers = stats.totalUsers || 0;
        this.pendingApprovals = stats.pendingApprovals || 0;
        this.monthlyHours = stats.monthlyHours || 0;
        this.activeProjects = stats.activeProjects || 0;
      },
      (error) => {
        console.error('Error loading dashboard stats:', error);
        
        // Fallback to simulated stats
        this.totalUsers = 12;
        this.pendingApprovals = 3;
        this.monthlyHours = 420;
        this.activeProjects = 4;
      }
    );
  }

  recentActivities: Activity[] = [];
  
  isParentAdmin(): boolean {
    return this.authService.isParentAdmin();
  }
}
