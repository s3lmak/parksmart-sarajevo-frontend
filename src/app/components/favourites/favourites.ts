import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Parking } from '../../models/parking';
import { FavouritesService } from '../../services/favourites';

@Component({
  selector: 'app-favourites',
  imports: [CommonModule, RouterModule],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class FavouritesComponent implements OnInit, OnDestroy {
  favourites: Parking[] = [];
  private refreshInterval: ReturnType<typeof setInterval> | undefined;

  constructor(private favouritesService: FavouritesService) {}

  ngOnInit(): void {
    this.favourites = this.favouritesService.getFavourites();
    this.refreshInterval = setInterval(() => {
      this.favourites = this.favouritesService.getFavourites();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  remove(parkingId: string): void {
    this.favouritesService.removeFavourite(parkingId);
    this.favourites = this.favouritesService.getFavourites();
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
