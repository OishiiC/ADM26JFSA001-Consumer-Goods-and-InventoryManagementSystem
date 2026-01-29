import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { KeyMetrics, SalesData, TopProduct } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="dashboard">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="card kpi-card">
          <span class="kpi-label">Total Revenue</span>
          <span class="kpi-value">₹{{ formatNumber(metrics()?.totalRevenue || 0) }}</span>
        </div>
        <div class="card kpi-card">
          <span class="kpi-label">Total Orders</span>
          <span class="kpi-value">{{ metrics()?.totalOrders || 0 }}</span>
        </div>
        <div class="card kpi-card">
          <span class="kpi-label">New Customers</span>
          <span class="kpi-value">{{ metrics()?.newCustomers || 0 }}</span>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Sales Chart -->
        <div class="card chart-card">
          <div class="chart-header">
            <h3>Sales</h3>
            <div class="period-toggle">
              @for (period of periods; track period) {
                <button 
                  class="period-btn" 
                  [class.active]="selectedPeriod() === period"
                  (click)="selectPeriod(period)"
                >
                  {{ period | titlecase }}
                </button>
              }
            </div>
          </div>
          <div class="chart-container">
            @if (chartData()) {
              <canvas baseChart
                [data]="chartData()!"
                [options]="chartOptions"
                [type]="'line'">
              </canvas>
            }
          </div>
        </div>
        
        <!-- Top Products -->
        <div class="card top-products-card">
          <h3>Top Products</h3>
          <div class="products-list">
            @for (product of topProducts(); track product.productId) {
              <div class="product-item">
                <div class="product-avatar" [style.background]="getAvatarColor($index)">
                  {{ product.productName.charAt(0).toUpperCase() }}
                </div>
                <div class="product-info">
                  <span class="product-name">{{ product.productName }}</span>
                  <span class="product-sales">{{ product.unitsSold }} units sold</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .kpi-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .kpi-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .kpi-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    
    /* Chart Card */
    .chart-card {
      display: flex;
      flex-direction: column;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .chart-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .period-toggle {
      display: flex;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      padding: 0.25rem;
    }
    
    .period-btn {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 500;
      background: none;
      border: none;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    
    .period-btn:hover {
      color: var(--text-primary);
    }
    
    .period-btn.active {
      background: var(--bg-primary);
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }
    
    .chart-container {
      flex: 1;
      min-height: 300px;
    }
    
    /* Top Products */
    .top-products-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    
    .products-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .product-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .product-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
      color: white;
    }
    
    .product-info {
      display: flex;
      flex-direction: column;
    }
    
    .product-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .product-sales {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  periods = ['daily', 'weekly', 'monthly', 'yearly'] as const;
  selectedPeriod = signal<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  
  metrics = signal<KeyMetrics | null>(null);
  salesData = signal<SalesData[]>([]);
  topProducts = signal<TopProduct[]>([]);

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₹' + this.formatNumber(Number(value))
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  chartData = computed(() => {
    const data = this.salesData();
    if (!data.length) return null;
    
    return {
      labels: data.map(d => d.period),
      datasets: [{
        data: data.map(d => d.revenue),
        borderColor: '#0d9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        fill: true,
        pointBackgroundColor: '#0d9488',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    };
  });

  constructor() {}

  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.loadMetrics();
    this.loadSalesData();
    this.loadTopProducts();
  }

  loadMetrics(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data) => this.metrics.set(data),
      error: (err) => console.error('Failed to load metrics:', err)
    });
  }

  loadSalesData(): void {
    this.dashboardService.getSalesData(this.selectedPeriod()).subscribe({
      next: (data) => this.salesData.set(data),
      error: (err) => console.error('Failed to load sales data:', err)
    });
  }

  loadTopProducts(): void {
    this.dashboardService.getTopProducts().subscribe({
      next: (data) => this.topProducts.set(data),
      error: (err) => console.error('Failed to load top products:', err)
    });
  }

  selectPeriod(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    this.selectedPeriod.set(period);
    this.loadSalesData();
  }

  formatNumber(num: number): string {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(2) + ' L';
    } else if (num >= 1000) {
      return num.toLocaleString('en-IN');
    }
    return num.toString();
  }

  getAvatarColor(index: number): string {
    const colors = ['#0d9488', '#0891b2', '#f59e0b', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  }
}
