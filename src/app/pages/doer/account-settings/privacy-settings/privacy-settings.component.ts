import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.scss']
})
export class PrivacySettingsComponent implements OnInit {

  @ViewChild('popUpVar') popupref;

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar) { }

  checked = {
    first_public: true,
    first_comm: true,
    last_public: true,
    last_comm: true,
    photo_public: true,
    photo_comm: true,
    addr_public: true,
    addr_comm: true,
    bio_public: true,
    bio_comm: true,
    int_public: true,
    int_comm: true,
    con_public: true,
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
    addr_comm: true,
    bio_public: true,
    bio_comm: true,
    int_public: true,
    int_comm: true,
    con_public: true,
    con_comm: true,
  };

  allDetails = {
    feed_summary_email: 1,
    comment_email: 1,
    likes_email: 1,
    invite_to_connect_email: 1,
    accepts_email: 1,
    new_add_community: 1,
    invite_to_join_pindo_email: 1,

    first_name: 7,
    last_name: 7,
    profile_photo: 7,
    primary_address: 7,
    bio: 7,
    interest: 7,
    contacts: 7,
  };

  @Input() basicDetails: any;

  ngOnInit() {
    // if (this.basicDetails.user)
    // this.basicDetails
    console.log(this.basicDetails.userType);
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
    if (this.allDetails.primary_address == 2) {
      this.checked.addr_public = false;
      this.checked.addr_comm = false;
    } else if (this.allDetails.primary_address == 4) {
      this.checked.addr_public = false;
      this.checked.addr_comm = true;
    } else if (this.allDetails.primary_address == 5) {
      this.checked.addr_public = true;
      this.checked.addr_comm = false;
    } else if (this.allDetails.primary_address == 7) {
      this.checked.addr_public = true;
      this.checked.addr_comm = true;
    }

    this.checked2.addr_public = this.checked.addr_public;
    this.checked2.addr_comm = this.checked.addr_comm;
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
          this.allDetails = result.data;
          this.setData();
        } else {
          if (this.basicDetails.userType == 1) {
            this.allDetails = {
              feed_summary_email: 1,
              comment_email: 1,
              likes_email: 1,
              invite_to_connect_email: 1,
              accepts_email: 1,
              new_add_community: 1,
              invite_to_join_pindo_email: 1,

              first_name: 7,
              last_name: 7,
              profile_photo: 7,
              primary_address: 2,
              bio: 7,
              interest: 7,
              contacts: 7,
            };

            this.checked = {
              first_public: true,
              first_comm: true,
              last_public: true,
              last_comm: true,
              photo_public: true,
              photo_comm: true,
              addr_public: false,
              addr_comm: false,
              bio_public: true,
              bio_comm: true,
              int_public: true,
              int_comm: true,
              con_public: true,
              con_comm: true,
            };

            this.checked2 = {
              first_public: true,
              first_comm: true,
              last_public: true,
              last_comm: true,
              photo_public: true,
              photo_comm: true,
              addr_public: false,
              addr_comm: false,
              bio_public: true,
              bio_comm: true,
              int_public: true,
              int_comm: true,
              con_public: true,
              con_comm: true,
            };
          }
        }
      }
    });
  }

  toggle(event, msg) {
    // console.log(event, msg);
    if (msg == 'addr_public') {
      this.checked.addr_public = event.checked;
    }
    if (msg == 'addr_comm') {
      this.checked.addr_comm = event.checked;
    }
  }

  onSave() {
    if (this.checked.addr_public == false && this.checked.addr_comm == false) {
      this.allDetails.primary_address = 2;
    } else if (this.checked.addr_public == false && this.checked.addr_comm == true) {
      this.allDetails.primary_address = 4;
    } else if (this.checked.addr_public == true && this.checked.addr_comm == false) {
      this.allDetails.primary_address = 5;
    } else if (this.checked.addr_public == true && this.checked.addr_comm == true) {
      this.allDetails.primary_address = 7;
    }

    const data = [
      { 'feed_summary_email': this.allDetails.feed_summary_email },
      { 'comment_email': this.allDetails.comment_email },
      { 'likes_email': this.allDetails.likes_email },
      { 'invite_to_connect_email': this.allDetails.invite_to_connect_email },
      { 'accepts_email': this.allDetails.accepts_email },
      { 'new_add_community': this.allDetails.new_add_community },
      { 'invite_to_join_pindo_email': this.allDetails.invite_to_join_pindo_email },

      { 'first_name': this.allDetails.first_name },
      { 'last_name': this.allDetails.last_name },
      { 'profile_photo': this.allDetails.profile_photo },
      { 'primary_address': this.allDetails.primary_address },
      { 'bio': this.allDetails.bio },
      { 'interest': this.allDetails.interest },
      { 'contacts': this.allDetails.contacts },
    ];
    const data2 = { data: JSON.stringify(data) };
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/pinner-manage-profile-notification-setting',
      data: data2,
      contenttype: 'application/json'
    }, false)
      .then(result => {
        console.log(result);
        if (result.status == 1) {
          this.responseMessageSnackBar(result.msg, 'orangeSnackBar');
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  closeModal() {
    if (this.checkValueUpdateORNot()) {
      Swal({
        title: 'Do you want to save your activity?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E6854A',
        confirmButtonText: 'SAVE',
        cancelButtonText: 'CANCEL',
      }).then((resultswal) => {
        if (resultswal.value) {
          this.onSave();
        } else {
          this.togglePopup();
        }
      });
    } else {
      this.togglePopup();
    }
  }

  checkValueUpdateORNot() {
    if (this.checked2.addr_public != this.checked.addr_public || this.checked2.addr_comm != this.checked.addr_comm) {
      return true;
    } else {
      return false;
    }
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }
}
