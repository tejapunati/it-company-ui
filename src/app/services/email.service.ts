import { Injectable } from '@angular/core';

export interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
  type: 'user_approved' | 'user_rejected' | 'timesheet_approved' | 'timesheet_rejected' | 'admin_approved';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailQueue: EmailTemplate[] = [];

  constructor() {
    // Load emails from localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedEmails = localStorage.getItem('emailLogs');
      if (storedEmails) {
        try {
          this.emailQueue = JSON.parse(storedEmails);
        } catch (e) {
          console.error('Error parsing stored emails:', e);
        }
      }
    }
  }

  // Simulate sending email (in real app, this would call backend API)
  sendEmail(template: EmailTemplate): Promise<boolean> {
    return new Promise((resolve) => {
      // Add timestamp
      template.timestamp = Date.now();
      
      // Add to queue for demo
      this.emailQueue.unshift(template); // Add to beginning for most recent first
      
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('emailLogs', JSON.stringify(this.emailQueue));
      }
      
      // Simulate email sending delay
      setTimeout(() => {
        console.log('📧 Email Sent:', template);
        this.showEmailNotification(template);
        this.logEmailToConsole(template);
        resolve(true);
      }, 1000);
    });
  }
  
  // Log detailed email to console for demo
  private logEmailToConsole(template: EmailTemplate) {
    console.group('📧 EMAIL SENT');
    console.log('To:', template.to);
    console.log('Subject:', template.subject);
    console.log('Body:');
    console.log(template.body);
    console.log('Type:', template.type);
    console.log('Timestamp:', new Date().toLocaleString());
    console.groupEnd();
  }

  // User approval email
  sendUserApprovalEmail(userEmail: string, userName: string, approved: boolean) {
    const template: EmailTemplate = {
      to: userEmail,
      subject: approved ? 'Account Approved - Welcome to SSRM Tech!' : 'Account Registration Update',
      body: approved 
        ? `Dear ${userName},\n\nGreat news! Your account has been approved. You can now login to your dashboard.\n\nWelcome to SSRM Tech!\n\nBest regards,\nSSRM Tech Team`
        : `Dear ${userName},\n\nWe regret to inform you that your account registration was not approved at this time.\n\nFor questions, please contact our support team.\n\nBest regards,\nSSRM Tech Team`,
      type: approved ? 'user_approved' : 'user_rejected',
      timestamp: 0 // Will be set in sendEmail
    };
    
    return this.sendEmail(template);
  }

  // Timesheet approval email
  sendTimesheetApprovalEmail(userEmail: string, userName: string, weekEnding: string, approved: boolean, approverName: string = 'Admin') {
    const template: EmailTemplate = {
      to: userEmail,
      subject: `Timesheet ${approved ? 'Approved' : 'Rejected'} - Week ending ${weekEnding}`,
      body: approved
        ? `Dear ${userName},\n\nYour timesheet for week ending ${weekEnding} has been approved by ${approverName}.\n\nThank you for your submission.\n\nBest regards,\nSSRM Tech Team`
        : `Dear ${userName},\n\nYour timesheet for week ending ${weekEnding} requires revision and was rejected by ${approverName}. Please resubmit with corrections.\n\nContact your manager for details.\n\nBest regards,\nSSRM Tech Team`,
      type: approved ? 'timesheet_approved' : 'timesheet_rejected',
      timestamp: 0 // Will be set in sendEmail
    };
    
    return this.sendEmail(template);
  }

  // Admin approval email
  sendAdminApprovalEmail(adminEmail: string, adminName: string) {
    const template: EmailTemplate = {
      to: adminEmail,
      subject: 'Admin Account Approved - SSRM Tech',
      body: `Dear ${adminName},\n\nYour admin account has been approved. You now have administrative access to the system.\n\nLogin to start managing users and system operations.\n\nBest regards,\nSSRM Tech Team`,
      type: 'admin_approved',
      timestamp: 0 // Will be set in sendEmail
    };
    
    return this.sendEmail(template);
  }

  // Show email notification in UI (demo purpose)
  private showEmailNotification(template: EmailTemplate) {
    if (typeof window !== 'undefined') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'email-notification';
      notification.innerHTML = `
        <div class="email-notification-content">
          <span class="email-icon">📧</span>
          <div class="email-details">
            <strong>Email Sent</strong>
            <p>To: ${template.to}</p>
            <p>Subject: ${template.subject}</p>
          </div>
          <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `;
      
      // Add styles
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        .email-notification-content {
          display: flex;
          align-items: center;
          padding: 1rem;
          gap: 1rem;
        }
        .email-icon {
          font-size: 1.5rem;
        }
        .email-details strong {
          color: #28a745;
          display: block;
          margin-bottom: 0.5rem;
        }
        .email-details p {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(notification);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 5000);
    }
  }

  // Get email queue (for admin to see sent emails)
  getEmailQueue(): EmailTemplate[] {
    return [...this.emailQueue].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Clear email queue
  clearEmailQueue() {
    this.emailQueue = [];
  }

  // Admin approval status email
  sendApprovalStatusEmail(admin: any, status: 'approved' | 'rejected') {
    const template: EmailTemplate = {
      to: admin.email,
      subject: `Admin Account ${status === 'approved' ? 'Approved' : 'Rejected'} - SSRM Tech`,
      body: status === 'approved'
        ? `Dear ${admin.name},\n\nYour admin account has been approved. You now have administrative access.\n\nLogin to start managing the system.\n\nBest regards,\nSSRM Tech Team`
        : `Dear ${admin.name},\n\nYour admin account request was not approved at this time.\n\nContact support for more information.\n\nBest regards,\nSSRM Tech Team`,
      type: 'admin_approved',
      timestamp: 0 // Will be set in sendEmail
    };
    return this.sendEmail(template);
  }

  // Admin approval notification
  sendAdminApprovalNotification(admin: any) {
    const template: EmailTemplate = {
      to: 'parentadmin@ssrmtech.com',
      subject: 'New Admin Registration - Approval Required',
      body: `A new admin registration requires your approval:\n\nName: ${admin.name}\nEmail: ${admin.email}\nRole: ${admin.role}\n\nPlease review and approve/reject this request.\n\nBest regards,\nSSRM Tech System`,
      type: 'admin_approved',
      timestamp: 0 // Will be set in sendEmail
    };
    return this.sendEmail(template);
  }

  // Timesheet submission notification to admin
  sendTimesheetSubmissionNotification(employeeName: string, employeeEmail: string, weekEnding: string, totalHours: number) {
    const template: EmailTemplate = {
      to: 'admin@ssrmtech.com',
      subject: `Timesheet Submitted - ${employeeName} (Week ending ${weekEnding})`,
      body: `A new timesheet has been submitted for your review:\n\nEmployee: ${employeeName}\nEmail: ${employeeEmail}\nWeek Ending: ${weekEnding}\nTotal Hours: ${totalHours}\n\nPlease review and approve/reject this timesheet in the admin dashboard.\n\nBest regards,\nSSRM Tech System`,
      type: 'timesheet_approved',
      timestamp: 0 // Will be set in sendEmail
    };
    return this.sendEmail(template);
  }
}