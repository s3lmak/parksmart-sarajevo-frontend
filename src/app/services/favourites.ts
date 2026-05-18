import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Favourite {
  id?: number | string;
  userId: string;
  parkingId: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private readonly apiUrl = `${environment.apiUrl}/api/favourites`;

  constructor(private http: HttpClient) {}

  getFavourites(userId: string): Observable<Favourite[]> {
    return this.http.get<Favourite[]>(`${this.apiUrl}/${userId}`);
  }

  addFavourite(userId: string, parkingId: string): Observable<Favourite> {
    return this.http.post<Favourite>(this.apiUrl, { userId, parkingId });
  }

  removeFavourite(userId: string, parkingId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${parkingId}`);
  }

  isFavourite(userId: string, parkingId: string): Observable<boolean> {
    return this.getFavourites(userId).pipe(
      map(favs => favs.some(f => f.parkingId === parkingId))
    );
  }
}
