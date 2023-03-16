import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnerPaymentSettingsExpressComponent } from './pinner-payment-settings-express.component';
import { routing } from './pinner-payment-settings-express.routing';
import { MaterialModule } from '../../../material.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule
  ],
  declarations: [PinnerPaymentSettingsExpressComponent]
})
export class PinnerPaymentSettingsExpressModule { }
