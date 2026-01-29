import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest, UpdateOrderStatusRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: OrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/place`, order);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/my-orders`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL);
  }

  updateOrderStatus(orderId: string, request: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.put<Order>(`${this.API_URL}/${orderId}/status`, request);
  }
}
