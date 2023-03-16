import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../../commonservice';
// declare var $: any;
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { Globalconstant } from '../../../../global_constant';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'contacts-list-dialog',
  templateUrl: 'contacts-list-dialog.html',
})

export class ContactsListDialog {
  companylogo_url: string = '';
  image_url: string = '';
  badge_url: string = '';
  hiredByDetailsList: any = [];
  is_loggedIn_user: number;
  user_type:number=0;

  constructor(public dialogRef: MatDialogRef<ContactsListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public commonservice: CommonService,
    private router: Router,
    public myGlobals: Globalconstant,
    public snackBar: MatSnackBar,
  ) {
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.badge_url = this.myGlobals.imageUrl;
  }

  ngOnInit() {
    this.hiredByDetailsList = this.data.hiredByList;
    this.is_loggedIn_user = this.data.is_loggedIn_user;
    if(this.is_loggedIn_user){
      localStorage.getItem('user_type')
      this.user_type = parseInt(atob(localStorage.getItem('user_type')));
    }
  }

  closeDialog(): void {
    this.dialogRef.close('close');
  }

  /**
* Opens user details
* @param user_id 
* @param user_type 
*/
  openUserDetails(user_id: number, user_type: number) {
    this.closeDialog();
    let b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    if (user_type == 1) {
      this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`pinner/pinner-profile/${eHex}`]);
    } else {
      this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`doer/doer-profile/${eHex}`]);
    }
  }

}