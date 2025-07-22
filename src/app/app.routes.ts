import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/character-list/character-list'),
  },
  {
    path: ':slug',
    loadChildren: () =>
      import('./pages/character/character.routes').then((r) => r.routes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
