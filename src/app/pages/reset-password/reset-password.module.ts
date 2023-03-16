import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule,MatRadioModule,MatIconModule,MatIconRegistry,MatInputModule,MatSnackBarModule } from '@angular/material';
import { ResetPasswordComponent } from './reset-password.component';
import { routing }       from './reset-password.routing';
import { EqualValidator } from './equal-validator.directive';

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
    routing
  ],
  declarations: [
    ResetPasswordComponent,
    EqualValidator
  ] 
})
export class ResetPasswordModule {
  
  

}