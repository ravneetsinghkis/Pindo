import { Routes, RouterModule }  from '@angular/router';
import { PinnerProfileNewComponent } from './pinner-profile-new.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerProfileNewComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
