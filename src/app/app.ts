import { Component } from '@angular/core';
import { RouterOutlet, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf], // ✅ ADD NgIf HERE
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
