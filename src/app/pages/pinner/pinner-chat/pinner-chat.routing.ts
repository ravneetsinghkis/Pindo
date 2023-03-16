import { Routes, RouterModule }  from '@angular/router';

import { PinnerChatComponent } from './pinner-chat.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: PinnerChatComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
