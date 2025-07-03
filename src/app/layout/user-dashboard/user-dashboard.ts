import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';

interface UserTimesheet {
  id?: number;
  weekEnding: string;
  hours: { [key: string]: number };
  totalHours: number;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: User | null = null;
  showTimesheetForm = false;
  currentWeekHours = 0;
  approvedHours = 0;
  totalSubmittedTimesheets = 0;
  pendingTimesheets = 0;
  unreadNotifications = 0;
  
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  newTimesheet: UserTimesheet = {
    weekEnding: '',
    hours: {},
    totalHours: 0,
    comments: '',
    status: 'pending',
    submittedDate: ''
  };
  
  myTimesheets: UserTimesheet[] = [
    {
      id: 1,
      weekEnding: '2024-01-07',
      hours: { Monday: 8, Tuesday: 8, Wednesday: 8, Thursday: 8, Friday: 8 },
      totalHours: 40,
      comments: 'Regular work week',
      status: 'approved',
      submittedDate: '2024-01-08'
    },
    {
      id: 2,
      weekEnding: '2024-01-14',
      hours: { Monday: 8, Tuesday: 8, Wednesday: 6, Thursday: 8, Friday: 8 },
      totalHours: 38,
      comments: 'Left early on Wednesday',
      status: 'pending',
      submittedDate: '2024-01-15'
    }
  ];
  
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Timesheet Approved',
      message: 'Your timesheet for week ending Jan 7 has been approved',
      time: '2 hours ago',
      icon: '✅',
      read: false
    },
    {
      id: 2,
      title: 'New Project Assignment',
      message: 'You have been assigned to Project Alpha',
      time: '1 day ago',
      icon: '💼',
      read: false
    },
    {
      id: 3,
      title: 'Payroll Processed',
      message: 'Your payment for last month has been processed',
      time: '3 days ago',
      icon: '💰',
      read: true
    }
  ];
  
  constructor(private authService: AuthService, private emailService: EmailService) {}
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Initialize hours for new timesheet
    this.weekDays.forEach(day => {
      this.newTimesheet.hours[day] = 0;
    });
    
    this.calculateUserStats();
  }
  
  calculateUserStats() {
    // Calculate current week hours (latest pending/approved timesheet)
    const latestTimesheet = this.myTimesheets[0];
    this.currentWeekHours = latestTimesheet ? latestTimesheet.totalHours : 0;
    
    // Calculate approved hours (sum of all approved timesheets)
    this.approvedHours = this.myTimesheets
      .filter(t => t.status === 'approved')
      .reduce((total, t) => total + t.totalHours, 0);
    
    // Calculate total submitted timesheets
    this.totalSubmittedTimesheets = this.myTimesheets.length;
    
    // Calculate pending timesheets
    this.pendingTimesheets = this.myTimesheets.filter(t => t.status === 'pending').length;
    
    // Calculate unread notifications
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }
  
  getTotalHours(): number {
    return Object.values(this.newTimesheet.hours).reduce((sum, hours) => sum + (hours || 0), 0);
  }
  
  submitTimesheet() {
    this.newTimesheet.totalHours = this.getTotalHours();
    this.newTimesheet.submittedDate = new Date().toISOString().split('T')[0];
    this.newTimesheet.id = Date.now();
    
    // Add employee name
    const submittedTimesheet = {
      ...this.newTimesheet,
      employeeName: this.currentUser?.name || 'Current User',
      employeeEmail: this.currentUser?.email || 'user@company.com'
    };
    
    this.myTimesheets.unshift(submittedTimesheet);
    
    // Store in localStorage for admin to see
    if (typeof window !== 'undefined' && window.localStorage) {
      const allTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
      allTimesheets.unshift(submittedTimesheet);
      localStorage.setItem('allTimesheets', JSON.stringify(allTimesheets));
    }
    
    // Reset form
    this.newTimesheet = {
      weekEnding: '',
      hours: {},
      totalHours: 0,
      comments: '',
      status: 'pending',
      submittedDate: ''
    };
    
    this.weekDays.forEach(day => {
      this.newTimesheet.hours[day] = 0;
    });
    
    this.showTimesheetForm = false;
    
    // Send email notification to admin
    this.emailService.sendTimesheetSubmissionNotification(
      submittedTimesheet.employeeName,
      submittedTimesheet.employeeEmail,
      this.newTimesheet.weekEnding,
      this.getTotalHours()
    );
    
    // Add notification
    this.notifications.unshift({
      id: this.notifications.length + 1,
      title: 'Timesheet Submitted',
      message: 'Your timesheet has been submitted for approval',
      time: 'Just now',
      icon: '📋',
      read: false
    });
    
    // Recalculate stats
    this.calculateUserStats();
  }
  
  viewTimesheet(timesheet: UserTimesheet) {
    console.log('Viewing timesheet:', timesheet);
  }
  
  markAsRead(notification: Notification) {
    notification.read = true;
    this.calculateUserStats(); // Recalculate unread count
  }
}