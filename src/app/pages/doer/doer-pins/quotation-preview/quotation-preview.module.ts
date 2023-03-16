import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './quotation-preview.routing';
import { QuotationPreviewComponent } from './quotation-preview.component';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RaiseDisputeFormComponent } from './raise-dispute-form/raise-dispute-form.component';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
import { QuoteBlockerDialogComponent } from './quote-blocker-dialog/quote-blocker-dialog.component';
import { SiteVisitDialogComponent } from './site-visit-dialog/site-visit-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    routing,
  ],
  declarations: [QuotationPreviewComponent, RaiseDisputeFormComponent, EscapeHtmlPipe, CourseDialogComponent, QuoteBlockerDialogComponent, SiteVisitDialogComponent],
  entryComponents: [CourseDialogComponent, QuoteBlockerDialogComponent, SiteVisitDialogComponent]
})
export class QuotationPreviewModule { }
