import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Respuesta plana del endpoint de login. */
export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
  email: string;
}

/**
 * Gestiona autenticación JWT: login, logout, validate y estado de sesión.
 * Sin store global (NgRx): señal local + sessionStorage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'soaint_jwt';
  private readonly legacyTokenKey = 'orion_jwt';
  private validateInFlight$: Observable<void> | null = null;
  private loggingOut = false;
  readonly isAuthenticated = signal(false);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {
    this.migrateLegacyToken();
    // UI optimista; el authGuard es la fuente de verdad en rutas protegidas.
    this.isAuthenticated.set(!!this.getToken());
  }

  /** Migra el JWT almacenado bajo la clave anterior (orion_jwt). */
  private migrateLegacyToken(): void {
    const legacyToken = sessionStorage.getItem(this.legacyTokenKey);
    if (legacyToken && !sessionStorage.getItem(this.tokenKey)) {
      sessionStorage.setItem(this.tokenKey, legacyToken);
      sessionStorage.removeItem(this.legacyTokenKey);
    }
  }

  /** Inicia sesión contra API_A y persiste el JWT. */
  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          sessionStorage.setItem(this.tokenKey, res.token);
          this.isAuthenticated.set(true);
        }),
      );
  }

  /**
   * Valida el JWT con GET /auth/validate (Bearer vía jwtInterceptor).
   * Comparte la petición en vuelo para evitar validates duplicados.
   */
  validateToken(): Observable<void> {
    if (!this.validateInFlight$) {
      // responseType text: el endpoint responde 200 sin cuerpo (JSON vacío fallaría al parsear).
      this.validateInFlight$ = this.http
        .get(`${environment.apiUrl}/auth/validate`, { responseType: 'text' })
        .pipe(
          tap(() => this.isAuthenticated.set(true)),
          map(() => undefined),
          finalize(() => {
            this.validateInFlight$ = null;
          }),
          shareReplay({ bufferSize: 1, refCount: true }),
        );
    }
    return this.validateInFlight$;
  }

  /** Elimina el token sin navegar (p. ej. desde el guard). */
  clearSession(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
    this.validateInFlight$ = null;
  }

  /** Elimina el token y redirige al login (idempotente). */
  logout(): void {
    if (this.loggingOut) {
      return;
    }
    this.loggingOut = true;
    this.clearSession();
    void this.router.navigate(['/login']).finally(() => {
      this.loggingOut = false;
    });
  }

  /** Obtiene el JWT almacenado. */
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
}
