import { Routes, RouterModule }  from '@angular/router';

import { DoerPublicProfileComponent } from './doer-public-profile.component';
import { InviteToPinComponent } from './invite-to-pin/invite-to-pin.component';
import { HireDoerComponent } from './hire-doer/hire-doer.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerPublicProfileComponent
  },
  {
    path: 'invite-to-pin',
    component: InviteToPinComponent
  },
  {
    path: 'hire-doer',
    component: HireDoerComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
