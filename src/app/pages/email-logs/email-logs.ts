import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService, EmailTemplate } from '../../services/email.service';

@Component({
  selector: 'app-email-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-logs.html',
  styleUrls: ['./email-logs.css']
})
export class EmailLogsComponent implements OnInit {
  emailLogs: EmailTemplate[] = [];

  constructor(private emailService: EmailService) {}

  ngOnInit() {
    this.loadEmailLogs();
  }

  loadEmailLogs() {
    this.emailLogs = this.emailService.getEmailQueue();
  }

  clearLogs() {
    this.emailService.clearEmailQueue();
    this.emailLogs = [];
  }

  getEmailIcon(type: string): string {
    switch (type) {
      case 'user_approved': return '✅';
      case 'user_rejected': return '❌';
      case 'timesheet_approved': return '📋✅';
      case 'timesheet_rejected': return '📋❌';
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
      case 'admin_approved': return 'Admin Approved';
      default: return 'Email';
    }
  }
}