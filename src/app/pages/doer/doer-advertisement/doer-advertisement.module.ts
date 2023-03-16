import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerAdvertisementComponent } from './doer-advertisement.component';
import { routing } from './doer-advertisement.routing';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestAdvertisementComponent } from './request-advertisement/request-advertisement.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [DoerAdvertisementComponent, RequestAdvertisementComponent]
})
export class DoerAdvertisementModule { }