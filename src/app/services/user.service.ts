import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
  
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }
  
  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }
  
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, user);
  }
  
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }
  
  approveUser(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${id}/approve`, {});
  }
  
  rejectUser(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${id}/reject`, {});
  }
  
  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users?status=PENDING`);
  }
}