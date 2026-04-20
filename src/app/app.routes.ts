import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'list',
    loadComponent: () =>
      import('./components/parking-list/parking-list').then(
        m => m.ParkingListComponent
      )
  },
  {
    path:'parking/:id', //dinamicki parametar
    loadComponent: () =>
      import('./components/parking-detail/parking-detail').then(
        m => m.ParkingDetailComponent
      )
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

