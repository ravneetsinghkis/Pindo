import { Routes, RouterModule }  from '@angular/router';

import { PrivacyComponent } from './privacy.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PrivacyComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
