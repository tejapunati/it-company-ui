import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionStatusService } from '../../services/connection-status.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-indicator" [class.connected]="isConnected" [class.disconnected]="!isConnected">
      <div class="status-dot"></div>
      <span class="status-text">{{ isConnected ? 'Backend Connected' : 'Backend Disconnected' }}</span>
    </div>
  `,
  styles: [`
    .connection-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
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
    
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .connected .status-dot {
      background-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
      animation: pulse-green 2s infinite;
    }
    
    .disconnected .status-dot {
      background-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
      animation: pulse-red 2s infinite;
    }
    
    @keyframes pulse-green {
      0% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }
    
    @keyframes pulse-red {
      0% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
      }
    }
  `]
})
export class ConnectionStatusComponent implements OnInit {
  isConnected = false;

  constructor(private connectionStatusService: ConnectionStatusService) {}

  ngOnInit(): void {
    this.connectionStatusService.connectionStatus$.subscribe(status => {
      this.isConnected = status;
    });
  }
}