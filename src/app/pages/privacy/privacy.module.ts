import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './privacy.routing';
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
  declarations: [PrivacyComponent,EscapeHtmlPipe]
})
export class PrivacyModule { }
