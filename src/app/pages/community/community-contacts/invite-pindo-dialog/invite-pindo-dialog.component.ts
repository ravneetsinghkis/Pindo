import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'invite-pindo-dialog',
  templateUrl: 'invite-pindo-dialog.html',
})

export class InvitePindoDialog {

  // submitted:boolean = false;
  // loading           = false;




  constructor(public dialogRef: MatDialogRef<InvitePindoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {

  }

  /**
   * on init
   */
  ngOnInit() {
  }

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
    // $("#nb-global-spinner").hide();
  }






  // public onSubmitUpdatePaymentCard(values):void {
  //   console.log(values);
  //   this.submitted = true;
  //   if (this.update_paymentCard.invalid) {
  //     console.log(this.update_paymentCard.invalid)
  //     return;
  //   }

  //   var expMonth = values.expiry_date.substring(0, 2);
  //   var expYear  = values.expiry_date.substring(2, 6);    
  //   var user_id  = atob(localStorage.getItem('loggedInUserId'));

  //   let postData = { 'user_id':user_id, 'exp_month':expMonth,'exp_year':expYear,'name':values.cHolder_name,'card_id':this.data.cardData.card_id};
  //   console.log(postData);
  //   this.cService.genericPostData('stripe-update-card', postData ).subscribe(
  //     (response: any) => {
  //       if (response.status) {
  //         this.dialogRef.close();
  //         $("#nb-global-spinner").hide();
  //         this.submitted = false;
  //         this.snackBar.open(response.message, 'Success' , {
  //           duration: 2000,
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top'
  //         });
  //       } else {
  //         this.snackBar.open(response.message, 'Error' , {
  //           duration: 2000,
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top'
  //         });
  //       }
  //     },
  //     (err: Error) => console.log(err)
  //   );
  // }

}