import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Parking } from '../../models/parking';
import { ParkingService } from '../../services/parking';
import { AuthService } from '../../services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  parkings: Parking[] = [];
  displayedColumns = ['id', 'name', 'zone', 'totalCapacity', 'pricePerHour', 'actions'];

  constructor(
    private parkingService: ParkingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      this.router.navigate(['/list']);
      return;
    }
    this.loadParkings();
  }

  loadParkings(): void {
    this.parkingService.getParkings().subscribe(data => {
      this.parkings = data;
    });
  }

  deleteParking(id: string): void {
    if (confirm('Are you sure you want to delete this parking?')) {
      this.parkingService.deleteParking(id).subscribe(() => {
        this.parkings = this.parkings.filter(p => p.id !== id);
      });
    }
  }
  showAddForm: boolean = false;

  newParking = {
    name: '',
    address: '',
    zone: '',
    totalCapacity: 0,
    pricePerHour: 0,
    workingHours: '',
    latitude: 0,
    longitude: 0
  };

  addParking(): void {
    this.parkingService.createParking(this.newParking as any).subscribe(parking => {
      this.parkings.push(parking);
      this.showAddForm = false;
      this.newParking = { name: '', address: '', zone: '', totalCapacity: 0, pricePerHour: 0, workingHours: '', latitude: 0, longitude: 0 };
    });
  }

  editingParking: Parking | null = null;

  startEdit(parking: Parking): void {
    this.editingParking = { ...parking };
  }

  cancelEdit(): void {
    this.editingParking = null;
  }

  saveEdit(): void {
    if (!this.editingParking) return;
    this.parkingService.updateParking(this.editingParking.id, this.editingParking).subscribe(updated => {
      const index = this.parkings.findIndex(p => p.id === updated.id);
      if (index !== -1) this.parkings[index] = updated;
      this.editingParking = null;
    });
  }
}
