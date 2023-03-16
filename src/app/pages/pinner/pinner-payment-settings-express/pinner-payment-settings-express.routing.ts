import { Routes, RouterModule }  from '@angular/router';
import { PinnerPaymentSettingsExpressComponent } from './pinner-payment-settings-express.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerPaymentSettingsExpressComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
