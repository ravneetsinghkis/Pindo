import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Covid19NewRoutingModule } from './covid19-new-routing.module';
import { Covid19NewComponent } from './covid19-new.component';
import { StarRatingModule } from 'angular-star-rating';
import { PublicPinDetailsComponent } from './public-pin-details/public-pin-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { RestrictUserModalComponent } from './restrict-user-modal/restrict-user-modal.component';
import { QuickRegistrationComponent } from './quick-registration/quick-registration.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    Covid19NewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
  ],
  declarations: [Covid19NewComponent, PublicPinDetailsComponent, ExcessCategoriesComponent, RestrictUserModalComponent, QuickRegistrationComponent, AllCategoriesDialogComponent],
  entryComponents: [ ExcessCategoriesComponent, RestrictUserModalComponent, QuickRegistrationComponent, AllCategoriesDialogComponent]
})
export class Covid19NewModule { }
