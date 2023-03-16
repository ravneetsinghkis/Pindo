import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckpointComponent } from './checkpoint.component';

const routes: Routes = [
  {
    path: '',
    component: CheckpointComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckpointRoutingModule { }
