import { Routes, RouterModule }  from '@angular/router';
import { ReferDoerComponent } from './refer-doer.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ReferDoerComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
