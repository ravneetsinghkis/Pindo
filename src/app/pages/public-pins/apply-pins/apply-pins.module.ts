import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyPinsComponent } from './apply-pins.component';
import { routing } from './apply-pins.routing';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ApplyPinsComponent]
})
export class ApplyPinsModule { }
