import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private users = [
    { email: 'admin', password: 'admin', role: 'admin', name: 'Admin User', id: 1 },
    { email: 'parent', password: 'parent', role: 'parent-admin', name: 'Parent Admin', id: 2 },
    { email: 'user', password: 'user', role: 'user', name: 'Regular User', id: 3 }
  ];

  private currentUser: User | null = null;

  login(email: string, password: string, role: string): Observable<any> {
    console.log(`Mock login attempt: ${email}, role: ${role}`);
    
    console.log('Mock auth service looking for user with:', { email, password, role });
    
    // Special handling for parent-admin
    if (email === 'parent' && password === 'parent') {
      console.log('Parent admin login detected');
      
      const parentAdminUser = {
        id: 2,
        email: 'parent',
        role: 'parent-admin' as 'parent-admin', // Type assertion
        name: 'Parent Admin'
      };
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(parentAdminUser));
      localStorage.setItem('mockToken', 'mock-jwt-token-parent-admin');
      this.currentUser = parentAdminUser;
      
      return of({
        ...parentAdminUser,
        token: 'mock-jwt-token-parent-admin'
      }).pipe(delay(500));
    }
    
    // Check for approved admins in localStorage
    let approvedAdmins: any[] = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('approvedUsers');
      if (stored) {
        approvedAdmins = JSON.parse(stored);
        console.log('Found approved admins:', approvedAdmins);
      }
    }
    
    // Check for approved regular users in localStorage
    let allUsers: any[] = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('allUsers');
      if (stored) {
        allUsers = JSON.parse(stored);
        console.log('Found all users:', allUsers);
      }
    }
    
    // First check if this is an approved admin
    const approvedAdmin = approvedAdmins.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === 'admin'
    );
    
    if (approvedAdmin) {
      console.log('Approved admin login successful:', approvedAdmin);
      this.currentUser = {
        id: approvedAdmin.id,
        email: approvedAdmin.email,
        role: 'admin' as 'admin',
        name: approvedAdmin.name
      };
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('mockToken', 'mock-jwt-token-admin');
      
      return of({
        ...approvedAdmin,
        token: 'mock-jwt-token-admin'
      }).pipe(delay(500));
    }
    
    // Then check if this is an approved regular user
    const approvedUser = allUsers.find(u => 
      u.email === email && 
      (u.password === password || password === 'user123') && 
      u.role === 'user' &&
      u.status === 'active'
    );
    
    if (approvedUser) {
      console.log('Approved user login successful:', approvedUser);
      this.currentUser = {
        id: approvedUser.id,
        email: approvedUser.email,
        role: 'user' as 'user',
        name: approvedUser.name
      };
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('mockToken', 'mock-jwt-token-user');
      
      return of({
        ...approvedUser,
        token: 'mock-jwt-token-user'
      }).pipe(delay(500));
    }
    
    // If not an approved admin, check default users
    const user = this.users.find(u => 
      u.email === email && 
      u.password === password && 
      (u.role === role || !role) // Make role optional
    );
    
    console.log('Found user in default list:', user);

    if (user) {
      console.log('Mock login successful');
      this.currentUser = {
        id: user.id,
        email: user.email,
        role: user.role as any,
        name: user.name
      };
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      localStorage.setItem('mockToken', 'mock-jwt-token-' + user.role);
      
      return of({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        token: 'mock-jwt-token-' + user.role
      }).pipe(delay(500)); // Simulate network delay
    } else {
      console.log('Mock login failed');
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('mockToken');
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    if (!this.currentUser && localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
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

  getToken(): string | null {
    return localStorage.getItem('mockToken');
  }
}