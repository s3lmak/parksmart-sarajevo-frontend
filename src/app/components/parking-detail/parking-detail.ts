import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {Parking} from '../../models/parking';
import {ParkingService} from '../../services/parking';

@Component({
  selector: 'app-parking-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './parking-detail.html',
  styleUrl: './parking-detail.css',
})
export class ParkingDetailComponent implements OnInit{
  parking: Parking | undefined;

  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService
  ) {} //konstruktor je drugsciji jer ovdje treba ovakomponenta dva srvisa umjesto jednog

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); //cita id parametar iz url
    if(id){
      this.parking = this.parkingService.getOne(id);
    }
  }

  getStatusLabel(status: string): string{
    const labels: Record<string, string> = {
      available: 'Available',
      limited: 'Limited',
      full: 'Full'
    };
    return labels[status] || status;
  }
}

/*Korisnik klikne na "Parking Skenderija" u listi
URL se mijenja u /parking/p01
ParkingDetailComponent se učita
ActivatedRoute nam kaže: "trenutni URL ima id = p01"
Mi pozovemo parkingService.getOne('p01') i dobijemo taj parking

Bez ActivatedRoute ne bismo znali koji parking prikazati – svaki put bi otvorili isti.*/
