import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { PinnerContactComponent } from './pinner-contact/pinner-contact.component';
import { PinnerControlComponent } from './pinner-control/pinner-control.component';
import { OterAddressesComponent } from './oter-addresses/oter-addresses.component';
import { ProfileNotificationSettingsComponent } from './profile-notification-settings/profile-notification-settings.component';
import Swal from 'sweetalert2';
import { ProfileEmailSettingsComponent } from './profile-email-settings/profile-email-settings.component';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-pinner-profile',
  templateUrl: './pinner-profile.component.html',
  styleUrls: ['./pinner-profile.component.scss']
})
export class PinnerProfileComponent implements OnInit {
  imageObj: any = null;
  isOtherContactPopulated = false;
  isContactInformationPopulated = false;
  isControlInformationPopulated = false;
  isBasicDetailsPopulated = false;
  showView: boolean = false;
  @ViewChild('popupref')
  popupref;

  @ViewChild('cntInfo')
  private cntInfo: PinnerContactComponent;

  @ViewChild('cntrolInfo')
  private cntrolInfo: PinnerControlComponent;

  @ViewChild('appOtherAddress')
  private appOtherAddress: OterAddressesComponent;


  @ViewChild('notificationcntrolInfo')
  private notificationcntrolInfo: ProfileNotificationSettingsComponent;


  @ViewChild('emailcntrolInfo')
  private emailcntrolInfo: ProfileEmailSettingsComponent;

  basicDetailsFormModel = {
    imageObj: {},
    user_id: '',
    first_name: '',
    last_name: '',
    username: '',
    imgUrl: []
  };

  exceedSizeLimit = false;

  imgUrl = '';
  perm_img = '';
  primary_location: any = {};
  ifImageUpped = false;
  oncesubmitted: boolean = false;
  basicDet = {};

  submitted = false;

  constructor(public titleService: Title, public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar) {
    // console.log('yes')
    this.titleService.setTitle('My Profile');
    this.getProfileDetails();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.showView = true;
    setTimeout(() => {
      if (!this.isBasicDetailsPopulated || !this.isOtherContactPopulated || this.isContactInformationPopulated != true) {
        Swal({
          title: 'Complete Profile',
          text: 'Please fill in your basic profile information (name, address, & contact info) so you can start connecting with your contacts and community and create pins to get stuff done.',
          confirmButtonColor: '#bad141',
          confirmButtonText: 'OK',
        });
      }
    }, 3000);

    // if(localStorage.getItem('initial_redirection_to_profile_page')=='1'){
    //   localStorage.removeItem('initial_redirection_to_profile_page');

    // }
  }

  onDelete(e) {
    console.log(e);
    this.imageObj = '';
    this.imgUrl = '';
    this.submitted = false;
  }

  clearImage() {
    this.imageObj = '';
    this.imgUrl = '';
    this.submitted = false;
  }

  accptFile(e) {
    if (e.file['size'] >= 2097152) {
      setTimeout(() => {
        $(document).find('.remove_custom').trigger('click');
        $(document).find('body .input-file-container .delete-button').trigger('click');
      }, 50);
      this.exceedSizeLimit = true;
    }
    else {
      console.log(e.file);
      this.imageObj = e.file;
      this.imgUrl = '';
      this.ifImageUpped = true;
      this.exceedSizeLimit = false;
    }
  }

  lengthUpdate(event, profileSlug) {
    if (profileSlug == 'otherAddress') {
      this.isOtherContactPopulated = event;
      if (this.isOtherContactPopulated) {
        this.getProfileDetails();
      }
    }
    else if (profileSlug == 'contactInformation') {
      this.isContactInformationPopulated = event;
    }
    else if (profileSlug == 'controlInformation') {
      this.isControlInformationPopulated = event;
      this.getProfileDetails();
    }
    else if (profileSlug == 'notificationcontrolInformation') {
      this.isControlInformationPopulated = event;
      this.getProfileDetails();
    }
    else if (profileSlug == 'emailcontrolInformation') {
      this.isControlInformationPopulated = event;
      this.getProfileDetails();
    }

    console.log('contact', this.isContactInformationPopulated);
    console.log('control', this.isControlInformationPopulated);
  }

  toggleParentPopup(profileSlug) {
    if (profileSlug === 'PinnerContactInformationComponent') {
      this.cntInfo.togglePopup();
    } else if (profileSlug === 'OterAddressesComponent') {
      this.appOtherAddress.togglePopup();
    }
  }

  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    }
    else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  getProfileDetails() {
    this.commonservice.postHttpCall({ url: '/pinners/get-basic-profile', data: {}, contenttype: 'application/json' }).then(result => this.profileDetailsSuccess(result));
  }

  profileDetailsSuccess(response) {
    if (response.status == 1) {
      console.log(response.data);
      this.basicDet = response.data;
      //this.populateListing();
      // this.basicDetailsFormModel.name = response.data.name;
      this.basicDetailsFormModel.user_id = response.data.id;
      this.basicDetailsFormModel.first_name = response.data.first_name;
      this.basicDetailsFormModel.last_name = response.data.last_name;
      this.basicDetailsFormModel.username = response.data.username;
      this.imgUrl = response.data.profile_photo;
      this.perm_img = response.data.profile_photo;
      this.primary_location = response.data.primary_location;

      //if(this.basicDetailsFormModel.name!='' && this.imgUrl!='' && this.primary_location!=null){
      if (this.basicDetailsFormModel.first_name != '' && this.basicDetailsFormModel.last_name != '' && this.imgUrl != '') {
        this.isBasicDetailsPopulated = true;
      }
      //this.basicDetailsFormModel.imgUrl.push(response.data.company_logo);
      if (response.data.redirected_to_profile_page == 0) {
        this.updateRedirectedToProfilePageFirstTimeAfterLogin();
      }
    }
  }

  submitDetails(values, validcheck, totForm, submitType) {
    //console.log(values);

    if (validcheck) {
      let fd = new FormData();
      Object.keys(values).forEach(function (key) {
        if (key == 'pImg') {
          fd.append(key, values[key].formatted);
        }
        else {
          fd.append(key, values[key]);
        }
      });

      if (this.imageObj) {
        fd.append('company_logo', this.imageObj);
        fd.append('status', 'haveImage');
      } else if (this.imageObj == null) {
        fd.append('status', 'unchanged');
      }
      else {
        fd.append('status', 'deleted');
      }
      console.log(values);

      this.commonservice.postHttpCall({ url: '/pinners/update-profile', data: fd, contenttype: 'from-data' }).then(result => this.submitSuccess(result, totForm));
    }
  }

  submitSuccess(response, frmElm) {
    if (response.status == 1) {
      //this.populateListing();
      //this.resetFunction(frmElm); 
      if (this.imageObj != null && this.imageObj != '') {
        this.submitted = true;
      }
      this.oncesubmitted = true;
      this.getProfileDetails();
      this.responseMessageSnackBar(response.msg);
      this.commonservice.filter('Register click');
    }
  }


  updateRedirectedToProfilePageFirstTimeAfterLogin() {
    this.commonservice.postHttpCall({ url: '/update-redirect-after-login', data: {}, contenttype: 'application/json' }).then(result => this.getRediectSuccess(result));
  }

  getRediectSuccess(response) {
    console.log(response);
  }


  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

}
