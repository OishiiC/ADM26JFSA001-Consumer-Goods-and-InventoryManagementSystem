import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeyMetrics, SalesData, TopProduct } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<KeyMetrics> {
    return this.http.get<KeyMetrics>(`${this.API_URL}/metrics`);
  }

  getSalesData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Observable<SalesData[]> {
    const params = new HttpParams().set('period', period);
    return this.http.get<SalesData[]>(`${this.API_URL}/sales`, { params });
  }

  getTopProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.API_URL}/top-products`);
  }
}
