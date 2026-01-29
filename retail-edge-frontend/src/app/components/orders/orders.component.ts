import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-page">
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id) {
                <tr>
                  <td class="order-id">#o{{ order.id.substring(0, 2) }}</td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ order.date }}</td>
                  <td>₹{{ order.total.toLocaleString('en-IN') }}</td>
                  <td>
                    <span class="badge" [ngClass]="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <select 
                      class="form-input form-select status-select"
                      [value]="''"
                      (change)="updateStatus(order, $event)"
                    >
                      <option value="" disabled selected>Select</option>
                      @for (status of statuses; track status) {
                        @if (status !== order.status) {
                          <option [value]="status">{{ status | titlecase }}</option>
                        }
                      }
                    </select>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center text-muted">No orders found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-id {
      font-family: monospace;
      font-weight: 600;
    }
    
    .status-select {
      width: 140px;
      padding: 0.5rem;
      font-size: 0.875rem;
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
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  
  statuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders.set(data),
      error: (err) => console.error('Failed to load orders:', err)
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

  updateStatus(order: Order, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as OrderStatus;
    
    if (!newStatus) return;
    
    this.orderService.updateOrderStatus(order.id, { status: newStatus }).subscribe({
      next: () => {
        this.loadOrders();
        select.value = '';
      },
      error: (err) => {
        console.error('Failed to update order status:', err);
        select.value = '';
      }
    });
  }
}
