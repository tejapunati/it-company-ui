import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css'
})
export class AboutusComponent {}