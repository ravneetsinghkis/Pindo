import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatIconRegistry, MatProgressSpinnerModule, MatSidenavModule } from '@angular/material';


@NgModule({
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule],
  exports: [MatButtonModule, MatIconModule, MatSidenavModule],
  providers: [MatIconRegistry]
})
export class MaterialModule { }