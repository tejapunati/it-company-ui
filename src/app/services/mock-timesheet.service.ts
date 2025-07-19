import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockTimesheetService {
  private timesheets = [
    {
      id: 1,
      userId: 1,
      weekEnding: '2025-07-12',
      status: 'PENDING',
      totalHours: 40,
      hours: {
        'MONDAY': 8,
        'TUESDAY': 8,
        'WEDNESDAY': 8,
        'THURSDAY': 8,
        'FRIDAY': 8,
        'SATURDAY': 0,
        'SUNDAY': 0
      },
      submittedDate: '2025-07-12T10:00:00',
      comments: ''
    },
    {
      id: 2,
      userId: 2,
      weekEnding: '2025-07-12',
      status: 'PENDING',
      totalHours: 35,
      hours: {
        'MONDAY': 7,
        'TUESDAY': 7,
        'WEDNESDAY': 7,
        'THURSDAY': 7,
        'FRIDAY': 7,
        'SATURDAY': 0,
        'SUNDAY': 0
      },
      submittedDate: '2025-07-12T11:00:00',
      comments: ''
    }
  ];

  constructor() { }

  getTimesheets(): Observable<any[]> {
    return of(this.timesheets).pipe(delay(500));
  }

  approveTimesheet(id: number): Observable<any> {
    const timesheet = this.timesheets.find(t => t.id === id);
    if (timesheet) {
      timesheet.status = 'APPROVED';
      timesheet.comments = 'Approved by admin';
    }
    return of({ success: true, message: 'Timesheet approved successfully' }).pipe(delay(500));
  }

  rejectTimesheet(id: number, comments: string): Observable<any> {
    const timesheet = this.timesheets.find(t => t.id === id);
    if (timesheet) {
      timesheet.status = 'REJECTED';
      timesheet.comments = comments;
    }
    return of({ success: true, message: 'Timesheet rejected successfully' }).pipe(delay(500));
  }
}