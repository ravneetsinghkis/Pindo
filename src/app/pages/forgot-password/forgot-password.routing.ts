import { Routes, RouterModule }  from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
