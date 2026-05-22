import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  constructor(private authService: AuthService) {
  }
  isLoggedIn(): boolean{
    return this.authService.isLoggedIn();
  }

  getCurrentUser(){
    return this.authService.getCurrentUser();
  }

  logout(): void{
      this.authService.logout();
      window.location.href = '/list';
  }
}
