import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '../../material.module';
//import { HeaderComponent }  from './header.component';
//import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { CreateBlogModule } from './../../pages/community/blog-list/create-blog/create-blog.module';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, GooglePlaceModule, MaterialModule],
  declarations: [],
  entryComponents: []
})
export class HeaderModule { }
