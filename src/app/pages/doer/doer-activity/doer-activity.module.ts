import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerActivityComponent } from './doer-activity.component';
import { routing } from './doer-activity.routing';
import { ChartsModule } from 'ng4-charts/ng4-charts';
import { MaterialModule } from '../../../shared/material.module';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { NguiMapModule} from '@ngui/map';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InviteGuestComponent } from './components/invite-guest/invite-guest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchiveConfirmationComponent } from './components/archive-confirmation/archive-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    MaterialModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    routing,
    PerfectScrollbarModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [DoerActivityComponent],
  declarations: [DoerActivityComponent, CourseDialogComponent, EscapeHtmlPipe, InviteGuestComponent, ArchiveConfirmationComponent],
  entryComponents: [CourseDialogComponent, InviteGuestComponent, ArchiveConfirmationComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class DoerActivityModule { 

}
