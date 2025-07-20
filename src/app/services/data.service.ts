import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from './mock-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  private useMockApi = false;

  constructor(private http: HttpClient, private mockApiService: MockApiService) {
    // Check if backend is available
    this.checkBackendConnection();
  }
  
  private checkBackendConnection(): void {
    this.http.get(`${environment.apiUrl}/health`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    }).subscribe({
      next: () => {
        this.useMockApi = false;
        console.log('Using real backend API');
      },
      error: () => {
        this.useMockApi = true;
        console.log('Backend not available, using mock API');
      }
    });
  }

  // Get services from backend or mock
  getServices(): Observable<any[]> {
    if (this.useMockApi) {
      return this.mockApiService.getServices();
    }
    return this.http.get<any[]>(`${this.apiUrl}/services`)
      .pipe(catchError(() => this.mockApiService.getServices()));
  }

  // Get testimonials from backend or mock
  getTestimonials(): Observable<any[]> {
    if (this.useMockApi) {
      return this.mockApiService.getTestimonials();
    }
    return this.http.get<any[]>(`${this.apiUrl}/testimonials`)
      .pipe(catchError(() => this.mockApiService.getTestimonials()));
  }

  // Get technologies from backend or mock
  getTechnologies(): Observable<any[]> {
    if (this.useMockApi) {
      return this.mockApiService.getTechnologies();
    }
    return this.http.get<any[]>(`${this.apiUrl}/technologies`)
      .pipe(catchError(() => this.mockApiService.getTechnologies()));
  }

  // Get industries from backend or mock
  getIndustries(): Observable<any[]> {
    if (this.useMockApi) {
      return this.mockApiService.getIndustries();
    }
    return this.http.get<any[]>(`${this.apiUrl}/industries`)
      .pipe(catchError(() => this.mockApiService.getIndustries()));
  }

  // Get stats from backend or mock
  getStats(): Observable<any[]> {
    if (this.useMockApi) {
      return this.mockApiService.getStats();
    }
    return this.http.get<any[]>(`${this.apiUrl}/stats`)
      .pipe(catchError(() => this.mockApiService.getStats()));
  }
}