import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { routing }       from './register.routing';
import { EqualValidator } from './equal-validator.directive';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FormsModule,
    routing
  ],
  declarations: [
    RegisterComponent,
    EqualValidator
  ] 
})
export class RegisterModule {
  
  
}