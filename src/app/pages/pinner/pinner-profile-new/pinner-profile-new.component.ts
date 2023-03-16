import { Component, OnInit, AfterViewInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
declare var $: any;
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Globalconstant } from '../../../global_constant';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactsListDialog } from './contacts-list-dialog/contacts-list-dialog.component';
import { BioEditComponent } from './bio-edit/bio-edit.component';
import { UpdateInterestsComponent } from './update-interests/update-interests.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';


@Component({
  selector: 'app-pinner-profile-new',
  templateUrl: './pinner-profile-new.component.html',
  styleUrls: ['./pinner-profile-new.component.scss']
})
export class PinnerProfileNewComponent implements OnInit, AfterViewInit {
  id: any;
  profile_url: any;
  submitted = false;
  //comnLeftSideBarBoxOpen = false;
  user_id: any;
  user_data: any;
  user_latitude: any;
  user_longitude: any;
  map_marker_array: any;
  latitude: any;
  longitude: any;
  mapObj: any;
  address: any;
  communitydata: any = [];
  contactdata: any = [];
  review_data: any = [];
  user_control: any;
  interest_bio: any = [];
  public_profile_post: any;
  specific_interest: any = [];
  specific_bio: any = [];
  split_array_interest: any;
  number_of_mutual_friend: any;
  p: number = 1;
  page_number: any = 1;
  limit: any;
  companylogo_url: any;
  user_own_profile: any;
  user_connectivity: any;
  is_my_profile: any;
  user_pending_status: any;
  user_control_status: number;
  showData: any = false;
  isLoadMoreReview: Boolean = true;

  first_name_show: Boolean = false;
  last_name_show: Boolean = false;
  profile_photo_show: Boolean = false;
  user_name_show: Boolean = true;
  bio_show: Boolean = false;
  address_show: Boolean = false;
  interest_show: Boolean = false;
  contacts_show: Boolean = false;

  @ViewChild('bioEditInfo') private bioEditInfo: BioEditComponent;
  @ViewChild('updateInterestsInfo') private updateInterestsInfo: UpdateInterestsComponent;
  @ViewChild('updateProfileInfo') private updateProfileInfo: UpdateProfileComponent;

  user_type: any;
  loginUserId: any;

  crewMemberDetails: any;

  constructor(public dialog: MatDialog, public titleService: Title,
    public commonservice: CommonService, public renderer: Renderer2,
    public el: ElementRef, public snackBar: MatSnackBar,
    private route: ActivatedRoute, public myGlobals: Globalconstant, private router: Router) {
    this.limit = this.myGlobals.pinnerReviewLimit;
    this.user_type = parseInt(atob(localStorage.getItem('user_type')));
    this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));
  }

  ngOnInit() {
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.user_own_profile = localStorage.getItem('frontend_user_id');
    this.decriptEncriptionKey();
    this.getCrewMemberDetails();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.showData = true;
    }, 500);
  }

  /**
    * Review section scroll
    */

  reviewSecScroll() {
    var target = $('.reviewCard');
    if (target.length > 0) {
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 80
      }, 1000);
    }

  }


  /**
   * Decript the encriptied user id
   */
  decriptEncriptionKey() {
    this.route.paramMap.subscribe(parameters => {
      if (parameters['params']['id']) {
        let reb64 = CryptoJS.enc.Hex.parse(parameters['params']['id']);
        let bytes = reb64.toString(CryptoJS.enc.Base64);
        let decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
        let plain = decrypt.toString(CryptoJS.enc.Utf8);
        this.user_id = plain.split('-')[0];
      } else {
        this.user_id = this.loginUserId;
      }

      this.getUserDetails(this.user_id);
      this.fetchNearestCommunityData(this.user_id);
      this.getUserContactList(this.user_id);
      this.getUserReviewdata(this.user_id, this.page_number);
      // this.getPublicUserPostDetails(this.user_id);


    });
  }
  /**
   * Gets user details
   * @param user_id 
   */
  getUserDetails(user_id) {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/public-user-details',
        data: { id: user_id },
        contenttype: 'application/json'
      })
      .then(result => {
        this.checkConnectivityUser(this.user_id);
        if (result.status == 1) {
          this.user_data = result.data.rows[0];
          this.address = result.data.rows[0].locations[0];
          this.user_control = result.data.rows[0].user_control;
          this.user_latitude = parseFloat(result.data.rows[0].lat);
          this.user_longitude = parseFloat(result.data.rows[0].lng);
          this.split_array_interest = result.data.rows[0].user_interests;
          this.map_marker_array = [this.user_latitude, this.user_longitude];
          // setTimeout(() => {
          // this.initMap(this.user_latitude, this.user_longitude);
          // }, 200);

        }

      });
  }

  /**
   * Checks connectivity or check the user type (own profile or other profile)
   * @param user_id 
   */
  checkConnectivityUser(user_id) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/publicUser-check-user', data: { user_id: user_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.user_control_status = result.user_control_status;
        this.is_my_profile = result.is_loggedIn_user;
        this.user_connectivity = result.is_connected;
        this.user_pending_status = result.is_pending;
        this.checkUserAccessControl();
      }
    });
  }

  checkUserAccessControl() {
    // others => 0, logged_in_user => 1, my_contacts-user = > 2, my_community_user =>3
    this.first_name_show = false;
    this.last_name_show = false;
    this.profile_photo_show = false;
    this.user_name_show = true;
    this.bio_show = false;
    this.address_show = false;
    this.interest_show = false;
    this.contacts_show = false;

    // this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, type)
    this.first_name_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'first_name');
    this.last_name_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'last_name');
    this.profile_photo_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'profile_photo');
    this.bio_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'bio');
    this.interest_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'interest');
    this.contacts_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'contacts');
    this.address_show = this.commonservice.checkPrivacySettingByTypeAndValue(this.user_control, this.user_control_status, 'primary_address');

    if (this.user_pending_status == 1 && this.user_connectivity == 0) {
      this.first_name_show = true;
      this.last_name_show = true;
      this.profile_photo_show = true;
      // this.address_show = true;
      this.interest_show = true;
      this.bio_show = true;
    }

    // if (this.user_control.primary_address == 5 || this.user_control.primary_address == 7) {
    //   this.address_show = true;
    // }

    // console.log(this.bio_show,"  ",this.user_control_status);

    // if (this.user_control_status == 1 || this.user_control_status == 2) {
    //   this.first_name_show = 1;
    //   this.last_name_show = 1;
    //   this.bio_show = 1;
    //   this.address_show = 1;
    //   this.interest_show = 1;
    //   this.contacts_show = 1;
    //   this.profile_photo_show = 1;
    // } else {
    //   if (this.user_control == null) {
    //     if (this.user_control_status == 3) {
    //       this.first_name_show = 1;
    //       this.last_name_show = 1;
    //       this.bio_show = 1;
    //       this.address_show = 0;
    //       this.interest_show = 1;
    //       this.contacts_show = 1;
    //       this.profile_photo_show = 1;
    //     } else if(this.user_control_status == 0){
    //       this.first_name_show = 1;
    //       this.last_name_show = 1;
    //       this.profile_photo_show = 1;
    //       this.user_name_show = 1;
    //       this.bio_show = 0;
    //       this.address_show = 0;
    //       this.interest_show = 0;
    //       this.contacts_show = 0;
    //     }
    //   } else {
    //     this.first_name_show = this.getUserControlStatusByName('first_name');
    //     this.last_name_show = this.getUserControlStatusByName('last_name');
    //     this.profile_photo_show = this.getUserControlStatusByName('profile_photo');
    //     this.bio_show = this.getUserControlStatusByName('bio');
    //     this.interest_show = this.getUserControlStatusByName('interest');
    //     this.contacts_show = this.getUserControlStatusByName('contacts');
    //     this.address_show = this.getUserControlStatusByName('primary_address');
    //   }
    // }
  }

  /**
   * Gets user control status by name
   * @param type 
   * @returns user control status by name 
   */
  // getUserControlStatusByName(type): number {
  //   if ((this.user_control_status == 3
  //     && (this.user_control[type] == 1
  //       || this.user_control[type] == 4
  //       || this.user_control[type] == 6
  //       || this.user_control[type] == 7))
  //     || (this.user_control_status == 0
  //       && (this.user_control[type] == 3
  //         || this.user_control[type] == 5
  //         || this.user_control[type] == 6
  //         || this.user_control[type] == 7))) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // }
  /**
   * Fetchs nearest community data of user
   * @param user_id 
   */
  fetchNearestCommunityData(user_id) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/public-user-nearest-communities', data: { user_id: user_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.communitydata = result.data.rows;
      }
    });
  }
  /**
   * send friend request connection using user id
   * @param conatct_user_id 
   */
  addContactToUser(conatct_user_id, user_type, send_type) {
    let link = user_type == 1 ? 'community/community-home' : 'doer/community-home';
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/connection-request', data: { contacted_user_id: conatct_user_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {

        var postData = {
          'sender_id': this.loginUserId,
          'reciver_id': conatct_user_id,
          'post_id': '',
          // 'title': 'You’ve just received a Connection Request',
          'title': 'You’ve received an invite to connect from ' + localStorage.getItem('name') + '.  It’s so nice to be popular.',
          'link': link,
          'show_in_todo': 0,
          /*'todo_title':'You’ve received a quote from Doer. Wait for more or hire now!',
          'todo_link': link,*/
        };
        this.myGlobals.notificationSocket.emit('post-community-notification', postData);
        this.responseMessageSnackBar(result.msg);
        if (send_type == 'send_view_profile') {
          this.checkConnectivityUser(this.user_id);
        } else {
          this.getUserContactList(this.user_id);

        }
      }
    });
  }

  /**
   * Gets data of public user post , pins , pinners , doers , review details 
   * @param user_id 
   */
  // getPublicUserPostDetails(user_id) {
  //   this.commonservice.postCommunityHttpCall({ url: '/api/pinner/public-user-posts', data: { user_id: user_id }, contenttype: "application/json" }).then(result => {
  //     if (result.status == 1) {
  //       this.public_profile_post = result.data.rows;
  //     }
  //   });
  // }

  /**
   * Adds connect users to community 
   * @param communityid 
   */
  addConnectUsersToCommunity(communityid) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/add-user-community',
      data: { community_id: communityid },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.responseMessageSnackBar(result.msg);
          this.fetchNearestCommunityData(this.user_id);
        }
      });
  }

  /**
   * Get the data of list contact user of user
   * @param user_id 
   */
  getUserContactList(user_id) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/public-user-contacts', data: { user_id: user_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.contactdata = result.data.rows;
        this.contactdata.forEach(data => {

          data.firstNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'first_name');
          data.lastNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'last_name');
          data.profilePictureShow = this.commonservice.checkPrivacySettingByTypeAndValue(data.user_control, data.user_control_status, 'profile_photo');
        });
        this.number_of_mutual_friend = result.no_of_mutual_friends;
      }
    });
  }

  /**
   * Show map data
   * @param user_latitude 
   * @param user_longitude 
   */
  initMap(user_latitude, user_longitude) {
    this.latitude = parseFloat(this.user_latitude);
    this.longitude = parseFloat(this.user_longitude);
    // Create the map.
    this.mapObj = {
      zoom: 8,
      center: { lat: user_latitude, lng: user_longitude },

      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false,
      zoomControl: false,
      mapTypeId: 'roadmap'
    };
    const map: any = new google.maps.Map(document.getElementById('map'), this.mapObj);

    const marker: any = new google.maps.Marker({
      position: { lat: user_latitude, lng: user_longitude },
      map: map,
      title: user_latitude + ',' + user_longitude
    });
  }

  /**
   * Gets user reviewdata 
   * @param user_id 
   * @param page_numner 
   */
  getUserReviewdata(user_id, page_numner) {
    this.isLoadMoreReview = false;
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/public-user-reviews', data: { pinner_id: user_id, page: page_numner, limit: this.limit }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        if (result.data.rows.length >= this.limit) {
          this.isLoadMoreReview = true;
        }
        result.data.rows.forEach(resultantdata => {
          this.review_data.push(resultantdata);
        });
      }
    });
  }

  /**
   * Loads more data
   */
  loadMoreData() {
    this.page_number = this.page_number + 1;
    this.getUserReviewdata(this.user_id, this.page_number);
  }

  /**
   * Go to user profile
   * @param user_id 
   * @param user_type 
   */
  openUserDetails(user_id, user_type) {
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
   * Comns left side bar tgl
   * @param clickItem 
   */
  // comnLeftSideBarTgl(clickItem) {
  //   clickItem.stopPropagation();
  //   if (this.comnLeftSideBarBoxOpen === false) {
  //     this.comnLeftSideBarBoxOpen = true;
  //   }
  //   else {
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
   * Open component for update profile data 
   * @param event 
   */
  loadProfile(event) {
    this.getUserDetails(this.user_id);
  }

  /**
   * Loads profile interest
   * @param event 
   */
  loadProfileInterest(event) {
    this.getUserDetails(this.user_id);
  }

  /**
   * Loads profile bio update
   * @param event 
   */
  loadProfileBio(event) {
    this.getUserDetails(this.user_id);
  }

  /**
   * Open Contacts list open dialog
   * @param contactdata 
   * @param is_my_profile 
   */
  contactsListOpenDialog(contactdata, is_my_profile): void {
    const dialogRef = this.dialog.open(ContactsListDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      data: { contactdataval: contactdata, user_id: this.user_id, user_profile: is_my_profile }
    });
    dialogRef.afterClosed().subscribe(result => {
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

  // ----------popup open close function -----------

  toggleParentPopup(profileSlug) {
    if (profileSlug === 'BioEditComponent') {
      this.bioEditInfo.togglePopup();
    }
    else if (profileSlug === 'UpdateInterestsComponent') {
      this.updateInterestsInfo.togglePopup();
    }
    else if (profileSlug === 'UpdateProfileComponent') {
      this.updateProfileInfo.togglePopup();

    }
    else if (profileSlug === 'UpdateProfileComponent') {
      this.updateProfileInfo.togglePopup();

    }

  }

  /**
   * Go to chat
   * @param user_id 
   * @param user_type 
   */
  goToChat(user_id, user_type) {
    this.commonservice.commonChatRedirectionMethod(user_id, user_type);
  }

  /**
   * Get Crew Member Details
   */
  getCrewMemberDetails() {
    this.commonservice.postHttpCall({
      url: '/crew-member-details',
      data: { 
        user_id: btoa( this.user_id )
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