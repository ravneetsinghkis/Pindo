import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CommonService } from '../../../../commonservice';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { Globalconstant } from '../../../../global_constant';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'contacts-list-dialog',
  templateUrl: 'contacts-list-dialog.html',
})

export class ContactsListDialog {

  all_contacts: any = [];
  friendListGroupWiseArrayList: any;
  image_url: any;
  type: any = 'all';
  active_type = 'all';
  user_type: any;
  companylogo_url: any;

  // user_type1: any;
  loginUserId: any;

  constructor(public dialogRef: MatDialogRef<ContactsListDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public commonservice: CommonService,
    private router: Router,
    public myGlobals: Globalconstant,
    public snackBar: MatSnackBar
  ) {
    // this.user_type1 = parseInt(atob(localStorage.getItem('user_type')));
    this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));
  }

  ngOnInit() {
    this.seeall_community(this.type);
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.user_type = this.data.user_profile;
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
  }

  /**
   * Seealls community
   * @param type 
   */
  seeall_community(type) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/publicUser-contacts-all-mutual',
      data: { filter_1_by: type, user_id: this.data.user_id },
      contenttype: "application/json"
    }).then(result => {
      this.friendListGroupWiseArrayList = [];
      if (result.status == 1) {
        this.all_contacts = result;
        if (this.all_contacts != '') {
          this.friendListGroupWiseArrayList = Object.keys(this.all_contacts.data).map(key => ({ type: key, value: this.all_contacts.data[key] }));

          this.friendListGroupWiseArrayList.forEach(friendGroup => {
            friendGroup.value.forEach(data => {
              data.firstNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'first_name');

              data.lastNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'last_name');

              data.profilePictureShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'profile_photo');
            })
          });
        }
        console.log(this.friendListGroupWiseArrayList);
      }
    });
  }

  /**
   * Seealls community all
   * @param type 
   */
  seeall_community_all(type) {
    this.active_type = type
    this.seeall_community(type);
  }

  /**
   * Seealls community mutual
   * @param type 
   */
  seeall_community_mutual(type) {
    this.active_type = type
    this.seeall_community(type);
  }

  /**
   * Connections send
   * @param user_id 
   * @param user_type 
   */
  addContactToUser(user_id, user_type, mIndex, iIndex) {
    let link = user_type == 1 ? 'community/community-home' : 'doer/community-home';
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/connection-request',
      data: { contacted_user_id: user_id },
      contenttype: "application/json"
    })
      .then(result => {
        if (result.status == 1) {
          // this.friendListGroupWiseArrayList[mIndex].value[iIndex]
          var postData = {
            'sender_id': this.loginUserId,
            'reciver_id': user_id,
            'post_id': '',
            'title': 'You’ve just received a Connection Request',
            'link': link,
            'show_in_todo': 0,
            /*'todo_title':'You’ve received a quote from Doer. Wait for more or hire now!',
            'todo_link': link,*/
          };
          this.myGlobals.notificationSocket.emit("post-community-notification", postData);
          this.responseMessageSnackBar(result.msg);
        } else {
          this.responseMessageSnackBar(result.msg, "error");
        }
      });
  }

  /**
  * Go to user profile
  * @param user_id 
  * @param user_type 
  */
  goToUserProfile(user_id, user_type) {
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

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
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



  /**
   * Go to chat
   * @param user_id 
   * @param user_type 
   */
  goToChat(user_id, user_type) {
    this.commonservice.commonChatRedirectionMethod(user_id, user_type);
  }


}