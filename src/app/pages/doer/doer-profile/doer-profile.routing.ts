import { Routes, RouterModule }  from '@angular/router';
import { DoerProfileComponent } from './doer-profile.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerProfileComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
