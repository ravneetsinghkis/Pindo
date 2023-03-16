import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { AuthGuard, NotAuthGuard } from './auth.guard';
import { routing } from './layout.routing';
import { MaterialModule } from './material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { GestureConfig } from '@angular/material';
import { ClickOutsideModule } from 'ng-click-outside';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateBlogModule } from './../pages/community/blog-list/create-blog/create-blog.module';
import { RatingModule } from 'ng-starrating';
import { HomeModule } from '../pages/home/home.module';
import { Covid19NewModule } from '../pages/covid19-new/covid19-new.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    MaterialModule,
    MatProgressBarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ClickOutsideModule,
    MatAutocompleteModule,
    DeviceDetectorModule.forRoot(),
    MatSelectModule,
    CreateBlogModule,
    RatingModule,
    Covid19NewModule,
    HomeModule,
  ],
  exports: [LayoutComponent],
  declarations: [FooterComponent, LayoutComponent,  HeaderComponent],
  entryComponents: [
    
  ],
  providers: [AuthGuard, NotAuthGuard, { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
})
export class LayoutModule { }
