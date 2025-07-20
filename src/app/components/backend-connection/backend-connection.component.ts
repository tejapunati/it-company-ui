import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-backend-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="backend-status" [class.connected]="isConnected" [class.disconnected]="!isConnected">
      <div class="status-indicator"></div>
      <span>Backend: {{ isConnected ? 'Connected' : 'Disconnected' }}</span>
    </div>
  `,
  styles: [`
    .backend-status {
      position: fixed;
      bottom: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .connected {
      background-color: rgba(52, 211, 153, 0.2);
      color: #065f46;
      border: 1px solid #10b981;
    }
    
    .disconnected {
      background-color: rgba(239, 68, 68, 0.2);
      color: #b91c1c;
      border: 1px solid #ef4444;
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
    
    .connected .status-indicator {
      background-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
    
    .disconnected .status-indicator {
      background-color: #ef4444;
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }
  `]
})
export class BackendConnectionComponent implements OnInit {
  isConnected = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkConnection();
    
    // Check connection every 30 seconds
    setInterval(() => {
      this.checkConnection();
    }, 30000);
  }

  checkConnection(): void {
    this.http.get(`${environment.apiUrl}/health`, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    })
      .subscribe({
        next: () => {
          this.isConnected = true;
        },
        error: () => {
          this.isConnected = false;
        }
      });
  }
}