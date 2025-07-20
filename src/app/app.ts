import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
// ConnectionStatusComponent removed to avoid duplication
import { BackendConnectionComponent } from './components/backend-connection/backend-connection.component';
import { MockApiComponent } from './components/mock-api/mock-api.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, BackendConnectionComponent, MockApiComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'it-company-ui';
  useMockApi = false;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.checkBackendConnection();
  }
  
  checkBackendConnection(): void {
    this.http.get(`${environment.apiUrl}/health`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    }).subscribe({
      next: () => {
        this.useMockApi = false;
        console.log('Backend is available');
      },
      error: () => {
        this.useMockApi = true;
        console.log('Backend is not available, using mock API');
      }
    });
  }
}