import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferDoerComponent } from './refer-doer.component';
import { MaterialModule } from '../../../shared/material.module';
import { routing } from './refer-doer.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [ReferDoerComponent,PinnerListDialogComponent],
  entryComponents: [PinnerListDialogComponent]
})
export class ReferDoerModule { }
