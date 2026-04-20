export interface Parking {
    id: string;
    name: string;
    address: string;
    zone: string;
    totalCapacity: number;
    availableSpots: number;
    status: 'available' | 'limited' | 'full';
    pricePerHour: number;
    workingHours: string;
    latitude: number;
    longitude: number;
    googleMapsUrl: string;
  }
