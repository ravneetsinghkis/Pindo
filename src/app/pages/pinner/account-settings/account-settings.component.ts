import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountSettingBasicDetailsComponent } from './account-setting-basic-details/account-setting-basic-details.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import { UpdateContactComponent } from './update-contact/update-contact.component';
import { LocationSettingsComponent } from './location-settings/location-settings.component';
import { VerifyBankAccountComponent } from './verify-bank-account/verify-bank-account.component';

import { Component, OnInit, ViewChild, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from 'src/app/global_constant';
import Swal from 'sweetalert2';
import { CrewApplicationComponent } from 'src/app/shared/crew-application/crew-application.component';
import { Observable, Subscription } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/layout/pending-changes.guard';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  @ViewChild('emailSettingsInfo')
  private emailSettingsInfo: EmailSettingsComponent;

  @ViewChild('privacySettingsInfo')
  private privacySettingsInfo: PrivacySettingsComponent;

  @ViewChild('addPaymentMethodInfo')
  private addPaymentMethodInfo: AddPaymentMethodComponent;

  @ViewChild('locationSettingsInfo')
  private locationSettingsInfo: LocationSettingsComponent;

  @ViewChild('updateContactInfo')
  private updateContactInfo: UpdateContactComponent;

  @ViewChild('accountSettingBasicDetailsInfo')
  private accountSettingBasicDetailsInfo: AccountSettingBasicDetailsComponent;

  @ViewChild('changePasswordInfo')
  private changePasswordInfo: ChangePasswordComponent;

  @ViewChild('verifyBankAccountInfo')
  private verifyBankAccountInfo: VerifyBankAccountComponent;

  @ViewChild('crewApplication')
  private crewApplication: CrewApplicationComponent;

  basicDetails: any = {};
  originalBasicContactDetails: any = {};
  updatedBasicContactDetails: any = {};
  locationDetailsList: any = [];
  cardOrBankDetailsListing: any = [];
  imgUrl: string = '';
  profile_url: string;

  profilePasswordStatus: Boolean = false;
  profileBasicInformationStatus: Boolean = false;
  profileContactInformationStatus: Boolean = false;
  profileLocationStatus: Boolean = false;
  profilePaymentInformationStatus: Boolean = false;
  profileEmailStatus: Boolean = true;
  profilePrivacyStatus: Boolean = true;

  basicFirstTimeCall: Boolean = false;
  contactFirstTimeCall: Boolean = false;
  LocationFirstTimeCall: Boolean = false;

  leftFilterBoxOpen: boolean = false;

  crewMemberDetails: any;
  isCrewMember: boolean = false;

  logOutClickedSubscription: Subscription;
  logoutInitiated: boolean = false;

  creditCardCount: number = 0;
  bankCount: number = 0;

  constructor(public renderer: Renderer2, public el: ElementRef,
    public titleService: Title, public commonservice: CommonService,
    public snackBar: MatSnackBar, public myGlobals: Globalconstant) {
    this.titleService.setTitle('Account setting');
    this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.getProfileDetails();
    // this.getContactInformation();
    // this.getLocationDetailsList();
    this.getPaymentCardListing();

  }

  ngOnInit() {
    this.logOutClickedSubscription = this.commonservice._listnerForLogoutClicked.subscribe(data => {
      this.logoutInitiated = !!data;
    });
  }

  /**
   * Toggles parent popup
   * @param profileSlug
   */
  toggleParentPopup(profileSlug) {
    if (profileSlug === 'EmailSettingsComponent') {
      this.emailSettingsInfo.togglePopup();
    } else if (profileSlug === 'PrivacySettingsComponent') {
      this.privacySettingsInfo.togglePopup();
    } else if (profileSlug === 'AddCardPaymentMethodComponent') {
      localStorage.setItem('cardOrBankDetails', 'newCard');
      this.addPaymentMethodInfo.togglePopup();
    } else if (profileSlug === 'AddBankPaymentMethodComponent') {
      localStorage.setItem('cardOrBankDetails', 'newBank');
      this.addPaymentMethodInfo.togglePopup();
    } else if (profileSlug === 'updateContactInfo') {
      this.updateContactInfo.togglePopup();
    } else if (profileSlug === 'locationSettingsInfo') {
      localStorage.setItem('updateLocationDetails', '');
      this.locationSettingsInfo.togglePopup();
    } else if (profileSlug == 'basicDetails') {
      this.accountSettingBasicDetailsInfo.togglePopup();
    } else if (profileSlug == 'changePasswordInfo') {
      this.changePasswordInfo.togglePopup();
    } else if (profileSlug == 'verifyBankAccountInfo') {
      this.verifyBankAccountInfo.togglePopup();
    } else if(profileSlug == 'CrewApplicationComponent') {
      this.crewApplication.togglePopup();
    }
  }

  /**
   * Updates location
   * @param index
   */
  updateLocation(index) {
    localStorage.setItem('updateLocationDetails', JSON.stringify(this.locationDetailsList[index]));
    this.locationSettingsInfo.togglePopup();
  }

  /**
   * Deletes location
   * @param index
   */
  deleteLocation(index) {
    Swal({
      title: 'Are you sure?',
      text: this.myGlobals.deleteLocationConfirmationMsg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((resultswal) => {
      if (resultswal.value) {
        this.deleteLocationById(this.locationDetailsList[index].id, index);
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

  /**
   * Gets account setting update details by type
   * @param event
   * @param type
   */
  getAccountSettingUpdateDetailsByType(event, type) {
    if (type == 'basicInformation' && event) {
      this.getProfileDetails();
    } else if (type == 'contactInformation' && event) {
      this.getContactInformation();
    } else if (type == 'passwordUpdate' && event) {
      this.getProfileDetails();
    } else if (type == 'locationInformation' && event) {
      this.getLocationDetailsList();
    } else if (type == 'paymentInformation' && event) {
      if (event == 'newBankAdd') {
        this.showBankInformationAlert();
      }
      this.getPaymentCardListing();
    }
  }

  /**
   * Gets profile details
   */
  getProfileDetails() {
    this.commonservice.postHttpCall({
      url: '/pinners/get-basic-profile',
      data: {}, contenttype: 'application/json'
    })
      .then(result => {
        this.populateProfileDetails(result);
      });
  }

  /**
   * Populates profile details
   * @param response
   */
  populateProfileDetails(response) {

    if (response.status == 1) {
      this.basicDetails = response.data;
      if (this.basicDetails.user_bio == null) {
        this.basicDetails.bio = '';
      } else {
        this.basicDetails.bio = this.basicDetails.user_bio.bio;
      }
      // console.log(response.data.profile_photo);
      if (this.basicDetails.first_name != null && this.basicDetails.first_name != ''
        && this.basicDetails.last_name != null && this.basicDetails.last_name != ''
        // && response.data.profile_photo != null && response.data.profile_photo != ''
        // && response.data.profile_photo != 'null'
        && this.basicDetails.username != null && this.basicDetails.username != '') {

        // if (this.basicDetails.first_name != null && this.basicDetails.first_name != '' && this.basicDetails.last_name != null && this.basicDetails.last_name != '') {
        this.profileBasicInformationStatus = true;
      } else {
        this.profileBasicInformationStatus = false;
      }
      if (this.basicDetails.change_password_message == '') {
        this.profilePasswordStatus = true;
      } else {
        this.profilePasswordStatus = false;
      }

    }
    if (!this.basicFirstTimeCall) {
      this.basicFirstTimeCall = true;
      this.commonservice.filter('Register click');
      this.getContactInformation();

      if (this.basicDetails.id) {
        this.getCrewMemberDetails(this.basicDetails.id);
      }
    }

  }

  /**
   * Shows bank information alert
   */
  showBankInformationAlert() {
    Swal({
      title: '',
      text: '',
      html: '<p> Your bank account must be verified before it can be used. This is a banking requirement and will take a day or two but only has to be done once so please bear with us. </p> <p>Steps to bank account verification:</p> <ol> <li>Two deposits under $1 will be deposited into your bank account. In a day or two the deposits will hit your account and will be labeled from PinDo Inc.</li> <li>As soon as they do, go to your PinDo account and click “verify” next to your bank account in Payment Information. </li> <li>When prompted, enter the two deposit amounts in the fields provided (enter $0.71 as 71)</li> <li>The two deposits will automatically be removed from your account after you have verified.</li> </ol> <h5>You will then be able to use your Bank Account / ACH to pay for Pins</h5> <h6>*If verification fails after a couple of attempts, please contact us at <a href="/support" target="_blank">PinDoit.com/Support</a>. Please note: 10 failed attempts or more will lock your bank account out of PinDo so contact us before that happens!</h6>',
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Ok',
    });
  }

  // showWhyLinkAlert(why_link_token) {
  //   Swal({
  //     type: 'success',
  //     title: 'Success',
  //     html: '',
  //     showConfirmButton: true,
  //     showCancelButton: false,
  //     confirmButtonText: "Ok",
  //     allowOutsideClick: true,
  //     customClass: "swal-fullscreen",
  //     showCloseButton: true
  //   }).then((result) => {
  //   });
  //   this.sweet_alert_why_link_content = document.querySelector('.swal2-content');
  //   var loading_html = ' <span class="full-loader"></span>';
  //   this.sweet_alert_why_link_content.innerHTML = loading_html;
  //   this.getWhylinkDetailsByToken(why_link_token);
  // }

  /**
   * Gets contact information
   */
  getContactInformation() {
    this.commonservice.postHttpCall({
      url: '/pinners/get-contact-info', contenttype: 'application/json'
    })
      .then(result => this.populateContactInformation(result));
  }

  /**
   * Populates contact information
   * @param response
   */
  populateContactInformation(response) {
    if (response.status == 1) {
      this.originalBasicContactDetails = response.data;
      this.updatedBasicContactDetails = { ...this.originalBasicContactDetails };
      let tempContactInfo = this.updatedBasicContactDetails;
      if (tempContactInfo['phone'] && tempContactInfo['phone'] != '') {
        tempContactInfo['phone'] = tempContactInfo['phone'].split('');
        tempContactInfo['phone'].splice(6, 0, '-');
        tempContactInfo['phone'].splice(3, 0, ') ');
        tempContactInfo['phone'].splice(0, 0, '+1 (');
      }
      if (tempContactInfo['phone']) {
        this.updatedBasicContactDetails.phone = tempContactInfo['phone'].join('');
      }

      if (tempContactInfo['mobile_no']) {
        tempContactInfo['mobile_no'] = tempContactInfo['mobile_no'].split('');
        tempContactInfo['mobile_no'].splice(6, 0, '-');
        tempContactInfo['mobile_no'].splice(3, 0, ') ');
        tempContactInfo['mobile_no'].splice(0, 0, '+1 (');
      }
      if (tempContactInfo['mobile_no']) {
        this.updatedBasicContactDetails.mobile_no = tempContactInfo['mobile_no'].join('');
      }

      if (this.originalBasicContactDetails.email != null && this.originalBasicContactDetails.email != ''
        && this.originalBasicContactDetails.phone != null && this.originalBasicContactDetails.phone != '') {
        this.profileContactInformationStatus = true;
      } else {
        this.profileContactInformationStatus = false;
      }
    }
    if (!this.contactFirstTimeCall) {
      this.contactFirstTimeCall = true;
      this.getLocationDetailsList();
    }
  }

  /**
   * Gets location details list
   */
  getLocationDetailsList() {
    this.profileLocationStatus = false;
    this.commonservice.postHttpCall({
      url: '/pinners/get-all-locations',
      data: {}, contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.locationDetailsList = result.data.locations;
          if (this.locationDetailsList.length > 0) {
            this.profileLocationStatus = true;
          }
        }
        if (!this.LocationFirstTimeCall) {
          this.LocationFirstTimeCall = true;
          setTimeout(() => {
            if (!this.profileBasicInformationStatus || !this.profileContactInformationStatus || !this.profileLocationStatus) {
              Swal({
                title: 'Complete Profile',
                text: this.myGlobals.pinner_profile_complete_msg,
                confirmButtonColor: '#bad141',
                confirmButtonText: 'OK',
              });
            }
          }, 200);
        }
      });
  }

  /**
   * Deletes location by id
   * @param location_id
   */
  deleteLocationById(location_id, index) {
    this.commonservice.postHttpCall({
      url: '/pinners/remove-address',
      data: { 'location_id': location_id },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.locationDetailsList.splice(index, 1);
          this.responseMessageSnackBar(result.msg);
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
   * Gets payment card listing
   */
  getPaymentCardListing() {
    this.profilePaymentInformationStatus = false;
    this.commonservice.postHttpCall({
      url: '/pinners/get-cards',
      data: {},
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.cardOrBankDetailsListing = result.data;
          this.creditCardCount = 0;
          this.bankCount = 0;

          for (let i = 0; i < this.cardOrBankDetailsListing.length; i++) {
            this.cardOrBankDetailsListing[i].brand = this.cardOrBankDetailsListing[i].brand.replace(/\s/g, '');
            
            if (this.cardOrBankDetailsListing[i].object == "card") {
              this.creditCardCount++;
            } else if (this.cardOrBankDetailsListing[i].object == "bank_account") {
              this.bankCount++;
            }
          }

          if (this.cardOrBankDetailsListing.length > 0) {
            this.profilePaymentInformationStatus = true;
          }
        }
      });
  }

  /*****************************************************************************
  *                       VERIFY PINNER BANK DETAILS                           *
  ******************************************************************************/
  /*verifyBankAccount(bank_dtls){
    this.openDialog('verify-bank-account',bank_dtls);
  }*/

  /**
   * Deletes payment details by id
   * @param index
   */
  deletePaymentDetailsById(index) {
    let account_type = 'bank!';
    let cancelFlag = true;
    let confirmButtonMsg = 'Yes, delete it!';

    // if (this.cardOrBankDetailsListing[index].is_primary == 1) {
    //   cancelFlag = false;
    //   confirmButtonMsg = 'OK';
    // }
    if (this.cardOrBankDetailsListing[index].object == 'card') {
      account_type = 'card!';
    }
    Swal({
      title: cancelFlag ? 'Are you sure?' : '',
      text: cancelFlag ? this.myGlobals.deletePaymentConfirmationMsg + ' ' + account_type : this.myGlobals.deletePrimaryMsg,
      type: 'warning',
      showCancelButton: cancelFlag,
      confirmButtonColor: '#bad141',
      confirmButtonText: confirmButtonMsg,
      cancelButtonText: 'No, keep it'
    }).then((resultswal) => {
      if (resultswal.value && cancelFlag) {
        this.removeCardDetailsByCardIdApi(index);
      }
    });

  }

  /**
   * Removes card details by card id api
   * @param index
   */
  removeCardDetailsByCardIdApi(index) {
    this.commonservice.postHttpCall({
      url: '/pinners/remove-card',
      data: { card_id: this.cardOrBankDetailsListing[index].object_id },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          // this.cardOrBankDetailsListing.splice(index, 1);
          this.getPaymentCardListing();
          this.responseMessageSnackBar(result.msg);
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
   * Edits payment details
   * @param index
   */
  editPaymentDetails(index) {
    localStorage.setItem('cardOrBankDetails', JSON.stringify(this.cardOrBankDetailsListing[index]));
    this.addPaymentMethodInfo.togglePopup();
  }

  /**
   * Verify Payment
   * @param index
   */
  verifyBank(bank_id) {
    localStorage.setItem('bank_id', bank_id);
    this.verifyBankAccountInfo.togglePopup();
  }

  /**
     * Lefts filter tgl
     * @param clickItem
     */
  leftFilterTgl(clickItem) {
    clickItem.stopPropagation();
    if (this.leftFilterBoxOpen === false) {
      this.leftFilterBoxOpen = true;
    }
    else {
      this.leftFilterBoxOpen = false;
    }
  }

  /**
   * Lefts filter over click
   * @param clickItem
   */
  leftFilterOverClick(clickItem) {
    clickItem.stopPropagation();
    clickItem.preventDefault();
    this.leftFilterBoxOpen = false;
  }

  /**
   * Get Crew Member Details
   */
  getCrewMemberDetails(user_id) {
    this.commonservice.postHttpCall({
      url: '/crew-member-details',
      data: {
        user_id: btoa( user_id )
      },
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.crewMemberDetails = result.data;
        this.isCrewMember = true;
      }
    })
    .catch(error => console.log(error));;
  }


  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away

    // Skip checking if user is clicked on logout
    if (this.logoutInitiated) {
      return true;
    }

    if (!this.profileBasicInformationStatus || !this.profileContactInformationStatus || !this.profileLocationStatus) {
      return false;
    } else {
      return true;
    }

  }

  ngOnDestroy() {
    if (this.logOutClickedSubscription) {
      this.logOutClickedSubscription.unsubscribe();
    }
	}


}