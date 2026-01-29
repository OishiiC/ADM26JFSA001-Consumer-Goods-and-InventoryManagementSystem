import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <!-- Form Panel -->
      <div class="form-panel">
        <div class="form-content">
          <h1 class="form-title">Create Account</h1>
          <p class="form-subtitle">Join Retail Edge to get started.</p>
          
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="name">Full name</label>
              <input
                type="text"
                id="name"
                class="form-input"
                [class.error]="nameError()"
                [(ngModel)]="name"
                name="name"
                placeholder="John Doe"
                required
              />
              @if (nameError()) {
                <span class="form-error">{{ nameError() }}</span>
              }
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">Email address</label>
              <input
                type="email"
                id="email"
                class="form-input"
                [class.error]="emailError()"
                [(ngModel)]="email"
                name="email"
                placeholder="you@example.com"
                required
              />
              @if (emailError()) {
                <span class="form-error">{{ emailError() }}</span>
              }
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                type="password"
                id="password"
                class="form-input"
                [class.error]="passwordError()"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
              />
              @if (passwordError()) {
                <span class="form-error">{{ passwordError() }}</span>
              }
            </div>
            
            @if (apiError()) {
              <div class="api-error">{{ apiError() }}</div>
            }
            
            <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner"></span>
              }
              Create Account
            </button>
          </form>
          
          <p class="auth-switch">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </div>
      </div>
      
      <!-- Branding Panel -->
      <div class="branding-panel">
        <div class="branding-content">
          <div class="brand-logo">
            <span class="logo-icon">m</span>
            <span class="logo-text">Retail Edge</span>
          </div>
          <h2 class="brand-tagline">Start Your Retail Journey Today.</h2>
          <p class="brand-description">
            Create an account to explore our product catalog and start shopping.
          </p>
          <div class="brand-footer">
            © 2025 Retail Edge. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
    }
    
    .form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: var(--bg-primary);
    }
    
    .form-content {
      width: 100%;
      max-width: 400px;
    }
    
    .form-title {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    
    .form-subtitle {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }
    
    .auth-form {
      margin-bottom: 1.5rem;
    }
    
    .api-error {
      background: var(--error-bg);
      color: var(--error);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    
    .auth-switch {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .auth-switch a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    
    .auth-switch a:hover {
      text-decoration: underline;
    }
    
    .branding-panel {
      flex: 1;
      background: var(--primary-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
    }
    
    .branding-content {
      max-width: 400px;
      color: white;
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 3rem;
    }
    
    .brand-logo .logo-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.5rem;
    }
    
    .brand-logo .logo-text {
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .brand-tagline {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    
    .brand-description {
      font-size: 1rem;
      opacity: 0.9;
      line-height: 1.6;
    }
    
    .brand-footer {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.875rem;
      opacity: 0.7;
    }
    
    @media (max-width: 768px) {
      .auth-container {
        flex-direction: column-reverse;
      }
      
      .branding-panel {
        padding: 3rem 2rem;
      }
      
      .brand-tagline {
        font-size: 1.5rem;
      }
      
      .brand-footer {
        position: static;
        transform: none;
        margin-top: 2rem;
      }
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  
  loading = signal(false);
  nameError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  apiError = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.nameError.set(null);
    this.emailError.set(null);
    this.passwordError.set(null);
    this.apiError.set(null);

    // Validation
    if (!this.name || this.name.trim().length < 2) {
      this.nameError.set('Please enter your full name');
      return;
    }
    if (!this.email) {
      this.emailError.set('Email is required');
      return;
    }
    if (!this.email.includes('@')) {
      this.emailError.set('Please enter a valid email');
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading.set(false);
        this.apiError.set(err.error?.message || 'Failed to create account');
      }
    });
  }
}
