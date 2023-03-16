import { Routes, RouterModule }  from '@angular/router';

import { FaqComponent } from './faq.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: FaqComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
console.log(routing);
