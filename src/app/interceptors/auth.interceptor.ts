import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Skip token for health check and public endpoints
  const isPublicEndpoint = req.url.includes('/health') || 
                          req.url.includes('/auth/login') || 
                          req.url.includes('/auth/register');
  
  // For direct-emails endpoint, use a special approach
  if ((req.url.includes('/direct-emails/') || req.url.includes('/emails/')) && !req.url.includes('token=')) {
    // For email endpoints, add token in query parameter only if not already present
    const separator = req.url.includes('?') ? '&' : '?';
    const url = `${req.url}${separator}token=${token}`;
    req = req.clone({
      url,
      setHeaders: {
        'Authorization': `Bearer ${token}`,  // Add Authorization header as well
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  } 
  // Clone the request and add the token if available and not a public endpoint
  else if (token && !isPublicEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  } else if (!isPublicEndpoint) {
    // For non-public endpoints without token, still set content type
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
  
  return next(req).pipe(
    catchError(error => {
      // Log authentication errors but don't redirect
      if (error.status === 401) {
        console.warn('Authentication error:', req.url);
      }
      return throwError(() => error);
    })
  );
};