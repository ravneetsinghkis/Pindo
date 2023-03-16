import { Routes, RouterModule }  from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { QuotationPreviewComponent } from './quotation-preview.component';

export const routes: Routes = [
  {
    path: '',
    component: QuotationPreviewComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
