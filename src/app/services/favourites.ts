import { Injectable } from '@angular/core';
import { Parking } from '../models/parking';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private favourites: Parking[] = [
    {
      id: 'p01',
      name: 'Parking Skenderija',
      address: 'Ulica Skenderija 1, Sarajevo',
      zone: 'Zone 1',
      totalCapacity: 80,
      availableSpots: 32,
      status: 'available',
      pricePerHour: 1.50,
      workingHours: '07:00 – 22:00',
      latitude: 43.8563,
      longitude: 18.4131,
      googleMapsUrl: 'https://maps.google.com/?q=43.8563,18.4131'
    },
    {
      id: 'p03',
      name: 'Parking Baščaršija',
      address: 'Baščaršija bb, Sarajevo',
      zone: 'Zone 2',
      totalCapacity: 40,
      availableSpots: 0,
      status: 'full',
      pricePerHour: 1.00,
      workingHours: '06:00 – 23:00',
      latitude: 43.8607,
      longitude: 18.4392,
      googleMapsUrl: 'https://maps.google.com/?q=43.8607,18.4392'
    },
    {
      id: 'p04',
      name: 'Parking Marijin Dvor',
      address: 'Hamdije Čemerlića 2, Sarajevo',
      zone: 'Zone 1',
      totalCapacity: 120,
      availableSpots: 67,
      status: 'available',
      pricePerHour: 1.50,
      workingHours: '07:00 – 22:00',
      latitude: 43.8567,
      longitude: 18.3997,
      googleMapsUrl: 'https://maps.google.com/?q=43.8567,18.3997'
    }
  ];

  getFavourites(): Parking[] {
    return this.favourites;
  }

  addFavourite(parkingId: string): void {
    // placeholder – will integrate with ParkingService when backend is ready
    void parkingId;
  }

  removeFavourite(parkingId: string): void {
    this.favourites = this.favourites.filter(p => p.id !== parkingId);
  }
}
