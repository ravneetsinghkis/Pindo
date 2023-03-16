import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing }       from './home.routing';
import { MatButtonModule,MatIconModule,MatIconRegistry,MatInputModule,MatAutocompleteModule,MatDialogModule } from '@angular/material';
import { HighlightDirective } from './home.directive';
// import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { HomeComponent } from './home.component';
// import { MaterialModule } from '../../material.module';
// import { RatingModule } from 'ng-starrating';
import { StarRatingModule } from 'angular-star-rating';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { PopoverModule } from 'ngx-popover';
import { MaterialModule } from 'src/app/layout/material.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MaterialModule,
    // RatingModule,
    StarRatingModule.forRoot(),
    // MatDialogModule,
    PopoverModule,
    // MaterialModule
    
  ],
  declarations: [
    HomeComponent,
    HighlightDirective,
    ExcessCategoriesComponent,
    
  ],
  providers: [MatIconRegistry],
  entryComponents: [
    ExcessCategoriesComponent
  ],
   
})
export class HomeModule {}
