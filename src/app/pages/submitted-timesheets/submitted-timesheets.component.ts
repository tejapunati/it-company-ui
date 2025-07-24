import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetService } from '../../services/timesheet.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-submitted-timesheets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submitted-timesheets.component.html',
  styleUrls: ['./submitted-timesheets.component.css']
})
export class SubmittedTimesheetsComponent implements OnInit {
  timesheets: any[] = [];
  selectedTimesheet: any = null;
  showModal = false;

  constructor(
    private timesheetService: TimesheetService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTimesheets();
  }

  loadTimesheets() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.timesheetService.getTimesheetsByUserId(currentUser.id).subscribe({
      next: (timesheets) => {
        this.timesheets = timesheets.sort((a, b) => 
          new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading timesheets:', error);
      }
    });
  }

  viewDetails(timesheet: any) {
    this.selectedTimesheet = timesheet;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTimesheet = null;
  }

  printTimesheet() {
    window.print();
  }

  getWeekDays(): string[] {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }
}