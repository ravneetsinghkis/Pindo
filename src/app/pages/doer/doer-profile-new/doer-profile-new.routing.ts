import { Routes, RouterModule }  from '@angular/router';
import { DoerProfileNewComponent } from './doer-profile-new.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerProfileNewComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
