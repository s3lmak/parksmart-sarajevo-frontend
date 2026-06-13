import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css'
})
export class MyReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  private userId: string = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.userId = user.id;
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservationsByUserId(this.userId).subscribe(data => {
      this.reservations = data;
    });
  }

  cancel(reservation: Reservation): void {
    this.reservationService.cancelReservation(reservation.id).subscribe(updated => {
      reservation.status = updated.status;
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Active',
      cancelled: 'Cancelled',
      completed: 'Completed'
    };
    return labels[status] || status;
  }
}
