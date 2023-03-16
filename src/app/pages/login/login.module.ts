import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule,MatRadioModule,MatIconModule,MatIconRegistry,MatInputModule,MatSnackBarModule,MatCheckboxModule } from '@angular/material';
import { LoginComponent } from './login.component';
import { routing }       from './login.routing';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider} from "angularx-social-login";

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
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    routing,
    SocialLoginModule
  ],
  declarations: [
    LoginComponent
  ],
  providers:[
    MatIconRegistry,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]  
})
export class LoginModule {
  
  
}