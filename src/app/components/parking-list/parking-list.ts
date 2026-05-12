import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Parking } from '../../models/parking';
import { ParkingService } from '../../services/parking';

@Component({
  selector: 'app-parking-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './parking-list.html',
  styleUrl: './parking-list.css'
})
export class ParkingListComponent implements OnInit {

  parkings: Parking[] = [];
  zones: string[] = [];

  selectedZone: string = '';
  selectedStatus: string = '';
  maxPrice: number | undefined = undefined;

  constructor(private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.loadParkings();
    this.loadZones();
  }

  loadParkings(): void {
    this.parkingService.getParkings().subscribe(data => {
      this.parkings = data;
    });
  }

  loadZones(): void {
    this.zones = ['Zone 1', 'Zone 2', 'Zone 3'];
  }

  applyFilters(): void {
    this.parkingService.getFilteredParkings(
      this.selectedZone || undefined,
      this.selectedStatus || undefined,
      this.maxPrice
    ).subscribe(data => {
      this.parkings = data;
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
}
