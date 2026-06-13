import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  createReservation(userId: string, parkingId: string, startTime: string, endTime: string): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, { userId, parkingId, startTime, endTime });
  }

  getReservationsByUserId(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }

  getActiveReservations(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}/active`);
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
