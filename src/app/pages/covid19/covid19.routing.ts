import { Routes, RouterModule }  from '@angular/router';

import { Covid19Component } from './covid19.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: Covid19Component
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
