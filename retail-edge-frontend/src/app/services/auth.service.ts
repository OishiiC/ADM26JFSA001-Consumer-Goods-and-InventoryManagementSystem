import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'retail_edge_token';
  private readonly USER_KEY = 'retail_edge_user';

  private userSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userSignal());
  readonly isAdmin = computed(() => this.userSignal()?.roles?.includes('ROLE_ADMIN') ?? false);

  constructor(private http: HttpClient, private router: Router) {}

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  register(data: RegisterRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  private saveAuthData(response: JwtResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    const user: User = {
      id: response.id,
      email: response.email,
      name: response.name,
      roles: response.roles
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
