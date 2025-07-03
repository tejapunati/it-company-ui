import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { EmailService } from '../../services/email.service';

interface PendingUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  role: string;
}

@Component({
  selector: 'app-user-approvals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-approvals.html',
  styleUrls: ['./user-approvals.css']
})
export class UserApprovalsComponent implements OnInit {
  pendingUsers: PendingUser[] = [];
  
  constructor(private activityService: ActivityService, private emailService: EmailService) {}
  
  ngOnInit() {
    this.loadPendingUsers();
  }
  
  loadPendingUsers() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('pendingUsers');
      if (stored) {
        this.pendingUsers = JSON.parse(stored);
      }
    }
  }
  
  approveUser(user: PendingUser) {
    user.status = 'approved';
    
    // Add to approved users (allUsers)
    if (typeof window !== 'undefined' && window.localStorage) {
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const approvedUser = {
        ...user,
        status: 'active',
        createdDate: new Date().toISOString()
      };
      allUsers.push(approvedUser);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
    
    this.updatePendingUsers();
    this.activityService.addActivity(`User approved: ${user.name}`, 'approval');
    
    // Send approval email
    this.emailService.sendUserApprovalEmail(user.email, user.name, true);
    
    console.log('✅ User approved:', user.name);
  }
  
  rejectUser(user: PendingUser) {
    user.status = 'rejected';
    this.updatePendingUsers();
    this.activityService.addActivity(`User rejected: ${user.name}`, 'approval');
    
    // Send rejection email
    this.emailService.sendUserApprovalEmail(user.email, user.name, false);
    
    console.log('❌ User rejected:', user.name);
  }
  
  updatePendingUsers() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('pendingUsers', JSON.stringify(this.pendingUsers));
    }
  }
  
  getPendingCount(): number {
    return this.pendingUsers.filter(user => user.status === 'pending').length;
  }
}