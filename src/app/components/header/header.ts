import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  isMenuOpen = false;
  
  constructor(private authService: AuthService, private elementRef: ElementRef) {}
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  
  isUser(): boolean {
    return this.authService.isUser();
  }
  
  logout() {
    this.authService.logout();
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Only process if menu is open
    if (!this.isMenuOpen) return;
    
    // Check if click is outside the menu and not on the menu toggle button
    const clickedInsideMenu = this.elementRef.nativeElement.querySelector('.main-nav').contains(event.target);
    const clickedOnMenuToggle = this.elementRef.nativeElement.querySelector('.menu-toggle').contains(event.target);
    
    if (!clickedInsideMenu && !clickedOnMenuToggle) {
      this.isMenuOpen = false;
    }
  }
}