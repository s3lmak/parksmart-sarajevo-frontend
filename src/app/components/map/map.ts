import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ParkingService } from '../../services/parking';
import { Parking } from '../../models/parking';
import mapboxgl from 'mapbox-gl';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;

  constructor(private parkingService: ParkingService) {}

  ngAfterViewInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2VsbWEta2FyYWNpYyIsImEiOiJjbXBnc3Z4MzUwaTF3MnhyMmI0ODV0NnZkIn0.T5bR-51Aye2Uw__Q0Ca1AA';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [18.4131, 43.8563],
      zoom: 13
    });

    this.map.on('load', () => {
      this.loadParkings();
    });

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadParkings(): void {
    this.parkingService.getParkings().subscribe(parkings => {
      parkings.forEach(parking => this.addMarker(parking));
    });
  }

  private addMarker(parking: Parking): void {
    const color = parking.status === 'available' ? '#1e7e34' :
      parking.status === 'limited' ? '#e65100' : '#c62828';

    const el = document.createElement('div');
    el.style.cssText = `
      background: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      cursor: pointer;
    `;

    new mapboxgl.Marker(el)
      .setLngLat([parking.longitude, parking.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(`
        <b>${parking.name}</b><br>
        ${parking.availableSpots} / ${parking.totalCapacity} free<br>
        <a href="/parking/${parking.id}" style="color:#1976d2">View details →</a>
      `))
      .addTo(this.map);
  }
}
