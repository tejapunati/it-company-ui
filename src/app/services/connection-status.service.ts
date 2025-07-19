import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {
  private connectionStatus = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatus.asObservable();

  constructor(private http: HttpClient) {
    // Check connection status every 30 seconds
    this.startConnectionMonitoring();
  }

  startConnectionMonitoring() {
    timer(0, 30000).pipe(
      switchMap(() => this.checkBackendConnection())
    ).subscribe(isConnected => {
      this.connectionStatus.next(isConnected);
    });
  }

  checkBackendConnection(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/health`, { 
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    })
      .pipe(
        switchMap((response: any) => {
          console.log('Backend connection check:', response);
          return of(response && response.status === 'UP');
        }),
        catchError((error) => {
          console.error('Backend connection error:', error);
          return of(false);
        })
      );
  }
}