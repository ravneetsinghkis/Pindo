import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material.module';
import { MyPinsComponent } from './my-pins.component';
import { routing } from './my-pins.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { CompareDateValidatorDirective } from './manage-availibility.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule, 
    ReactiveFormsModule,
    InfiniteScrollModule,
    ClickOutsideModule
  ],
  declarations: [
  	MyPinsComponent,
    CompareDateValidatorDirective
  ]
})
export class MyPinsModule { }
