import { Routes, RouterModule }  from '@angular/router';
import { MyPinsComponent } from './my-pins.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: MyPinsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
