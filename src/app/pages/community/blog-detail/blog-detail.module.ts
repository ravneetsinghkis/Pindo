import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './../../../material.module';

import { BlogDetailRoutingModule } from './blog-detail-routing.module';
import { BlogDetailComponent } from './blog-detail.component';
import { MomentModule } from 'ngx-moment';
import { TruncateModule } from 'ng2-truncate';
import { EscapeHtmlPipe } from './keep-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    BlogDetailRoutingModule,
    MaterialModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59
      }
    }),
    TruncateModule
  ],
  declarations: [BlogDetailComponent,EscapeHtmlPipe]
})
export class BlogDetailModule { }
