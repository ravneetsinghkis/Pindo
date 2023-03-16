import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { MaterialModule } from '../../shared/material.module';
import { SupportsRoutingModule } from './support-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PinnerSupportComponent } from './pinner-support/pinner-support.component';
import { DoerSupportComponent } from './doer-support/doer-support.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    ToastrModule,
    SupportsRoutingModule
  ],
  declarations: [SupportComponent, PinnerSupportComponent, DoerSupportComponent]
})
export class SupportModule { }
