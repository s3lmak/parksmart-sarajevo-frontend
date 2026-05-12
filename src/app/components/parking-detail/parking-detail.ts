import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Parking } from '../../models/parking';
import { ParkingService } from '../../services/parking';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './parking-detail.html',
  styleUrl: './parking-detail.css'
})
export class ParkingDetailComponent implements OnInit {

  parking: Parking | undefined;

  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.parkingService.getParkingById(id).subscribe(data => {
        this.parking = data;
      });
    }
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
