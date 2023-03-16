import { Routes, RouterModule }  from '@angular/router';

import { DoerChatComponent } from './doer-chat.component';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: DoerChatComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
