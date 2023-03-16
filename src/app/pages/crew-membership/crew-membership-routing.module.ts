import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrewMembershipComponent } from './crew-membership.component';

const routes: Routes = [
  {
    path: "",
    component: CrewMembershipComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrewMembershipRoutingModule { }
