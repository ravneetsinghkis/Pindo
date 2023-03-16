import { Routes, RouterModule }  from '@angular/router';
import { AdvertisementComponent } from './request-advertisement.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: AdvertisementComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
