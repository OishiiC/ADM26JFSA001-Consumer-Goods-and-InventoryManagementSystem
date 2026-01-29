import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'inventory',
        loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
