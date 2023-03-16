import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityContactsComponent } from './community-contacts.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityContactsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityContactsRoutingModule { }
