import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-page">
      <div class="inventory-grid">
        @for (item of inventory(); track item.productId; let i = $index) {
          <div class="card inventory-card">
            <div class="inventory-header">
              <h4 class="product-name">{{ item.productName }}</h4>
              <span class="product-id">#p{{ i + 1 }}</span>
            </div>
            
            <div class="donut-container">
              <svg viewBox="0 0 100 100" class="donut-chart">
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  stroke-width="12"
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  [attr.stroke]="getStockColor(item)"
                  stroke-width="12"
                  [attr.stroke-dasharray]="getStrokeDasharray(item)"
                  stroke-dashoffset="62.8"
                  stroke-linecap="round"
                  class="donut-fill"
                />
              </svg>
              <div class="donut-center">
                <span class="stock-value">{{ item.stock }}</span>
                <span class="stock-label">Units</span>
              </div>
            </div>
            
            <div class="status-badge-container">
              <span class="badge" [ngClass]="getStatusClass(item)">
                {{ item.stock <= item.lowStockThreshold ? 'Low Stock' : 'In Stock' }}
              </span>
            </div>
            
            <div class="threshold-row">
              <span class="threshold-label">Threshold: {{ item.lowStockThreshold }}</span>
              <button class="edit-btn" (click)="openEditModal(item)" title="Edit threshold">
                ✏️
              </button>
            </div>
          </div>
        } @empty {
          <p class="text-center text-muted">No inventory items found</p>
        }
      </div>
      
      <!-- Edit Threshold Modal -->
      @if (editingItem()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Edit Low Stock Threshold</h3>
              <button class="modal-close" (click)="closeModal()">&times;</button>
            </div>
            <form (ngSubmit)="saveThreshold()">
              <div class="modal-body">
                <p class="modal-description">Update threshold for <strong>{{ editingItem()!.productName }}</strong></p>
                <div class="form-group">
                  <label class="form-label">Threshold</label>
                  <input 
                    type="number" 
                    class="form-input" 
                    [(ngModel)]="newThreshold" 
                    name="threshold" 
                    min="0" 
                    required 
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  @if (saving()) {
                    <span class="spinner"></span>
                  }
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .inventory-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .inventory-header {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .product-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
    
    .product-id {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    
    /* Donut Chart */
    .donut-container {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 1rem 0;
    }
    
    .donut-chart {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    
    .donut-fill {
      transition: stroke-dasharray var(--transition-normal);
    }
    
    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stock-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .stock-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .status-badge-container {
      margin: 0.75rem 0;
    }
    
    .badge-success {
      background: #dcfce7;
      color: #166534;
    }
    
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    
    .threshold-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: auto;
    }
    
    .threshold-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .edit-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.25rem;
      opacity: 0.7;
      transition: opacity var(--transition-fast);
    }
    
    .edit-btn:hover {
      opacity: 1;
    }
    
    .modal-description {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
  `]
})
export class InventoryComponent implements OnInit {
  inventory = signal<InventoryItem[]>([]);
  editingItem = signal<InventoryItem | null>(null);
  newThreshold = 0;
  saving = signal(false);

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe({
      next: (data) => this.inventory.set(data),
      error: (err) => console.error('Failed to load inventory:', err)
    });
  }

  getStockColor(item: InventoryItem): string {
    const ratio = item.stock / (item.lowStockThreshold * 3);
    if (ratio <= 0.33) return '#ef4444'; // red
    if (ratio <= 0.66) return '#f59e0b'; // yellow
    return '#22c55e'; // green
  }

  getStrokeDasharray(item: InventoryItem): string {
    const circumference = 2 * Math.PI * 40; // ~251.3
    const maxStock = item.lowStockThreshold * 3;
    const percentage = Math.min(item.stock / maxStock, 1);
    const filled = circumference * percentage;
    return `${filled} ${circumference}`;
  }

  getStatusClass(item: InventoryItem): string {
    return item.stock <= item.lowStockThreshold ? 'badge-warning' : 'badge-success';
  }

  openEditModal(item: InventoryItem): void {
    this.editingItem.set(item);
    this.newThreshold = item.lowStockThreshold;
  }

  closeModal(): void {
    this.editingItem.set(null);
  }

  saveThreshold(): void {
    const item = this.editingItem();
    if (!item) return;
    
    this.saving.set(true);
    this.inventoryService.updateThreshold(item.productId, { threshold: this.newThreshold }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadInventory();
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Failed to update threshold:', err);
      }
    });
  }
}
