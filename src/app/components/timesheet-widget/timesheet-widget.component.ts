import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-timesheet-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timesheet-widget">
      <div class="widget-header">
        <h3>Recent Timesheets</h3>
        <button class="view-all-btn" (click)="viewAllTimesheets()">View All</button>
      </div>
      
      <div class="timesheet-list" *ngIf="timesheets.length > 0">
        <div class="timesheet-item" *ngFor="let timesheet of timesheets">
          <div class="timesheet-info">
            <div class="week-ending">Week ending: {{ timesheet.weekEnding }}</div>
            <div class="hours">{{ timesheet.totalHours }} hours</div>
          </div>
          <div class="timesheet-status">
            <span class="status-badge" [class]="'status-' + timesheet.status.toLowerCase()">
              {{ timesheet.status }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="empty-state" *ngIf="timesheets.length === 0">
        <div class="empty-icon">📋</div>
        <p>No timesheets submitted yet</p>
      </div>
    </div>
  `,
  styles: [`
    .timesheet-widget {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      padding: 1rem;
      height: 100%;
    }
    
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .widget-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }
    
    .view-all-btn {
      background: none;
      border: none;
      color: #4f46e5;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 0;
    }
    
    .timesheet-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .timesheet-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      transition: background-color 0.2s;
    }
    
    .timesheet-item:hover {
      background-color: #f9fafb;
    }
    
    .timesheet-info {
      flex: 1;
    }
    
    .week-ending {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .hours {
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    
    .status-approved {
      background: #d1fae5;
      color: #065f46;
    }
    
    .status-rejected {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      color: #6b7280;
      text-align: center;
    }
    
    .empty-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      opacity: 0.7;
    }
  `]
})
export class TimesheetWidgetComponent implements OnInit {
  timesheets: any[] = [];
  
  constructor(
    private timesheetService: TimesheetService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadRecentTimesheets();
  }
  
  loadRecentTimesheets() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    this.timesheetService.getTimesheetsByUserId(currentUser.id).subscribe({
      next: (timesheets) => {
        this.timesheets = timesheets
          .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
          .slice(0, 2);
      },
      error: (error) => {
        console.error('Error loading recent timesheets:', error);
        this.timesheets = [];
      }
    });
  }
  
  viewAllTimesheets() {
    this.router.navigate(['/submitted-timesheets']);
  }
}