import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnerChatComponent } from './pinner-chat.component';
import { routing } from './pinner-chat.routing';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [PinnerChatComponent]
})
export class PinnerChatModule { }
