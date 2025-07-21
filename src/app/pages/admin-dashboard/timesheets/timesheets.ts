import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Timesheet, TimesheetService } from '../../../services/timesheet.service';
import { AuthService } from '../../../services/auth.service';
import { EmailService } from '../../../services/email.service';

@Component({
  standalone: true,
  selector: 'app-timesheets',
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheets.html',
  styleUrls: ['./timesheets.css']
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[] = [];
  uniqueUsers: string[] = [];
  selectedUser: string = '';
  filteredTimesheets: Timesheet[] = [];

  constructor(
    private timesheetService: TimesheetService,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.loadTimesheets();
  }
  
  loadTimesheets() {
    // Load timesheets from the backend API
    this.timesheetService.getPendingTimesheets().subscribe({
      next: (timesheets) => {
        console.log('Loaded timesheets from API:', timesheets);
        this.timesheets = timesheets;
        this.updateUniqueUsers();
        this.filterTimesheets();
      },
      error: (error) => {
        console.error('Error loading timesheets:', error);
        
        // If API fails, use sample data
        const sampleTimesheets: Timesheet[] = [
          { 
            id: 1, 
            userId: 1, 
            weekEnding: '2024-01-07', 
            totalHours: 40, 
            status: 'APPROVED',
            hours: { 'Monday': 8, 'Tuesday': 8, 'Wednesday': 8, 'Thursday': 8, 'Friday': 8 }
          },
          { 
            id: 2, 
            userId: 2, 
            weekEnding: '2024-01-07', 
            totalHours: 35, 
            status: 'PENDING',
            hours: { 'Monday': 7, 'Tuesday': 7, 'Wednesday': 7, 'Thursday': 7, 'Friday': 7 }
          },
          { 
            id: 3, 
            userId: 3, 
            weekEnding: '2024-01-07', 
            totalHours: 42, 
            status: 'APPROVED',
            hours: { 'Monday': 9, 'Tuesday': 9, 'Wednesday': 8, 'Thursday': 8, 'Friday': 8 }
          }
        ];
        
        this.timesheets = sampleTimesheets;
        this.updateUniqueUsers();
        this.filterTimesheets();
      }
    });
  }

  updateUniqueUsers() {
    this.uniqueUsers = Array.from(new Set(this.timesheets.map(ts => 
      ts.userId ? `User ${ts.userId}` : 'Unknown User'
    )));
  }

  filterTimesheets() {
    if (!this.selectedUser) {
      this.filteredTimesheets = this.timesheets;
    } else {
      this.filteredTimesheets = this.timesheets.filter(ts => 
        `User ${ts.userId}` === this.selectedUser
      );
    }
  }

  approveTimesheet(id: number) {
    console.log('Approving timesheet ID:', id);
    
    this.timesheetService.approveTimesheet(id, '').subscribe({
      next: (updatedTimesheet) => {
        console.log('Timesheet approved:', updatedTimesheet);
        
        // Update the local list
        const index = this.timesheets.findIndex(t => t.id === id);
        if (index !== -1) {
          this.timesheets[index] = updatedTimesheet;
        }
        
        this.filterTimesheets();
        
        // Get admin name
        const currentUser = this.authService.getCurrentUser();
        const adminName = currentUser?.name || 'Admin';
        
        // Get the timesheet details
        const timesheet = this.timesheets.find(t => t.id === id);
        if (timesheet) {
          // Find the user email from localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            const allTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
            const matchingTimesheet = allTimesheets.find((t: any) => t.id === id || t.id === timesheet.id);
            
            if (matchingTimesheet && matchingTimesheet.employeeEmail) {
              // Send email notification to user
              const userEmail = matchingTimesheet.employeeEmail;
              const userName = matchingTimesheet.employeeName || 'User';
              const weekEnding = timesheet.weekEnding || 'Current Week';
              
              // Send email notification to user
              this.emailService.sendTimesheetApprovalEmail(
                userEmail,
                userName,
                weekEnding,
                true, // approved
                adminName
              );
            }
          }
        }
      },
      error: (error) => {
        console.error('Error approving timesheet:', error);
      }
    });
  }

  rejectTimesheet(id: number) {
    console.log('Rejecting timesheet ID:', id);
    
    this.timesheetService.rejectTimesheet(id, '').subscribe({
      next: (updatedTimesheet) => {
        console.log('Timesheet rejected:', updatedTimesheet);
        
        // Update the local list
        const index = this.timesheets.findIndex(t => t.id === id);
        if (index !== -1) {
          this.timesheets[index] = updatedTimesheet;
        }
        
        this.filterTimesheets();
        
        // Get admin name
        const currentUser = this.authService.getCurrentUser();
        const adminName = currentUser?.name || 'Admin';
        
        // Get the timesheet details
        const timesheet = this.timesheets.find(t => t.id === id);
        if (timesheet) {
          // Find the user email from localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            const allTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
            const matchingTimesheet = allTimesheets.find((t: any) => t.id === id || t.id === timesheet.id);
            
            if (matchingTimesheet && matchingTimesheet.employeeEmail) {
              // Send email notification to user
              const userEmail = matchingTimesheet.employeeEmail;
              const userName = matchingTimesheet.employeeName || 'User';
              const weekEnding = timesheet.weekEnding || 'Current Week';
              
              // Send email notification to user
              this.emailService.sendTimesheetApprovalEmail(
                userEmail,
                userName,
                weekEnding,
                false, // rejected
                adminName
              );
            }
          }
        }
      },
      error: (error) => {
        console.error('Error rejecting timesheet:', error);
      }
    });
  }
  
  // Helper methods for template
  getEmployeeName(timesheet: Timesheet): string {
    return `User ${timesheet.userId}`;
  }
  
  getWeekEnding(timesheet: Timesheet): string {
    return timesheet.weekEnding || 'N/A';
  }
  
  getTotalHours(timesheet: Timesheet): number {
    if (timesheet.totalHours) {
      return timesheet.totalHours;
    }
    
    if (timesheet.hours && typeof timesheet.hours === 'object') {
      return Object.values(timesheet.hours).reduce((sum: number, hours: number) => sum + hours, 0);
    }
    
    return 0;
  }
  
  getStatus(timesheet: Timesheet): string {
    return timesheet.status?.toLowerCase() || 'pending';
  }
  
  getId(timesheet: Timesheet): number {
    return timesheet.id || 0;
  }
}