import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectTypeRegisterComponent } from './select-type-register.component';
import { routing }       from './select-type-register.routing';
import { EqualValidator } from './equal-validator.directive';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatButtonModule,MatRadioModule,MatIconModule,MatIconRegistry,MatInputModule,MatSnackBarModule } from '@angular/material';
import { RegisterAsPinnerComponent } from './register-as-pinner/register-as-pinner.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RegisterAsDoerComponent } from './register-as-doer/register-as-doer.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from "angularx-social-login";
import {MatTooltipModule} from '@angular/material/tooltip';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("Google-OAuth-Client-Id")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("249153822496113")
  }
]);
export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTooltipModule,
    routing,
    MatProgressSpinnerModule,
    SocialLoginModule

  ],
  declarations: [
    SelectTypeRegisterComponent,
    RegisterAsPinnerComponent,
    EqualValidator,
    RegisterAsDoerComponent
  ],
  providers:[
    MatIconRegistry,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }] 

})
export class SelectTypeRegisterModule {
  
  
}