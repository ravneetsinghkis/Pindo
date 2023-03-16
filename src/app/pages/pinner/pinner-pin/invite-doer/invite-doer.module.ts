import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteDoerComponent } from './invite-doer.component';
import { MaterialModule } from '../../../../material.module';
import { routing } from './invite-doer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseDialogComponent } from './choose-skip-option/choose-skip-optiondialog.component';
import { FilterDoerComponent } from './filter-doer/filter-doer.component';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { InviteDialog } from './invite-dialog/invite-dialog.component';
import { PostSocialDialog } from './post-social-dialog/post-social-dialog.component';
import { PublicPinDialog } from './public-pin-dialog/public-pin-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareButtonModule } from '@ngx-share/button';
import { OpenPindoComponent } from './open-pindo/open-pindo.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ClipboardModule,
    ShareButtonModule.forRoot(),
    CKEditorModule
  ],
  declarations: [
    InviteDoerComponent,
    CourseDialogComponent,
    FilterDoerComponent,
    EscapeHtmlPipe,
    PinnerListDialogComponent,
    InviteDialog,
    PostSocialDialog,
    PublicPinDialog,
    OpenPindoComponent,
    ExcessCategoriesComponent,
    AllCategoriesDialogComponent
  ],
  providers: [FilterDoerComponent],
  // entryComponents: [CourseDialogComponent,PinnerListDialogComponent]
  entryComponents: [
    CourseDialogComponent,
    PinnerListDialogComponent,
    InviteDialog,
    PostSocialDialog,
    PublicPinDialog,
    OpenPindoComponent,
    ExcessCategoriesComponent,
    AllCategoriesDialogComponent
  ]
})
export class InviteDoerModule { }
