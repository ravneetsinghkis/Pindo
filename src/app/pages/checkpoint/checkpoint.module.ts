import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckpointRoutingModule } from './checkpoint-routing.module';
import { CheckpointComponent } from './checkpoint.component';

@NgModule({
  imports: [
    CommonModule,
    CheckpointRoutingModule
  ],
  declarations: [CheckpointComponent]
})
export class CheckpointModule { }
