// User and Auth models
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  id: string;
  email: string;
  name: string;
  roles: string[];
}

// Product models
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  lowStockThreshold: number;
}

export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  lowStockThreshold: number;
}

// Order models
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// Inventory models
export interface InventoryItem {
  productId: string;
  productName: string;
  stock: number;
  lowStockThreshold: number;
}

export interface UpdateThresholdRequest {
  threshold: number;
}

// Dashboard models
export interface KeyMetrics {
  totalRevenue: number;
  totalOrders: number;
  newCustomers: number;
}

export interface SalesData {
  period: string;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  unitsSold: number;
}

// Cart models (client-side only)
export interface CartItem {
  product: Product;
  quantity: number;
}
