import { Routes, RouterModule }  from '@angular/router';
import { PinnerProfileComponent } from './pinner-profile.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerProfileComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
