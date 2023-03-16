import { MaterialModule } from '../../../../material.module';
import { CreatePinComponent } from './create-pin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';
import { CreatePinRoutingModule } from './create-pin-routing.module';
import {NgxMaskModule} from 'ngx-mask';
import { CKEditorModule } from 'ng2-ckeditor';
import { InputComponent } from './components/input/input.component';
import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { ButtonComponent } from './components/button/button.component';
import { SelectComponent } from './components/select/select.component';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { DateComponent } from './components/date/date.component';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  imports: [
    CommonModule,
    CreatePinRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    NgxUploaderModule,
    CKEditorModule,
    GooglePlaceModule
  ],
  // declarations: [CreatePinComponent],
  declarations: [CreatePinComponent,EscapeHtmlPipe,InputComponent, DynamicFieldDirective, DynamicFormComponent, ButtonComponent, SelectComponent, RadiobuttonComponent, CheckboxComponent, TextareaComponent, DateComponent],
  entryComponents: [InputComponent,ButtonComponent,SelectComponent,RadiobuttonComponent,CheckboxComponent,TextareaComponent,DateComponent ]
})
export class CreatePinModule { }
