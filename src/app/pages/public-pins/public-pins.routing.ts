import { Routes, RouterModule } from '@angular/router';

import { PublicPinsComponent } from './public-pins.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PublicPinsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
