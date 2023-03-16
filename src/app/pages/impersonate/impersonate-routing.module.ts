import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpersonateComponent } from './impersonate.component';

const routes: Routes = [
	{
	    path: '',
	    component: ImpersonateComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpersonateRoutingModule { }
