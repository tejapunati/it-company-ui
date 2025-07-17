import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {
    // Check if user is stored in localStorage (browser only)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(email: string, password: string, role: string): Observable<any> {
    // Try Spring Security's default login endpoint
    const loginUrl = `${environment.apiUrl}/login`;
    console.log(`Sending login request to ${loginUrl} with username: ${email}, role: ${role}`);
    
    // Create form data for Spring Security
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('role', role);
    
    // Use form data for Spring Security compatibility
    return this.http.post(loginUrl, formData)
      .pipe(
        tap((response: any) => {
          console.log('Login response:', response);
          
          // Handle Spring Security response
          // For Spring Security, we might need to extract user info from JWT or a separate endpoint
          // This is a simplified version
          
          // Create a user object based on the login info
          // In a real app, you might want to fetch user details from a /me endpoint
          const user: User = {
            id: 0, // We'll need to get this from the backend
            email: email,
            role: role as any, // Use the role from the login form
            name: email.split('@')[0] // Use part of email as name temporarily
          };
          
          console.log('User object created:', user);
          
          // Store authentication state
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            // For Spring Security, we might use JSESSIONID cookie instead of token
            // But we'll store the role for our app's use
            localStorage.setItem('userRole', role);
            console.log('User data saved to localStorage');
          }
          
          this.currentUserSubject.next(user);
          console.log('Current user updated in service');
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, userData);
  }

  adminRegister(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin-register`, userData);
  }

  getToken(): string | null {
    // For Spring Security, we typically use cookies (JSESSIONID)
    // But we'll return the user role for our interceptor to use
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userRole');
    }
    return null;
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