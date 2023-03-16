import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-shareprofile',
  templateUrl: './shareprofile.component.html',
  styleUrls: ['./shareprofile.component.scss']
})
export class ShareprofileComponent implements OnInit {

  linkText: any;
  frontendURL: any;
  title: any;

  constructor(public dialogRef: MatDialogRef<ShareprofileComponent>,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public globalconstant: Globalconstant) {
      this.frontendURL = globalconstant.frontend_url;
    }

  ngOnInit() {
    this.linkText = 'Here is a link';
    this.title = 'Check out my Doer recommendation on PinDo.';
  }
  onCopyLink(text) {
    console.log(text);
  }

  onSuccess() {
    this.snackBar.open('Pin link has successfully been copied to your clipboard!', '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'orangeSnackBar',
    });
  }

  onError() {
    this.snackBar.open('Pin link could not be copied. Something went wrong!', '', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'error',
    });
  }

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();

  }
}
