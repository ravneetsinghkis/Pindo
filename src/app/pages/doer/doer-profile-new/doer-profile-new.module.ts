import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerProfileNewComponent } from './doer-profile-new.component';
import { routing } from './doer-profile-new.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material.module';
import { InputFileModule } from 'ngx-input-file';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { ClipboardModule } from 'ngx-clipboard';
import { PortfolioDialog } from './portfolio-dialog/portfolio-dialog.component';
import { ContactsListDialog } from './contacts-list-dialog/contacts-list-dialog.component';
//import { RatingModule } from 'ng-starrating';
// import { ShareButtonsModule } from '@ngx-share/buttons';
import { StarRatingModule } from 'angular-star-rating';
import { ShareButtonModule } from '@ngx-share/button';
import { SharedModule } from 'src/app/shared-module';
import { NguiMapModule } from '@ngui/map';
import { ShareprofileComponent } from './shareprofile/shareprofile.component';
import { InvitePinDialog } from './invite-pin-dialog/invite-pin-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { PostsocialdialogComponent } from './postsocialdialog/postsocialdialog.component';

const config = {
  fileAccept: '*',
  fileLimit: 1
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    GooglePlaceModule,
    routing,
    // RatingModule,
    StarRatingModule.forRoot(),
    NguiMapModule,
    InputFileModule.forRoot(config),
    NgxMaskModule.forRoot(),
    ShareButtonModule.forRoot(),
    PerfectScrollbarModule,
    ClipboardModule
  ],
  declarations: [
    DoerProfileNewComponent, PortfolioDialog, InvitePinDialog, ContactsListDialog, ShareprofileComponent, PostsocialdialogComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [PortfolioDialog, InvitePinDialog, ContactsListDialog, ShareprofileComponent, PostsocialdialogComponent]
})
export class DoerProfileNewModule { }
