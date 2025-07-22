import { Routes } from '@angular/router';
import Character from './character';

export const routes: Routes = [
  {
    path: '',
    component: Character,
    children: [
      {
        path: 'dinero',
        pathMatch: 'full',
        loadComponent: () => import('./money/money'),
      },
      {
        path: 'atributos',
        loadComponent: () => import('./attributes/attributes'),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./inventory/inventory'),
      },
      {
        path: '**',
        redirectTo: 'dinero',
      },
    ],
  },
];
