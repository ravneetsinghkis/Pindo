import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvitationRoutingModule } from './invitation-routing.module';
import { InvitationComponent } from './invitation.component';

@NgModule({
  imports: [
    CommonModule,
    InvitationRoutingModule
  ],
  declarations: [InvitationComponent]
})
export class InvitationModule { }
