import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './terms.routing';
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
  declarations: [TermsComponent,EscapeHtmlPipe]
})
export class TermsModule { }
