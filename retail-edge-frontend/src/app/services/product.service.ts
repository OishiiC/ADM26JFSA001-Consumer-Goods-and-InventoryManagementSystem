import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(search?: string, category?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    return this.http.get<Product[]>(this.API_URL, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  createProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  updateProduct(id: string, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
