import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
declare var $: any;
import { CommonService } from '../../../../commonservice';
@Component({
  selector: 'services-offered-dialog',
  templateUrl: 'services-offered-dialog.html',
})
export class ServicesOfferedDialog {

  parent_category: any = [];
  user_id: any;
  constructor(public dialogRef: MatDialogRef<ServicesOfferedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, private router: Router, public commonservice: CommonService
  ) {

  }
  ngOnInit() {
    this.parent_category = this.data.list_cat_val;
    this.user_id = this.data.user_id;
    this.totalCategoryList(this.user_id);
  }
  //---------------- Total category----------
  /**
   * Totalcategorylists services offered dialog
   * @param user_id 
   */
  totalCategoryList(user_id) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/doer-categories', data: { doer_id: user_id }, contenttype: "application/json" }).then(result => {
      if (result.status == 1) {
        this.parent_category = result.data;
      }
    });
  }
  /**
   * Go to user profile page using user id
   * @param user_id 
   */
  goToUserDetails(user_id) {
    let b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    console.log(eHex);
    this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
  }
  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
    // $("#nb-global-spinner").hide();
  }

}