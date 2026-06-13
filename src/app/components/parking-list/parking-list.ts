import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Parking } from '../../models/parking';
import { ParkingService } from '../../services/parking';
import { FavouritesService } from '../../services/favourites';
import { ReviewService } from '../../services/review';
import { AuthService } from '../../services/auth';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    DecimalPipe,
    MatChipListbox,
    MatChipOption,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './parking-list.html',
  styleUrl: './parking-list.css'
})
export class ParkingListComponent implements OnInit {

  parkings: Parking[] = [];
  zones: string[] = [];
  favouriteIds: Set<string> = new Set();
  ratings: Map<string, number | null> = new Map();

  selectedZone: string = '';
  selectedStatus: string = '';
  maxPrice: number | undefined = undefined;

  constructor(
    private parkingService: ParkingService,
    private favouritesService: FavouritesService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadParkings();
    this.loadZones();
    this.loadFavouriteIds();
  }

  loadParkings(): void {
    this.parkingService.getParkings().subscribe(data => {
      this.parkings = data;
      this.loadRatings();
    });
  }

  loadRatings(): void {
    this.parkings.forEach(parking => {
      this.reviewService.getReviewsByParkingId(parking.id).subscribe(reviews => {
        if (reviews.length === 0) {
          this.ratings.set(parking.id, null);
        } else {
          const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
          this.ratings.set(parking.id, average);
        }
      });
    });
  }

  getRating(parkingId: string): number | null | undefined {
    return this.ratings.get(parkingId);
  }

  loadZones(): void {
    this.zones = ['Zone 1', 'Zone 2', 'Zone 3'];
  }

  loadFavouriteIds(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.favouritesService.getFavourites(user.id).subscribe(favs => {
      this.favouriteIds = new Set(favs.map(f => f.parkingId));
    });
  }

  applyFilters(): void {
    this.parkingService.getFilteredParkings(
      this.selectedZone || undefined,
      this.selectedStatus || undefined,
      this.maxPrice
    ).subscribe(data => {
      this.parkings = data;
      this.loadRatings();
    });
  }

  resetFilters(): void {
    this.selectedZone = '';
    this.selectedStatus = '';
    this.maxPrice = undefined;
    this.loadParkings();
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      available: 'Available',
      limited: 'Limited',
      full: 'Full'
    };
    return labels[status] || status;
  }

  isFavourite(parkingId: string): boolean {
    return this.favouriteIds.has(parkingId);
  }

  toggleFavourite(parking: Parking, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.favouriteIds.has(parking.id)) {
      this.favouritesService.removeFavourite(user.id, parking.id).subscribe(() => {
        this.favouriteIds = new Set([...this.favouriteIds].filter(id => id !== parking.id));
      });
    } else {
      this.favouritesService.addFavourite(user.id, parking.id).subscribe(() => {
        this.favouriteIds = new Set([...this.favouriteIds, parking.id]);
      });
    }
  }
  selectZone(zone: string): void {
    this.selectedZone = this.selectedZone === zone ? '' : zone;
    this.applyFilters();
  }

  selectStatus(status: string): void {
    this.selectedStatus = this.selectedStatus === status ? '' : status;
    this.applyFilters();
  }
}
