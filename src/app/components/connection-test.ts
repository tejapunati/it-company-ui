import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-connection-test',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
    <div class="connection-test">
      <h2>Backend Connection Test</h2>
      <div class="status">
        <p>Status: 
          <span [class]="connectionStatus === 'Connected' ? 'connected' : 'disconnected'">
            {{ connectionStatus }}
          </span>
        </p>
        <p *ngIf="errorMessage">Error: {{ errorMessage }}</p>
      </div>
      <button (click)="testConnection()" class="btn btn-primary">Test Connection</button>
      
      <div *ngIf="apiResponse" class="response">
        <h3>API Response:</h3>
        <pre>{{ apiResponse | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .connection-test {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      max-width: 600px;
      margin: 20px auto;
    }
    .status {
      margin: 20px 0;
    }
    .connected {
      color: green;
      font-weight: bold;
    }
    .disconnected {
      color: red;
      font-weight: bold;
    }
    .response {
      margin-top: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
      overflow: auto;
    }
    pre {
      white-space: pre-wrap;
    }
    button {
      margin-bottom: 20px;
    }
  `]
})
export class ConnectionTestComponent implements OnInit {
  connectionStatus: string = 'Unknown';
  errorMessage: string = '';
  apiResponse: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Test connection on component initialization
    this.testConnection();
  }

  testConnection(): void {
    this.connectionStatus = 'Testing...';
    this.errorMessage = '';
    this.apiResponse = null;

    // Try to connect to the backend health endpoint
    this.http.get(`${environment.apiUrl}/health`, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.connectionStatus = 'Connected';
          this.apiResponse = response;
        },
        error: (error) => {
          this.connectionStatus = 'Disconnected';
          this.errorMessage = `${error.status}: ${error.statusText}`;
          console.error('Backend connection error:', error);
          
          // Try to get more details about the error
          if (error.error) {
            try {
              this.apiResponse = typeof error.error === 'string' ? error.error : JSON.stringify(error.error, null, 2);
            } catch (e) {
              this.apiResponse = 'Error parsing response';
            }
          }
        }
      });
  }
}