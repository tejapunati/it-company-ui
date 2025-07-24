import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetch email logs for a specific user
   * @param email The email address of the user
   * @returns Observable with email logs data
   */
  getEmailLogs(email: string): Observable<any> {
    console.log(`Fetching email logs for: ${email}`);
    // Let the auth interceptor handle the token
    const url = `${this.apiUrl}/emails/${email}`;
    
    return this.http.get(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching email logs:', error);
          return of({ userEmailLogs: [], adminEmailLogs: [], parentAdminEmailLogs: [] });
        })
      );
  }

  /**
   * Alternative method to fetch emails using the direct endpoint
   * @param email The email address of the user
   * @returns Observable with email logs data
   */
  getDirectEmailLogs(email: string): Observable<any> {
    console.log(`Fetching direct email logs for: ${email}`);
    // Let the auth interceptor handle the token
    const url = `${this.apiUrl}/direct-emails/${email}`;
    
    return this.http.get(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching direct email logs:', error);
          return of({ userEmailLogs: [], adminEmailLogs: [], parentAdminEmailLogs: [] });
        })
      );
  }

  /**
   * Clear email logs for a specific user
   * @param email The email address of the user
   * @returns Observable with operation result
   */
  clearEmailLogs(email: string): Observable<any> {
    // Let the auth interceptor handle the token
    const url = `${this.apiUrl}/emails/${email}`;
    
    return this.http.delete(url)
      .pipe(
        catchError(error => {
          console.error('Error clearing email logs:', error);
          return of({ success: false, message: 'Failed to clear email logs' });
        })
      );
  }
  
  /**
   * Get user emails from user_email_logs collection
   */
  getUserEmails(email: string): Observable<any> {
    const url = `${this.apiUrl}/email-logs/user/${email}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error fetching user emails:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Get admin emails from admin_email_logs collection
   */
  getAdminEmails(email: string): Observable<any> {
    const url = `${this.apiUrl}/email-logs/admin/${email}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error fetching admin emails:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Get parent admin emails from parent_admin_email_logs collection
   */
  getParentAdminEmails(email: string): Observable<any> {
    const url = `${this.apiUrl}/email-logs/parent-admin/${email}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Error fetching parent admin emails:', error);
        return of([]);
      })
    );
  }

  /**
   * Get sample email logs for testing when API is not available
   * @param email The email address of the user
   * @returns Observable with sample email logs data
   */
  getSampleEmailLogs(email: string): Observable<any> {
    console.log(`Generating sample email logs for: ${email}`);
    
    // Create sample data based on user role
    const isAdmin = email.includes('admin');
    const isParentAdmin = email.includes('parent-admin');
    
    const sampleData: any = {
      userEmailLogs: [],
      adminEmailLogs: [],
      parentAdminEmailLogs: []
    };
    
    // Add user email logs
    if (!isAdmin || email === 'user@ssrmtech.com') {
      sampleData.userEmailLogs = [
        {
          id: '1',
          toEmail: email,
          subject: 'Timesheet Approved',
          body: 'Your timesheet for week ending 2023-07-15 has been approved.',
          type: 'TIMESHEET_APPROVED',
          sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        },
        {
          id: '2',
          toEmail: email,
          subject: 'Welcome to SSRM Tech',
          body: 'Your account has been approved. Welcome to SSRM Tech!',
          type: 'USER_APPROVED',
          sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        }
      ];
    }
    
    // Add admin email logs
    if (isAdmin && !isParentAdmin) {
      sampleData.adminEmailLogs = [
        {
          id: '3',
          toEmail: email,
          subject: 'New Timesheet Submission',
          body: 'A new timesheet has been submitted by user@ssrmtech.com',
          type: 'TIMESHEET_SUBMITTED',
          sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: '4',
          toEmail: email,
          subject: 'Admin Account Approved',
          body: 'Your admin account has been approved by parent-admin@ssrmtech.com',
          type: 'ADMIN_NOTIFICATION',
          sentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
        }
      ];
    }
    
    // Add parent admin email logs
    if (isParentAdmin) {
      sampleData.parentAdminEmailLogs = [
        {
          id: '5',
          toEmail: email,
          subject: 'New Admin Registration',
          body: 'A new admin has registered and requires approval: admin@ssrmtech.com',
          type: 'PARENT_ADMIN_NOTIFICATION',
          sentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
        },
        {
          id: '6',
          toEmail: email,
          subject: 'System Notification',
          body: 'Monthly system usage report is available',
          type: 'PARENT_ADMIN_NOTIFICATION',
          sentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
        }
      ];
    }
    
    return of(sampleData);
  }
}