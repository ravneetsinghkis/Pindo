import { Routes, RouterModule }  from '@angular/router';
import { QuotationsComponent } from './quotations.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: QuotationsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
