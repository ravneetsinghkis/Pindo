import { Routes, RouterModule }  from '@angular/router';
import { DoerTransactionsComponent } from './doer-transactions.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerTransactionsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
