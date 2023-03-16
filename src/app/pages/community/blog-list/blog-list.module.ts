import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material.module';
import { BlogListRoutingModule } from './blog-list-routing.module';
import { BlogListComponent } from './blog-list.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TruncateModule } from 'ng2-truncate';
import { CreateBlogModule } from './create-blog/create-blog.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BlogListRoutingModule,
    MaterialModule,
    InfiniteScrollModule,
    CKEditorModule,
    TruncateModule,
    CreateBlogModule
  ],
  declarations: [BlogListComponent],
})
export class BlogListModule { }
