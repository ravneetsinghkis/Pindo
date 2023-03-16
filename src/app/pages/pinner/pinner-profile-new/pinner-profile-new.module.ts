import { ContactsListDialog } from './contacts-list-dialog/contacts-list-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnerProfileNewComponent } from './pinner-profile-new.component';
import { routing } from './pinner-profile-new.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatCardModule,MatButtonModule,MatIconModule,MatSelectModule,MatBadgeModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule,MatInputModule,MatSnackBarModule,MatCheckboxModule } from '@angular/material';
import { MaterialModule } from './../../../material.module';
import { PinnerBasicDetailComponent } from './pinner-basic-detail/pinner-basic-detail.component';
import { InputFileModule } from 'ngx-input-file';
import { PinnerContactComponent } from './pinner-contact/pinner-contact.component';
import { OterAddressesComponent } from './oter-addresses/oter-addresses.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeCustomValidator } from './changePassword.directive';
import {NgxMaskModule} from 'ngx-mask';
import { NguiMapModule} from '@ngui/map';
import { MomentModule } from 'ngx-moment';
import {NgxPaginationModule} from 'ngx-pagination';
import { BioEditComponent } from './bio-edit/bio-edit.component';
import { UpdateInterestsComponent } from './update-interests/update-interests.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
// import { RatingModule } from 'ng-starrating';
import { StarRatingModule } from 'angular-star-rating';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CKEditorModule } from 'ng2-ckeditor';

const config = {
  fileAccept: '*',
  fileLimit: 1
};

@NgModule({
  imports: [
    FormsModule,
    // RatingModule,
    StarRatingModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    GooglePlaceModule,
    routing,
    PipeModule,
    NgxPaginationModule,
    CKEditorModule,
    InputFileModule.forRoot(config),
    NgxMaskModule.forRoot(),
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    })
  ],
  declarations: [
  	PinnerProfileNewComponent,
  	PinnerBasicDetailComponent,
  	PinnerContactComponent,
  	OterAddressesComponent,
    ChangePasswordComponent,
    ChangeCustomValidator,
    ContactsListDialog,
    BioEditComponent,
    UpdateInterestsComponent,
    UpdateProfileComponent
  ],
  entryComponents: [ContactsListDialog]
})
export class PinnerProfileNewModule { }
