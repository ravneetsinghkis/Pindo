import { Routes, RouterModule }  from '@angular/router';

import { PinnerActivityComponent } from './pinner-activity.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerActivityComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
