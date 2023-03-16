import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LayoutModule } from './layout/layout.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonService } from './commonservice';
import { Globalconstant } from './global_constant';
import { TokenInterceptor } from './token.interceptor';
import { MaterialModule } from './material.module';
import {MatDialogModule} from '@angular/material';
import { CourseDialogComponent } from './layout/header/course-dialog/course-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ChooseLoginStatus } from './shared/choose-login-status/choose-login-status.component';


@NgModule({
  declarations: [
    AppComponent,
    CourseDialogComponent,
    ChooseLoginStatus
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    MatDialogModule,
    HttpClientModule,
    GooglePlaceModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right'      
    }), // ToastrModule added
  ],
  providers: [CommonService, Globalconstant, CookieService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }, { provide: MatDialogRef, useValue: {} },
{ provide: MAT_DIALOG_DATA, useValue: [] }],
  entryComponents: [CourseDialogComponent,ChooseLoginStatus],
  bootstrap: [AppComponent]
})
export class AppModule { }
