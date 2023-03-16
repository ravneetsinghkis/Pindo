import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnerProfileComponent } from './pinner-profile.component';
import { routing } from './pinner-profile.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule,MatCardModule,MatButtonModule,MatIconModule,MatSelectModule,MatBadgeModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule,MatInputModule,MatSnackBarModule,MatCheckboxModule } from '@angular/material';
import { PinnerBasicDetailComponent } from './pinner-basic-detail/pinner-basic-detail.component';
import { InputFileModule } from 'ngx-input-file';
import { PinnerContactComponent } from './pinner-contact/pinner-contact.component';
import { OterAddressesComponent } from './oter-addresses/oter-addresses.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeCustomValidator } from './changePassword.directive';
import {NgxMaskModule} from 'ngx-mask';
import { PinnerControlComponent } from './pinner-control/pinner-control.component';
import { ProfileNotificationSettingsComponent } from './profile-notification-settings/profile-notification-settings.component';
import { ProfileEmailSettingsComponent } from './profile-email-settings/profile-email-settings.component';


const config = {
  fileAccept: '*',
  fileLimit: 1
};

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatBadgeModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatRadioModule,
    MatInputModule,
    MatSnackBarModule,
    MatCheckboxModule,
    GooglePlaceModule,
    routing,
    InputFileModule.forRoot(config),
    NgxMaskModule.forRoot()
  ],
  declarations: [
  	PinnerProfileComponent,
  	PinnerBasicDetailComponent,
  	PinnerContactComponent,
  	OterAddressesComponent,
    ChangePasswordComponent,
    ChangeCustomValidator,
    PinnerControlComponent,
    ProfileNotificationSettingsComponent,
    ProfileEmailSettingsComponent
  ]
})
export class PinnerProfileModule { }
