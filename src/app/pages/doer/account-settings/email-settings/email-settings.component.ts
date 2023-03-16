import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss']
})
export class EmailSettingsComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  @Input() ID: any;

  feedVal: any = 1;
  responseVal: any = 1;
  conectVal: any = 1;
  acceptedVal: any = 1;
  addedVal: any = 1;
  joinedVal: any = 1;

  feedVal2: any = 1;
  responseVal2: any = 1;
  conectVal2: any = 1;
  acceptedVal2: any = 1;
  addedVal2: any = 1;
  joinedVal2: any = 1;

  currentPrivacyDetails = {
    first_name: 7,
    last_name: 7,
    profile_photo: 7,
    primary_address: 7,
    bio: 7,
    interest: 7,
    contacts: 7,
  };

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant) { }

  ngOnInit() {
  }

  getData() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/list-privacy',
      data: {},
      contenttype: 'application/json'
    }, false).then(result => {
      if (result.status == 1) {
        console.log(result);
        if (result.data) {
          this.currentPrivacyDetails.first_name = result.data.first_name;
          this.currentPrivacyDetails.last_name = result.data.last_name;
          this.currentPrivacyDetails.profile_photo = result.data.profile_photo;
          this.currentPrivacyDetails.primary_address = result.data.primary_address;
          this.currentPrivacyDetails.bio = result.data.bio;
          this.currentPrivacyDetails.interest = result.data.interest;
          this.currentPrivacyDetails.contacts = result.data.contacts;

          this.feedVal = result.data.feed_summary_email == 1 ? true : false;
          this.responseVal = result.data.likes_email == 1 ? true : false;
          this.conectVal = result.data.invite_to_connect_email === 1 ? true : false;
          this.acceptedVal = result.data.accepts_email == 1 ? true : false;
          this.addedVal = result.data.new_add_community == 1 ? true : false;
          this.joinedVal = result.data.invite_to_join_pindo_email == 1 ? true : false;

          this.feedVal2 = this.feedVal;
          this.responseVal2 = this.responseVal;
          this.conectVal2 = this.conectVal;
          this.acceptedVal2 = this.acceptedVal;
          this.addedVal2 = this.addedVal;
          this.joinedVal2 = this.joinedVal;
        }
      }
    });
  }
  togglePopup() {
    // console.log(this.popupref);
    console.log(this.ID);
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.getData();
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
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
  checkValueUpdateORNot(): boolean {
    if (
      this.feedVal != this.feedVal2 ||
      this.responseVal != this.responseVal2 ||
      this.conectVal != this.conectVal2 ||
      this.acceptedVal != this.acceptedVal2 ||
      this.addedVal != this.addedVal2 ||
      this.joinedVal != this.joinedVal2
    ) {
      return true;
    } else {
      return false;
    }
  }
  setToggle(event, msg) {
    console.log(event, msg);
    if (msg == 'feed') {
      this.feedVal = event.checked;
    } else if (msg == 'response') {
      this.responseVal = event.checked;
    } else if (msg == 'connect') {
      this.conectVal = event.checked;
    } else if (msg == 'accepted') {
      this.acceptedVal = event.checked;
    } else if (msg == 'added') {
      this.addedVal = event.checked;
    } else if (msg == 'joined') {
      this.joinedVal = event.checked;
    }
  }
  onSave() {
    this.feedVal = this.feedVal == true ? 1 : 0;
    this.responseVal = this.responseVal == true ? 1 : 0;
    this.conectVal = this.conectVal == true ? 1 : 0;
    this.acceptedVal = this.acceptedVal == true ? 1 : 0;
    this.addedVal = this.addedVal == true ? 1 : 0;
    this.joinedVal = this.joinedVal == true ? 1 : 0;

    console.log(this.feedVal, this.responseVal, this.conectVal, this.acceptedVal, this.addedVal, this.joinedVal);
    let data = [
      { 'feed_summary_email': this.feedVal },
      { 'comment_email': 1 },
      { 'likes_email': 1 },
      { 'invite_to_connect_email': this.conectVal },
      { 'accepts_email': this.acceptedVal },
      { 'new_add_community': this.addedVal },
      { 'invite_to_join_pindo_email': this.joinedVal },

      { 'first_name': 7 },
      { 'last_name': 7 },
      { 'profile_photo': 7 },
      { 'primary_address': this.currentPrivacyDetails.primary_address },
      { 'bio': 7 },
      { 'interest': 7 },
      { 'contacts': 7 },
    ];
    let data2 = { data: JSON.stringify(data) };
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/pinner-manage-profile-notification-setting',
      data: data2, contenttype: 'application/json'
    }, false)
      .then(result => {
        console.log(result);
        if (result.status == 1) {
          this.responseMessageSnackBar(result.msg , 'orangeSnackBar');
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }
  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

}
