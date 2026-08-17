import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Ante 401/403 en rutas API autenticadas, limpia la sesión y redirige a /login.
 * Excluye login y validate para evitar bucles con credenciales inválidas o el guard.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const isAuthBootstrap =
          req.url.includes('/auth/login') || req.url.includes('/auth/validate');
        if (!isAuthBootstrap && (err.status === 401 || err.status === 403)) {
          auth.logout();
        }
      }
      return throwError(() => err);
    }),
  );
};
