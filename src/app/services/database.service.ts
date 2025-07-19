import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, Timesheet, Email, Activity, DashboardStats } from '../models/database.models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor(private http: HttpClient) {}

  // API endpoints for backend integration
  private readonly API_BASE = environment.apiUrl;
  
  // User management endpoints
  private readonly USERS_ENDPOINT = `${this.API_BASE}/users`;
  private readonly AUTH_ENDPOINT = `${this.API_BASE}/auth`;
  
  // Timesheet management endpoints
  private readonly TIMESHEETS_ENDPOINT = `${this.API_BASE}/timesheets`;
  
  // Email management endpoints
  private readonly EMAILS_ENDPOINT = `${this.API_BASE}/emails`;
  
  // Activity tracking endpoints
  private readonly ACTIVITIES_ENDPOINT = `${this.API_BASE}/activities`;
  
  // Stats endpoints
  private readonly STATS_ENDPOINT = `${this.API_BASE}/stats`;

  // Current localStorage simulation methods
  // These will be replaced with actual HTTP calls to backend

  // User operations
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.USERS_ENDPOINT);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.USERS_ENDPOINT, user);
  }
  
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.USERS_ENDPOINT}/${id}`, user);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.USERS_ENDPOINT}/${id}`);
  }

  // Timesheet operations
  getTimesheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(this.TIMESHEETS_ENDPOINT);
  }

  createTimesheet(timesheet: Partial<Timesheet>): Observable<Timesheet> {
    return this.http.post<Timesheet>(this.TIMESHEETS_ENDPOINT, timesheet);
  }
  
  updateTimesheet(id: number, timesheet: Partial<Timesheet>): Observable<Timesheet> {
    return this.http.put<Timesheet>(`${this.TIMESHEETS_ENDPOINT}/${id}`, timesheet);
  }

  // Email operations
  getEmails(): Observable<Email[]> {
    return this.http.get<Email[]>(this.EMAILS_ENDPOINT);
  }
  
  sendEmail(email: Partial<Email>): Observable<Email> {
    return this.http.post<Email>(this.EMAILS_ENDPOINT, email);
  }

  // Activity operations
  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.ACTIVITIES_ENDPOINT);
  }
  
  logActivity(activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(this.ACTIVITIES_ENDPOINT, activity);
  }

  // Stats operations
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.STATS_ENDPOINT);
  }

  // Helper methods for specific data needs
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.USERS_ENDPOINT}/${id}`);
  }
  
  getTimesheetsByUserId(userId: number): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(`${this.TIMESHEETS_ENDPOINT}/user/${userId}`);
  }
  
  getActivitiesByUserId(userId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.ACTIVITIES_ENDPOINT}/user/${userId}`);
  }
}