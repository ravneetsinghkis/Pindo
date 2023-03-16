import { Routes, RouterModule }  from '@angular/router';

import { PinnerDashboardComponent } from './pinner-dashboard.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerDashboardComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
