import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Parking } from '../../models/parking';
import { Review } from '../../models/review';
import { ParkingService } from '../../services/parking';
import { FavouritesService } from '../../services/favourites';
import { ReviewService } from '../../services/review';
import { AuthService } from '../../services/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-parking-detail',
  imports: [RouterModule, DecimalPipe, DatePipe, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './parking-detail.html',
  styleUrl: './parking-detail.css'
})
export class ParkingDetailComponent implements OnInit {

  parking: Parking | undefined;
  private isFav: boolean = false;

  reviews: Review[] = [];
  averageRating = 0;
  hasReviewed = false;
  reviewRating = 0;
  reviewComment = '';
  reviewError = '';

  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private favouritesService: FavouritesService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.parkingService.getParkingById(id).subscribe(data => {
        this.parking = data;
        this.checkFavourite();
      });
      this.loadReviews(id);
      this.loadAverageRating(id);
      this.checkUserReview(id);
    }
  }

  checkFavourite(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.parking) return;
    this.favouritesService.getFavourites(user.id).subscribe(favs => {
      this.isFav = favs.some(f => f.parkingId === this.parking!.id.toString());
    });
  }

  isFavourite(): boolean {
    return this.isFav;
  }

  toggleFavourite(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.parking) return;
    if (this.isFav) {
      this.favouritesService.removeFavourite(user.id, this.parking.id.toString()).subscribe(() => {
        this.isFav = false;
      });
    } else {
      this.favouritesService.addFavourite(user.id, this.parking.id.toString()).subscribe(() => {
        this.isFav = true;
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      available: 'Available',
      limited: 'Almost full',
      full: 'Full'
    };
    return labels[status] || status;
  }

  getMapUrl(): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${this.parking?.latitude},${this.parking?.longitude}&z=16&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  loadReviews(parkingId: string): void {
    this.reviewService.getReviewsByParkingId(parkingId).subscribe(data => {
      this.reviews = data;
    });
  }

  loadAverageRating(parkingId: string): void {
    this.reviewService.getAverageRating(parkingId).subscribe(data => {
      this.averageRating = data;
    });
  }

  checkUserReview(parkingId: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.reviewService.hasUserReviewed(user.id, parkingId).subscribe(result => {
      this.hasReviewed = result;
    });
  }

  getStarArray(rating: number): boolean[] {
    const rounded = Math.round(rating);
    return [1, 2, 3, 4, 5].map(star => star <= rounded);
  }

  setReviewRating(rating: number): void {
    this.reviewRating = rating;
  }

  submitReview(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.parking || this.reviewRating === 0) return;

    this.reviewError = '';

    this.reviewService.addReview(user.id, this.parking.id, this.reviewRating, this.reviewComment).subscribe({
      next: () => {
        this.hasReviewed = true;
        this.reviewRating = 0;
        this.reviewComment = '';
        this.loadReviews(this.parking!.id);
        this.loadAverageRating(this.parking!.id);
      },
      error: () => {
        this.reviewError = 'Failed to submit review. Please try again.';
      }
    });
  }
}
