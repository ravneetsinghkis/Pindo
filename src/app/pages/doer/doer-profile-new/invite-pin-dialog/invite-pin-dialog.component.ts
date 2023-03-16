import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';


@Component({
  selector: 'invite-pin-dialog',
  templateUrl: 'invite-pin-dialog.html',
})

export class InvitePinDialog implements OnInit {
  pin_slug: string = '';
  pinnerPinList: any = [];
  doerDetails: any = [];

  // @ViewChild('insuredDoerInfo')

  constructor(public dialogRef: MatDialogRef<InvitePinDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public commonservice: CommonService,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant,
  ) {
    this.pinnerPinList = this.data.pinnerPinList;
    this.doerDetails.push(this.data.doerDetails);
  }

  ngOnInit() {
    console.log(this.data.pinnerPinList);
  }



  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Submits invite doer
   * @param frmElm
   */
  inviteDoer(pin_slug, index) {
    this.pin_slug = pin_slug;
    this.commonservice.postHttpCall({
      url: '/pinners/invite-doers',
      data: { 'pin_id': this.pin_slug, 'doer_list': this.doerDetails },
      contenttype: 'application/json'
    })
      .then(result => this.inviteDoerSuccess(result, index));
  }

  /**
   * Invites doer success
   * @param response
   */
  inviteDoerSuccess(response, index) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_details': this.doerDetails,
        'title': 'Heads up!  You’ve received a quote request.',
        'link': 'doer/quotation-preview/' + this.pin_slug,
        'show_in_todo': 1,
        'todo_title': 'Heads up!  You’ve received a quote request.',
        'todo_link': 'doer/quotation-preview/' + this.pin_slug,
        'pin_slug': this.pin_slug,
      };
      this.dialogRef.close(index);
      this.myGlobals.notificationSocket.emit('post-invite-doer', postData);
      console.log("inviteDoerSuccess", postData);
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
  * Responses message snack bar
  * @param message
  * @param [res_class]
  */
  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

}
