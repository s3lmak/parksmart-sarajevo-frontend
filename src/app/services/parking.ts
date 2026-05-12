import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parking } from '../models/parking';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  private apiUrl = 'http://localhost:8080/api/parkings';

  constructor(private http: HttpClient) {}

  getParkings(): Observable<Parking[]> {
    return this.http.get<Parking[]>(this.apiUrl);
  }

  getParkingById(id: string): Observable<Parking> {
    return this.http.get<Parking>(`${this.apiUrl}/${id}`);
  }

  getFilteredParkings(zone?: string, status?: string, maxPrice?: number): Observable<Parking[]> {
    let url = 'http://localhost:8080/api/search';
    if (zone) return this.http.get<Parking[]>(`${url}/zone/${zone}`);
    if (status) return this.http.get<Parking[]>(`${url}/status/${status}`);
    if (maxPrice) return this.http.get<Parking[]>(`${url}/price?maxPrice=${maxPrice}`);
    return this.http.get<Parking[]>(this.apiUrl);
  }

  getZones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/zones`);
  }
}
