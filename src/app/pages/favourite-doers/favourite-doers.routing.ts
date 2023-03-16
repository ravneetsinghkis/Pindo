import { Routes, RouterModule }  from '@angular/router';

import { FavouriteDoersComponent } from './favourite-doers.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: FavouriteDoersComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
