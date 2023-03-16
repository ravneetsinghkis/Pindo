import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule,MatRadioModule,MatIconModule,MatIconRegistry,MatInputModule,MatSnackBarModule,MatCheckboxModule,MatSelectModule } from '@angular/material';
// import { MatFileUploadModule } from 'angular-material-fileupload';

import { HelpCenterComponent } from './help-center.component';
import { routing }       from './help-center.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    // MatFileUploadModule, 
    routing
  ],
  declarations: [
    HelpCenterComponent
  ] 
})
export class HelpCenterModule {
  
  
}