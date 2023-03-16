import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsComponent } from './quotations.component';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './quotations.routing';
import { ReferredDoerComponent } from './referred-doer/referred-doer.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing
  ],
  declarations: [QuotationsComponent, ReferredDoerComponent]
})
export class QuotationsModule { }
