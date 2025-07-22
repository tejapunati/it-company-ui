import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailApiService } from '../../services/email-api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EmailTemplate } from '../../services/email.service';

@Component({
  selector: 'app-email-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="email-widget">
      <div class="widget-header">
        <h3>Recent Emails</h3>
        <button class="view-all-btn" (click)="viewAllEmails()">View All</button>
      </div>
      
      <div class="email-list" *ngIf="emails.length > 0">
        <div class="email-item" *ngFor="let email of emails.slice(0, 5)">
          <div class="email-icon">{{ getEmailIcon(email.type) }}</div>
          <div class="email-content">
            <div class="email-subject">{{ email.subject }}</div>
            <div class="email-meta">
              <span class="email-to">To: {{ email.to }}</span>
              <span class="email-time">{{ formatTime(email.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="empty-state" *ngIf="emails.length === 0">
        <div class="empty-icon">📧</div>
        <p>No recent emails</p>
      </div>
    </div>
  `,
  styles: [`
    .email-widget {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
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
    
    .email-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }
    
    .email-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 6px;
      transition: background-color 0.2s;
    }
    
    .email-item:hover {
      background-color: #f9fafb;
    }
    
    .email-icon {
      font-size: 1.25rem;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .email-content {
      flex: 1;
      min-width: 0;
    }
    
    .email-subject {
      font-weight: 500;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .email-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #6b7280;
    }
    
    .email-to {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 60%;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      color: #6b7280;
      text-align: center;
      flex: 1;
    }
    
    .empty-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      opacity: 0.7;
    }
  `]
})
export class EmailWidgetComponent implements OnInit {
  @Input() maxEmails: number = 5;
  emails: any[] = [];
  
  constructor(
    private emailApiService: EmailApiService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadEmails();
  }
  
  loadEmails() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    this.emailApiService.getDirectEmailLogs(currentUser.email).subscribe({
      next: (data) => {
        console.log('Email widget data:', data);
        
        if (!data || (!data.userEmailLogs && !data.adminEmailLogs && !data.parentAdminEmailLogs)) {
          // Try standard endpoint if direct endpoint returns no data
          this.tryStandardEndpoint(currentUser.email);
          return;
        }
        
        this.processEmailData(data);
      },
      error: (error) => {
        console.error('Error fetching emails for widget:', error);
        // Try standard endpoint as fallback
        this.tryStandardEndpoint(currentUser.email);
      }
    });
  }
  
  tryStandardEndpoint(email: string) {
    this.emailApiService.getEmailLogs(email).subscribe({
      next: (data) => {
        console.log('Email widget data from standard endpoint:', data);
        this.processEmailData(data);
      },
      error: (error) => {
        console.error('Error fetching emails from standard endpoint:', error);
        // Use sample data as last resort
        this.useSampleData(email);
      }
    });
  }
  
  useSampleData(email: string) {
    console.log('Using sample email data for:', email);
    this.emailApiService.getSampleEmailLogs(email).subscribe({
      next: (data) => {
        console.log('Sample email data:', data);
        this.processEmailData(data);
      },
      error: (error) => {
        console.error('Error generating sample emails:', error);
        this.emails = [];
      }
    });
  }
  
  processEmailData(data: any) {
    try {
      // Check if data is an array (direct API response format)
      if (Array.isArray(data)) {
        console.log('Processing array data format for widget');
        // Map the array format to our internal format with proper type casting
        const emailLogs = data.map((log: any) => ({
          to: log.toEmail || 'unknown',
          subject: log.subject || 'No Subject',
          body: log.body || 'No Content',
          type: this.mapEmailType(log.type), // Return type is now properly typed
          timestamp: log.sentDate ? new Date(log.sentDate).getTime() : Date.now()
        }));
        
        // Set the emails and sort
        this.emails = emailLogs as EmailTemplate[];
        this.emails.sort((a, b) => b.timestamp - a.timestamp);
        
        // Limit to maxEmails
        if (this.emails.length > this.maxEmails) {
          this.emails = this.emails.slice(0, this.maxEmails);
        }
        return;
      }
      
      // Process object format with collections
      // Process user email logs
      const userLogs = data.userEmailLogs || [];
      const userEmailLogs = userLogs.map((log: any) => ({
        to: log.toEmail || 'unknown',
        subject: log.subject || 'No Subject',
        body: log.body || 'No Content',
        type: this.mapEmailType(log.type),
        timestamp: log.sentDate ? new Date(log.sentDate).getTime() : Date.now()
      }));
      
      // Process admin email logs if user is an admin
      const adminLogs = data.adminEmailLogs || [];
      const adminEmailLogs = adminLogs.map((log: any) => ({
        to: log.toEmail || 'unknown',
        subject: log.subject || 'No Subject',
        body: log.body || 'No Content',
        type: this.mapEmailType(log.type),
        timestamp: log.sentDate ? new Date(log.sentDate).getTime() : Date.now()
      }));
      
      // Process parent admin email logs if user is a parent admin
      const parentAdminLogs = data.parentAdminEmailLogs || [];
      const parentAdminEmailLogs = parentAdminLogs.map((log: any) => ({
        to: log.toEmail || 'unknown',
        subject: log.subject || 'No Subject',
        body: log.body || 'No Content',
        type: this.mapEmailType(log.type),
        timestamp: log.sentDate ? new Date(log.sentDate).getTime() : Date.now()
      }));
      
      // Combine all email logs
      this.emails = [...userEmailLogs, ...adminEmailLogs, ...parentAdminEmailLogs];
      
      // Sort by timestamp (newest first)
      this.emails.sort((a, b) => b.timestamp - a.timestamp);
      
      // If no emails were found, use sample data
      if (this.emails.length === 0) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.useSampleData(currentUser.email);
          return;
        }
      }
      
      // Limit to maxEmails
      if (this.emails.length > this.maxEmails) {
        this.emails = this.emails.slice(0, this.maxEmails);
      }
    } catch (error) {
      console.error('Error processing email data:', error);
      // Use sample data as fallback
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.useSampleData(currentUser.email);
      }
    }
  }
  
  viewAllEmails() {
    this.router.navigate(['/email-logs']);
  }
  
  getEmailIcon(type: string): string {
    switch (type) {
      case 'user_approved': return '✅';
      case 'user_rejected': return '❌';
      case 'timesheet_approved': return '📋✅';
      case 'timesheet_rejected': return '📋❌';
      case 'timesheet_submitted': return '📋📤';
      case 'admin_approved': return '👨‍💼✅';
      default: return '📧';
    }
  }
  
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Map backend email type to frontend type
  mapEmailType(type: string): 'user_approved' | 'user_rejected' | 'timesheet_approved' | 'timesheet_rejected' | 'admin_approved' | 'timesheet_submitted' {
    switch (type) {
      case 'TIMESHEET_APPROVED': return 'timesheet_approved';
      case 'TIMESHEET_REJECTED': return 'timesheet_rejected';
      case 'TIMESHEET_SUBMITTED': return 'timesheet_submitted';
      case 'USER_APPROVED': return 'user_approved';
      case 'USER_REJECTED': return 'user_rejected';
      case 'ADMIN_NOTIFICATION': return 'admin_approved';
      case 'PARENT_ADMIN_NOTIFICATION': return 'admin_approved';
      case 'SAMPLE': return 'timesheet_submitted';
      default: return 'timesheet_submitted'; // Default to a valid type
    }
  }
}