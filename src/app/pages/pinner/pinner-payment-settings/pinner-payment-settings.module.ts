import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { PinnerPaymentSettingsComponent } from './pinner-payment-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './pinner-payment-settings.routing';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { AddBankComponent } from './add-bank/add-bank.component';
import { AddAnotherBankComponent } from './add-another-bank/add-another-bank.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { VerifyBankComponent } from './verify-bank/verify-bank.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing,
    CreditCardDirectivesModule,
    GooglePlaceModule
  ],
  declarations: [PinnerPaymentSettingsComponent,AddBankComponent,AddAnotherBankComponent,VerifyBankComponent],
  entryComponents: [VerifyBankComponent]
})
export class PinnerPaymentSettingsModule { }
