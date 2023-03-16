import { Routes, RouterModule }  from '@angular/router';

import { SelectTypeRegisterComponent } from './select-type-register.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: SelectTypeRegisterComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
