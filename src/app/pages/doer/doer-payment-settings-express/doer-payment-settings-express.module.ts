import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerPaymentSettingsExpressComponent } from './doer-payment-settings-express.component';
import { routing } from './doer-payment-settings-express.routing';
import { MaterialModule } from '../../../material.module';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddBankComponent } from './add-bank/add-bank.component';
import { AddAnotherBankComponent } from './add-another-bank/add-another-bank.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    FormsModule,
    CreditCardDirectivesModule,
    ReactiveFormsModule,
    GooglePlaceModule
  ],
  declarations: [DoerPaymentSettingsExpressComponent, AddBankComponent, AddAnotherBankComponent]
})
export class DoerPaymentSettingsExpressModule { }
