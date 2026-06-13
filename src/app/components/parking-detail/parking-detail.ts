import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Parking } from '../../models/parking';
import { ParkingService } from '../../services/parking';
import { FavouritesService } from '../../services/favourites';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-parking-detail',
  imports: [RouterModule, DecimalPipe, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './parking-detail.html',
  styleUrl: './parking-detail.css'
})
export class ParkingDetailComponent implements OnInit {

  parking: Parking | undefined;
  private isFav: boolean = false;

  showReservationForm = false;
  startTime = '';
  endTime = '';
  reservationSuccess = '';
  reservationError = '';

  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private favouritesService: FavouritesService,
    private reservationService: ReservationService,
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

  openReservationForm(): void {
    this.showReservationForm = true;
    this.reservationSuccess = '';
    this.reservationError = '';
  }

  cancelReservationForm(): void {
    this.showReservationForm = false;
    this.startTime = '';
    this.endTime = '';
    this.reservationError = '';
  }

  confirmReservation(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.parking) return;

    this.reservationError = '';
    this.reservationSuccess = '';

    this.reservationService.createReservation(user.id, this.parking.id, this.startTime, this.endTime).subscribe({
      next: () => {
        this.reservationSuccess = 'Reservation confirmed!';
        this.showReservationForm = false;
        this.startTime = '';
        this.endTime = '';
      },
      error: () => {
        this.reservationError = 'Failed to create reservation. Please try again.';
      }
    });
  }
}
