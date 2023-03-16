import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var $: any;
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'invite-dialog',
  templateUrl: 'invite-dialog.html',
})
export class InviteDialog {

  contactMailSend: any;
  submitted: boolean = false;
  invite_pindo: FormGroup;
  global_mail_link: any;
  msgText = 'Hello! I\'m on PinDo searching for the right Service Provider for my job and I thought of you. Since you\'re not yet on PinDo, I\'d like to invite you to check out my job and provide a quote. Perhaps we can work together!' + '\n\n' + 'Sincerely,' + '\n' + 'Name';
  name: any = '';
  email: any = '';

  constructor(public dialogRef: MatDialogRef<InviteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonservice: CommonService) {

  }

  ngOnInit() {

  }

  onSend() {
    console.log(this.name, this.email, this.msgText);
    const sendData = {
      url: '/api/pinner/invite-a-doer',
      data: {
        'reciever_user_name': this.name,
        'reciever_user_email': this.email,
        'message': this.msgText,
        'link_to_Pinner_profile_page': 'https://beta.pindoit.com',
        'link_to_public_pin': 'https://beta.pindoit.com',
        'link_to_Doer_registration': 'https://beta.pindoit.com/register'
      }
    };
    this.commonservice.postCommunityHttpCall(sendData).then((res) => {
      console.log(res);
      if (res.status === 1) {
        this.closeDialog();
        this.snackBar.open(res.msg, '', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: '',
        });
      } else {
        Swal({
          title: res.msg,
          confirmButtonColor: '#bad141',
          confirmButtonText: 'OK',
        });
      }
    });
  }
  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
