import { Routes, RouterModule }  from '@angular/router';
import { PinnerTransactionsComponent } from './pinner-transactions.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerTransactionsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
