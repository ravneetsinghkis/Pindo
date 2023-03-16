import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePinDummyRoutingModule } from './create-pin-dummy-routing.module';
import { CreatePinDummyComponent } from './create-pin-dummy.component';
import { MaterialModule } from './../../../material.module';

@NgModule({
  imports: [
    CommonModule,
    CreatePinDummyRoutingModule,
    MaterialModule
  ],
  declarations: [CreatePinDummyComponent, ]
})
export class CreatePinDummyModule { }
