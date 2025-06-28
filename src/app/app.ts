// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'it-company-ui';
  isMenuOpen: boolean = false; // ✅ Make sure this property is declared and initialized

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // ✅ Make sure this method is defined and toggles the property
    console.log('Menu toggled:', this.isMenuOpen); // Add for debugging
  }
}