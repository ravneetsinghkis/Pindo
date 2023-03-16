import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PinListingComponent } from './pin-listing.component';

const routes: Routes = [
	{
		path: '',
		component: PinListingComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PinListingRoutingModule { }
