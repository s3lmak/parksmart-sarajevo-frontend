import { Injectable } from '@angular/core';
import { Parking } from '../models/parking';

@Injectable({
  providedIn: 'root',
})

export class ParkingService {
  private parkings: Parking[] = [
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
      id: 'p02',
      name: 'Parking Ferhadija',
      address: 'Ferhadija 12, Sarajevo',
      zone: 'Zone 1',
      totalCapacity: 50,
      availableSpots: 4,
      status: 'limited',
      pricePerHour: 2.00,
      workingHours: '00:00 – 24:00',
      latitude: 43.8594,
      longitude: 18.4322,
      googleMapsUrl: 'https://maps.google.com/?q=43.8594,18.4322'
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
    },
    {
      id: 'p05',
      name: 'Parking Čengić Vila',
      address: 'Envera Šehovića 4, Sarajevo',
      zone: 'Zone 2',
      totalCapacity: 60,
      availableSpots: 15,
      status: 'limited',
      pricePerHour: 1.00,
      workingHours: '07:00 – 21:00',
      latitude: 43.8445,
      longitude: 18.3856,
      googleMapsUrl: 'https://maps.google.com/?q=43.8445,18.3856'
    },
    {
      id: 'p06',
      name: 'Parking Ilidža',
      address: 'Bosanski put 1, Ilidža',
      zone: 'Zone 3',
      totalCapacity: 200,
      availableSpots: 143,
      status: 'available',
      pricePerHour: 0.50,
      workingHours: '06:00 – 22:00',
      latitude: 43.8302,
      longitude: 18.3100,
      googleMapsUrl: 'https://maps.google.com/?q=43.8302,18.3100'
    }
  ];

  getParkings(): Parking[] {
    return this.parkings;
  }

  getOne(id: string): Parking | undefined{
    return this.parkings.find(p => p.id === id);
  }

  getFilteredParkings(zone?: string, status?: string, maxPrice?: number): Parking[] {
    return this.parkings.filter(p =>{
      if (zone && p.zone !== zone) return false;
      if (status && p.status !== status) return false;
      if (maxPrice && p.pricePerHour > maxPrice) return false;
      return true;
    });
  }

  getZones(): string[]{
    return [...new Set(this.parkings.map(p => p.zone))];
  }

}
