import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-page">
      <!-- User Info -->
      <div class="card user-info">
        <div class="user-avatar">
          {{ currentUser()?.name?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div class="user-details">
          <h2>{{ currentUser()?.name }}</h2>
          <p>{{ currentUser()?.email }}</p>
        </div>
      </div>
      
      <!-- Order History -->
      <div class="card order-history">
        <h3 class="section-title">Order History</h3>
        
        @if (loading()) {
          <div class="loading-state">
            <span class="spinner"></span>
            <span>Loading orders...</span>
          </div>
        } @else if (orders().length === 0) {
          <div class="empty-state">
            <p>You haven't placed any orders yet.</p>
          </div>
        } @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (order of orders(); track order.id) {
                  <tr>
                    <td class="order-id">#{{ order.id.substring(0, 8) }}</td>
                    <td>{{ order.date }}</td>
                    <td>{{ order.items.length }} item(s)</td>
                    <td>₹{{ order.total.toLocaleString('en-IN') }}</td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    /* User Info */
    .user-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .user-avatar {
      width: 80px;
      height: 80px;
      background: var(--primary);
      color: white;
      font-size: 2rem;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-details h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .user-details p {
      color: var(--text-secondary);
    }
    
    /* Order History */
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .order-id {
      font-family: monospace;
      font-weight: 600;
    }
    
    .loading-state,
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
      color: var(--text-secondary);
    }
    
    .badge-success {
      background: #dcfce7;
      color: #166534;
    }
    
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    
    .badge-error {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .badge-info {
      background: #dbeafe;
      color: #1e40af;
    }
    
    .badge-neutral {
      background: #f1f5f9;
      color: #64748b;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  loading = signal(true);

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'SHIPPED': return 'badge-info';
      case 'PROCESSING': return 'badge-warning';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-neutral';
    }
  }
}
