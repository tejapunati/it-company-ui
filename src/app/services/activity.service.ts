import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Activity {
  id: number;
  userId: number;
  action: string;
  description: string;
  type: string;
  timestamp: string;
  metadata?: any;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadActivities();
  }

  // Load activities from the backend
  loadActivities(): void {
    this.http.get<Activity[]>(`${environment.apiUrl}/activities`).subscribe(
      (activities) => {
        // Add icons for UI display
        const activitiesWithIcons = activities.map(activity => ({
          ...activity,
          icon: this.getActivityIcon(activity.type)
        }));
        this.activitiesSubject.next(activitiesWithIcons);
      },
      (error) => {
        console.error('Error loading activities:', error);
        // Create sample activities if API fails
        const sampleActivities: Activity[] = [
          {
            id: 1,
            userId: 1,
            action: 'login',
            description: 'User logged in',
            type: 'user',
            timestamp: new Date().toISOString(),
            icon: '🔑'
          },
          {
            id: 2,
            userId: 1,
            action: 'timesheet_submit',
            description: 'User submitted timesheet',
            type: 'timesheet',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            icon: '📋'
          }
        ];
        this.activitiesSubject.next(sampleActivities);
      }
    );
  }
  
  // Log a new activity
  logActivity(type: string, action: string, description: string, userId?: number): void {
    const activity: Partial<Activity> = {
      action,
      description,
      type,
      userId,
      timestamp: new Date().toISOString()
    };
    
    this.http.post<Activity>(`${environment.apiUrl}/activities`, activity).subscribe(
      (newActivity) => {
        const updatedActivities = [
          {
            ...newActivity,
            icon: this.getActivityIcon(newActivity.type)
          },
          ...this.activitiesSubject.value
        ];
        this.activitiesSubject.next(updatedActivities);
      },
      (error) => {
        console.error('Error logging activity:', error);
        // Add to local list anyway
        const localActivity: Activity = {
          id: Date.now(),
          userId: userId || 0,
          action,
          description,
          type,
          timestamp: new Date().toISOString(),
          icon: this.getActivityIcon(type)
        };
        const updatedActivities = [localActivity, ...this.activitiesSubject.value];
        this.activitiesSubject.next(updatedActivities);
      }
    );
  }

  // Get activity icon based on type
  private getActivityIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'user': return '👤';
      case 'timesheet': return '📋';
      case 'approval': return '✅';
      case 'admin': return '🔑';
      default: return '📝';
    }
  }
}