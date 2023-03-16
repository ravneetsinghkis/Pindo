import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';

@Component({
  selector: 'public-pin-dialog',
  templateUrl: 'public-pin-dialog.html',
})
export class PublicPinDialog {
  publicPinMsg: string = 'Making your Pin public gives Service Providers outside of PinDo the opportunity to bid on your job. They will not see your personal information. Would you like to make your Pin public?';
  constructor(public dialogRef: MatDialogRef<PublicPinDialog>,
    @Inject(MAT_DIALOG_DATA) public pin_slug: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
  ) {
console.log(this.pin_slug);
  }

  ngOnInit() {
  }

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  makePinAsPublic() {
    this.makePinPublicApi();
  }

  makePinPublicApi() {
    this.commonservice.postHttpCall({
      url: '/pinners/mark-as-public-pin', 
      data: {pin_id: this.pin_slug}, 
      contenttype: 'application/json'})
      .then(result => {
        if (result.status == 1) {
          this.responseMessageSnackBar(result.msg);
          this.dialogRef.close('success');
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
}

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   */
  public responseMessageSnackBar(message, res_class= '') {
    this.snackBar.open(message, '', {
        duration: 4000,
        horizontalPosition: 'right',       
        panelClass: res_class
    });
  }
}
