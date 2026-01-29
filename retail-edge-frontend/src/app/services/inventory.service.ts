import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem, UpdateThresholdRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly API_URL = 'http://localhost:8080/api/inventory';

  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.API_URL);
  }

  updateThreshold(productId: string, request: UpdateThresholdRequest): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.API_URL}/${productId}/threshold`, request);
  }
}
