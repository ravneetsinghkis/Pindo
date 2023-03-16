import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrewMembershipRoutingModule } from './crew-membership-routing.module';
import { CrewMembershipComponent } from './crew-membership.component';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { CrewApplicationModule } from 'src/app/shared/crew-application/crew-application.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CrewMembershipRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    CrewApplicationModule
  ],
  declarations: [CrewMembershipComponent]
})
export class CrewMembershipModule { }
