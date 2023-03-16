import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './services.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceDoerDetailsComponent } from './service-doer-details/service-doer-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import { InviteDialog } from './invite-dialog/invite-dialog.component';
import { PostSocialDialog } from './post-social-dialog/post-social-dialog.component';
import { PublicPinDialog} from './public-pin-dialog/public-pin-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClipboardModule } from 'ngx-clipboard';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxPaginationModule,
    ClipboardModule
  ],
  declarations: [ServicesComponent, ServiceDoerDetailsComponent, EscapeHtmlPipe, PinnerListDialogComponent, InviteDialog, PostSocialDialog, PublicPinDialog, ExcessCategoriesComponent, AllCategoriesDialogComponent],
  entryComponents: [PinnerListDialogComponent, InviteDialog, PostSocialDialog, PublicPinDialog, ExcessCategoriesComponent, AllCategoriesDialogComponent]
})
export class ServicesModule { }
