import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Covid19NewComponent } from './covid19-new.component';

const routes: Routes = [
  {
    path: '',
    component: Covid19NewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Covid19NewRoutingModule { }
