import { Routes, RouterModule }  from '@angular/router';

import { DoerDashboardComponent } from './doer-dashboard.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerDashboardComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
