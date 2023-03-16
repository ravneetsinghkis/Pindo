import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteDoersComponent } from './favourite-doers.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './favourite-doers.routing';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing
  ],
  declarations: [FavouriteDoersComponent]
})
export class FavouriteDoersModule { }
