import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinnerTransactionsComponent } from './pinner-transactions.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './pinner-transactions.routing';
import { ClickOutsideModule } from 'ng-click-outside';
import { CompareDateValidatorDirective } from './manage-availibility.directive';
import { Angular2CsvModule } from 'angular2-csv';

@NgModule({
  imports: [
  	Angular2CsvModule,
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing,
    ClickOutsideModule,

  ],
  declarations: [PinnerTransactionsComponent,CompareDateValidatorDirective]
})
export class PinnerTransactionsModule { }
