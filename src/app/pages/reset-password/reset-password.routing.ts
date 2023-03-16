import { Routes, RouterModule }  from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

