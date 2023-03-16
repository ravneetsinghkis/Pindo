import { Routes, RouterModule }  from '@angular/router';

import { DoerActivityComponent } from './doer-activity.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerActivityComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
