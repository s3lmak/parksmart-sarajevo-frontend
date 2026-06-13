import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Review } from '../models/review';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  getReviewsByParkingId(parkingId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/parking/${parkingId}`);
  }

  getAverageRating(parkingId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/parking/${parkingId}/average`);
  }

  addReview(userId: string, parkingId: string, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, { userId, parkingId, rating, comment });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  hasUserReviewed(userId: string, parkingId: string): Observable<boolean> {
    return this.getReviewsByParkingId(parkingId).pipe(
      map(reviews => reviews.some(r => String(r.userId) === userId))
    );
  }
}
