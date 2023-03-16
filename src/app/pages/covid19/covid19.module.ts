import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Covid19Component } from './covid19.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './covid19.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EscapeHtmlPipe } from './keep-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  declarations: [Covid19Component,EscapeHtmlPipe]
})
export class Covid19Module { }
