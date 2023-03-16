import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from 'ng2-ckeditor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from './../../../../material.module';
import { CreateBlogComponent } from './create-blog.component';

@NgModule({
  imports: [
    CommonModule,
    CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [CreateBlogComponent],
  exports: [CreateBlogComponent],
})
export class CreateBlogModule { }
