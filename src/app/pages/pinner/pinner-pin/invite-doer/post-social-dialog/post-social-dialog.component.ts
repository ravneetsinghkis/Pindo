import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var $: any;
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Globalconstant } from 'src/app/global_constant';


@Component({
  selector: 'post-social-dialog',
  templateUrl: 'post-social-dialog.html',
  styleUrls: ['./post-social-dialog.scss']
})
export class PostSocialDialog implements OnInit {
  contactMailSend: any;
  submitted: boolean = false;
  invite_pindo: FormGroup;
  global_mail_link: any;
  linkText: any;
  pinID: any;
  fbShareUrl: any;
  pin_id: any;
  desc = 'desc';
  title = 'text';

  constructor(public dialogRef: MatDialogRef<PostSocialDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public route: ActivatedRoute,
    public globalconstant: Globalconstant
  ) {
    this.linkText = this.globalconstant.frontend_url + '/public-pins/' + this.data.slug;
  }

  ngOnInit() {
    this.fbShareUrl = this.linkText;
    this.pinID = localStorage.getItem('pinID');
    console.log(this.fbShareUrl);
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
    this.commonservice.postHttpCall({
      url: '/pinners/mark-as-public-pin',
      data: { pin_id: this.data.slug },
      contenttype: 'application/json'
    })
      .then(result => {
        // if (result.status == 1) {
        //   this.snackBar.open(result.msg, '', {
        //     duration: 4000,
        //     horizontalPosition: 'right',
        //     verticalPosition: 'bottom',
        //     panelClass: '',
        //   });
        // } else {
        //   this.snackBar.open(result.msg, '', {
        //     duration: 4000,
        //     horizontalPosition: 'right',
        //     verticalPosition: 'bottom',
        //     panelClass: 'error',
        //   });
        // }
        }
      );
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
