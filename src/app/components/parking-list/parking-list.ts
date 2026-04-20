import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import{FormsModule} from '@angular/forms';
import{Parking} from '../../models/parking';
import{ParkingService} from '../../services/parking';

@Component({
  selector: 'app-parking-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './parking-list.html',
  styleUrl: './parking-list.css',
})
export class ParkingListComponent implements OnInit{
  parkings: Parking[] = [];
  zones: string[] = [];

  selectedZone: string = '';
  selectedStatus: string = '';
  maxPrice: number | undefined = undefined;

  constructor(private parkingService: ParkingService) {
  }

  ngOnInit() {
    this.parkings=this.parkingService.getParkings();
    this.zones=this.parkingService.getZones();
  }

  applyFilters(){
    this.parkings = this.parkingService.getFilteredParkings(
      this.selectedZone || undefined,
      this.selectedStatus || undefined,
      this.maxPrice
    );
  }

  resetFilters(){
    this.selectedZone = '';
    this.selectedStatus = '';
    this.maxPrice=undefined;
    this.parkings=this.parkingService.getParkings();
  }

  getStatusLabel(status: string):string {
    const labels: Record<string, string> = {
      available: 'Available',
      limited: 'Limited',
      full: 'Full'
    };
    return labels[status] || status;
  }

}
