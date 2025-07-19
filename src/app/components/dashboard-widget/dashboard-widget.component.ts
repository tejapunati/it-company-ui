import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-widget">
      <div class="widget-header">
        <h3>Backend Data</h3>
        <div class="connection-status" [class.connected]="isConnected" [class.disconnected]="!isConnected">
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </div>
      </div>
      
      <div class="widget-content">
        <div *ngIf="isLoading" class="loading">
          Loading data...
        </div>
        
        <div *ngIf="!isLoading && isConnected && stats" class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.activeUsers }}</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.pendingApprovals }}</div>
            <div class="stat-label">Pending Approvals</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalTimesheets }}</div>
            <div class="stat-label">Total Timesheets</div>
          </div>
        </div>
        
        <div *ngIf="!isLoading && !isConnected" class="error-message">
          <p>{{ errorMessage || 'Unable to connect to backend server.' }}</p>
          <button (click)="loadData()" class="retry-button">Retry</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-widget {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 20px;
    }
    
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
    
    .widget-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    
    .connection-status {
      font-size: 14px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 20px;
    }
    
    .connected {
      background-color: rgba(52, 211, 153, 0.2);
      color: #065f46;
    }
    
    .disconnected {
      background-color: rgba(239, 68, 68, 0.2);
      color: #b91c1c;
    }
    
    .widget-content {
      padding: 20px;
    }
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #6c757d;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .stat-item {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #3b82f6;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #6c757d;
    }
    
    .error-message {
      text-align: center;
      padding: 20px;
      color: #b91c1c;
    }
    
    .retry-button {
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 10px;
    }
    
    .retry-button:hover {
      background-color: #2563eb;
    }
  `]
})
export class DashboardWidgetComponent implements OnInit {
  isConnected = false;
  isLoading = true;
  errorMessage = '';
  stats: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.get(`${environment.apiUrl}/dashboard/stats`)
      .subscribe({
        next: (response) => {
          this.isConnected = true;
          this.stats = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.isConnected = false;
          this.isLoading = false;
          
          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to backend server.';
          } else {
            this.errorMessage = `Error: ${error.status} - ${error.statusText || 'Unknown error'}`;
          }
        }
      });
  }
}