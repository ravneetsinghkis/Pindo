import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ProfileInsuranceComponent } from './profile-insurance/profile-insurance.component';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { ProfilePaymentComponent } from './profile-payment/profile-payment.component';
import { ProfileLicenceComponent } from './profile-licence/profile-licence.component';
import { DoerBasicDetailsComponent } from './doer-basic-details/doer-basic-details.component';
import { DoerContactInformationComponent } from './doer-contact-information/doer-contact-information.component';
import { ProfileServicesComponent } from './profile-services/profile-services.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { MatSnackBar } from '@angular/material';
import { DoerControlComponent } from './doer-control/doer-control.component';
import { DoerProfileNotificationSettingsComponent } from './doer-profile-notification-settings/doer-profile-notification-settings.component';
import { DoerProfileEmailSettingsComponent } from './doer-profile-email-settings/doer-profile-email-settings.component';
declare var jQuery: any;
declare var $: any;
// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment} from 'moment';

// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

import { CommonService } from '../../../commonservice';
import { CertificatesComponent } from './profile-certificates/certificates.component';
import { Title } from '@angular/platform-browser';
import { Globalconstant } from 'src/app/global_constant';

declare var Swiper: any;

@Component({
  selector: 'app-doer-profile',
  templateUrl: './doer-profile.component.html',
  styleUrls: ['./doer-profile.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class DoerProfileComponent implements OnInit {
  isControlInformationPopulated = false;
  @ViewChild('cntrolInfo')
  private cntrolInfo: DoerControlComponent;
  @ViewChild('notificationcntrolInfo')
  private notificationcntrolInfo: DoerProfileNotificationSettingsComponent;

  @ViewChild('emailcntrolInfo')
  private emailcntrolInfo: DoerProfileEmailSettingsComponent;

  @ViewChild('popUpManageAvailibility')
  handlePopupmanageaval;

  @ViewChild('profileInsurance')
  private profileInsurance: ProfileInsuranceComponent;

  @ViewChild('profileOpeningHours')
  private profileOpeningHours: OpeningHoursComponent;

  @ViewChild('profileLicense')
  private profileLicense: ProfileLicenceComponent;

  @ViewChild('profilePayment')
  private profilePayment: ProfilePaymentComponent;

  @ViewChild('doerBasicDetails')
  private doerBasicDetails: DoerBasicDetailsComponent;

  @ViewChild('cntInfo')
  private cntInfo: DoerContactInformationComponent;

  @ViewChild('profileCertificates')
  private profileCertificates: CertificatesComponent;

  @ViewChild('DoerServices')
  private DoerServices: ProfileServicesComponent;

  @ViewChild('manageAvlForm') public userFrm: any;

  singleDaySelection = false;
  prof_id: any = '';




  // tslint:disable-next-line:no-inferrable-types
  favoriteSeason: any = 0;
  emergencyService: any = [{ 'value': 1, 'text': 'Yes, I am available for emergency services' }, { 'value': 0, 'text': 'No, I don’t provide emergency service' }];

  // tslint:disable-next-line:no-inferrable-types
  basicDetails: boolean = false;
  // tslint:disable-next-line:
  dummyInsurance: boolean = false;
  dummyLicence: boolean = false;
  dummyService: boolean = false;
  dummyOpeningHours: boolean = false;
  dummyProfilePayment: boolean = false;
  dummyContactinformation: boolean = false;
  dummyCertificates: boolean = false;
  doerBadges = [];

  manageAvlModel = {
    start_date: '',
    end_date: ''
  };

  public avlList = [];

  constructor(public renderer: Renderer2,
    public el: ElementRef,
    public commonservice: CommonService,
    private titleService: Title,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public globalconstant: Globalconstant) {
    // Change Page Title
    this.titleService.setTitle('My Profile');
    this.getEmergencyServices();
    this.getBadges();
  }

  ngOnInit() {
    // tslint:disable-next-line:indent
    console.log(this.profileLicense);
    this.populateAvlListing();

    $('.forScroll').mCustomScrollbar();
    this.getBasicDetails();
  }

  /**
  * Get doer basic details
  * @headerParam accesss token.
  *
  * @response {
  * "status": "1",
  * "msg": "Basic info has been fetched successfully.",
  * "data" : "get user details"
  * }
  * 
  */
  getBasicDetails() {
    this.commonservice.postHttpCall({ url: '/doers/get-basic-details', data: {}, contenttype: 'application/json' }).then(result => this.profileDetailsSuccess(result));
  }
  profileDetailsSuccess(response) {
    if (response.status == 1) {
      console.log('response', response);
      //Checking minimum basic details has been completed by user or not.
      const profileData = response.data;
      if (profileData.profile_type == 1) {
        if (profileData.company_logo == null || profileData.address == null || (profileData.stripe_customer_id == null && profileData.stripe_user_id == null)) {
          this.profileCompletionAlertPopup();
        } else {
          if (localStorage.getItem('updateBoard') == '1') {
            this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-post', data: { title: 'Joinee', type: 'joinee', send_to: 'both', receiver_id: 0, target_id: 0, category_id: 0, subcategory_id: 0, message: ' ' }, contenttype: 'application/json' }).then((res) => {
              console.log('PROFILE COMPLETE', res);
              // this.globalconstant.updateBoard = 0;
              localStorage.setItem('updateBoard', '0');
            });
          }
        }
      } else {
        if (profileData.company_logo == null || profileData.company_name == null || profileData.address == null || (profileData.stripe_customer_id == null && profileData.stripe_user_id == null)) {
          this.profileCompletionAlertPopup();
        } else {
          const isAdminDoer = localStorage.getItem('admin_create_doer'); console.log('isAdminDoer', isAdminDoer);
          if (localStorage.getItem('updateBoard') == '1' && (isAdminDoer == null)) {
            this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-post', data: { title: 'Joinee', type: 'joinee', send_to: 'both', receiver_id: 0, target_id: 0, category_id: 0, subcategory_id: 0, message: ' ' }, contenttype: 'application/json' }).then((res) => {
              console.log('PROFILE COMPLETE', res);
              // this.globalconstant.updateBoard = 0;
              localStorage.setItem('updateBoard', '0');
            });
          }
        }
      }
    }
  }

  profileCompletionAlertPopup() {
    //if(localStorage.getItem('initial_redirection_to_profile_page')=='1')
    //localStorage.removeItem('initial_redirection_to_profile_page');
    // this.globalconstant.updateBoard = 1;
    localStorage.setItem('updateBoard', '1');
    Swal({
      title: 'Complete Profile',
      text: 'Please complete the Profile fields required for connecting with Pinners and bidding for jobs.',
      //type: 'success',
      //showCancelButton: true,
      confirmButtonColor: '#bad141',
      //cancelButtonColor: "#bad141", 
      confirmButtonText: 'OK',
      //cancelButtonText: 'LOGIN'
    });
  }

  ngAfterViewInit() {

  }

  /**
   * Edits indv folder
   * @param folderDetails 
   */
  editIndvFolder(folderDetails) {
    console.log(folderDetails);
    this.openDialog(folderDetails);
    //
  }

  getId(evt) {
    this.prof_id = evt;
  }

  /*
     * open popup
     * 
  */
  openDialog(dataTosend = '') {
    const tempDialogRef = this.dialog.open(CourseDialogComponent, {
      width: '475px',
      disableClose: false,
      data: (dataTosend == '') ? null : dataTosend
    });
  }

  /**
   * Inits badge slider
   */
  initBadgeSlider() {
    const swiper = new Swiper('.badges-slider .swiper-container', {
      slidesPerView: 8,
      spaceBetween: 0,
      navigation: {
        nextEl: '.badges-slider .swiper-button-next',
        prevEl: '.badges-slider .swiper-button-prev',
      },
      breakpoints: {
        1024: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 0,
        }
      }
    });
  }

  /**
   * Gets badges
   */
  getBadges() {
    this.commonservice.postHttpCall({ url: '/doers/get-doer-badges', contenttype: 'application/json' }).then(result => this.getBadgesSuccess(result));
  }

  /**
   * Gets badges success
   * @param response 
   */
  getBadgesSuccess(response) {
    if (response.status == 1) {
      this.doerBadges = response.data;
      setTimeout(() => {
        this.initBadgeSlider();
      }, 0);
    }
  }


  /**
   * Determines whether single day selection on
   * @param evt 
   */
  onSingleDaySelection(evt) {
    console.log(evt.checked);
    this.singleDaySelection = evt.checked;
    if (evt.checked) {
      this.manageAvlModel.end_date = this.manageAvlModel.start_date;
    } else {
      this.manageAvlModel.end_date = '';
    }
  }

  /**
   * Toggles datepicker
   * @param ref 
   */
  toggleDatepicker(ref) {
    if (!this.singleDaySelection) {
      ref.open();
    }
  }

  /**
   * Determines whether start date change on
   */
  onStartDateChange() {
    if (this.singleDaySelection) {
      this.manageAvlModel.end_date = this.manageAvlModel.start_date;
    }
  }

  /**
   * Toggles parent popup
   * @param profileSlug 
   */
  toggleParentPopup(profileSlug) {
    if (profileSlug === 'profileInsurance') {
      this.profileInsurance.togglePopup();
    } else if (profileSlug === 'profileLicense') {
      this.profileLicense.togglePopup();
    } else if (profileSlug === 'profileOpeningHours') {
      this.profileOpeningHours.togglePopup();
    } else if (profileSlug === 'profilePayment') {
      this.profilePayment.togglePopup();
    } else if (profileSlug === 'DoerBasicDetailsComponent') {
      this.doerBasicDetails.togglePopup();
    } else if (profileSlug === 'DoerContactInformationComponent') {
      this.cntInfo.togglePopup();
    } else if (profileSlug == 'profileCertificates') {
      this.profileCertificates.togglePopup();
    } else if (profileSlug == 'DoerAddServices') {
      this.DoerServices.togglePopup();
    }

  }

  /**
   * Lengths update
   * @param event 
   * @param profileSlug 
   */
  lengthUpdate(event, profileSlug) {
    console.log('event', event);
    console.log('profileSlug', profileSlug);
    if (profileSlug == 'profileInsurance') {
      this.dummyInsurance = event;
    } else if (profileSlug == 'profileLicense') {
      this.dummyLicence = event;
    } else if (profileSlug == 'profileCertificates') {
      this.dummyCertificates = event;
    } else if (profileSlug == 'profileOpeningHours') {
      this.dummyOpeningHours = event;
    } else if (profileSlug == 'profilePayment') {
      this.dummyProfilePayment = event;
    } else if (profileSlug == 'DoerServices') {
      this.dummyService = event;
    }

  }



  /**
   * Toggles manage availibility popup
   */
  toggleManageAvailibilityPopup() {
    console.log(this.handlePopupmanageaval.nativeElement);
    if (this.handlePopupmanageaval.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.handlePopupmanageaval.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.handlePopupmanageaval.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Populates avl listing
   */
  populateAvlListing() {
    this.commonservice.postHttpCall({ url: '/doers/availibility-list', contenttype: 'application/json' }).then(result => this.populateAvlSuccess(result));
  }

  /**
   * Submitavls doer profile component
   * @param tosubmitVal 
   */
  submitavl(tosubmitVal) {
    this.commonservice.postHttpCall({ url: '/doers/manage-availibilities', data: tosubmitVal, contenttype: 'application/json' }).then(result => this.submittedAvlsuccess(result));
  }

  /**
   * Removes availibity
   * @param index 
   */
  removeAvailibity(index) {
    const availibilityID = this.avlList[index].id;
    const avlData = { 'availability_id': availibilityID };
    console.log(avlData);
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this insurance!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/remove-availibility', data: avlData, contenttype: 'application/json' }).then(result => this.removeAvlsuccess(result));
      }
    });
  }

  /**
   * Removes avlsuccess
   * @param response 
   */
  removeAvlsuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.resetFunction(this.userFrm);
      this.commonservice.postHttpCall({ url: '/doers/availibility-list', contenttype: 'application/json' }).then(result => this.populateAvlSuccess(result));
    }
  }

  /**
   * Populates avl success
   * @param response 
   */
  populateAvlSuccess(response) {
    if (response.status == 1) {
      this.avlList = JSON.parse(JSON.stringify(response.data));
    }
  }

  /**
   * Submitted avlsuccess
   * @param response 
   */
  submittedAvlsuccess(response) {
    console.log(response);
    if (response.status == 1) {
      this.populateAvlListing();

      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.resetFunction(this.userFrm);
    }
  }

  /**
   * Formats date
   * @param obj 
   * @returns  
   */
  formatDate(obj) {
    const _year = obj._i.year;
    let _month = obj._i.month + 1;
    let _date = obj._i.date;
    if (_month.toString().length == 1) {
      _month = '0' + _month;
    }
    if (_date.toString().length == 1) {
      _date = '0' + _date;
    }
    const tot_date = [_year, _month, _date].join('-');
    return tot_date;
  }

  /**
   * Submitmngavls doer profile component
   * @param { value, valid } 
   */
  submitmngavl({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      const start_date_custom = value.ValidateDates.start_date;
      const totalstartDate = this.formatDate(start_date_custom);
      const end_date_custom = value.ValidateDates.end_date;
      const totalendDate = this.formatDate(end_date_custom);

      const total_obj = {
        'start_date': totalstartDate,
        'end_date': totalendDate
      };
      console.log(total_obj);
      this.submitavl(total_obj);
    }
  }

  /**
   * Resets function
   * @param frmElm 
   */
  resetFunction(frmElm) {
    frmElm.submitted = false;
    frmElm.reset();
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
   * Sets emergency services
   */
  public setEmergencyServices() {
    setTimeout(() => {
      console.log('this.favoriteSeason', this.favoriteSeason);

      this.commonservice.postHttpCall({ url: '/doers/update-emergency-service', data: { emergency: this.favoriteSeason }, contenttype: 'application/json' }).then(result => this.emergencySuccess(result));
    }, 500);

  }

  /**
   * Emergencys success
   * @param response 
   */
  emergencySuccess(response) {
    console.log(response);
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
  }


  /**
   * Gets emergency services
   */
  public getEmergencyServices() {

    this.commonservice.postHttpCall({ url: '/doers/get-emergency-service', data: {}, contenttype: 'application/json' }).then(result => this.getEmergencySuccess(result));

  }

  /**
   * Gets emergency success
   * @param response 
   */
  getEmergencySuccess(response) {
    console.log(response);
    if (response.status == 1) {
      this.favoriteSeason = response.data.emergency;
      //this.responseMessageSnackBar(response.msg);
      if (response.data.redirected_to_profile_page == 0) {
        this.updateRedirectedToProfilePageFirstTimeAfterLogin();
      }
    }
  }


  /**
   * Updates redirected to profile page first time after login
   */
  updateRedirectedToProfilePageFirstTimeAfterLogin() {
    this.commonservice.postHttpCall({ url: '/update-redirect-after-login', data: {}, contenttype: 'application/json' }).then(result => this.getRediectSuccess(result));
  }

  /**
   * Gets rediect success
   * @param response 
   */
  getRediectSuccess(response) {
    console.log(response);
  }
}
