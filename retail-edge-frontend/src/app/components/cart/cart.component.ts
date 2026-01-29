import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page">
      @if (items().length === 0) {
        <div class="empty-cart card">
          <div class="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Browse our products and add items to your cart.</p>
          <a routerLink="/products" class="btn btn-primary">Shop Now</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-items">
            <div class="card">
              <h3 class="section-title">Cart Items ({{ itemCount() }})</h3>
              @for (item of items(); track item.product.id) {
                <div class="cart-item">
                  @if (item.product.imageUrl) {
                    <img [src]="item.product.imageUrl" [alt]="item.product.name" class="item-img" />
                  } @else {
                    <div class="item-img-placeholder">{{ item.product.name.charAt(0) }}</div>
                  }
                  <div class="item-details">
                    <h4 class="item-name">{{ item.product.name }}</h4>
                    <span class="item-category">{{ item.product.category }}</span>
                    <span class="item-price">₹{{ item.product.price.toLocaleString('en-IN') }}</span>
                  </div>
                  <div class="item-actions">
                    <div class="quantity-controls">
                      <button class="qty-btn" (click)="decrementQuantity(item.product.id, item.quantity)">−</button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="incrementQuantity(item.product.id, item.quantity)">+</button>
                    </div>
                    <span class="item-subtotal">₹{{ (item.product.price * item.quantity).toLocaleString('en-IN') }}</span>
                    <button class="remove-btn" (click)="removeItem(item.product.id)" title="Remove">
                      🗑️
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <div class="cart-summary card">
            <h3 class="section-title">Order Summary</h3>
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
            <button class="btn btn-primary btn-lg w-full" (click)="proceedToCheckout()">
              Proceed to Checkout
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .empty-cart h2 {
      margin-bottom: 0.5rem;
    }
    
    .empty-cart p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 1.5rem;
      align-items: start;
    }
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    /* Cart Items */
    .cart-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    .cart-item:last-child {
      border-bottom: none;
    }
    
    .item-img {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      object-fit: cover;
    }
    
    .item-img-placeholder {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    
    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .item-name {
      font-size: 1rem;
      font-weight: 600;
    }
    
    .item-category {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .item-price {
      font-size: 0.875rem;
      color: var(--primary);
      font-weight: 500;
    }
    
    .item-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      padding: 0.25rem;
    }
    
    .qty-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: var(--bg-primary);
      color: var(--text-primary);
      border-radius: var(--radius-sm);
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }
    
    .qty-btn:hover {
      background: var(--primary);
      color: white;
    }
    
    .qty-value {
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }
    
    .item-subtotal {
      font-weight: 700;
      min-width: 100px;
      text-align: right;
    }
    
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      opacity: 0.6;
      transition: opacity var(--transition-fast);
    }
    
    .remove-btn:hover {
      opacity: 1;
    }
    
    /* Summary */
    .cart-summary {
      position: sticky;
      top: calc(var(--header-height) + 2rem);
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      font-size: 0.9375rem;
    }
    
    .summary-row.total {
      font-size: 1.125rem;
      font-weight: 700;
    }
    
    .summary-divider {
      height: 1px;
      background: var(--border-color);
      margin: 0.5rem 0;
    }
    
    .cart-summary .btn {
      margin-top: 1.5rem;
    }
    
    @media (max-width: 1024px) {
      .cart-layout {
        grid-template-columns: 1fr;
      }
      
      .cart-summary {
        position: static;
      }
    }
    
    @media (max-width: 640px) {
      .cart-item {
        flex-wrap: wrap;
      }
      
      .item-actions {
        width: 100%;
        justify-content: space-between;
        padding-top: 0.5rem;
      }
    }
  `]
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);

  items = this.cartService.items;
  itemCount = this.cartService.itemCount;
  total = this.cartService.total;

  incrementQuantity(productId: string, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decrementQuantity(productId: string, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
