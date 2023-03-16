import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { ImpersonateRoutingModule } from './impersonate-routing.module';
import { ImpersonateComponent } from './impersonate.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ImpersonateRoutingModule
  ],
  declarations: [ImpersonateComponent]
})
export class ImpersonateModule { }
