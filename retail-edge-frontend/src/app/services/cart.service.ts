import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'retail_edge_cart';
  
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  readonly items = this.cartItems.asReadonly();
  readonly itemCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly total = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  constructor() {
    // Auto-save cart to localStorage when it changes
    effect(() => {
      localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems()));
    });
  }

  private loadCartFromStorage(): CartItem[] {
    const cartJson = localStorage.getItem(this.CART_KEY);
    if (cartJson) {
      try {
        return JSON.parse(cartJson);
      } catch {
        return [];
      }
    }
    return [];
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      this.cartItems.set([...currentItems, { product, quantity }]);
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.cartItems.set(updatedItems);
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems();
    this.cartItems.set(currentItems.filter(item => item.product.id !== productId));
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item?.quantity ?? 0;
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
