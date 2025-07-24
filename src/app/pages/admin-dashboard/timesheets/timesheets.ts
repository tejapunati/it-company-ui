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
        this.timesheets = [];
        this.updateUniqueUsers();
        this.filterTimesheets();
      }
    });
  }

  updateUniqueUsers() {
    this.uniqueUsers = Array.from(new Set(this.timesheets.map(ts => 
      this.getEmployeeName(ts)
    )));
  }

  filterTimesheets() {
    if (!this.selectedUser) {
      this.filteredTimesheets = this.timesheets;
    } else {
      this.filteredTimesheets = this.timesheets.filter(ts => 
        this.getEmployeeName(ts) === this.selectedUser
      );
    }
  }

  approveTimesheet(id: string) {
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

  rejectTimesheet(id: string) {
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
  getEmployeeName(timesheet: any): string {
    // Check if timesheet has userName property (from TimesheetWithUserDTO)
    if (timesheet.userName) {
      return timesheet.userName;
    }
    // Fallback to userId if userName is not available
    return timesheet.userId ? `User ${timesheet.userId}` : 'Unknown User';
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
  
  getId(timesheet: Timesheet): string {
    return timesheet.id?.toString() || '0';
  }
}