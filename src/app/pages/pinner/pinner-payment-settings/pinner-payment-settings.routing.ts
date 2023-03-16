import { Routes, RouterModule }  from '@angular/router';
import { PinnerPaymentSettingsComponent } from './pinner-payment-settings.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerPaymentSettingsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
