import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountSettingBasicDetailsComponent } from './account-setting-basic-details/account-setting-basic-details.component';
import { LocationSettingsComponent } from './location-settings/location-settings.component';
import { UpdateContactComponent } from './update-contact/update-contact.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { MaterialModule } from './../../../material.module';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { AccountSettingsComponent } from './account-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';
import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import {NgxMaskModule} from 'ngx-mask';
import { CKEditorModule } from 'ng2-ckeditor';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerifyBankAccountComponent } from './verify-bank-account/verify-bank-account.component';
import { CrewApplicationModule } from 'src/app/shared/crew-application/crew-application.module';
import { PendingChangesGuard } from 'src/app/layout/pending-changes.guard';
import { PendingProfilePopupModule } from 'src/app/shared/pending-profile-popup/pending-profile-popup.module';
import { PendingProfilePopupComponent } from 'src/app/shared/pending-profile-popup/pending-profile-popup.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";


@NgModule({
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    NgxUploaderModule,
    CKEditorModule,
    CrewApplicationModule,
    PendingProfilePopupModule,
    GooglePlaceModule
  ],
  declarations: [ 
    AccountSettingsComponent, 
    EmailSettingsComponent, 
    PrivacySettingsComponent,
    AddPaymentMethodComponent,
    UpdateContactComponent,
    LocationSettingsComponent,
    AccountSettingBasicDetailsComponent,
    ChangePasswordComponent,
    VerifyBankAccountComponent
  ],
  entryComponents: [PendingProfilePopupComponent],
  providers: [PendingChangesGuard]
})
export class AccountSettingsModule { }
