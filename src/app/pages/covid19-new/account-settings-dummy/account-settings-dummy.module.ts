import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountSettingsDummyRoutingModule } from './account-settings-dummy-routing.module';
import { AccountSettingsDummyComponent } from './account-settings-dummy.component';
import { MaterialModule } from './../../../material.module';

@NgModule({
  imports: [
    CommonModule,
    AccountSettingsDummyRoutingModule,
    MaterialModule
  ],
  declarations: [AccountSettingsDummyComponent]
})
export class AccountSettingsDummyModule { }
