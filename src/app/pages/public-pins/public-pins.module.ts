import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicPinsComponent } from './public-pins.component';
import { MaterialModule } from '../../shared/material.module';
import { routing } from './public-pins.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChooseLoginStatus } from './choose-login-status/choose-login-status.component';
import { PublicPinDetailsComponent } from './public-pin-details/public-pin-details.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ClickOutsideModule } from 'ng-click-outside';
import { EscapeHtmlPipe } from './keep-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    ClickOutsideModule
  ],
  declarations: [PublicPinsComponent, ChooseLoginStatus, PublicPinDetailsComponent, EscapeHtmlPipe],
  entryComponents: [ChooseLoginStatus]
})
export class PublicPinsModule { }
