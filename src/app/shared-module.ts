import { NgModule } from '@angular/core';
import { SortPipePipe } from './pipes/sort-pipe.pipe';

@NgModule({
  declarations: [SortPipePipe],
  exports: [
      SortPipePipe
    ],
  providers: [
    //{provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
  ],
})
export class SharedModule { }