import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService, EmailTemplate } from '../../services/email.service';
import { EmailApiService } from '../../services/email-api.service';
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
  emailsLoaded = false;

  constructor(
    private emailService: EmailService, 
    private emailApiService: EmailApiService,
    private authService: AuthService
  ) {}

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
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    // Use role-specific API calls
    if (currentUser.role === 'PARENT_ADMIN') {
      this.emailApiService.getParentAdminEmails(email).subscribe({
        next: (data) => {
          console.log('Parent admin email logs:', data);
          this.processEmailArray(data);
        },
        error: (error) => {
          console.error('Error fetching parent admin emails:', error);
          this.emailLogs = [];
          this.emailsLoaded = true;
        }
      });
    } else if (currentUser.role === 'ADMIN') {
      this.emailApiService.getAdminEmails(email).subscribe({
        next: (data) => {
          console.log('Admin email logs:', data);
          this.processEmailArray(data);
        },
        error: (error) => {
          console.error('Error fetching admin emails:', error);
          this.emailLogs = [];
          this.emailsLoaded = true;
        }
      });
    } else {
      this.emailApiService.getUserEmails(email).subscribe({
        next: (data) => {
          console.log('User email logs:', data);
          this.processEmailArray(data);
        },
        error: (error) => {
          console.error('Error fetching user emails:', error);
          this.emailLogs = [];
          this.emailsLoaded = true;
        }
      });
    }
  }
  
  processEmailArray(data: any[]) {
    console.log('Processing email array:', data);
    const emailLogs = data.map((log: any) => ({
      to: log.toEmail || 'unknown',
      subject: log.subject || 'No Subject',
      body: log.body || 'No Content',
      type: this.mapEmailType(log.type),
      timestamp: log.sentDate ? new Date(log.sentDate).getTime() : Date.now()
    }));
    
    this.emailLogs = emailLogs;
    this.emailLogs.sort((a, b) => b.timestamp - a.timestamp);
    this.emailsLoaded = true;
    console.log('Processed email logs:', this.emailLogs);
  }
  
  processEmailData(data: any) {
    try {
      // Check if data is an array (direct API response format)
      if (Array.isArray(data)) {
        console.log('Processing array data format');
        // Map the array format to our internal format with proper type casting
        const emailLogs = data.map((log: any) => ({
          to: log.toEmail || 'unknown',
          subject: log.subject || 'No Subject',
          body: log.body || 'No Content',
          type: this.mapEmailType(log.type), // Return type is now properly typed
          timestamp: log.sentDate ? new Date(log.sentDate).getTime() : Date.now()
        }));
        
        // Set the emails and sort
        this.emailLogs = emailLogs as EmailTemplate[];
        this.emailLogs.sort((a, b) => b.timestamp - a.timestamp);
        this.emailsLoaded = true;
        console.log('Processed array email logs:', this.emailLogs);
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
      this.emailLogs = [...userEmailLogs, ...adminEmailLogs, ...parentAdminEmailLogs];
      
      // Sort by timestamp (newest first)
      this.emailLogs.sort((a, b) => b.timestamp - a.timestamp);
      
      // Mark emails as loaded even if empty
      this.emailsLoaded = true;
      
      // Mark emails as loaded
      this.emailsLoaded = true;
      
      console.log('Processed email logs:', this.emailLogs);
    } catch (error) {
      console.error('Error processing email data:', error);
      this.emailLogs = [];
      this.emailsLoaded = true;
    }
  }

  clearLogs() {
    // Get current user
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }
    
    // First, clear local state immediately to provide instant feedback
    this.emailService.clearEmailQueue();
    this.emailLogs = [];
    this.emailsLoaded = false;
    
    // Set flag in localStorage to prevent auto-reload
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('emailLogs');
    }
    
    // Then attempt to clear on the server
    this.emailApiService.clearEmailLogs(currentUser.email).subscribe({
      next: (data) => {
        console.log('Emails cleared successfully:', data);
      },
      error: (error) => {
        console.error('Error in clear logs process:', error);
        // We've already cleared the UI, so no additional action needed
      }
    });
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
  
  useSampleData(email: string) {
    console.log('Using sample email data for:', email);
    this.emailApiService.getSampleEmailLogs(email).subscribe({
      next: (data) => {
        console.log('Sample email data:', data);
        this.processEmailData(data);
      },
      error: (error) => {
        console.error('Error generating sample emails:', error);
        this.emailLogs = [];
        this.emailsLoaded = true;
      }
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
}