import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, ProductRequest } from '../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-page">
      <!-- Header -->
      <div class="page-header">
        <div class="search-filters">
          <input 
            type="text" 
            class="form-input search-input" 
            placeholder="Search by name or category..." 
            [(ngModel)]="searchTerm"
            (input)="filterProducts()"
          />
          <select class="form-input form-select category-filter" [(ngModel)]="selectedCategory" (change)="filterProducts()">
            <option value="">All Categories</option>
            @for (cat of categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>
        @if (isAdmin()) {
          <button class="btn btn-primary" (click)="openAddModal()">Add Product</button>
        }
      </div>
      
      <!-- Admin Table View -->
      @if (isAdmin()) {
        <div class="card">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of filteredProducts(); track product.id) {
                  <tr>
                    <td>
                      <div class="product-cell">
                        @if (product.imageUrl) {
                          <img [src]="product.imageUrl" [alt]="product.name" class="product-img" />
                        } @else {
                          <div class="product-img-placeholder">{{ product.name.charAt(0) }}</div>
                        }
                        <span>{{ product.name }}</span>
                      </div>
                    </td>
                    <td>{{ product.category }}</td>
                    <td>₹{{ product.price.toLocaleString('en-IN') }}</td>
                    <td>
                      <span>{{ product.stock }}</span>
                      @if (product.stock <= product.lowStockThreshold) {
                        <span class="badge badge-warning low-stock-badge">Low Stock</span>
                      }
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn btn-ghost btn-sm" (click)="openEditModal(product)">Edit</button>
                        <button class="btn btn-ghost btn-sm text-error" (click)="deleteProduct(product)">Delete</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="text-center text-muted">No products found</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <!-- User Card Grid View -->
        <div class="products-grid">
          @for (product of filteredProducts(); track product.id) {
            <div class="card card-elevated product-card">
              @if (product.imageUrl) {
                <img [src]="product.imageUrl" [alt]="product.name" class="product-card-img" />
              } @else {
                <div class="product-card-img-placeholder">
                  <span>{{ product.name.charAt(0) }}</span>
                </div>
              }
              <div class="product-card-body">
                <h4 class="product-card-name">{{ product.name }}</h4>
                <span class="product-card-category">{{ product.category }}</span>
                <span class="product-card-price">₹{{ product.price.toLocaleString('en-IN') }}</span>
                
                @if (getCartQuantity(product.id) > 0) {
                  <div class="quantity-controls">
                    <button class="qty-btn" (click)="decrementQuantity(product)">−</button>
                    <span class="qty-value">{{ getCartQuantity(product.id) }}</span>
                    <button class="qty-btn" (click)="incrementQuantity(product)">+</button>
                  </div>
                } @else {
                  <button class="btn btn-primary w-full" (click)="addToCart(product)">Add to Cart</button>
                }
              </div>
            </div>
          } @empty {
            <p class="text-center text-muted">No products found</p>
          }
        </div>
      }
      
      <!-- Product Modal -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">{{ editingProduct() ? 'Edit Product' : 'Add Product' }}</h3>
              <button class="modal-close" (click)="closeModal()">&times;</button>
            </div>
            <form (ngSubmit)="saveProduct()">
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-input" [(ngModel)]="formData.name" name="name" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <input type="text" class="form-input" [(ngModel)]="formData.category" name="category" required />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Price</label>
                    <input type="number" class="form-input" [(ngModel)]="formData.price" name="price" min="0" step="0.01" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Stock</label>
                    <input type="number" class="form-input" [(ngModel)]="formData.stock" name="stock" min="0" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Low Stock Threshold</label>
                  <input type="number" class="form-input" [(ngModel)]="formData.lowStockThreshold" name="lowStockThreshold" min="0" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Image URL</label>
                  <input type="url" class="form-input" [(ngModel)]="formData.imageUrl" name="imageUrl" />
                </div>
                @if (formData.imageUrl) {
                  <div class="image-preview">
                    <img [src]="formData.imageUrl" alt="Preview" />
                  </div>
                }
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  @if (saving()) {
                    <span class="spinner"></span>
                  }
                  {{ editingProduct() ? 'Save Changes' : 'Add Product' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    
    .search-filters {
      display: flex;
      gap: 1rem;
      flex: 1;
    }
    
    .search-input {
      max-width: 300px;
    }
    
    .category-filter {
      width: 180px;
    }
    
    /* Table Styles */
    .product-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .product-img {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      object-fit: cover;
    }
    
    .product-img-placeholder {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    .low-stock-badge {
      margin-left: 0.5rem;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    
    /* Card Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .product-card {
      padding: 0;
      overflow: hidden;
    }
    
    .product-card-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }
    
    .product-card-img-placeholder {
      width: 100%;
      height: 180px;
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    
    .product-card-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .product-card-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .product-card-category {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .product-card-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--primary);
      margin: 0.5rem 0;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      padding: 0.5rem;
    }
    
    .qty-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: var(--primary);
      color: white;
      border-radius: var(--radius-sm);
      font-size: 1.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .qty-btn:hover {
      background: var(--primary-dark);
    }
    
    .qty-value {
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }
    
    /* Modal */
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .image-preview {
      margin-top: 0.5rem;
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    
    .image-preview img {
      width: 100%;
      max-height: 150px;
      object-fit: cover;
    }
    
    @media (max-width: 640px) {
      .search-filters {
        flex-direction: column;
      }
      
      .search-input,
      .category-filter {
        max-width: 100%;
        width: 100%;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  products = signal<Product[]>([]);
  searchTerm = '';
  selectedCategory = '';
  
  showModal = signal(false);
  editingProduct = signal<Product | null>(null);
  saving = signal(false);
  
  formData: ProductRequest = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    lowStockThreshold: 10,
    imageUrl: ''
  };

  isAdmin = this.authService.isAdmin;

  categories = computed(() => {
    const cats = new Set(this.products().map(p => p.category));
    return Array.from(cats);
  });

  filteredProducts = computed(() => {
    let result = this.products();
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
      );
    }
    
    if (this.selectedCategory) {
      result = result.filter(p => p.category === this.selectedCategory);
    }
    
    return result;
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  filterProducts(): void {
    // Trigger computed signal recalculation
    this.products.update(p => [...p]);
  }

  // Cart methods for user view
  getCartQuantity(productId: string): number {
    return this.cartService.getItemQuantity(productId);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  incrementQuantity(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  decrementQuantity(product: Product): void {
    const currentQty = this.getCartQuantity(product.id);
    this.cartService.updateQuantity(product.id, currentQty - 1);
  }

  // Admin modal methods
  openAddModal(): void {
    this.editingProduct.set(null);
    this.formData = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
      imageUrl: ''
    };
    this.showModal.set(true);
  }

  openEditModal(product: Product): void {
    this.editingProduct.set(product);
    this.formData = {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      imageUrl: product.imageUrl || ''
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProduct.set(null);
  }

  saveProduct(): void {
    this.saving.set(true);
    const editing = this.editingProduct();
    
    if (editing) {
      this.productService.updateProduct(editing.id, this.formData).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Failed to update product:', err);
        }
      });
    } else {
      this.productService.createProduct(this.formData).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          this.saving.set(false);
          console.error('Failed to create product:', err);
        }
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Failed to delete product:', err)
      });
    }
  }
}
