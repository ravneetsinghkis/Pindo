import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PinListingRoutingModule } from './pin-listing-routing.module';
import { PinListingComponent } from './pin-listing.component';

@NgModule({
  imports: [
    CommonModule,
    PinListingRoutingModule
  ],
  declarations: [PinListingComponent]
})
export class PinListingModule { }
