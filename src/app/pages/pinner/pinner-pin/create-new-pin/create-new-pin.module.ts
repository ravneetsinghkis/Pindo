import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from '../../../../material.module';
import { routing } from './create-new-pin.routing';
import { InputComponent } from './components/input/input.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { CreateNewPinComponent } from './create-new-pin.component';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { DateComponent } from './components/date/date.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { EscapeHtmlPipe } from './keep-html.pipe';

// import { NguiStickyModule } from '@ngui/sticky';

@NgModule({
  imports: [
    CommonModule,
    routing,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    // NguiStickyModule
  ],
  declarations: [InputComponent, DynamicFieldDirective, DynamicFormComponent, CreateNewPinComponent, ButtonComponent, SelectComponent, RadiobuttonComponent, CheckboxComponent, TextareaComponent, DateComponent, CourseDialogComponent, EscapeHtmlPipe],
  entryComponents: [ CourseDialogComponent, InputComponent,ButtonComponent,SelectComponent,RadiobuttonComponent,CheckboxComponent,TextareaComponent,DateComponent ]
})
export class CreateNewPinModule { }
