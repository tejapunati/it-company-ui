import { Injectable } from '@angular/core';

// Database schema interfaces for future backend integration
export interface DatabaseUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  role: 'user' | 'admin' | 'parent-admin';
  status: 'active' | 'inactive' | 'pending';
  createdDate: string;
  lastLogin?: string;
}

export interface DatabaseTimesheet {
  id: number;
  userId: number;
  employeeName: string;
  employeeEmail: string;
  weekEnding: string;
  hours: { [key: string]: number };
  totalHours: number;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: number;
}

export interface DatabaseEmail {
  id: number;
  to: string;
  from: string;
  subject: string;
  body: string;
  type: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: number;
  readAt?: number;
}

export interface DatabaseActivity {
  id: number;
  userId: number;
  action: string;
  description: string;
  type: 'user' | 'timesheet' | 'approval' | 'admin';
  timestamp: number;
  metadata?: any;
}

export interface DatabaseStats {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  totalTimesheets: number;
  approvedHours: number;
  pendingTimesheets: number;
  emailsSent: number;
  lastUpdated: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  constructor() {}

  // Future API endpoints for backend integration
  private readonly API_BASE = '/api/v1';
  
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
  async getUsers(): Promise<DatabaseUser[]> {
    // Future: return this.http.get<DatabaseUser[]>(this.USERS_ENDPOINT).toPromise();
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]');
    return Promise.resolve(users);
  }

  async createUser(user: Partial<DatabaseUser>): Promise<DatabaseUser> {
    // Future: return this.http.post<DatabaseUser>(this.USERS_ENDPOINT, user).toPromise();
    const users = await this.getUsers();
    const newUser: DatabaseUser = {
      id: Date.now(),
      createdDate: new Date().toISOString(),
      status: 'pending',
      ...user
    } as DatabaseUser;
    users.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(users));
    return Promise.resolve(newUser);
  }

  // Timesheet operations
  async getTimesheets(): Promise<DatabaseTimesheet[]> {
    // Future: return this.http.get<DatabaseTimesheet[]>(this.TIMESHEETS_ENDPOINT).toPromise();
    const timesheets = JSON.parse(localStorage.getItem('allTimesheets') || '[]');
    return Promise.resolve(timesheets);
  }

  async createTimesheet(timesheet: Partial<DatabaseTimesheet>): Promise<DatabaseTimesheet> {
    // Future: return this.http.post<DatabaseTimesheet>(this.TIMESHEETS_ENDPOINT, timesheet).toPromise();
    const timesheets = await this.getTimesheets();
    const newTimesheet: DatabaseTimesheet = {
      id: Date.now(),
      submittedDate: new Date().toISOString(),
      status: 'pending',
      ...timesheet
    } as DatabaseTimesheet;
    timesheets.unshift(newTimesheet);
    localStorage.setItem('allTimesheets', JSON.stringify(timesheets));
    return Promise.resolve(newTimesheet);
  }

  // Email operations
  async getEmails(): Promise<DatabaseEmail[]> {
    // Future: return this.http.get<DatabaseEmail[]>(this.EMAILS_ENDPOINT).toPromise();
    // Currently handled by EmailService
    return Promise.resolve([]);
  }

  // Activity operations
  async getActivities(): Promise<DatabaseActivity[]> {
    // Future: return this.http.get<DatabaseActivity[]>(this.ACTIVITIES_ENDPOINT).toPromise();
    const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
    return Promise.resolve(activities);
  }

  // Stats operations
  async getStats(): Promise<DatabaseStats> {
    // Future: return this.http.get<DatabaseStats>(this.STATS_ENDPOINT).toPromise();
    const users = await this.getUsers();
    const timesheets = await this.getTimesheets();
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    
    const stats: DatabaseStats = {
      totalUsers: users.length + 2, // +2 for default users
      activeUsers: users.filter(u => u.status === 'active').length + 2,
      pendingApprovals: pendingUsers.filter((u: any) => u.status === 'pending').length + 
                       timesheets.filter(t => t.status === 'pending').length,
      totalTimesheets: timesheets.length,
      approvedHours: timesheets.filter(t => t.status === 'approved')
                              .reduce((total, t) => total + t.totalHours, 0),
      pendingTimesheets: timesheets.filter(t => t.status === 'pending').length,
      emailsSent: JSON.parse(localStorage.getItem('emailQueue') || '[]').length,
      lastUpdated: Date.now()
    };
    
    return Promise.resolve(stats);
  }

  // Migration helper for future backend integration
  async exportAllData(): Promise<{
    users: DatabaseUser[],
    timesheets: DatabaseTimesheet[],
    emails: any[],
    activities: DatabaseActivity[]
  }> {
    return {
      users: await this.getUsers(),
      timesheets: await this.getTimesheets(),
      emails: JSON.parse(localStorage.getItem('emailQueue') || '[]'),
      activities: await this.getActivities()
    };
  }
}