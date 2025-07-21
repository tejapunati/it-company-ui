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

  constructor(private emailService: EmailService, private authService: AuthService) {}

  ngOnInit() {
    this.loadEmailLogs();
  }

  loadEmailLogs() {
    // Get emails filtered by user role
    this.emailLogs = this.emailService.getEmailQueue();
    
    // Additional filtering based on user role
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.role === 'ADMIN') {
        // Regular admin should not see parent admin approval emails
        this.emailLogs = this.emailLogs.filter(email => 
          !(email.type === 'admin_approved' && email.to.includes('parent'))
        );
      } else if (currentUser.role === 'PARENT_ADMIN') {
        // Parent admin should not see regular admin timesheet approval emails
        this.emailLogs = this.emailLogs.filter(email => 
          !(email.type === 'timesheet_approved' || email.type === 'timesheet_rejected')
        );
      }
    }
  }

  clearLogs() {
    this.emailService.clearEmailQueue();
    this.emailLogs = [];
    
    // Also clear from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('emailLogs');
    }
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