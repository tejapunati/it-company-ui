import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MockAuthService } from './mock-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient, private mockAuthService: MockAuthService) {
    // Check if user is already logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  
  login(email: string, password: string, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password, role }, {
      withCredentials: false
    })
      .pipe(
        tap(response => {
          // Store user details and token in local storage
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }
  
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user);
  }
  
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
  
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  getToken(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.token : null;
  }
  
  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.role === role;
  }
  
  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('PARENT_ADMIN');
  }
  
  isParentAdmin(): boolean {
    return this.hasRole('PARENT_ADMIN');
  }
  
  isUser(): boolean {
    return this.hasRole('USER');
  }
  
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/forgot-password`, { email });
  }
}