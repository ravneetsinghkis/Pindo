import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { AddAlbumComponent } from './add-album/add-album.component';
import { InsuredDoerComponent } from './insured-doer/insured-doer.component';
import { BadgeManageDialog } from './badge-manage-dialog/badge-manage-dialog.component';
import { AccountSettingPaymentMethodComponent } from './account-setting-payment-method/account-setting-payment-method.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { MaterialModule } from './../../../material.module';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { AccountSettingsComponent } from './account-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';

import { AccountSettingsRoutingModule } from './account-settings-routing.module';
import {NgxMaskModule} from 'ngx-mask';
import { NgxUploaderModule } from 'ngx-uploader';
import { AccountSettingBasicDetailsComponent } from './account-setting-basic-details/account-setting-basic-details.component';
import { InputFileModule } from 'ngx-input-file';
import { AccountSettingContactInformationComponent } from './account-setting-contact-information/account-setting-contact-information.component';
import { NguiMapModule } from '@ngui/map';
import { AccountSettingLocatioInformationComponent } from './account-setting-location-information/account-setting-location-information.component';
import { AccountSettingOpeningHoursComponent } from './account-setting-opening-hours/account-setting-opening-hours.component';
import { ConfirmMinimumSingleSelectedValidatorDirective } from './account-setting-payment-method/account-setting-payment-method.directive';
import { AccountSettingServicesComponent } from './account-setting-services/account-setting-services.component';
import { EscapeHtmlPipe } from 'src/app/pipes/keep-html.pipe';
import { CKEditorModule } from 'ng2-ckeditor';
import { CompareTime } from './account-setting-opening-hours/account-setting-opening-hours.directive';
import { NgxMasonryModule } from 'ngx-masonry';
import { CrystalGalleryModule } from 'ngx-crystal-gallery';
import { DatetransformPipe } from './../../../pipes/datetransform.pipe';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PhonetransformPipe } from 'src/app/pipes/phonetransform.pipe';
import { SharedModule } from 'src/app/shared-module';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { AddBankComponent } from './add-bank/add-bank.component';
import { PendingChangesGuard } from 'src/app/layout/pending-changes.guard';
import { VerifyBankComponent } from './verify-bank/verify-bank.component';
import { CrewApplicationModule } from 'src/app/shared/crew-application/crew-application.module';
import { PendingProfilePopupComponent } from 'src/app/shared/pending-profile-popup/pending-profile-popup.component';
import { PendingProfilePopupModule } from 'src/app/shared/pending-profile-popup/pending-profile-popup.module';
import { AdminDoerPasswordSetupComponent } from './admin-doer-password-setup/admin-doer-password-setup.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

const config = {
  fileAccept: '*',
  fileLimit: 1
};

@NgModule({
  imports: [
    CommonModule,
    AccountSettingsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    InputFileModule.forRoot(config),
    NgxUploaderModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder,geometry&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    NgxMasonryModule,
    CrystalGalleryModule,
    CKEditorModule,
    SharedModule,
    PipeModule,
    CrewApplicationModule,
    PendingProfilePopupModule,
    GooglePlaceModule
  ],
  declarations: [ 
    AddAlbumComponent,
    AddPaymentMethodComponent,
    AccountSettingsComponent, 
    AccountSettingBasicDetailsComponent,
    AccountSettingContactInformationComponent,
    AccountSettingLocatioInformationComponent,
    AccountSettingOpeningHoursComponent,
    AccountSettingPaymentMethodComponent,
    AccountSettingServicesComponent,
    EmailSettingsComponent, 
    PrivacySettingsComponent, 
    EscapeHtmlPipe,
    ConfirmMinimumSingleSelectedValidatorDirective,
    BadgeManageDialog, 
    InsuredDoerComponent,
    DatetransformPipe,
    PhonetransformPipe,
    CompareTime,
    ChangePasswordComponent,
    AddBankComponent,
    VerifyBankComponent,
    AdminDoerPasswordSetupComponent,
  ],
  entryComponents: [ BadgeManageDialog, PendingProfilePopupComponent, AdminDoerPasswordSetupComponent],
  providers: [PendingChangesGuard]
})
export class AccountSettingsModule { }
