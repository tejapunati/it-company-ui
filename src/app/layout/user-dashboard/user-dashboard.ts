import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/database.models';
import { EmailService, EmailTemplate } from '../../services/email.service';
import { TimesheetService } from '../../services/timesheet.service';
import { EmailWidgetComponent } from '../../components/email-widget/email-widget.component';

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

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EmailWidgetComponent],
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

  // Recent activities
  recentActivities: Activity[] = [];
  
  // Email logs
  emailLogs: EmailTemplate[] = [];
  
  constructor(
    private authService: AuthService, 
    private emailService: EmailService,
    private timesheetService: TimesheetService
  ) {}
  
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Initialize hours for new timesheet
    this.weekDays.forEach(day => {
      this.newTimesheet.hours[day] = 0;
    });
    
    this.calculateUserStats();
    this.loadRecentActivities();
    this.loadEmailLogs();
  }
  
  calculateUserStats() {
    // Get current date and start of week
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Monday of current week
    currentWeekStart.setHours(0, 0, 0, 0);
    
    // Format date for comparison
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Find current week's timesheet
    const currentWeekTimesheet = this.myTimesheets.find(t => {
      const weekEndDate = new Date(t.weekEnding);
      const weekStartDate = new Date(weekEndDate);
      weekStartDate.setDate(weekEndDate.getDate() - 6); // Assuming week ending is Sunday
      
      return formatDate(currentWeekStart) === formatDate(weekStartDate);
    });
    
    // Calculate current week hours
    this.currentWeekHours = currentWeekTimesheet ? currentWeekTimesheet.totalHours : 0;
    
    // If no current week timesheet found, calculate from all timesheets in current week
    if (!currentWeekTimesheet && typeof window !== 'undefined' && window.localStorage) {
      const allTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
      const userEmail = this.currentUser?.email;
      
      if (userEmail) {
        // Find all timesheets for current user in current week
        const userCurrentWeekTimesheets = allTimesheets.filter((t: any) => {
          if (t.employeeEmail !== userEmail) return false;
          
          const weekEndDate = new Date(t.weekEnding);
          const weekStartDate = new Date(weekEndDate);
          weekStartDate.setDate(weekEndDate.getDate() - 6);
          
          return formatDate(currentWeekStart) === formatDate(weekStartDate);
        });
        
        // Sum hours for current week
        if (userCurrentWeekTimesheets.length > 0) {
          this.currentWeekHours = userCurrentWeekTimesheets.reduce(
            (total: number, t: any) => total + (t.totalHours || 0), 0
          );
        }
      }
    }
    
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
    
    // Get current user from localStorage if not available in service
    if (!this.currentUser && typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    
    // Use hardcoded name if user is still not available
    const userName = this.currentUser?.name || 'Regular User';
    const userEmail = this.currentUser?.email || 'user@example.com';
    
    // Add employee name with the actual user name
    const submittedTimesheet = {
      ...this.newTimesheet,
      employeeName: userName,
      employeeEmail: userEmail,
      userId: this.currentUser?.id // Add userId for backend
    };
    
    // Log the user info for debugging
    console.log('Current user submitting timesheet:', this.currentUser);
    console.log('Submitted timesheet with employee name:', submittedTimesheet.employeeName);
    
    // Create a timesheet object for the backend API
    const backendTimesheet = {
      userId: this.currentUser?.id,
      weekEnding: submittedTimesheet.weekEnding,
      hours: submittedTimesheet.hours,
      totalHours: submittedTimesheet.totalHours,
      comments: submittedTimesheet.comments,
      status: 'PENDING' // Backend expects uppercase status
    };
    
    // Send timesheet to backend API
    console.log('Sending timesheet to backend:', backendTimesheet);
    
    // Call the API to create a timesheet
    this.timesheetService.createTimesheet(backendTimesheet).subscribe({
      next: (response) => {
        console.log('Timesheet created successfully:', response);
        
        // Add the timesheet to the local list with the ID from the backend
        const timesheetWithId = {
          ...submittedTimesheet,
          id: response.id // Use the ID from the backend
        };
        
        this.myTimesheets.unshift(timesheetWithId);
        
        // Store in localStorage for admin to see
        if (typeof window !== 'undefined' && window.localStorage) {
          const allTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
          allTimesheets.unshift(timesheetWithId);
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
          submittedTimesheet.weekEnding,
          submittedTimesheet.totalHours
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
        
        // Add to recent activities
        this.addActivity({
          id: Date.now(),
          type: 'timesheet_submitted',
          description: `You submitted a timesheet for week ending ${submittedTimesheet.weekEnding} with ${submittedTimesheet.totalHours} hours`,
          timestamp: new Date(),
          icon: '📋'
        });
        
        // Recalculate stats
        this.calculateUserStats();
      },
      error: (error) => {
        console.error('Error creating timesheet:', error);
        alert('Failed to submit timesheet. Please try again.');
      }
    });
  }
  
  viewTimesheet(timesheet: UserTimesheet) {
    console.log('Viewing timesheet:', timesheet);
  }
  
  markAsRead(notification: Notification) {
    notification.read = true;
    this.calculateUserStats(); // Recalculate unread count
  }

  // Load recent activities
  loadRecentActivities() {
    // Check localStorage for activities
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedActivities = localStorage.getItem('userActivities');
      if (storedActivities) {
        try {
          const activities = JSON.parse(storedActivities);
          // Filter activities for current user
          if (this.currentUser) {
            this.recentActivities = activities.filter((a: any) => 
              a.userId === this.currentUser?.id
            );
          }
        } catch (e) {
          console.error('Error parsing activities:', e);
        }
      }
      
      // Check for timesheet approvals in allTimesheets
      const allTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
      const userEmail = this.currentUser?.email;
      
      if (userEmail) {
        // Find timesheets for current user that have been approved/rejected
        const userTimesheets = allTimesheets.filter((t: any) => 
          t.employeeEmail === userEmail && 
          (t.status === 'approved' || t.status === 'rejected') &&
          t.statusUpdatedBy // Only include if they were updated by someone
        );
        
        // Add timesheet approval activities
        userTimesheets.forEach((timesheet: any) => {
          const isApproved = timesheet.status === 'approved';
          const activity = {
            id: Date.now() + Math.random(), // Ensure unique ID
            type: isApproved ? 'timesheet_approved' : 'timesheet_rejected',
            description: `Your timesheet for week ending ${timesheet.weekEnding} was ${timesheet.status} by ${timesheet.statusUpdatedBy}`,
            timestamp: new Date(timesheet.statusUpdatedAt || Date.now()),
            icon: isApproved ? '✅' : '❌'
          };
          
          // Check if this activity already exists to avoid duplicates
          const exists = this.recentActivities.some(a => 
            a.type === activity.type && 
            a.description === activity.description
          );
          
          if (!exists) {
            this.recentActivities.push(activity);
          }
        });
      }
    }

    // If no activities found, add sample activities
    if (this.recentActivities.length === 0) {
      this.recentActivities = [
        {
          id: 1,
          type: 'timesheet_submitted',
          description: 'You submitted a timesheet for week ending Jan 14 with 38 hours',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          icon: '📋'
        },
        {
          id: 2,
          type: 'timesheet_approved',
          description: 'Your timesheet for week ending Jan 7 was approved by Admin',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          icon: '✅'
        },
        {
          id: 3,
          type: 'login',
          description: 'You logged in to the system',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          icon: '🔐'
        }
      ];
    }

    // Sort activities by timestamp (newest first)
    this.recentActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Add a new activity
  addActivity(activity: Activity) {
    // Add to local array
    this.recentActivities.unshift(activity);
    
    // Store in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedActivities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      
      // Add user ID to activity
      const activityWithUser = {
        ...activity,
        userId: this.currentUser?.id
      };
      
      storedActivities.unshift(activityWithUser);
      localStorage.setItem('userActivities', JSON.stringify(storedActivities));
    }
  }

  // Load email logs - now handled by EmailWidgetComponent
  loadEmailLogs() {
    // This method is kept for backward compatibility
    // Email logs are now loaded by the EmailWidgetComponent
    console.log('Email logs are now handled by EmailWidgetComponent');
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

  // Format timestamp for display
  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  }
  
  // Clear all activities
  clearActivities() {
    this.recentActivities = [];
    
    // Clear activities from localStorage for current user
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedActivities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      
      // Filter out activities for current user
      const filteredActivities = storedActivities.filter((a: any) => 
        a.userId !== this.currentUser?.id
      );
      
      localStorage.setItem('userActivities', JSON.stringify(filteredActivities));
    }
  }
  
  // Clear all notifications
  clearNotifications() {
    this.notifications = [];
    this.unreadNotifications = 0;
    
    // Clear notifications from localStorage for current user
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userNotifications');
    }
  }
}