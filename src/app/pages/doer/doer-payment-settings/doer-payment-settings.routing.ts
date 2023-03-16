import { Routes, RouterModule }  from '@angular/router';
import { DoerPaymentSettingsComponent } from './doer-payment-settings.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerPaymentSettingsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
