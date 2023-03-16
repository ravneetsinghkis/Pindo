import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsInfoComponent } from './cms-info.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './cms-info.routing';
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
  declarations: [CmsInfoComponent,EscapeHtmlPipe]
})
export class CmsInfoModule { }
