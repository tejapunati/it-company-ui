import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../services/email.service';

interface PendingAdmin {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-approval.html',
  styleUrls: ['./admin-approval.css'],
})
export class AdminApprovalComponent implements OnInit {
  pendingAdmins: PendingAdmin[] = [];
  
  constructor(private emailService: EmailService) {}
  
  ngOnInit() {
    this.loadPendingAdmins();
  }
  
  loadPendingAdmins() {
    // Check if running in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('pendingAdmins');
      if (stored) {
        this.pendingAdmins = JSON.parse(stored);
        return;
      }
    }
    
    // Default sample data
    this.pendingAdmins = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        department: 'IT',
        registrationDate: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0124',
        department: 'HR',
        registrationDate: new Date().toISOString(),
        status: 'pending'
      }
    ];
  }

  approveAdmin(admin: PendingAdmin) {
    admin.status = 'approved';
    this.updateAdminStatus(admin);
    
    // Add the approved admin to the mock users list
    this.addApprovedAdminToUsers(admin);
    
    // Send approval email
    this.emailService.sendApprovalStatusEmail(admin, 'approved');
    
    console.log(`✅ Admin approved: ${admin.name}`);
  }

  rejectAdmin(admin: PendingAdmin) {
    admin.status = 'rejected';
    this.updateAdminStatus(admin);
    
    // Send rejection email
    this.emailService.sendApprovalStatusEmail(admin, 'rejected');
    
    console.log(`❌ Admin rejected: ${admin.name}`);
  }
  
  private updateAdminStatus(admin: PendingAdmin) {
    // Update localStorage (browser only)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('pendingAdmins', JSON.stringify(this.pendingAdmins));
    }
  }
  
  private addApprovedAdminToUsers(admin: PendingAdmin) {
    // Get existing approved users from localStorage
    let approvedUsers = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('approvedUsers');
      if (stored) {
        approvedUsers = JSON.parse(stored);
      }
    }
    
    // Add the newly approved admin
    approvedUsers.push({
      id: admin.id,
      email: admin.email.split('@')[0], // Use first part of email as username
      password: 'admin123', // Default password
      role: 'admin',
      name: admin.name
    });
    
    // Save back to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
    }
  }
  
  getPendingCount(): number {
    return this.pendingAdmins.filter(admin => admin.status === 'pending').length;
  }
}