import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout" [class.sidebar-collapsed]="sidebarCollapsed()">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="mobileMenuOpen()">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">m</span>
            @if (!sidebarCollapsed()) {
              <span class="logo-text">Retail Edge</span>
            }
          </div>
          <button class="collapse-btn" (click)="toggleSidebar()">
            <span class="collapse-icon">{{ sidebarCollapsed() ? '›' : '‹' }}</span>
          </button>
        </div>
        
        <nav class="sidebar-nav">
          @if (isAdmin()) {
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">Dashboard</span>
              }
            </a>
          }
          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📦</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-label">Products</span>
            }
          </a>
          @if (isAdmin()) {
            <a routerLink="/orders" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📋</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">Orders</span>
              }
            </a>
            <a routerLink="/inventory" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📈</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">Inventory</span>
              }
            </a>
          }
          @if (!isAdmin()) {
            <a routerLink="/cart" routerLinkActive="active" class="nav-item cart-item">
              <span class="nav-icon">🛒</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">Cart</span>
              }
              @if (cartCount() > 0) {
                <span class="cart-badge">{{ cartCount() }}</span>
              }
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👤</span>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">Profile</span>
              }
            </a>
          }
        </nav>
        
        <div class="sidebar-footer">
          <button class="logout-btn" (click)="logout()">
            <span class="nav-icon">🚪</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-label">Logout</span>
            }
          </button>
        </div>
      </aside>
      
      <!-- Mobile Overlay -->
      @if (mobileMenuOpen()) {
        <div class="mobile-overlay" (click)="closeMobileMenu()"></div>
      }
      
      <!-- Main Content -->
      <main class="main-content">
        <header class="content-header">
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">☰</button>
          <h1 class="page-title">{{ pageTitle() }}</h1>
        </header>
        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }
    
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-primary);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 100;
      transition: width var(--transition-normal);
    }
    
    .layout.sidebar-collapsed .sidebar {
      width: var(--sidebar-collapsed);
    }
    
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .logo-icon {
      width: 36px;
      height: 36px;
      background: var(--primary);
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
    }
    
    .logo-text {
      font-weight: 600;
      font-size: 1.125rem;
      color: var(--text-primary);
    }
    
    .collapse-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      color: var(--text-secondary);
      padding: 0.5rem;
    }
    
    .layout.sidebar-collapsed .collapse-btn {
      display: none;
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all var(--transition-fast);
      position: relative;
    }
    
    .nav-item:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }
    
    .nav-item.active {
      background: rgba(13, 148, 136, 0.1);
      color: var(--primary);
      border-right: 3px solid var(--primary);
    }
    
    .nav-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    
    .nav-label {
      font-size: 0.9375rem;
      font-weight: 500;
    }
    
    .layout.sidebar-collapsed .nav-item {
      justify-content: center;
      padding: 1rem;
    }
    
    .cart-item {
      position: relative;
    }
    
    .cart-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--primary);
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: all var(--transition-fast);
      border-radius: var(--radius-md);
    }
    
    .logout-btn:hover {
      background: var(--error-bg);
      color: var(--error);
    }
    
    .layout.sidebar-collapsed .logout-btn {
      justify-content: center;
    }
    
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin-left var(--transition-normal);
    }
    
    .layout.sidebar-collapsed .main-content {
      margin-left: var(--sidebar-collapsed);
    }
    
    .content-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 2rem;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    
    .page-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
    }
    
    .content-body {
      padding: 2rem;
    }
    
    .mobile-overlay {
      display: none;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: 280px;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .layout.sidebar-collapsed .sidebar {
        width: 280px;
      }
      
      .main-content,
      .layout.sidebar-collapsed .main-content {
        margin-left: 0;
      }
      
      .mobile-menu-btn {
        display: block;
      }
      
      .collapse-btn {
        display: none;
      }
      
      .mobile-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;
      }
      
      .content-header {
        padding: 1rem;
      }
      
      .content-body {
        padding: 1rem;
      }
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  mobileMenuOpen = signal(false);

  isAdmin = this.authService.isAdmin;
  cartCount = this.cartService.itemCount;

  pageTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard';
    if (url.includes('products')) return 'Products';
    if (url.includes('orders')) return 'Orders';
    if (url.includes('inventory')) return 'Inventory';
    if (url.includes('cart')) return 'Cart';
    if (url.includes('checkout')) return 'Checkout';
    if (url.includes('profile')) return 'Profile';
    return 'Retail Edge';
  });

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}

