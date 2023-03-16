import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityHomeComponent } from './community-home.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityHomeComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityHomeRoutingModule { }
