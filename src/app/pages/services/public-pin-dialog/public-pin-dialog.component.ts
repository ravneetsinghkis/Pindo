import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'public-pin-dialog',
  templateUrl: 'public-pin-dialog.html',
})
export class PublicPinDialog {
  contactMailSend: any;
  submitted: boolean = false;
  invite_pindo: FormGroup;
  global_mail_link: any;
  constructor(public dialogRef: MatDialogRef<PublicPinDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, public snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {

  }

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();

  }

}