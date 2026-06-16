export interface Notification {
  id: string;
  message: string;
  parkingName: string;
  oldStatus: string;
  newStatus: string;
  timestamp: Date;
  read: boolean;
}
