import { Routes, RouterModule }  from '@angular/router';

import { TermsComponent } from './terms.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: TermsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
