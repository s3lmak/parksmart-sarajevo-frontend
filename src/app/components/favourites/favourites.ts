import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Parking } from '../../models/parking';
import { FavouritesService } from '../../services/favourites';
import { ParkingService } from '../../services/parking';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-favourites',
  imports: [CommonModule, RouterModule],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class FavouritesComponent implements OnInit {
  favourites: Parking[] = [];
  private userId: string = '';

  constructor(
    private favouritesService: FavouritesService,
    private parkingService: ParkingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.userId = user.id;
    this.loadFavourites();
  }

  loadFavourites(): void {
    forkJoin({
      favs: this.favouritesService.getFavourites(this.userId),
      parkings: this.parkingService.getParkings()
    }).subscribe(({ favs, parkings }) => {
      const favouriteIds = new Set(favs.map(f => f.parkingId));
      this.favourites = parkings.filter(p => favouriteIds.has(p.id));
    });
  }

  remove(parkingId: string): void {
    this.favouritesService.removeFavourite(this.userId, parkingId).subscribe(() => {
      this.favourites = this.favourites.filter(p => p.id !== parkingId);
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      available: 'Available',
      limited: 'Limited',
      full: 'Full'
    };
    return labels[status] || status;
  }
}
