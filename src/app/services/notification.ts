import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Notification } from '../models/notification';
import { Parking } from '../models/parking';
import { AuthService } from './auth';
import { environment } from '../../environments/environment';

const POLL_INTERVAL_MS = 60000;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/api/parkings`;

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  unreadCount$: Observable<number> = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.read).length)
  );

  private favouriteIds: string[] = [];
  private previousStatuses = new Map<string, string>();
  private pollingSubscription?: Subscription;

  constructor(private http: HttpClient, private authService: AuthService) {}

  startPolling(favouriteIds: string[]): void {
    this.stopPolling();
    this.favouriteIds = favouriteIds;
    this.previousStatuses.clear();

    this.pollingSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(
        filter(() => this.authService.isLoggedIn()),
        switchMap(() => this.http.get<Parking[]>(this.apiUrl))
      )
      .subscribe(parkings => this.checkForStatusChanges(parkings));
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
  }

  addNotification(notification: Notification): void {
    this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);
  }

  markAllAsRead(): void {
    const updated = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updated);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  private checkForStatusChanges(parkings: Parking[]): void {
    for (const parking of parkings) {
      if (!this.favouriteIds.includes(parking.id)) continue;

      const oldStatus = this.previousStatuses.get(parking.id);
      if (oldStatus && oldStatus !== parking.status) {
        this.addNotification({
          id: Date.now().toString(),
          message: `Parking ${parking.name} changed from ${oldStatus} to ${parking.status}`,
          parkingName: parking.name,
          oldStatus,
          newStatus: parking.status,
          timestamp: new Date(),
          read: false,
        });
      }
      this.previousStatuses.set(parking.id, parking.status);
    }
  }
}
