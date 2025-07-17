import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isAdmin = this.authService.isAdmin();
    console.log('AdminGuard check - isLoggedIn:', isLoggedIn, 'isAdmin:', isAdmin);
    console.log('Current user:', this.authService.getCurrentUser());
    
    if (isLoggedIn && isAdmin) {
      console.log('AdminGuard: Access granted');
      return true;
    }
    
    console.log('AdminGuard: Access denied, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ParentAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isParentAdmin = this.authService.isParentAdmin();
    console.log('ParentAdminGuard check - isLoggedIn:', isLoggedIn, 'isParentAdmin:', isParentAdmin);
    console.log('Current user:', this.authService.getCurrentUser());
    
    if (isLoggedIn && isParentAdmin) {
      console.log('ParentAdminGuard: Access granted');
      return true;
    }
    
    console.log('ParentAdminGuard: Access denied, redirecting to admin dashboard');
    this.router.navigate(['/admin-dashboard']);
    return false;
  }
}