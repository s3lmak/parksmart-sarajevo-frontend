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

  deleteParking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createParking(parking: Partial<Parking>): Observable<Parking> {
    return this.http.post<Parking>(this.apiUrl, parking);
  }

  updateParking(id: string, parking: Partial<Parking>): Observable<Parking> {
    return this.http.put<Parking>(`${this.apiUrl}/${id}`, parking);
  }

}
