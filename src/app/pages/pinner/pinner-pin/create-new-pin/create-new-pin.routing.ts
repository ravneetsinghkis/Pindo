import { Routes, RouterModule }  from '@angular/router';
import { CreateNewPinComponent } from './create-new-pin.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: CreateNewPinComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
