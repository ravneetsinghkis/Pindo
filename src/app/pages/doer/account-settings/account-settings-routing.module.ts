import { AccountSettingsComponent } from './account-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingChangesGuard } from 'src/app/layout/pending-changes.guard';
const routes: Routes = [
  {
    path:'',
    component: AccountSettingsComponent,
    canDeactivate: [PendingChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountSettingsRoutingModule { }
