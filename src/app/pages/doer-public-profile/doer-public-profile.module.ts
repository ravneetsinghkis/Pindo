import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerPublicProfileComponent } from './doer-public-profile.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './doer-public-profile.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { InviteToPinComponent } from './invite-to-pin/invite-to-pin.component';
import { HireDoerComponent } from './hire-doer/hire-doer.component';
import { DoerPhotoListingComponent } from './doer-photo-listing/doer-photo-listing.component';
import {CrystalGalleryModule} from 'ngx-crystal-gallery';
// import { SortPipePipe } from '../../pipes/sort-pipe.pipe';
import { SharedModule } from './../../shared-module';
import { EscapeHtmlPipe } from './keep-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    CrystalGalleryModule,
    ShareButtonsModule.forRoot(),
    SharedModule
  ],
  declarations: [
    DoerPublicProfileComponent,
    CourseDialogComponent, 
    InviteToPinComponent, 
    HireDoerComponent, 
    DoerPhotoListingComponent,
    EscapeHtmlPipe,
    PinnerListDialogComponent
    //SortPipePipe
  ],
  entryComponents: [CourseDialogComponent,PinnerListDialogComponent]
})
export class DoerPublicProfileModule { }
