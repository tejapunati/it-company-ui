import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-email-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-container">
      <h3>Email API Debug</h3>
      <div class="actions">
        <button (click)="testDirectEndpoint()">Test Direct Endpoint</button>
        <button (click)="testStandardEndpoint()">Test Standard Endpoint</button>
        <button (click)="testMockData()">Use Mock Data</button>
      </div>
      
      <div class="results" *ngIf="apiResponse">
        <h4>API Response:</h4>
        <pre>{{ apiResponse | json }}</pre>
      </div>
      
      <div class="emails" *ngIf="emails.length > 0">
        <h4>Processed Emails:</h4>
        <div class="email-item" *ngFor="let email of emails">
          <div><strong>To:</strong> {{ email.to }}</div>
          <div><strong>Subject:</strong> {{ email.subject }}</div>
          <div><strong>Type:</strong> {{ email.type }}</div>
        </div>
      </div>
      
      <div class="error" *ngIf="error">
        <h4>Error:</h4>
        <pre>{{ error }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .debug-container {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    button {
      padding: 0.5rem 1rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .results, .emails, .error {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    
    .error {
      background: #fee2e2;
      border-color: #fecaca;
      color: #b91c1c;
    }
    
    pre {
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .email-item {
      padding: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 0.5rem;
    }
  `]
})
export class EmailDebugComponent implements OnInit {
  apiResponse: any = null;
  emails: any[] = [];
  error: string | null = null;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    // Auto-test on init
    this.testDirectEndpoint();
  }
  
  testDirectEndpoint() {
    this.error = null;
    this.apiResponse = null;
    this.emails = [];
    
    const email = 'parent-admin@ssrmtech.com'; // Use a known email from your logs
    const url = `${environment.apiUrl}/direct-emails/${email}`;
    
    console.log(`Testing direct endpoint: ${url}`);
    
    this.http.get(url).subscribe({
      next: (data: any) => {
        console.log('Direct endpoint response:', data);
        this.apiResponse = data;
        this.processEmailData(data);
      },
      error: (err) => {
        console.error('Direct endpoint error:', err);
        this.error = `Error: ${err.message || JSON.stringify(err)}`;
      }
    });
  }
  
  testStandardEndpoint() {
    this.error = null;
    this.apiResponse = null;
    this.emails = [];
    
    const email = 'parent-admin@ssrmtech.com'; // Use a known email from your logs
    const url = `${environment.apiUrl}/emails/${email}`;
    
    console.log(`Testing standard endpoint: ${url}`);
    
    this.http.get(url).subscribe({
      next: (data: any) => {
        console.log('Standard endpoint response:', data);
        this.apiResponse = data;
        this.processEmailData(data);
      },
      error: (err) => {
        console.error('Standard endpoint error:', err);
        this.error = `Error: ${err.message || JSON.stringify(err)}`;
      }
    });
  }
  
  testMockData() {
    this.error = null;
    this.apiResponse = null;
    this.emails = [];
    
    // Create mock data
    const mockData = {
      userEmailLogs: [
        {
          id: '1',
          toEmail: 'user@ssrmtech.com',
          subject: 'Timesheet Approved',
          body: 'Your timesheet has been approved',
          type: 'TIMESHEET_APPROVED',
          sentDate: new Date().toISOString()
        }
      ],
      adminEmailLogs: [
        {
          id: '2',
          toEmail: 'admin@ssrmtech.com',
          subject: 'New Timesheet Submission',
          body: 'A new timesheet has been submitted',
          type: 'TIMESHEET_SUBMITTED',
          sentDate: new Date().toISOString()
        }
      ],
      parentAdminEmailLogs: [
        {
          id: '3',
          toEmail: 'parent-admin@ssrmtech.com',
          subject: 'New Admin Registration',
          body: 'A new admin has registered',
          type: 'ADMIN_NOTIFICATION',
          sentDate: new Date().toISOString()
        }
      ]
    };
    
    this.apiResponse = mockData;
    this.processEmailData(mockData);
  }
  
  processEmailData(data: any) {
    // Process user email logs
    const userLogs = data.userEmailLogs || [];
    const userEmailLogs = userLogs.map((log: any) => ({
      to: log.toEmail,
      subject: log.subject,
      body: log.body,
      type: this.mapEmailType(log.type),
      timestamp: new Date(log.sentDate).getTime()
    }));
    
    // Process admin email logs
    const adminLogs = data.adminEmailLogs || [];
    const adminEmailLogs = adminLogs.map((log: any) => ({
      to: log.toEmail,
      subject: log.subject,
      body: log.body,
      type: this.mapEmailType(log.type),
      timestamp: new Date(log.sentDate).getTime()
    }));
    
    // Process parent admin email logs
    const parentAdminLogs = data.parentAdminEmailLogs || [];
    const parentAdminEmailLogs = parentAdminLogs.map((log: any) => ({
      to: log.toEmail,
      subject: log.subject,
      body: log.body,
      type: this.mapEmailType(log.type),
      timestamp: new Date(log.sentDate).getTime()
    }));
    
    // Combine all email logs
    this.emails = [...userEmailLogs, ...adminEmailLogs, ...parentAdminEmailLogs];
    
    // Sort by timestamp (newest first)
    this.emails.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  mapEmailType(type: string): string {
    switch (type) {
      case 'TIMESHEET_APPROVED': return 'timesheet_approved';
      case 'TIMESHEET_REJECTED': return 'timesheet_rejected';
      case 'TIMESHEET_SUBMITTED': return 'timesheet_submitted';
      case 'USER_APPROVED': return 'user_approved';
      case 'USER_REJECTED': return 'user_rejected';
      case 'ADMIN_NOTIFICATION': return 'admin_approved';
      case 'PARENT_ADMIN_NOTIFICATION': return 'admin_approved';
      case 'SAMPLE': return 'timesheet_submitted';
      default: return type?.toLowerCase() || 'email';
    }
  }
}