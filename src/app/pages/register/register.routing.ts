import { Routes, RouterModule }  from '@angular/router';

import { RegisterComponent } from './register.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: RegisterComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
