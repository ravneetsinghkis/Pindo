import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestCommunityComponent } from './request-community.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [RequestCommunityComponent]
})
export class RequestCommunityModule { }
