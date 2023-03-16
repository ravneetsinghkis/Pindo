import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ActiveQuotationDetailsComponent } from './active-quotation-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ActiveQuotationDetailsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
