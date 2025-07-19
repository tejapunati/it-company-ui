import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert" [ngClass]="{'alert-success': status === 'UP', 'alert-danger': status === 'DOWN'}">
      <h4>Status: {{ status }}</h4>
      <p *ngIf="message">{{ message }}</p>
      <p *ngIf="error">Error: {{ error }}</p>
    </div>
  `,
  styles: []
})
export class ConnectionStatusComponent {
  @Input() status: string = '';
  @Input() message: string = '';
  @Input() error: string = '';
}