import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingsDummyComponent } from './account-settings-dummy.component';

const routes: Routes = [
  {
    path: "",
    component: AccountSettingsDummyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingsDummyRoutingModule { }
