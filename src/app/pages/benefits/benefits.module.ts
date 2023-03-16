import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { BenefitsRoutingModule } from './benefits-routing.module';
import { BenefitsComponent } from './benefits.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    BenefitsRoutingModule
  ],
  declarations: [BenefitsComponent]
})
export class BenefitsModule { }
