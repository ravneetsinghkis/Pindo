import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerProfileComponent } from './doer-profile.component';
import { routing } from './doer-profile.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatButtonModule, MatIconModule, MatSelectModule, MatBadgeModule, MatChipsModule, MatSlideToggleModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatInputModule, MatSnackBarModule, MatCheckboxModule, MatMenuModule } from '@angular/material';
import { ProfileInsuranceComponent } from './profile-insurance/profile-insurance.component';
import { ProfileLicenceComponent } from './profile-licence/profile-licence.component';
import { CertificatesComponent } from './profile-certificates/certificates.component';
import { ProfileAffiliationComponent } from './profile-affiliation/profile-affiliation.component';
import { ProfileServicesComponent } from './profile-services/profile-services.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { ProfilePaymentComponent } from './profile-payment/profile-payment.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ConfirmMinimumSingleSelectedValidatorDirective } from './profile-payment/profile-payment.directive';
import { CompareDateValidatorDirective } from './manage-availibility.directive';
import { DoerBasicDetailsComponent } from './doer-basic-details/doer-basic-details.component';
import { InputFileModule } from 'ngx-input-file';
import { DoerContactInformationComponent } from './doer-contact-information/doer-contact-information.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CompareTime } from './opening-hours/opening-hours.directive';
import { NguiMapModule} from '@ngui/map';
import {MatSliderModule} from '@angular/material/slider';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeCustomValidator } from './changePassword.directive';
import { MatProgressSpinnerModule } from '@angular/material';
import {NgxMaskModule} from 'ngx-mask';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DoerPhotosComponent } from './doer-photos/doer-photos.component';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgxMasonryModule } from 'ngx-masonry';
import { CrystalGalleryModule } from 'ngx-crystal-gallery';
// import { SortPipePipe } from '../../../pipes/sort-pipe.pipe';
import { SharedModule } from '../../../shared-module';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { DoerControlComponent } from './doer-control/doer-control.component';
import { DoerProfileEmailSettingsComponent } from './doer-profile-email-settings/doer-profile-email-settings.component';
import { DoerProfileNotificationSettingsComponent } from './doer-profile-notification-settings/doer-profile-notification-settings.component';

const config = {
  fileAccept: '*',
  fileLimit: 1
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,    
    MatIconModule,
    MatSelectModule,
    MatBadgeModule,
    MatSlideToggleModule,    
    MatRadioModule,
    MatInputModule,
    MatSnackBarModule,  
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    NgxMaterialTimepickerModule.forRoot(), 
    InputFileModule.forRoot(config), 
    NgxMaskModule.forRoot(),
    //ToastrModule.forRoot(), // ToastrModule added
    GooglePlaceModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    MatSliderModule,
    MatTooltipModule,
    NgxUploaderModule,
    NgxMasonryModule,
    CrystalGalleryModule,
    SharedModule,
    routing
  ],  
  declarations: [
    DoerProfileComponent, 
    ProfileInsuranceComponent, 
    ConfirmMinimumSingleSelectedValidatorDirective, 
    ProfileLicenceComponent, 
    ProfileAffiliationComponent, 
    ProfileServicesComponent, 
    OpeningHoursComponent, 
    ProfilePaymentComponent, 
    DoerBasicDetailsComponent, 
    DoerContactInformationComponent,
    CertificatesComponent,
    CompareDateValidatorDirective,
    CompareTime,
    ChangePasswordComponent,
    ChangeCustomValidator,
    CourseDialogComponent,
    DoerPhotosComponent,
    EscapeHtmlPipe,
    DoerControlComponent,
    DoerProfileEmailSettingsComponent,
    DoerProfileNotificationSettingsComponent
    // SortPipePipe
  ],
  entryComponents: [CourseDialogComponent]
})
export class DoerProfileModule { }
