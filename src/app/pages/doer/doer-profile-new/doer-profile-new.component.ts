import { PortfolioDialog } from './portfolio-dialog/portfolio-dialog.component';
import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
// declare var jQuery: any;
// declare var $: any;
declare var Swiper: any;
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Globalconstant } from '../../../global_constant';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactsListDialog } from './contacts-list-dialog/contacts-list-dialog.component';
import Swal from 'sweetalert2';
import { ShareprofileComponent } from './shareprofile/shareprofile.component';
import { ChooseLoginStatus } from 'src/app/shared/choose-login-status/choose-login-status.component';
import { InvitePinDialog } from './invite-pin-dialog/invite-pin-dialog.component';
import { environment } from 'src/environments/environment.prod';
import { PostsocialdialogComponent } from './postsocialdialog/postsocialdialog.component';


@Component({
  selector: 'doer-profile-new',
  templateUrl: './doer-profile-new.component.html',
  styleUrls: ['./doer-profile-new.component.scss']
})
export class DoerProfileNewComponent implements OnInit {

  // comnLeftSideBarBoxOpen = false;

  user_type: number;
  loginUserId: string = '';
  loginUserName: string;

  menuOpen: boolean = false;
  doer_id: any;
  doer_profile_details: any = [];
  doer_latitude: number;
  doer_longitude: number;
  companylogo_url: string = '';
  image_url: string = '';
  badge_url: string = '';
  portfolio_url: string = '';
  gallery_url: string = '';
  doerCategoryDetails: any = [];
  totalCompletedJob: any = [];
  doerProfileBadgesDetails: any = [];
  isLoadMoreReview: Boolean = true;
  doerProfileReviewsDetails: any = [];
  doerReviewLimit: number = 15;
  reviewPages: number = 1;
  doerProfileHoursOfOperationDetails: any = [];
  doerProfileHiredByDetails: any = [];
  doerProfileHired: any = [];
  doerProfileEndorsementListDetails: any = [];
  doerProfilePortfolioDetails: any = [];
  checkUserDetails: any = [];
  doerProfileTotalReview: number = 0;
  numberOfPinnerHired: number = 0;
  filterName: string = 'Sort by';
  sortBy: string = 'newest';
  addressLink: any;
  doer_encript_id: any;
  fbShareUrl: any;

  defaultRatingValue = 0;
  pinnerPinList: any;
  addressControlStatus: boolean = false;

  crewMemberDetails: any;

  constructor(
    public dialog: MatDialog,
    public titleService: Title,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public myGlobals: Globalconstant,
    private router: Router,
    private meta: Meta) {

    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.badge_url = this.myGlobals.uploadUrl + '/badges/';
    this.portfolio_url = this.myGlobals.uploadUrl + '/gallery/';
    this.gallery_url = this.myGlobals.uploadUrl + '/doer_gallery';

    if (localStorage.getItem('frontend_user_id')) {
      this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));
    }

    if (localStorage.getItem('user_type')) {
      this.user_type = parseInt(atob(localStorage.getItem('user_type')));
    }

    if (localStorage.getItem('name')) {
      this.loginUserName = localStorage.getItem('name');
    }
  }

  ngOnInit() {
    this.decriptEncriptionKey();
    if (this.loginUserId && this.user_type == 1) {
      this.getPinnerPinList();
    }
    this.getCrewMemberDetails();
  }

  /**
   * Shows bages slider
   */
  // showBagesSlider() {
  //   var swiper = new Swiper('.badges-slider .swiper-container', {
  //     slidesPerView: 5,
  //     spaceBetween: 10,
  //     freeMode: true,
  //     navigation: {
  //       nextEl: '.badges-slider .swiper-button-next',
  //       prevEl: '.badges-slider .swiper-button-prev',
  //     },
  //   });
  // }

  /**
   * Shows portfolio slider
   */

  shareThisProfile(): void {
    const dialogRef = this.dialog.open(ShareprofileComponent, {
      width: '740px',
      panelClass: 'comnDialog-panel',
      data: {
        'slug': 'slugName'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Shows portfolio slider
   */
  showPortfolioSlider() {
    let swiper = new Swiper('.portfolio-slider .swiper-container', {
      slidesPerView: 5,
      spaceBetween: 10,
      freeMode: true,
      navigation: {
        nextEl: '.portfolio-slider .swiper-button-next',
        prevEl: '.portfolio-slider .swiper-button-prev',
      },
      breakpoints: {
        1199: {
          slidesPerView: 4,
        },
        991: {
          slidesPerView: 3,
        },
        767: {
          slidesPerView: 2,
        }
      }
    });
  }

  /**
   * Inits map
   */
  initMap() {
    let mapObj: any = {
      zoom: 9,
      center: { lat: this.doer_latitude, lng: this.doer_longitude },
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      zoomControl: false,
      mapTypeId: 'roadmap',
      styles: JSON.parse(this.myGlobals.styles)
    };
    const map: any = new google.maps.Map(document.getElementById('map3'), mapObj);

    const marker: any = new google.maps.Marker({
      position: { lat: this.doer_latitude, lng: this.doer_longitude },
      map: map,
      icon: './assets/images/doers_marker.png'
      // title: user_latitude + ',' + user_longitude
    });
    let circle = new google.maps.Circle({
      map: map,
      radius: 24140,    // 15 miles in metres
      fillColor: '#E6854A',
      strokeColor: '#bd6d3c',
      strokeWeight: .8
    });
    circle.bindTo('center', marker, 'position');
  }

  /**
   * Comns left side bar tgl
   * @param clickItem
   */
  // comnLeftSideBarTgl(clickItem) {
  //   clickItem.stopPropagation();
  //   if (this.comnLeftSideBarBoxOpen === false) {
  //     this.comnLeftSideBarBoxOpen = true;
  //   } else {
  //     this.comnLeftSideBarBoxOpen = false;
  //   }
  // }

  /**
   * Comns left side bar over click
   * @param clickItem
   */
  // comnLeftSideBarOverClick(clickItem) {
  //   clickItem.stopPropagation();
  //   clickItem.preventDefault();
  //   this.comnLeftSideBarBoxOpen = false;
  // }

  /**
   * Sorts by dropdown open close
   */
  sortByDropdownOpenClose() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Opens portfolio dialog
   */
  openPortfolioDialog(portfolio_id): void {
    const dialogRef = this.dialog.open(PortfolioDialog, {
      width: '1000px',
      panelClass: 'comnDialog-panel',
      data: { portfolioId: portfolio_id, doerId: this.doer_id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /**
   * Hired by pinner dialog
   */
  hiredByPinnerDialog(): void {
    if (this.numberOfPinnerHired != 0) {
      const dialogRef = this.dialog.open(ContactsListDialog, {
        width: '530px',
        panelClass: 'comnDialog-panel',
        data: { hiredByList: this.doerProfileHiredByDetails, is_loggedIn_user: this.checkUserDetails.is_loggedIn_user }
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  /**
   * Sorting review list
   * @param sort_type
   */
  sortingReviewList(sort_type: string) {
    if (sort_type == 'newest') {
      this.filterName = 'Newest to Oldest';
    } else if (sort_type == 'oldest') {
      this.filterName = 'Oldest to Newest';
    } else if (sort_type == 'highest_ratings') {
      this.filterName = 'High to Low Rating';
    } else if (sort_type == 'lowest_ratings') {
      this.filterName = 'Low to High Rating';
    }
    this.sortBy = sort_type;
    this.reviewPages = 1;
    this.doerProfileReviewsDetails = [];
    this.getDoerProfileReviews();
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
   * Decripts encription key
   */
  decriptEncriptionKey() {
    this.route.paramMap.subscribe(parameters => {
      if (parameters['params']['id']) {
        const reb64 = CryptoJS.enc.Hex.parse(parameters['params']['id']);
        const bytes = reb64.toString(CryptoJS.enc.Base64);
        const decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
        const plain = decrypt.toString(CryptoJS.enc.Utf8);
        this.doer_id = plain.split('-')[0];

      } else {
        this.doer_id = this.loginUserId;
      }

      this.getDoerProfileDetailsById();
      this.getDoerCategoryListByDoerIdApi();
      this.getDoerCompletedJobByDoerId();
      // this.getDoerProfileBadges();
      this.getDoerProfileReviews();
      this.getDoerProfileHoursOfOperation();
      this.getDoerProfileHiredBy();
      this.getDoerProfileEndorsementList();
      this.getDoerProfilePortfolio();
      this.checkUser();
      this.getDoerProfileBadges();
    });
  }

  openSocialDialog() {
    const dialogRef = this.dialog.open(PostsocialdialogComponent, {
      width: '740px',
      panelClass: 'comnDialog-panel',
      data: {
        'slug': this.fbShareUrl
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
 * Opens user details
 * @param user_id
 * @param user_type
 */
  openUserDetails(user_id: number, user_type: number) {
    const b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const eHex = e64.toString(CryptoJS.enc.Hex);
    if (user_type == 1) {
      this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`pinner/pinner-profile/${eHex}`]);
    } else {
      this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`doer/doer-profile/${eHex}`]);
    }
  }

  /**
   * Loads more review
   */
  loadMoreReview() {
    this.reviewPages = this.reviewPages + 1;
    this.getDoerProfileReviews();
  }

  /**
   * Determines whether convert t
   * @param time
   * @returns
   */
  tConvert(time) {
    if (time) {
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      const newTime = time[0] + time[1] + time[2] + ' ' + time[5];
      return newTime;
    }
  }

  /**
   * Times differ between two time
   * @param endTime
   * @param startTime
   * @returns
   */
  timeDifferBetweenTwoTime(endTime, startTime) {

    let formatedDifferent = '';
    const startDate: any = new Date('January 1, 1970 ' + startTime);
    const endDate: any = new Date('January 1, 1970 ' + endTime);

    let timeDiff = Math.abs(startDate - endDate);

    let hh: any = Math.floor(timeDiff / 1000 / 60 / 60);
    if (hh < 10) {
      hh = '0' + hh;
    }
    formatedDifferent = hh + 'H ';
    timeDiff -= hh * 1000 * 60 * 60;
    let mm: any = Math.floor(timeDiff / 1000 / 60);
    if (mm != 0) {
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (mm == 59 || mm == 30) {
        mm = 0;
        hh++;
        formatedDifferent = hh + 'H ';
      }
      timeDiff -= mm * 1000 * 60;
      if (mm != 0) {
        formatedDifferent = formatedDifferent + mm + 'M ';
      }
    }

    return formatedDifferent;
  }


  /**
   * Opens login or registration dialog
   * @param url
   */
  openLoginOrRegistrationDialog(url) {
    //console.log('asdasd',indexVal);
    this.dialog.open(ChooseLoginStatus, {
      width: '650px',
      disableClose: false,
      data: url
    });
  }


  /**
   * Invites pin dialog
   */
  invitePinDialog() {
    const dialogRef = this.dialog.open(InvitePinDialog, {
      width: '900px',
      panelClass: 'comnDialog-panel',
      data: { pinnerPinList: this.pinnerPinList, doerDetails: this.doer_profile_details }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if (result) {
        // console.log(result);
        this.pinnerPinList[result].is_invited = 1;
        // console.log('success');
      }
    });
  }

  getPinnerPinList() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-doer-profile-invite-to-pin',
      data: { doer_id: this.doer_id },
      contenttype: 'application/json'
    })
      .then(result => {
        // console.log(result);
        if (result.status == 1) {
          this.pinnerPinList = result.data;
        } else {
          this.pinnerPinList = [];
        }
      })
  }

  /**
   * Gets doer profile details by id
   */
  getDoerProfileDetailsById() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/public-doer-details',
        data: { id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.doer_profile_details = result.data.rows[0];
          // console.log(this.doer_profile_details);
          if (this.doer_profile_details.lat != null) {
            this.doer_latitude = parseFloat(result.data.rows[0].lat);
            this.doer_longitude = parseFloat(result.data.rows[0].lng);
          } else {
            this.doer_latitude = parseFloat(localStorage.getItem('pindo_system_current_position_lat'));
            this.doer_longitude = parseFloat(localStorage.getItem('pindo_system_current_position_lng'));
          }
          if (this.doer_profile_details.address == null) {
            this.doer_profile_details.address = localStorage.getItem('pindo_system_current_position_address');
          }
          this.addressLink = this.doer_profile_details['address'];

          this.checkUser();
          // this.addressControlStatus = this.checkPrivacySettingByTypeAndValue(this.doer_profile_details.user_control, this.checkUserDetails.user_control_status, 'primary_address');

          // if (this.addressLink != null && this.addressControlStatus) {
          //   const address = this.addressLink.replace(/\,/g, '');
          //   this.addressLink = address.replace(/\ /g, '%20');
          //   this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
          // } else {
          //   let address = this.doer_profile_details.city ? this.doer_profile_details.city : '';
          //   address += this.doer_profile_details.state ? "," + this.doer_profile_details.state : '';
          //   this.addressLink = `https://maps.google.com/maps?q=${address}`;
          // }
          // this.initMap();

          const b64 = CryptoJS.AES.encrypt(`${this.doer_profile_details.id}`, 'Secret Key').toString();
          const e64 = CryptoJS.enc.Base64.parse(b64);
          const eHex = e64.toString(CryptoJS.enc.Hex);
          this.fbShareUrl = this.myGlobals.frontend_url + `/doer/doer-profile/${eHex}`;


          // Meta tags
          this.meta.updateTag({property: "og:type", content: "profile"});
          if ( this.doer_profile_details.profile_type == 2 && this.doer_profile_details.user_type == 2 ) {
            this.meta.updateTag({property: "og:title", content: this.doer_profile_details.company_name});
          } else {
            this.meta.updateTag({property: "og:title", content: this.doer_profile_details.first_name + " " + this.doer_profile_details.last_name});
            this.meta.updateTag({property: "og:profile:first_name", content: this.doer_profile_details.first_name});
            this.meta.updateTag({property: "og:profile:last_name", content: this.doer_profile_details.last_name});
          }
          
          // let ogImage = (this.doer_profile_details.company_logo != null) ? (this.companylogo_url + this.doer_profile_details.company_logo) : (this.myGlobals.baseUrl + 'assets/images/default-userImg-orange.svg');
          this.meta.updateTag({property: "og:image", content: "https://pindoit.com/pindo-server/uploads/pindo-profile.jpg"});
          this.meta.updateTag({property: "og:image:alt", content: "Profile Image"});
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }


  /**
   * Checks privacy setting by type and value
   * @param user_control
   * @param user_control_status
   * @param type
   * @returns
   */
  checkPrivacySettingByTypeAndValue(user_control, user_control_status, type) {
    if (user_control_status == 1 || user_control_status == 2 || user_control == null
      || (user_control_status == 3
        && (user_control[type] == 1 || user_control[type] == 4 || user_control[type] == 6 || user_control[type] == 7))
      || (user_control_status == 0
        && (user_control[type] == 3 || user_control[type] == 5 || user_control[type] == 6 || user_control[type] == 7))) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Gets doer category list by doer id api
   */
  getDoerCategoryListByDoerIdApi() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/doer-categories',
        data: { doer_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.doerCategoryDetails = result.data;
        }
      });
  }

  /**
   * Gets doer completed job by doer id
   */
  getDoerCompletedJobByDoerId() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-profile-completed-jobs',
        data: { doer_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.totalCompletedJob = result.data;
        }
      });
  }

  /**
   * Gets doer profile badges
   */
  getDoerProfileBadges() {
    this.commonservice.postHttpCall({
      url: '/doers/get-doer-badges',
      data: { doer_id: this.doer_id },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          // this.doerProfileBadgesDetails = result.data;
          this.doerProfileBadgesDetails = this.commonservice.removeDuplicates(result.data, 'badge_id');
          setTimeout(function () {
            // this.showBagesSlider();
            let swiper = new Swiper('.badges-slider .swiper-container', {
              slidesPerView: 5,
              spaceBetween: 10,
              freeMode: true,
              navigation: {
                nextEl: '.badges-slider .swiper-button-next',
                prevEl: '.badges-slider .swiper-button-prev',
              },
            });
          }, 0);

          console.log(this.doerProfileBadgesDetails);
        }
      });
  }

  /**
   * Gets doer profile reviews
   */
  getDoerProfileReviews() {
    this.isLoadMoreReview = false;
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-profile-reviews',
        data: { doer_id: this.doer_id, page: this.reviewPages, limit: this.doerReviewLimit, sort_by: this.sortBy },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          if (result.data.rows.length >= this.doerReviewLimit) {
            this.isLoadMoreReview = true;
          }
          result.data.rows.forEach(data => {

            data.pinner_details.firstNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.pinner_details.user_control, data.pinner_details.user_control_status, 'first_name');

            data.pinner_details.lastNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.pinner_details.user_control, data.pinner_details.user_control_status, 'last_name');

            data.pinner_details.profilePictureShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.pinner_details.user_control, data.pinner_details.user_control_status, 'profile_photo');

            this.doerProfileReviewsDetails.push(data);
          });
          this.doerProfileTotalReview = result.total_reviews_count;
        }
      });
  }

  /**
   * Gets doer profile hours of operation
   */
  getDoerProfileHoursOfOperation() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-profile-hours-of-operation',
        data: { user_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          const doerProfileHoursOfOperationDetails = result.data.rows[0];

          this.doerProfileHoursOfOperationDetails.sundayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.sunday_end_time, doerProfileHoursOfOperationDetails.sunday_start_time);
          this.doerProfileHoursOfOperationDetails.sunday = doerProfileHoursOfOperationDetails.sunday;
          this.doerProfileHoursOfOperationDetails.sunday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.sunday_start_time);
          this.doerProfileHoursOfOperationDetails.sunday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.sunday_end_time);

          this.doerProfileHoursOfOperationDetails.mondayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.monday_end_time, doerProfileHoursOfOperationDetails.monday_start_time);
          this.doerProfileHoursOfOperationDetails.monday = doerProfileHoursOfOperationDetails.monday;
          this.doerProfileHoursOfOperationDetails.monday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.monday_start_time);
          this.doerProfileHoursOfOperationDetails.monday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.monday_end_time);

          this.doerProfileHoursOfOperationDetails.tuesdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.tuesday_end_time, doerProfileHoursOfOperationDetails.tuesday_start_time);
          this.doerProfileHoursOfOperationDetails.tuesday = doerProfileHoursOfOperationDetails.tuesday;
          this.doerProfileHoursOfOperationDetails.tuesday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.tuesday_start_time);
          this.doerProfileHoursOfOperationDetails.tuesday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.tuesday_end_time);

          this.doerProfileHoursOfOperationDetails.wednesdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.wednesday_end_time, doerProfileHoursOfOperationDetails.wednesday_start_time);
          this.doerProfileHoursOfOperationDetails.wednesday = doerProfileHoursOfOperationDetails.wednesday;
          this.doerProfileHoursOfOperationDetails.wednesday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.wednesday_start_time);
          this.doerProfileHoursOfOperationDetails.wednesday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.wednesday_end_time);

          this.doerProfileHoursOfOperationDetails.thursdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.thursday_end_time, doerProfileHoursOfOperationDetails.thursday_start_time);
          this.doerProfileHoursOfOperationDetails.thursday = doerProfileHoursOfOperationDetails.thursday;
          this.doerProfileHoursOfOperationDetails.thursday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.thursday_start_time);
          this.doerProfileHoursOfOperationDetails.thursday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.thursday_end_time);

          this.doerProfileHoursOfOperationDetails.fridayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.friday_end_time, doerProfileHoursOfOperationDetails.friday_start_time);
          this.doerProfileHoursOfOperationDetails.friday = doerProfileHoursOfOperationDetails.friday;
          this.doerProfileHoursOfOperationDetails.friday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.friday_start_time);
          this.doerProfileHoursOfOperationDetails.friday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.friday_end_time);

          this.doerProfileHoursOfOperationDetails.saturdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.saturday_end_time, doerProfileHoursOfOperationDetails.saturday_start_time);
          this.doerProfileHoursOfOperationDetails.saturday = doerProfileHoursOfOperationDetails.saturday;
          this.doerProfileHoursOfOperationDetails.saturday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.saturday_start_time);
          this.doerProfileHoursOfOperationDetails.saturday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.saturday_end_time);

        }
      });
  }

  /**
   * Gets doer profile hired by
   */
  getDoerProfileHiredBy() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-profile-hired_by',
        data: { doer_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.doerProfileHiredByDetails = result.data.rows;

          this.doerProfileHiredByDetails.forEach(data => {
            data.firstNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'first_name');

            data.lastNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'last_name');

            data.profilePictureShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'profile_photo');
          });

          this.numberOfPinnerHired = result.hired_by_pinner_numbers;
          this.doerProfileHired = this.doerProfileHiredByDetails;
          if (this.numberOfPinnerHired >= 6) {
            this.doerProfileHired = this.doerProfileHired.slice(0, 6);
          }
        }
      });
  }

  /**
   * Gets doer profile endorsement list
   */
  getDoerProfileEndorsementList() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-profile-endorsement-list',
        data: { endorsed_to_doer_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.doerProfileEndorsementListDetails = result.data.rows;
        }
      });
  }

  /**
   * Gets doer profile portfolio
   */
  getDoerProfilePortfolio() {
    this.commonservice.postCommunityHttpCall(
      {
        // url: '/api/pinner/get-doer-profile-portfolio',
        url: '/api/pinner/get-doer-profile-photo-gallery',
        data: { user_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.doerProfilePortfolioDetails = result.data.rows;
          setTimeout(() => {
            this.showPortfolioSlider();
          }, 300);

        }
      });
  }

  /**
   * Checks user
   */
  checkUser() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/publicUser-check-user',
        data: { user_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.checkUserDetails = result;
        }
        this.addressControlStatus = this.commonservice.checkSettingByTypeAndValueForAll(this.doer_profile_details.user_control, this.checkUserDetails.user_control_status, 'primary_address');

        if (this.addressLink != null && this.addressControlStatus) {
          const address = this.addressLink.replace(/\,/g, '');
          this.addressLink = address.replace(/\ /g, '%20');
          this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
        } else {
          let address = this.doer_profile_details.city ? this.doer_profile_details.city : '';
          address += this.doer_profile_details.state ? ',' + this.doer_profile_details.state : '';
          this.addressLink = `https://maps.google.com/maps?q=${address}`;
        }
        this.initMap();
      });
  }

  /**
 * Connection send to add your contact list
 * @param community_id
 */
  sendRequestToDoer() {
    if (!this.loginUserId) {
      this.openLoginOrRegistrationDialog('');
    } else {
      this.commonservice.postCommunityHttpCall(
        {
          url: '/api/pinner/connection-request',
          data: { contacted_user_id: this.doer_profile_details.id },
          contenttype: 'application/json'
        })
        .then(result => {
          if (result.status == 1) {
            let postData = {
              'sender_id': this.loginUserId,
              'reciver_id': this.doer_profile_details.id,
              'post_id': '',
              'title': 'You’ve received an invite to connect from ' + this.loginUserName + '.  It’s so nice to be popular.',
              'link': 'doer/community-home',
              'show_in_todo': 0,
              /*'todo_title':'You’ve received a quote from Doer. Wait for more or hire now!',
              'todo_link': 'pinner/active-quotation-details/',*/
            };
            this.myGlobals.notificationSocket.emit('post-community-notification', postData);
            this.checkUser();
            this.responseMessageSnackBar(result.msg, 'orangeSnackBar');
          } else {
            this.responseMessageSnackBar(result.msg, 'error');
          }
        });
    }
  }

  /**
   * Get Crew Member Details
   */
  getCrewMemberDetails() {
    this.commonservice.postHttpCall({
      url: '/crew-member-details',
      data: { 
        user_id: btoa( this.doer_id )
      },
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.crewMemberDetails = result.data;
      }
    })
    .catch(error => console.log(error));;
  }

}
