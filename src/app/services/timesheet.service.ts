import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Timesheet {
  id?: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  weekEnding: string;
  status: string;
  totalHours: number;
  submittedDate?: string;
  reviewedDate?: string;
  reviewedBy?: number;
  comments?: string;
  hours: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  getAllTimesheets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/timesheets`);
  }
  
  getTimesheetsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/timesheets/user/${userId}`);
  }
  
  getTimesheetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/timesheets/${id}`);
  }
  
  createTimesheet(timesheet: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/timesheets`, timesheet);
  }
  
  updateTimesheet(id: string, timesheet: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/timesheets/${id}`, timesheet);
  }
  
  deleteTimesheet(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/timesheets/${id}`);
  }
  
  getPendingTimesheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.apiUrl}/timesheets?status=PENDING`);
  }
  
  approveTimesheet(id: string, comments: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/timesheets/${id}/approve`, { comments });
  }
  
  rejectTimesheet(id: string, comments: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/timesheets/${id}/reject`, { comments });
  }
}