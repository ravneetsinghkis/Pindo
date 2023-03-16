import { Routes, RouterModule }  from '@angular/router';

import { HelpCenterComponent } from './help-center.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: HelpCenterComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
