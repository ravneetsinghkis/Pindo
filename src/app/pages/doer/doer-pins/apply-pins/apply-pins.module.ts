import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyPinsComponent } from './apply-pins.component';
import { routing } from './apply-pins.routing';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmitQuotationFormComponent } from './submit-quotation-form/submit-quotation-form.component';
import { CourseDialogComponent } from './submit-quotation-form/choose-option/choose-optiondialog.component';
import { RaiseDisputeFormComponent } from './raise-dispute-form/raise-dispute-form.component';
import { RequestPaymentDialogComponent } from './submit-quotation-form/request-payment-dialog/request-payment-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ApplyPinsComponent, ProfileDetailsComponent, SubmitQuotationFormComponent, CourseDialogComponent, RaiseDisputeFormComponent, RequestPaymentDialogComponent],
  entryComponents: [CourseDialogComponent, RequestPaymentDialogComponent],
})
export class ApplyPinsModule { }
