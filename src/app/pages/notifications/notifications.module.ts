import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './notifications.routing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    InfiniteScrollModule,
    FormsModule
  ],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }
