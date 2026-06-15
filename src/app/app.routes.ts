import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./components/parking-list/parking-list').then(
        m => m.ParkingListComponent
      )
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./components/map/map').then(m=>m.MapComponent)
  },
  {
    path: 'parking/:id', //dinamički parametar
    loadComponent: () =>
      import('./components/parking-detail/parking-detail').then(
        m => m.ParkingDetailComponent
      )
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(
        m => m.LoginComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then(
        m => m.RegisterComponent
      )
  },
  {
    path: 'favourites',
    loadComponent: () =>
      import('./components/favourites/favourites').then(
        m => m.FavouritesComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'my-reservations',
    loadComponent: () =>
      import('./components/my-reservations/my-reservations').then(
        m => m.MyReservationsComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin').then(m => m.AdminComponent)
  }
];
