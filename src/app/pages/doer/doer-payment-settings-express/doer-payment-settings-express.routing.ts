import { Routes, RouterModule } from '@angular/router';
import { DoerPaymentSettingsExpressComponent } from './doer-payment-settings-express.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerPaymentSettingsExpressComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
