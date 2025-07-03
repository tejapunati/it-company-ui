import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user' | 'parent-admin';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is stored in localStorage (browser only)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string, role: string): boolean {
    if (!email || !password || !role) return false;
    
    // Check against created users (for regular users)
    if (role === 'user' && typeof window !== 'undefined' && window.localStorage) {
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
      const foundUser = allUsers.find((u: any) => 
        u.email === email && u.password === password && u.status === 'active'
      );
      
      if (foundUser) {
        const user: User = {
          id: foundUser.id,
          email: foundUser.email,
          role: 'user',
          name: foundUser.name
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return true;
      }
      return false; // User not found or inactive
    }
    
    // Allow admin/parent-admin with any credentials (for demo)
    if (role === 'admin' || role === 'parent-admin') {
      const user: User = {
        id: 1,
        email: email,
        role: role as 'admin' | 'user' | 'parent-admin',
        name: email.split('@')[0]
      };
      
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.currentUserSubject.next(user);
      return true;
    }
    
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || user?.role === 'parent-admin';
  }
  
  isParentAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'parent-admin';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }
}