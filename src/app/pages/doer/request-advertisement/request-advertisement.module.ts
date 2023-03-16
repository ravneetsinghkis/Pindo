import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementComponent } from './request-advertisement.component';
import { routing } from './request-advertisement.routing';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    routing,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [AdvertisementComponent,CourseDialogComponent],
  entryComponents: [CourseDialogComponent]
})
export class AdvertisementModule { }
