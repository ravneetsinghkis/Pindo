import { Routes, RouterModule }  from '@angular/router';
import { ApplyPinsComponent } from './apply-pins.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: ApplyPinsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
