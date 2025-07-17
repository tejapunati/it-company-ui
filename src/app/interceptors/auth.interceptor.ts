import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // For Spring Security, we don't need to add Authorization header
  // as it uses cookies (JSESSIONID) for authentication
  // We'll just pass the request through
  
  // Log the request for debugging
  console.log(`Sending ${req.method} request to ${req.url}`);
  
  return next(req);
};