import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Timesheet {
  id: number;
  user: string;
  week: string;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'pending';
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private timesheetsSubject = new BehaviorSubject<Timesheet[]>([
    { id: 1, user: 'Alice Johnson', week: '2024-W01', hours: 40, status: 'approved' },
    { id: 2, user: 'Bob Smith', week: '2024-W01', hours: 35, status: 'pending' },
    { id: 3, user: 'Carol Davis', week: '2024-W01', hours: 42, status: 'approved' },
    { id: 4, user: 'Alice Johnson', week: '2024-W02', hours: 38, status: 'pending' }
  ]);

  private usersSubject = new BehaviorSubject<UserData[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'user', status: 'active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'admin', status: 'pending' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', role: 'user', status: 'inactive' }
  ]);

  public timesheets$ = this.timesheetsSubject.asObservable();
  public users$ = this.usersSubject.asObservable();

  getTimesheets(): Observable<Timesheet[]> {
    return this.timesheets$;
  }

  getUsers(): Observable<UserData[]> {
    return this.users$;
  }

  updateUserStatus(userId: number, status: 'active' | 'inactive' | 'pending'): void {
    const users = this.usersSubject.value;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].status = status;
      this.usersSubject.next([...users]);
    }
  }

  approveTimesheet(timesheetId: number): void {
    const timesheets = this.timesheetsSubject.value;
    const timesheetIndex = timesheets.findIndex(t => t.id === timesheetId);
    if (timesheetIndex !== -1) {
      timesheets[timesheetIndex].status = 'approved';
      this.timesheetsSubject.next([...timesheets]);
    }
  }

  rejectTimesheet(timesheetId: number): void {
    const timesheets = this.timesheetsSubject.value;
    const timesheetIndex = timesheets.findIndex(t => t.id === timesheetId);
    if (timesheetIndex !== -1) {
      timesheets[timesheetIndex].status = 'rejected';
      this.timesheetsSubject.next([...timesheets]);
    }
  }
}