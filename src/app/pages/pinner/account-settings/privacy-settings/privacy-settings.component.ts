import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.scss']
})
export class PrivacySettingsComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  privacySettingDetails: any = {};
  flag: any;
  checked = {
    first_public: true,
    first_comm: true,
    last_public: true,
    last_comm: true,
    photo_public: true,
    photo_comm: true,
    addr_public: true,
    addr_comm: false,
    bio_public: false,
    bio_comm: true,
    int_public: false,
    int_comm: true,
    con_public: false,
    con_comm: true,
  };
  checked2 = {
    first_public: true,
    first_comm: true,
    last_public: true,
    last_comm: true,
    photo_public: true,
    photo_comm: true,
    addr_public: true,
    addr_comm: false,
    bio_public: false,
    bio_comm: true,
    int_public: false,
    int_comm: true,
    con_public: false,
    con_comm: true,
  };
  toSend = {
    first: 7,
    last: 7,
    photo: 7,
    addr: 5,
    bio: 4,
    int: 4,
    con: 4,
  };
  currentEmailDetails = {
    feed_summary_email: 1,
    comment_email: 1,
    likes_email: 1,
    invite_to_connect_email: 1,
    accepts_email: 1,
    new_add_community: 1,
    invite_to_join_pindo_email: 1
  };

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant) { }

  ngOnInit() {
  }

  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.getData();
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  setData() {
    if (this.privacySettingDetails.first_name == 2) {
      this.checked.first_public = false;
      this.checked.first_comm = false;
    } else if (this.privacySettingDetails.first_name == 4) {
      this.checked.first_public = false;
      this.checked.first_comm = true;
    } else if (this.privacySettingDetails.first_name == 5) {
      this.checked.first_public = true;
      this.checked.first_comm = false;
    } else if (this.privacySettingDetails.first_name == 7) {
      this.checked.first_public = true;
      this.checked.first_comm = true;
    }

    if (this.privacySettingDetails.last_name == 2) {
      this.checked.last_public = false;
      this.checked.last_comm = false;
    } else if (this.privacySettingDetails.last_name == 4) {
      this.checked.last_public = false;
      this.checked.last_comm = true;
    } else if (this.privacySettingDetails.last_name == 5) {
      this.checked.last_public = true;
      this.checked.last_comm = false;
    } else if (this.privacySettingDetails.last_name == 7) {
      this.checked.last_public = true;
      this.checked.last_comm = true;
    }

    if (this.privacySettingDetails.profile_photo == 2) {
      this.checked.photo_public = false;
      this.checked.photo_comm = false;
    } else if (this.privacySettingDetails.profile_photo == 4) {
      this.checked.photo_public = false;
      this.checked.photo_comm = true;
    } else if (this.privacySettingDetails.profile_photo == 5) {
      this.checked.photo_public = true;
      this.checked.photo_comm = false;
    } else if (this.privacySettingDetails.profile_photo == 7) {
      this.checked.photo_public = true;
      this.checked.photo_comm = true;
    }

    if (this.privacySettingDetails.primary_address == 2) {
      this.checked.addr_public = false;
      this.checked.addr_comm = false;
    } else if (this.privacySettingDetails.primary_address == 4) {
      this.checked.addr_public = false;
      this.checked.addr_comm = true;
    } else if (this.privacySettingDetails.primary_address == 5) {
      this.checked.addr_public = true;
      this.checked.addr_comm = false;
    } else if (this.privacySettingDetails.primary_address == 7) {
      this.checked.addr_public = true;
      this.checked.addr_comm = true;
    }

    if (this.privacySettingDetails.bio == 2) {
      this.checked.bio_public = false;
      this.checked.bio_comm = false;
    } else if (this.privacySettingDetails.bio == 4) {
      this.checked.bio_public = false;
      this.checked.bio_comm = true;
    } else if (this.privacySettingDetails.bio == 5) {
      this.checked.bio_public = true;
      this.checked.bio_comm = false;
    } else if (this.privacySettingDetails.bio == 7) {
      this.checked.bio_public = true;
      this.checked.bio_comm = true;
    }

    if (this.privacySettingDetails.interest == 2) {
      this.checked.int_public = false;
      this.checked.int_comm = false;
    } else if (this.privacySettingDetails.interest == 4) {
      this.checked.int_public = false;
      this.checked.int_comm = true;
    } else if (this.privacySettingDetails.interest == 5) {
      this.checked.int_public = true;
      this.checked.int_comm = false;
    } else if (this.privacySettingDetails.interest == 7) {
      this.checked.int_public = true;
      this.checked.int_comm = true;
    }

    if (this.privacySettingDetails.contacts == 2) {
      this.checked.con_public = false;
      this.checked.con_comm = false;
    } else if (this.privacySettingDetails.contacts == 4) {
      this.checked.con_public = false;
      this.checked.con_comm = true;
    } else if (this.privacySettingDetails.contacts == 5) {
      this.checked.con_public = true;
      this.checked.con_comm = false;
    } else if (this.privacySettingDetails.contacts == 7) {
      this.checked.con_public = true;
      this.checked.con_comm = true;
    }

    this.checked2.first_public = this.checked.first_public;
    this.checked2.first_comm = this.checked.first_comm;
    this.checked2.last_public = this.checked.last_public;
    this.checked2.last_comm = this.checked.last_comm;
    this.checked2.photo_public = this.checked.photo_public;
    this.checked2.photo_comm = this.checked.photo_comm;
    this.checked2.addr_public = this.checked.addr_public;
    this.checked2.addr_comm = this.checked.addr_comm;
    this.checked2.bio_public = this.checked.bio_public;
    this.checked2.bio_comm = this.checked.bio_comm;
    this.checked2.int_public = this.checked.int_public;
    this.checked2.int_comm = this.checked.int_comm;
    this.checked2.con_public = this.checked.con_public;
    this.checked2.con_comm = this.checked.con_comm;
  }

  getData() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/list-privacy',
      data: {},
      contenttype: 'application/json'
    }, false).then(result => {
      if (result.status == 1) {
        // console.log(result);
        // this.data = result.data;
        if (result.data) {
          this.privacySettingDetails = result.data;
          this.currentEmailDetails.feed_summary_email = result.data.feed_summary_email;
          this.currentEmailDetails.comment_email = result.data.comment_email;
          this.currentEmailDetails.likes_email = result.data.likes_email;
          this.currentEmailDetails.invite_to_connect_email = result.data.invite_to_connect_email;
          this.currentEmailDetails.accepts_email = result.data.accepts_email;
          this.currentEmailDetails.new_add_community = result.data.new_add_community;
          this.currentEmailDetails.invite_to_connect_email = result.data.invite_to_connect_email;
          this.setData();
        }
      }
    });
  }


  checkValueUpdateORNot(): boolean {
    if (
      this.checked2.first_public != this.checked.first_public ||
      this.checked2.first_comm != this.checked.first_comm ||
      this.checked2.last_public != this.checked.last_public ||
      this.checked2.last_comm != this.checked.last_comm ||
      this.checked2.photo_public != this.checked.photo_public ||
      this.checked2.photo_comm != this.checked.photo_comm ||
      this.checked2.addr_public != this.checked.addr_public ||
      this.checked2.addr_comm != this.checked.addr_comm ||
      this.checked2.bio_public != this.checked.bio_public ||
      this.checked2.bio_comm != this.checked.bio_comm ||
      this.checked2.int_public != this.checked.int_public ||
      this.checked2.int_comm != this.checked.int_comm ||
      this.checked2.con_public != this.checked.con_public ||
      this.checked2.con_comm != this.checked.con_comm
    ) {
      return true;
    } else {
      return false;
    }
  }

  closeModal() {
    if (this.checkValueUpdateORNot()) {
      Swal({
        title: this.myGlobals.updateDataBackAlertMsg,
        text: '',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'YES',
        cancelButtonText: 'BACK',
      }).then((resultswal) => {
        if (resultswal.value) {
          this.togglePopup();
        }
      });
    } else {
      this.togglePopup();
    }
  }

  toggle(event, msg) {
    // console.log(event, msg);
    if (msg == 'first_public') {
      this.checked.first_public = event.checked;
    }
    if (msg == 'first_comm') {
      this.checked.first_comm = event.checked;
    }
    if (msg == 'last_public') {
      this.checked.last_public = event.checked;
    }
    if (msg == 'last_comm') {
      this.checked.last_comm = event.checked;
    }
    if (msg == 'photo_public') {
      this.checked.photo_public = event.checked;
    }
    if (msg == 'photo_comm') {
      this.checked.photo_comm = event.checked;
    }
    if (msg == 'addr_public') {
      this.checked.addr_public = event.checked;
    }
    if (msg == 'addr_comm') {
      this.checked.addr_comm = event.checked;
    }
    if (msg == 'bio_public') {
      this.checked.bio_public = event.checked;
    }
    if (msg == 'bio_comm') {
      this.checked.bio_comm = event.checked;
    }
    if (msg == 'int_public') {
      this.checked.int_public = event.checked;
    }
    if (msg == 'int_comm') {
      this.checked.int_comm = event.checked;
    }
    if (msg == 'con_public') {
      this.checked.con_public = event.checked;
    }
    if (msg == 'con_comm') {
      this.checked.con_comm = event.checked;
    }
  }

  /**
   * Determines whether save on
   */
  onSave() {
    if (this.checked.first_public == false && this.checked.first_comm == false) {
      this.toSend.first = 2;
    } else if (this.checked.first_public == false && this.checked.first_comm == true) {
      this.toSend.first = 4;
    } else if (this.checked.first_public == true && this.checked.first_comm == false) {
      this.toSend.first = 5;
    } else if (this.checked.first_public == true && this.checked.first_comm == true) {
      this.toSend.first = 7;
    }

    if (this.checked.last_public == false && this.checked.last_comm == false) {
      this.toSend.last = 2;
    } else if (this.checked.last_public == false && this.checked.last_comm == true) {
      this.toSend.last = 4;
    } else if (this.checked.last_public == true && this.checked.last_comm == false) {
      this.toSend.last = 5;
    } else if (this.checked.last_public == true && this.checked.last_comm == true) {
      this.toSend.last = 7;
    }

    if (this.checked.photo_public == false && this.checked.photo_comm == false) {
      this.toSend.photo = 2;
    } else if (this.checked.photo_public == false && this.checked.photo_comm == true) {
      this.toSend.photo = 4;
    } else if (this.checked.photo_public == true && this.checked.photo_comm == false) {
      this.toSend.photo = 5;
    } else if (this.checked.photo_public == true && this.checked.photo_comm == true) {
      this.toSend.photo = 7;
    }

    if (this.checked.addr_public == false && this.checked.addr_comm == false) {
      this.toSend.addr = 2;
    } else if (this.checked.addr_public == false && this.checked.addr_comm == true) {
      this.toSend.addr = 4;
    } else if (this.checked.addr_public == true && this.checked.addr_comm == false) {
      this.toSend.addr = 5;
    } else if (this.checked.addr_public == true && this.checked.addr_comm == true) {
      this.toSend.addr = 7;
    }

    if (this.checked.bio_public == false && this.checked.bio_comm == false) {
      this.toSend.bio = 2;
    } else if (this.checked.bio_public == false && this.checked.bio_comm == true) {
      this.toSend.bio = 4;
    } else if (this.checked.bio_public == true && this.checked.bio_comm == false) {
      this.toSend.bio = 5;
    } else if (this.checked.bio_public == true && this.checked.bio_comm == true) {
      this.toSend.bio = 7;
    }

    if (this.checked.int_public == false && this.checked.int_comm == false) {
      this.toSend.int = 2;
    } else if (this.checked.int_public == false && this.checked.int_comm == true) {
      this.toSend.int = 4;
    } else if (this.checked.int_public == true && this.checked.int_comm == false) {
      this.toSend.int = 5;
    } else if (this.checked.int_public == true && this.checked.int_comm == true) {
      this.toSend.int = 7;
    }

    if (this.checked.con_public == false && this.checked.con_comm == false) {
      this.toSend.con = 2;
    } else if (this.checked.con_public == false && this.checked.con_comm == true) {
      this.toSend.con = 4;
    } else if (this.checked.con_public == true && this.checked.con_comm == false) {
      this.toSend.con = 5;
    } else if (this.checked.con_public == true && this.checked.con_comm == true) {
      this.toSend.con = 7;
    }

    let data = [
      { 'feed_summary_email': this.currentEmailDetails.feed_summary_email },
      { 'comment_email': this.currentEmailDetails.comment_email },
      { 'likes_email': this.currentEmailDetails.likes_email },
      { 'invite_to_connect_email': this.currentEmailDetails.invite_to_connect_email },
      { 'accepts_email': this.currentEmailDetails.accepts_email },
      { 'new_add_community': this.currentEmailDetails.new_add_community },
      { 'invite_to_join_pindo_email': this.currentEmailDetails.invite_to_join_pindo_email },
      { 'first_name': this.toSend.first },
      { 'last_name': this.toSend.last },
      { 'profile_photo': this.toSend.photo },
      { 'primary_address': this.toSend.addr },
      { 'bio': this.toSend.bio },
      { 'interest': this.toSend.int },
      { 'contacts': this.toSend.con },
    ];
    let data2 = { data: JSON.stringify(data) };
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/pinner-manage-profile-notification-setting',
      data: data2, contenttype: 'application/json'
    }, false)
      .then(result => {
        console.log(result);
        if (result.status == 1) {
          this.responseMessageSnackBar(result.msg);
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
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
