import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnerDashboardComponent } from './pinner-dashboard.component';
import { routing } from './pinner.routing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ChartsModule } from 'ng4-charts/ng4-charts';
import {MatSelectModule} from '@angular/material/select';
import { NguiMapModule} from '@ngui/map';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatSelectModule,
    MatButtonToggleModule,
    ChartsModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDX6v5ZrzvzuTdBnDiDswr8U0BTV0vJNOA'}),
    routing,
    PerfectScrollbarModule,
    InfiniteScrollModule
  ],
  exports: [PinnerDashboardComponent],
  declarations: [PinnerDashboardComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PinnerdashboardModule { 

}
