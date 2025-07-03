import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Activity {
  id: number;
  time: string;
  description: string;
  type: 'user' | 'timesheet' | 'approval' | 'admin';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  public activities$ = this.activitiesSubject.asObservable();

  constructor() {
    this.loadActivities();
  }

  private loadActivities() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('recentActivities');
      if (stored) {
        this.activitiesSubject.next(JSON.parse(stored));
      }
    }
  }

  addActivity(description: string, type: 'user' | 'timesheet' | 'approval' | 'admin') {
    const activities = this.activitiesSubject.value;
    const newActivity: Activity = {
      id: Date.now(),
      time: this.getTimeAgo(new Date()),
      description,
      type,
      icon: this.getIcon(type)
    };

    const updatedActivities = [newActivity, ...activities].slice(0, 10); // Keep only latest 10
    this.activitiesSubject.next(updatedActivities);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
    }
  }

  private getIcon(type: string): string {
    switch (type) {
      case 'user': return '👤';
      case 'timesheet': return '📋';
      case 'approval': return '✅';
      case 'admin': return '👨‍💼';
      default: return '📝';
    }
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }

  getActivities(): Activity[] {
    return this.activitiesSubject.value;
  }
}