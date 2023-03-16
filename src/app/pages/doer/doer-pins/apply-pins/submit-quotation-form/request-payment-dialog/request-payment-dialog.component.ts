import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-request-payment-dialog',
  templateUrl: './request-payment-dialog.component.html',
  styleUrls: ['./request-payment-dialog.component.scss']
})
export class RequestPaymentDialogComponent implements OnInit {

  @Output() onRequestPaymentFromModal = new EventEmitter();
  @Output() onUpdateQuotationFromModal = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<RequestPaymentDialogComponent>,
  ) {

  }

  ngOnInit() {

  }

  requestedPayment() {
    this.onRequestPaymentFromModal.emit(true);
    this.closeDialog();
  }

  updateQuotation() {
    this.onUpdateQuotationFromModal.emit(true);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
