import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var $: any;
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { wordCountlimit } from './../../grouprequired-validator';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'invite-pindo-dialog',
  templateUrl: 'invite-pindo-dialog.html',
})
export class InvitePindoDialog {
  contactMailSend: any;
  submitted: boolean = false;
  invite_pindo: FormGroup;
  global_mail_link: any;
  constructor(public dialogRef: MatDialogRef<InvitePindoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, public commonservice: CommonService, public snackBar: MatSnackBar, public myGlobals: Globalconstant
  ) {

  }

  ngOnInit() {
    this.createPostFormBuild();
    //this.global_mail_link = 'https://pindoit.com/register';
    //this.global_mail_link = 'https://beta.pindoit.com/register';
    //this.global_mail_link = 'http://localhost:4242/register';

    // this.global_mail_link = this.myGlobals.frontend_url + '/register';
    this.global_mail_link = this.myGlobals.frontend_url + '/home';

    // this.global_mail_link = this.myGlobals.frontend_url;

  }

  /**
   * Creates post form build
   */
  createPostFormBuild() {
    this.invite_pindo = this.fb.group({
      invite_email: ['', Validators.compose([Validators.required, Validators.email])],
      invite_user_name: ['', Validators.compose([Validators.required])]
    });
  }
  /**
 * Dubmit the form with form data
 * @param val 
 */
  onSubmitCreatePost(val) {
    this.submitted = true;
    const current_user_id = localStorage.getItem('frontend_user_id');

    const b64_current_user_id = CryptoJS.AES.encrypt(`${current_user_id}`, 'Secret Key').toString();
    const e64_current_user_id = CryptoJS.enc.Base64.parse(b64_current_user_id);
    const encryptedCurrentUserId = e64_current_user_id.toString(CryptoJS.enc.Hex);

    const b64_invited_email = CryptoJS.AES.encrypt(`${val.invite_email}`, 'Secret Key').toString();
    const e64_invited_email = CryptoJS.enc.Base64.parse(b64_invited_email);
    const encryptedInvitedEmail = e64_invited_email.toString(CryptoJS.enc.Hex);

    const new_url = this.global_mail_link + '/' + encryptedCurrentUserId + '/' + encryptedInvitedEmail;
    if (this.invite_pindo.invalid) {
      return;
    } else {
      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/pindo-join-request',
        data: {
          base_url: new_url,
          email: val.invite_email,
          name: val.invite_user_name
        }, contenttype: 'application/json'
      }).then(result => {
        if (result.status == 1) {
          this.dialogRef.close();
          this.responseMessageSnackBar(result.msg);
        }
      });
    }
  }
  /**
   * Responses message snack bar for show alert
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
  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();

  }
}
