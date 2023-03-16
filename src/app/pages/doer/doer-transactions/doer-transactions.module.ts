import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoerTransactionsComponent } from './doer-transactions.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './doer-transactions.routing';
import { ClickOutsideModule } from 'ng-click-outside';
import { CompareDateValidatorDirective } from './manage-availibility.directive';
import { Angular2CsvModule } from 'angular2-csv';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing,
    ClickOutsideModule,
    Angular2CsvModule
  ],
  declarations: [DoerTransactionsComponent,CompareDateValidatorDirective]
})
export class DoerTransactionsModule { }
