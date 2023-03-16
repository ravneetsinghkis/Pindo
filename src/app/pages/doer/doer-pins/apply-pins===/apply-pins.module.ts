import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyPinsComponent } from './apply-pins.component';
import { routing } from './apply-pins.routing';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrepopulatedPaymentComponent } from './prepopulated-payment/prepopulated-payment.component';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
import { RaiseDisputeFormComponent } from './raise-dispute-form/raise-dispute-form.component';


@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ApplyPinsComponent, PrepopulatedPaymentComponent,CourseDialogComponent, RaiseDisputeFormComponent],
  entryComponents: [CourseDialogComponent]
})
export class ApplyPinsModule { }
