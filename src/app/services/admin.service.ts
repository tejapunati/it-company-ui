import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admins`);
  }

  createAdmin(admin: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admins`, admin);
  }

  deleteAdmin(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admins/${id}`);
  }
}