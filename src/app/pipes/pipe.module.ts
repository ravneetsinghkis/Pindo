import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomeTimeAgoPipe } from './custome-time-ago.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CustomeTimeAgoPipe],
  exports: [
    CustomeTimeAgoPipe
    ],
})
export class PipeModule { }
