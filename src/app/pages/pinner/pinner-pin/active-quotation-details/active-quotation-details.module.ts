import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './active-quotation-details.routing';
import { ActiveQuotationDetailsComponent } from './active-quotation-details.component';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
import { RaiseDisputeFormComponent } from './raise-dispute-form/raise-dispute-form.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { DecimalPipe } from '@angular/common';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';
import { PinnerListDialogComponent } from 'src/app/shared/pinner-list-dialog/pinner-list-dialog.component';
import { PinnerListDialogModule } from 'src/app/shared/pinner-list-dialog/pinner-list-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    BarRatingModule,
    PinnerListDialogModule,
    routing
  ],
  declarations: [ActiveQuotationDetailsComponent,CourseDialogComponent,RaiseDisputeFormComponent, ExcessCategoriesComponent, AllCategoriesDialogComponent],
  providers: [DecimalPipe],
  entryComponents: [CourseDialogComponent, ExcessCategoriesComponent, AllCategoriesDialogComponent, PinnerListDialogComponent]
})
export class ActiveQuotationDetailsModule { }
