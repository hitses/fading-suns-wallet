import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/character-list/character-list'),
  },
  {
    path: ':slug',
    loadComponent: () => import('./pages/character/character'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
