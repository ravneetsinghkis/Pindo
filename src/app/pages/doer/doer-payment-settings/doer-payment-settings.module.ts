import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerPaymentSettingsComponent } from './doer-payment-settings.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { routing } from './doer-payment-settings.routing';
import { AddBankComponent } from './add-bank/add-bank.component';
import { CreditCardDirectivesModule } from 'angular-cc-library';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing,
    GooglePlaceModule,
    CreditCardDirectivesModule
  ],
  declarations: [DoerPaymentSettingsComponent, AddBankComponent]
})
export class DoerPaymentSettingsModule { }
