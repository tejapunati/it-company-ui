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
    const currentUser = this.authService.getCurrentUser();
    const userName = currentUser?.name || 'Employee';
    const userEmail = currentUser?.email || '';
    
    if (this.selectedTimesheet) {
      // Create a professional timesheet print HTML
      const printHTML = `
        <html>
          <head>
            <title>Timesheet - ${this.selectedTimesheet.weekEnding}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
              .company-header { text-align: center; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
              .company-name { font-size: 28px; font-weight: bold; color: #4f46e5; margin: 0; }
              .company-tagline { font-size: 14px; color: #666; margin: 5px 0 0 0; }
              .timesheet-title { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
              .employee-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              .employee-info h3 { margin: 0 0 10px 0; color: #4f46e5; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .info-item { display: flex; }
              .info-label { font-weight: bold; min-width: 120px; }
              .info-value { flex: 1; }
              .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .status-approved { background: #d1fae5; color: #065f46; }
              .status-rejected { background: #fee2e2; color: #991b1b; }
              .hours-section { margin-top: 30px; }
              .hours-section h3 { color: #4f46e5; margin-bottom: 15px; }
              .hours-table { width: 100%; border-collapse: collapse; border: 2px solid #4f46e5; }
              .hours-table th { background: #4f46e5; color: white; padding: 12px; text-align: left; font-weight: bold; }
              .hours-table td { padding: 10px 12px; border-bottom: 1px solid #ddd; }
              .hours-table tr:nth-child(even) { background: #f8f9fa; }
              .total-row { background: #e0e7ff !important; font-weight: bold; border-top: 2px solid #4f46e5; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="company-header">
              <h1 class="company-name">SSRM Tech Solutions</h1>
              <p class="company-tagline">Professional IT Services & Solutions</p>
            </div>
            
            <h2 class="timesheet-title">Employee Timesheet</h2>
            
            <div class="employee-info">
              <h3>Employee Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Employee Name:</span>
                  <span class="info-value">${userName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${userEmail}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Week Ending:</span>
                  <span class="info-value">${this.selectedTimesheet.weekEnding}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <span class="info-value">
                    <span class="status-badge status-${this.selectedTimesheet.status.toLowerCase()}">
                      ${this.selectedTimesheet.status}
                    </span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total Hours:</span>
                  <span class="info-value">${this.selectedTimesheet.totalHours}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Submitted Date:</span>
                  <span class="info-value">${new Date(this.selectedTimesheet.submittedDate).toLocaleDateString()}</span>
                </div>
              </div>
              ${this.selectedTimesheet.reviewedDate ? `
                <div style="margin-top: 10px;">
                  <div class="info-item">
                    <span class="info-label">Reviewed Date:</span>
                    <span class="info-value">${new Date(this.selectedTimesheet.reviewedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ` : ''}
              ${this.selectedTimesheet.comments ? `
                <div style="margin-top: 10px;">
                  <div class="info-item">
                    <span class="info-label">Comments:</span>
                    <span class="info-value">${this.selectedTimesheet.comments}</span>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <div class="hours-section">
              <h3>Daily Hours Breakdown</h3>
              <table class="hours-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Hours Worked</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.getWeekDays().map(day => `
                    <tr>
                      <td>${day}</td>
                      <td>${this.selectedTimesheet.hours[day] || 0}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr class="total-row">
                    <td><strong>Total Hours</strong></td>
                    <td><strong>${this.selectedTimesheet.totalHours}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div class="footer">
              <p>This timesheet was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <p>SSRM Tech Solutions - Professional IT Services</p>
            </div>
          </body>
        </html>
      `;
      
      // Open new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  }

  getWeekDays(): string[] {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }
}