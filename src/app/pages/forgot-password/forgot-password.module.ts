import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule,MatRadioModule,MatIconModule,MatIconRegistry,MatInputModule,MatSnackBarModule } from '@angular/material';
import { ForgotPasswordComponent } from './forgot-password.component';
import { routing }       from './forgot-password.routing';

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
    ForgotPasswordComponent
  ] 
})
export class ForgotPasswordModule {
  
  
}