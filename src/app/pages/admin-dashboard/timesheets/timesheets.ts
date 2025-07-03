import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Timesheet } from '../../../services/data.service';
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

  constructor(private dataService: DataService, private emailService: EmailService) {}

  ngOnInit() {
    this.loadTimesheets();
  }
  
  loadTimesheets() {
    // Load from localStorage (user submissions)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTimesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
      console.log('Raw stored timesheets:', storedTimesheets);
      if (storedTimesheets.length > 0) {
        this.timesheets = storedTimesheets;
        console.log('Loaded timesheets:', this.timesheets);
        this.updateUniqueUsers();
        this.filterTimesheets();
        return;
      }
    }
    
    // Load sample data if no user submissions
    this.dataService.getTimesheets().subscribe((timesheets: Timesheet[]) => {
      this.timesheets = timesheets;
      this.updateUniqueUsers();
      this.filterTimesheets();
    });
  }

  updateUniqueUsers() {
    this.uniqueUsers = Array.from(new Set(this.timesheets.map(ts => ts.user || (ts as any).employeeName)));
  }

  filterTimesheets() {
    if (!this.selectedUser) {
      this.filteredTimesheets = this.timesheets;
    } else {
      this.filteredTimesheets = this.timesheets.filter(ts => 
        ts.user === this.selectedUser || (ts as any).employeeName === this.selectedUser
      );
    }
  }

  approveTimesheet(id: number) {
    console.log('Approving timesheet ID:', id);
    const timesheet = this.timesheets.find(ts => (ts as any).id === id);
    console.log('Found timesheet:', timesheet);
    if (timesheet) {
      (timesheet as any).status = 'approved';
      this.updateTimesheetStorage();
      this.filterTimesheets();
      
      // Send approval email
      const employeeName = (timesheet as any).employeeName || 'Employee';
      const employeeEmail = `${employeeName.toLowerCase().replace(' ', '.')}@company.com`;
      const weekEnding = (timesheet as any).weekEnding || 'Current Week';
      this.emailService.sendTimesheetApprovalEmail(employeeEmail, employeeName, weekEnding, true);
      
      console.log('Timesheet approved');
    }
  }

  rejectTimesheet(id: number) {
    console.log('Rejecting timesheet ID:', id);
    const timesheet = this.timesheets.find(ts => (ts as any).id === id);
    if (timesheet) {
      (timesheet as any).status = 'rejected';
      this.updateTimesheetStorage();
      this.filterTimesheets();
      
      // Send rejection email
      const employeeName = (timesheet as any).employeeName || 'Employee';
      const employeeEmail = `${employeeName.toLowerCase().replace(' ', '.')}@company.com`;
      const weekEnding = (timesheet as any).weekEnding || 'Current Week';
      this.emailService.sendTimesheetApprovalEmail(employeeEmail, employeeName, weekEnding, false);
      
      console.log('Timesheet rejected');
    }
  }
  
  updateTimesheetStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('allTimesheets', JSON.stringify(this.timesheets));
    }
  }
  
  // Helper methods for template
  getEmployeeName(timesheet: any): string {
    return timesheet.employeeName || timesheet.user || 'Unknown User';
  }
  
  getWeekEnding(timesheet: any): string {
    return timesheet.weekEnding || timesheet.week || 'N/A';
  }
  
  getTotalHours(timesheet: any): number {
    return timesheet.totalHours || timesheet.hours || 0;
  }
  
  getStatus(timesheet: any): string {
    return timesheet.status || 'pending';
  }
  
  getId(timesheet: any): number {
    return timesheet.id;
  }
}
