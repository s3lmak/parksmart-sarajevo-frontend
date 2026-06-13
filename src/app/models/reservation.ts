export interface Reservation {
  id: number;
  userId: number;
  parkingId: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}
