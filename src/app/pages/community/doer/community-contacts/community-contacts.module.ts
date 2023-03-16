import { MaterialModule } from '../../../../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { CommunityContactsRoutingModule } from './community-contacts-routing.module';
import { CommunityContactsComponent } from './community-contacts.component';
import { InvitePindoDialog } from './invite-pindo-dialog/invite-pindo-dialog.component';

import { NguiMapModule} from '@ngui/map';
import {PopoverModule} from 'ngx-popover';

import { TagListDialog } from './tag-list-dialog/tag-list-dialog.component';
import { ServicesOfferedDialog } from './services-offered-dialog/services-offered-dialog.component';
import { EndorseServicesDialog } from './endorse-services-dialog/endorse-services-dialog.component';

// import { InvitePindoDialog } from './invite-pindo-dialog/invite-pindo-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommunityContactsRoutingModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    PopoverModule,
    MaterialModule
  ],
  declarations: [CommunityContactsComponent, TagListDialog, ServicesOfferedDialog, InvitePindoDialog, EndorseServicesDialog],
  entryComponents: [TagListDialog, ServicesOfferedDialog, EndorseServicesDialog]
})
export class CommunityContactsModule { }
