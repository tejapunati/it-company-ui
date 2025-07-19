import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionService } from '../../services/connection.service';
import { ConnectionStatusComponent } from './connection-status.component';

@Component({
  selector: 'app-connection-test-page',
  standalone: true,
  imports: [
    CommonModule,
    ConnectionStatusComponent,
  ],
  template: `
    <div class="container mt-5">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h2>Backend Connection Test</h2>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <button class="btn btn-primary" (click)="testConnection()">Test Connection</button>
          </div>
          <app-connection-status 
            *ngIf="connectionStatus" 
            [status]="connectionStatus.status" 
            [message]="connectionStatus.message" 
            [error]="connectionStatus.error">
          </app-connection-status>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ConnectionTestPageComponent implements OnInit {
  connectionStatus: any = null;

  constructor(private connectionService: ConnectionService) {}

  ngOnInit(): void {
  }

  testConnection(): void {
    this.connectionService.testConnection().subscribe(
      (response) => {
        this.connectionStatus = response;
      }
    );
  }
}