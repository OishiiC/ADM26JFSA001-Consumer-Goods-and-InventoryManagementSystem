import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-page">
      @if (orderPlaced()) {
        <div class="success-card card">
          <div class="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <button class="btn btn-primary" (click)="continueShopping()">Continue Shopping</button>
        </div>
      } @else {
        <div class="payment-layout">
          <!-- Payment Form -->
          <div class="payment-form card">
            <h3 class="section-title">Payment Details</h3>
            
            <form (ngSubmit)="processPayment()">
              <div class="form-group">
                <label class="form-label">Card Number</label>
                <input 
                  type="text" 
                  class="form-input" 
                  [(ngModel)]="cardNumber" 
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expiry Date</label>
                  <input 
                    type="text" 
                    class="form-input" 
                    [(ngModel)]="expiryDate" 
                    name="expiryDate"
                    placeholder="MM/YY"
                    maxlength="5"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">CVV</label>
                  <input 
                    type="text" 
                    class="form-input" 
                    [(ngModel)]="cvv" 
                    name="cvv"
                    placeholder="123"
                    maxlength="3"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Cardholder Name</label>
                <input 
                  type="text" 
                  class="form-input" 
                  [(ngModel)]="cardholderName" 
                  name="cardholderName"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              @if (error()) {
                <div class="api-error">{{ error() }}</div>
              }
              
              <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="processing()">
                @if (processing()) {
                  <span class="spinner"></span>
                  Processing Payment...
                } @else {
                  Pay ₹{{ total().toLocaleString('en-IN') }}
                }
              </button>
            </form>
          </div>
          
          <!-- Order Summary -->
          <div class="order-summary card">
            <h3 class="section-title">Order Summary</h3>
            
            <div class="summary-items">
              @for (item of items(); track item.product.id) {
                <div class="summary-item">
                  <span class="item-name">{{ item.product.name }} × {{ item.quantity }}</span>
                  <span class="item-total">₹{{ (item.product.price * item.quantity).toLocaleString('en-IN') }}</span>
                </div>
              }
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹{{ total().toLocaleString('en-IN') }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="text-success">Free</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span>₹{{ total().toLocaleString('en-IN') }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .payment-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1.5rem;
      align-items: start;
    }
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .api-error {
      background: var(--error-bg);
      color: var(--error);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    
    /* Order Summary */
    .order-summary {
      position: sticky;
      top: calc(var(--header-height) + 2rem);
    }
    
    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }
    
    .item-name {
      color: var(--text-secondary);
    }
    
    .summary-divider {
      height: 1px;
      background: var(--border-color);
      margin: 1rem 0;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.9375rem;
    }
    
    .summary-row.total {
      font-size: 1.125rem;
      font-weight: 700;
    }
    
    /* Success State */
    .success-card {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .success-icon {
      width: 80px;
      height: 80px;
      background: var(--success);
      color: white;
      font-size: 2.5rem;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    
    .success-card h2 {
      margin-bottom: 0.5rem;
    }
    
    .success-card p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 1024px) {
      .payment-layout {
        grid-template-columns: 1fr;
      }
      
      .order-summary {
        position: static;
        order: -1;
      }
    }
  `]
})
export class PaymentComponent {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cardNumber = '';
  expiryDate = '';
  cvv = '';
  cardholderName = '';
  
  processing = signal(false);
  error = signal<string | null>(null);
  orderPlaced = signal(false);

  items = this.cartService.items;
  total = this.cartService.total;

  processPayment(): void {
    this.error.set(null);
    
    // Basic validation
    if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardholderName) {
      this.error.set('Please fill in all payment details');
      return;
    }
    
    this.processing.set(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      // Create order request
      const orderItems = this.items().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));
      
      this.orderService.placeOrder({ items: orderItems }).subscribe({
        next: () => {
          this.processing.set(false);
          this.orderPlaced.set(true);
          this.cartService.clearCart();
        },
        error: (err) => {
          this.processing.set(false);
          this.error.set(err.error?.message || 'Failed to place order');
        }
      });
    }, 2000);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
