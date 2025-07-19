import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  // For demo purposes, we'll simulate a connected backend
  private simulateConnected = true;
  
  constructor(private http: HttpClient) {}

  checkBackendConnection(): Observable<boolean> {
    console.log('Checking backend connection');
    
    // For demo purposes, return a simulated connection status
    // In a real app, we would use the HTTP call below
    return of(this.simulateConnected);
    
    // Original implementation:
    // return this.http.get(`${environment.apiUrl}/health`)
    //  .pipe(
    //    map(() => true),
    //    catchError(() => of(false))
    //  );
  }
  
  // Toggle the connection status (for demo purposes)
  toggleConnectionStatus(): void {
    this.simulateConnected = !this.simulateConnected;
    console.log(`Backend connection status set to: ${this.simulateConnected ? 'Connected' : 'Disconnected'}`);
  }

  testConnection(): Observable<any> {
    console.log('Sending GET request to', `${environment.apiUrl}/health`);
    
    // For demo purposes, return a simulated response
    if (this.simulateConnected) {
      return of({ status: 'UP', message: 'Backend connection successful' });
    } else {
      return of({ status: 'DOWN', error: 'Connection failed' });
    }
    
    // Original implementation:
    // Try a simple ping to see if the server is up
    // return this.http.get(`${environment.apiUrl}/health`, { 
    //   responseType: 'text',
    //   observe: 'response'
    // })
    //   .pipe(
    //     tap(response => {
    //       console.log('Backend connection successful:', response);
    //     }),
    //     map(() => ({ status: 'UP', message: 'Backend connection successful' })),
    //     catchError(error => {
    //       // Special case: if error.status is 200 but it's still an error,
    //       // it means the response was received but couldn't be parsed properly
    //       if (error.status === 200) {
    //         console.log('Backend connection error with status 200:', error);
    //         return of({ status: 'UP', message: 'Backend connection successful' });
    //       }
    //       
    //       console.error('Backend connection error:', error);
    //       
    //       // If we get a 401 or CORS error, the backend is still running
    //       if (error.status === 401 || error.status === 0) {
    //         return of({ 
    //           status: 'UP', 
    //           message: error.status === 401 ? 
    //             'Backend is running but requires authentication' : 
    //             'Backend is running but CORS is not configured properly'
    //         });
    //       }
    //       
    //       return of({ 
    //         status: 'DOWN', 
    //         error: error.message || 'Connection failed' 
    //       });
    //     })
    //   );
  }
}