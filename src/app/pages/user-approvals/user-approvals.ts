import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailService } from '../../services/email.service';

interface PendingUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  role: string;
}

@Component({
  selector: 'app-user-approvals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-approvals.html',
  styleUrls: ['./user-approvals.css'],
})
export class UserApprovalsComponent implements OnInit {
  pendingUsers: PendingUser[] = [];
  
  constructor(private emailService: EmailService) {}
  
  ngOnInit() {
    this.loadPendingUsers();
  }
  
  loadPendingUsers() {
    // Check if running in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('pendingUsers');
      if (stored) {
        this.pendingUsers = JSON.parse(stored);
        return;
      }
    }
    
    // Default sample data
    this.pendingUsers = [
      {
        id: 1,
        name: 'John User',
        email: 'john.user@example.com',
        phone: '+1-555-1234',
        registrationDate: new Date().toISOString(),
        status: 'pending',
        role: 'user'
      },
      {
        id: 2,
        name: 'Jane Employee',
        email: 'jane.employee@example.com',
        phone: '+1-555-5678',
        registrationDate: new Date().toISOString(),
        status: 'pending',
        role: 'user'
      }
    ];
  }

  approveUser(user: PendingUser) {
    user.status = 'approved';
    this.updateUserStatus(user);
    
    // Add the approved user to the users list
    this.addApprovedUserToUsers(user);
    
    // Send approval email
    this.emailService.sendUserApprovalEmail(user.email, user.name, true);
    
    console.log(`✅ User approved: ${user.name}`);
  }

  rejectUser(user: PendingUser) {
    user.status = 'rejected';
    this.updateUserStatus(user);
    
    // Send rejection email
    this.emailService.sendUserApprovalEmail(user.email, user.name, false);
    
    console.log(`❌ User rejected: ${user.name}`);
  }
  
  private updateUserStatus(user: PendingUser) {
    // Update localStorage (browser only)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('pendingUsers', JSON.stringify(this.pendingUsers));
    }
  }
  
  private addApprovedUserToUsers(user: PendingUser) {
    // Get existing approved users from localStorage
    let allUsers = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('allUsers');
      if (stored) {
        allUsers = JSON.parse(stored);
      }
    }
    
    // Add the newly approved user
    allUsers.push({
      id: user.id,
      name: user.name,
      email: user.email,
      password: 'user123', // Default password
      role: 'user',
      status: 'active',
      phone: user.phone
    });
    
    // Save back to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
  }
  
  getPendingCount(): number {
    return this.pendingUsers.filter(user => user.status === 'pending').length;
  }
}