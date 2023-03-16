import { Routes, RouterModule }  from '@angular/router';

import { NotificationsComponent } from './notifications.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
