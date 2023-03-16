import { Routes, RouterModule }  from '@angular/router';

import { Error404Component } from './error.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: Error404Component
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
