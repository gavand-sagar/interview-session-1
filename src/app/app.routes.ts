import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lifecycle' },
  { path: 'lifecycle', title: 'Lifecycle', loadComponent: () => import('./lifecycle/lifecycle.page') },
  { path: 'zone', title: 'Zone', loadComponent: () => import('./zone/zone.page') },
  { path: 'old-syntax', title: 'Old syntax', loadComponent: () => import('./old-syntax/old-syntax.page') },
  { path: 'decorators', title: 'Decorators', loadComponent: () => import('./decorators/decorators.page') },
];
