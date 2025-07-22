import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService, EmailTemplate } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-logs.html',
  styleUrls: ['./email-logs.css']
})
export class EmailLogsComponent implements OnInit {
  emailLogs: EmailTemplate[] = [];
  private emailsLoaded = false;

  constructor(private emailService: EmailService, private authService: AuthService) {}

  ngOnInit() {
    this.loadEmailLogs();
  }

  loadEmailLogs() {
    // Get current user
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    // Load emails from database via API
    this.loadEmailsFromServer(currentUser.email);
  }
  
  loadEmailsFromServer(email: string) {
    console.log('Loading email logs for user:', email);
    
    // Use the direct access endpoint
    const apiUrl = 'http://localhost:8081/api/v1';
    const directUrl = `${apiUrl}/direct-emails/${email}`;
    
    // Call direct endpoint to get emails
    fetch(directUrl)
      .then(response => {
        console.log('Direct endpoint response status:', response.status);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Email logs from direct endpoint:', data);
        
        // Process user email logs
        const userLogs = data.userEmailLogs || [];
        const userEmailLogs = userLogs.map((log: any) => ({
          to: log.toEmail,
          subject: log.subject,
          body: log.body,
          type: this.mapEmailType(log.type),
          timestamp: new Date(log.sentDate).getTime()
        }));
        
        // Process admin email logs if user is an admin
        const adminLogs = data.adminEmailLogs || [];
        const adminEmailLogs = adminLogs.map((log: any) => ({
          to: log.toEmail,
          subject: log.subject,
          body: log.body,
          type: this.mapEmailType(log.type),
          timestamp: new Date(log.sentDate).getTime()
        }));
        
        // Process parent admin email logs if user is a parent admin
        const parentAdminLogs = data.parentAdminEmailLogs || [];
        const parentAdminEmailLogs = parentAdminLogs.map((log: any) => ({
          to: log.toEmail,
          subject: log.subject,
          body: log.body,
          type: this.mapEmailType(log.type),
          timestamp: new Date(log.sentDate).getTime()
        }));
        
        // Combine all email logs
        this.emailLogs = [...userEmailLogs, ...adminEmailLogs, ...parentAdminEmailLogs];
        
        // Sort by timestamp (newest first)
        this.emailLogs.sort((a, b) => b.timestamp - a.timestamp);
        
        // Mark emails as loaded
        this.emailsLoaded = true;
        
        console.log('Processed email logs:', this.emailLogs);
      })
      .catch(error => {
        console.error('Error fetching email logs:', error);
        // Set empty array if there's an error
        this.emailLogs = [];
        this.emailsLoaded = true;
      });
  }

  clearLogs() {
    // Get current user
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    // Clear emails from backend using the direct endpoint
    const apiUrl = 'http://localhost:8081/api/v1';
    const clearUrl = `${apiUrl}/clear-emails/${currentUser.email}`;
    
    // First, clear local state immediately to provide instant feedback
    this.emailService.clearEmailQueue();
    this.emailLogs = [];
    this.emailsLoaded = false;
    
    // Set flag in localStorage to prevent auto-reload
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('emailLogs');
    }
    
    // Then attempt to clear on the server
    fetch(clearUrl, { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Clear emails response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to clear emails: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Emails cleared successfully:', data);
    })
    .catch(error => {
      console.error('Error in clear logs process:', error);
      // We've already cleared the UI, so no additional action needed
    });
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

  getEmailTypeLabel(type: string): string {
    switch (type) {
      case 'user_approved': return 'User Approved';
      case 'user_rejected': return 'User Rejected';
      case 'timesheet_approved': return 'Timesheet Approved';
      case 'timesheet_rejected': return 'Timesheet Rejected';
      case 'timesheet_submitted': return 'Timesheet Submitted';
      case 'admin_approved': return 'Admin Notification';
      default: return 'Email';
    }
  }
  
  // Map backend email type to frontend type
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
      default: return type.toLowerCase();
    }
  }
}