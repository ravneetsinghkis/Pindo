import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var $: any;
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import * as CryptoJS from 'crypto-js';
import { CommonService } from 'src/app/commonservice';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'invite-dialog',
  templateUrl: 'invite-dialog.html',
})
export class InviteDialog {
  contactMailSend: any;
  submitted: boolean;
  invite_pindo: FormGroup;
  global_mail_link: any;
  msgText: any;
  name: any = '';
  email: any = '';
  pinID: any;
  pinnerID: any;
  pinName: any;
  pinUniqueID: any;

  constructor(public dialogRef: MatDialogRef<InviteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public globalconstant: Globalconstant) {
    this.submitted = false;
    this.invite_pindo = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      msgText: ['', Validators.compose([Validators.required])],
    });
    this.msgText = 'Hello! I\'m on PinDo searching for the right Service Provider for my job and I thought of you. Since you\'re not yet on PinDo, I\'d like to invite you to check out my job and provide a quote. Perhaps we can work together! \n\nSincerely, \n' + this.data.pinnerName;
    console.log(this.msgText);
  }

  ngOnInit() {
    this.pinID = localStorage.getItem('pinID');
    this.pinnerID = localStorage.getItem('pinnerID');
    this.pinName = localStorage.getItem('pinName');
    this.pinUniqueID = localStorage.getItem('pinUniqueID');
  }

  onSend() {
    this.submitted = true;
    if (this.invite_pindo.invalid) {
      return;
    }
    console.log(this.name, this.email, this.msgText);
    const b64 = CryptoJS.AES.encrypt(`${this.pinnerID}`, 'Secret Key').toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const eHex = e64.toString(CryptoJS.enc.Hex);
    const url1 = this.globalconstant.frontend_url + `/public/pinner-profile/${eHex}`;
    const url2 = this.globalconstant.frontend_url + '/register';
    const url3 = this.globalconstant.frontend_url + '/public-pins/' + this.data.slug;

    // console.log(url1, url2, url3);
    const sendData = {
      url: '/api/pinner/invite-a-doer',
      data: {
        'reciever_user_name': this.name,
        'reciever_user_email': this.email,
        'message': this.msgText,
        'link_to_Pinner_profile_page': url1,
        'link_to_public_pin': url3,
        'link_to_Doer_registration': url2,
        'pin_id': this.pinID,
        'pin_name': this.pinName,
        'PIN_UNIQUE_ID' : this.pinUniqueID
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
