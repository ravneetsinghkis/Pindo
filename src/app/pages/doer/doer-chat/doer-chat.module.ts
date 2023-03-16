import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerChatComponent } from './doer-chat.component';
import { routing } from './doer-chat.routing';
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
  declarations: [DoerChatComponent]
})
export class DoerChatModule { }
