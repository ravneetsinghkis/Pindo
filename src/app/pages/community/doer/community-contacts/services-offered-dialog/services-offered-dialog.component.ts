import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
// declare var $: any;
import { CommonService } from '../../../../../commonservice';
@Component({
  selector: 'services-offered-dialog',
  templateUrl: 'services-offered-dialog.html',
})
export class ServicesOfferedDialog {

  parent_category: any = [];
  doer_id: number;
  user_type: number;
  constructor(public dialogRef: MatDialogRef<ServicesOfferedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private router: Router,
    public commonservice: CommonService
  ) { }

  ngOnInit() {
    this.parent_category = this.data.list_cat_val;
    this.doer_id = this.data.doer_id;
    this.user_type = this.data.user_type;
    this.totalCategoryList(this.doer_id);
  }

  //---------------- Total category----------
  /**
   * Totalcategorylists services offered dialog
   * @param doer_id 
   */
  totalCategoryList(doer_id) {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/doer-categories',
        data: { doer_id: doer_id },
        contenttype: "application/json"
      })
      .then(result => {
        if (result.status == 1) {
          this.parent_category = result.data;
        }
      });
  }

  /**
   * Go to user profile page using user id
   */
  openUserDetails() {
    let b64 = CryptoJS.AES.encrypt(`${this.doer_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    
    if (this.user_type == 1) {
      this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`pinner/pinner-profile/${eHex}`]);
    } else {
      this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`doer/doer-profile/${eHex}`]);
    }
  }

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
