import { Routes, RouterModule }  from '@angular/router';

import { CmsInfoComponent } from './cms-info.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: CmsInfoComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
