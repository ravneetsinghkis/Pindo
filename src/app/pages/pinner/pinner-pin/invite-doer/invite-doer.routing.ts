import { Routes, RouterModule }  from '@angular/router';
import { InviteDoerComponent } from './invite-doer.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: InviteDoerComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
