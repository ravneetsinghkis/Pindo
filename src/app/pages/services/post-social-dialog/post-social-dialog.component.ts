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
  selector: 'post-social-dialog',
  templateUrl: 'post-social-dialog.html',
  styleUrls: ['./post-social-dialog.scss']
})
export class PostSocialDialog {
  contactMailSend: any;
  submitted: boolean = false;
  invite_pindo: FormGroup;
  global_mail_link: any;
  linkText = 'invisionapp.com/share/AHTW2JVYJ9G#/38360';

  constructor(public dialogRef: MatDialogRef<PostSocialDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonservice: CommonService
  ) {
  }

  ngOnInit() {
  }

  onCopyLink(text) {
    console.log(text);
  }

  onSuccess() {
    this.snackBar.open('Pin link has successfully been copied to your clipboard!', '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: '',
    });
    const sendData = {
      url: '/api/pinner/invite-a-doer',
      data: {
        /* 'reciever_user_name': this.name,
        'reciever_user_email': this.email,
        'message': this.msgText,
        'link_to_Pinner_profile_page': 'https://beta.pindoit.com/pinner/my-profile',
        'link_to_public_pin': 'what',
        'link_to_Doer_registration': 'https://beta.pindoit.com/register' */
        pin_id: '',
      }
    };
    this.commonservice.postCommunityHttpCall(sendData).then((res) => {
      console.log(res);
    });
  }

  onError() {
    this.snackBar.open('Pin link could not be copied. Something went wrong!', '', {
      duration: 4000,
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
