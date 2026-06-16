import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  fullName: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.fullName = user.fullName;
  }

  save(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.successMessage = '';
    this.errorMessage = '';

    if (this.newPassword && !this.currentPassword) {
      this.errorMessage = 'Please enter your current password to change it.';
      return;
    }

    const body: any = { fullName: this.fullName };
    if (this.newPassword) {
      body.password = this.newPassword;
      body.currentPassword = this.currentPassword;
    }

    this.http.put(`${environment.apiUrl}/api/users/${user.id}`, body).subscribe({
      next: (updatedUser: any) => {
        localStorage.setItem('parksmart_user', JSON.stringify({
          id: user.id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role
        }));
        this.successMessage = 'Profile updated successfully!';
        this.newPassword = '';
        this.currentPassword = '';
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Current password is incorrect.';
        } else {
          this.errorMessage = 'Failed to update profile.';
        }
      }
    });
  }
}
