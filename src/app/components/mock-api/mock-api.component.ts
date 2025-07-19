import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mock-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mock-api-container">
      <div class="status-card" [class.connected]="true">
        <h2>Mock API Active</h2>
        <p>Using mock data since backend connection failed</p>
      </div>
    </div>
  `,
  styles: [`
    .mock-api-container {
      position: fixed;
      bottom: 60px;
      right: 10px;
      z-index: 1000;
    }
    
    .status-card {
      background-color: rgba(52, 211, 153, 0.2);
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 10px 15px;
      color: #065f46;
      font-size: 12px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .status-card h2 {
      margin: 0 0 5px 0;
      font-size: 14px;
    }
    
    .status-card p {
      margin: 0;
    }
  `]
})
export class MockApiComponent {}