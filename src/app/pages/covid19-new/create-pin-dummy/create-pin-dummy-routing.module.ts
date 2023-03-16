import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePinDummyComponent } from './create-pin-dummy.component';

const routes: Routes = [
  {
    path: "",
    component: CreatePinDummyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePinDummyRoutingModule { }
