import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parking } from '../models/parking';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private apiUrl = `${environment.apiUrl}/api/parkings`;
  private searchUrl = `${environment.apiUrl}/api/search`;

  constructor(private http: HttpClient) {}

  getParkings(): Observable<Parking[]> {
    return this.http.get<Parking[]>(this.apiUrl);
  }

  getParkingById(id: string): Observable<Parking> {
    return this.http.get<Parking>(`${this.apiUrl}/${id}`);
  }

  getFilteredParkings(zone?: string, status?: string, maxPrice?: number): Observable<Parking[]> {
    if (zone) return this.http.get<Parking[]>(`${this.searchUrl}/zone/${zone}`);
    if (status) return this.http.get<Parking[]>(`${this.searchUrl}/status/${status}`);
    if (maxPrice) return this.http.get<Parking[]>(`${this.searchUrl}/price?maxPrice=${maxPrice}`);
    return this.http.get<Parking[]>(this.apiUrl);
  }
}
