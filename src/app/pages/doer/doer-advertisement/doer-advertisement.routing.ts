import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DoerAdvertisementComponent } from './doer-advertisement.component';

export const routes: Routes = [
  {
    path: '',
    component: DoerAdvertisementComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
