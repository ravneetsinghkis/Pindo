import { EndorseServicesDialog } from './endorse-services-dialog/endorse-services-dialog.component';
import { ServicesOfferedDialog } from './services-offered-dialog/services-offered-dialog.component';
import { TagListDialog } from './tag-list-dialog/tag-list-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
// import { AppComponent } from '../../../app.component';

import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
declare var $: any;
declare var Swiper: any;
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-community-contacts',
  templateUrl: './community-contacts.component.html',
  styleUrls: ['./community-contacts.component.scss']
})
export class CommunityContactsComponent implements OnInit {
  companylogo_url: string = '';
  blog_image_url: string = '';
  image_url: string = '';
  filter_by_type: string = 'all';
  filter_by_letter: string = '';

  public show: boolean = false;
  friendrequest_list: any = [];
  limit: any = 3;
  offset: any = 0;
  type_of_page: any;
  total_numberod_request: any;
  number_flag_count: any = 0;
  show_see_all: any = true;
  request_response: any = [];

  community_array: any;
  community_list: any = [];
  mapped_array: any;
  searchword: any;
  shownodatadiv: any;
  total_numer_pinner_doer: any = {};
  letterAry: any = [];
  actionMenuOpen: boolean = false;
  leftFilterBoxOpen: boolean = false;
  rightFilterBoxOpen: boolean = false;
  sort_by: any = '';
  showDiv1 = true;
  cardContent = [
    {
      showRemove: false
    },
    {
      showRemove: false
    },
    {
      showRemove: false
    }
  ];

  loadingContactList: Boolean = true;
  loginUserId: any;

  constructor(
    public dialog: MatDialog,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public ref: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant,
    public router: Router,
    public appService: AppComponent
  ) {
    this.letterAry = myGlobals.letterArray;
    this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));
  }

  ngOnInit() {
    this.filter_by_type = 'all';
    this.filter_by_letter = '';
    this.blog_image_url = this.myGlobals.uploadUrl + '/blog/';
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';

    this.getAllFriendRequest(this.offset, this.limit, this.type_of_page);
    this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
    this.totalNumberOfPinnerDoers();
  }

  /**
   * List of the all send friend request 
   * @param offsetp 
   * @param limitp 
   * @param type_of_page 
   */
  getAllFriendRequest(offsetp, limitp, type_of_page) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/list-connection-request', data: { offset: offsetp, limit: limitp }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.friendrequest_list = result.data.rows;
        this.total_numberod_request = result.number_of_requests[0];
        if (type_of_page == 'back') {
          this.number_flag_count = this.number_flag_count - this.friendrequest_list.length;
        } else {
          this.number_flag_count = this.number_flag_count + this.friendrequest_list.length;
        }
        if (this.number_flag_count == this.total_numberod_request) {
          this.show_see_all = false;
        } else {
          this.show_see_all = true;
        }
        console.log('this.friendrequest_list= ', this.friendrequest_list);
      }

    });
  }

  /**
   * Removes user from contact list confirmation
   * @param contactid 
   */
  removeUserFromContactListConfirmation(contactid) {
    Swal({
      title: 'Are you sure you want to remove?',
      text: '',
      //type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((resultswal) => {
      if (resultswal.value) {
        this.removedUserFromContactListApi(contactid);
      }
    });
  }

  /**
   * Removed user from contact list api
   * @param contactid 
   */
  removedUserFromContactListApi(contactid) {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/remove-contacts',
        data: { user_id: contactid },
        contenttype: 'application/json'
      })
      .then(result => {
        this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
        this.responseMessageSnackBar(result.msg);
      });
  }

  /**
   * Gets contact list user
   * @param filter_by_type 
   * @param filter_by_letter 
   * @param sort_by 
   */
  getContactListUser(filter_by_type, filter_by_letter, sort_by) {
    this.loadingContactList = true;
    this.community_array = [];
    this.mapped_array = [];
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/list-contacts',
        data: { filter_1_by: filter_by_type, filter_2_by: filter_by_letter, sort_by: sort_by },
        contenttype: 'application/json'
      })
      .then(result => {
        this.loadingContactList = false;
        if (result.status == 1) {
          this.community_list = result;
          if (this.community_list != '') {
            //return the object of the total array
            this.mapped_array = Object.keys(this.community_list.data).map(key => ({ type: key, value: this.community_list.data[key] }));
          }
        } else {
          this.shownodatadiv = 5;
        }
      });
  }

  /**
   * Sorts by name change
   */
  sortByNameChange() {
    this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
  }

  /**
   * Go to next page of list for invitaion list
   * @param offset 
   * @param limit 
   * @param type_of_page 
   */
  seeNextPage(offset, limit, type_of_page) {
    let newoffset = offset + 3;
    let newlimit = limit;
    this.offset = newoffset;
    this.limit = newlimit;
    this.getAllFriendRequest(newoffset, newlimit, type_of_page);
  }

  /**
   * See previous page of list for invitation list
   * @param offset 
   * @param limit 
   * @param type_of_page 
   */
  seePreviousRequest(offset, limit, type_of_page) {
    let newoffset = offset - 3;
    let newlimit = limit;
    this.offset = newoffset;
    this.limit = newlimit;
    this.getAllFriendRequest(newoffset, newlimit, type_of_page);
  }

  /**
   * Totals number of pinner doers of the user
   */
  totalNumberOfPinnerDoers() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/public-user-pinner-doer-count',
        data: {},
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.total_numer_pinner_doer = result.data;
        }
      });
  }

  /**
   * Sorts byuser type (Pinner Doer or all)
   */
  sortByuserType() {
    this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
  }

  /**
   * Searchs by alphabettical order
   * @param alphabet 
   */
  searchByAlphabet(event, alphabet) {
    // click only one chekcbox
    $('input.example').on('change', function () {
      $('input.example').not(this).prop('checked', false);
    });
    if (event.target.checked == true) {
      this.filter_by_letter = alphabet;
      this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
    }
    if (event.target.checked == false) {
      this.filter_by_letter = '';
      this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
    }
  }

  /**
   * Searchs contact list
   */
  searchContactList() {
    this.filter_by_letter = this.searchword;
    this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
  }

  /**
* Changes friend request status (Accecpt or declined)
   * @param id (request id)
   * @param user_id (user id)
   * @param status (accecpt or declined status (if 0 it is declined , if 1 so it accecpted))
   */
  acceptOrDeclineFriendRequest(id, user_id, user_type, status) {

    if (status == 2) {
      Swal({
        title: 'Are you sure you want to decline this invitation to connect?',
        text: '',
        //type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E6854A',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((resultswal) => {
        if (resultswal.value) {
          this.acceptOrDeclineFriendRequestApi(id, user_id, user_type, status);
        }
      });
    } else {
      this.acceptOrDeclineFriendRequestApi(id, user_id, user_type, status);
    }
  }

  /**
   * Accepts or decline friend request api
   * @param id 
   * @param user_id 
   * @param status 
   */
  acceptOrDeclineFriendRequestApi(id, user_id, user_type, status) {
    let link = user_type == 1 ? 'community/community-contacts' : 'doer/community-contacts';
    let msg = status == 2 ? localStorage.getItem('name') + ' has declined your connection request.' : localStorage.getItem('name') + ' swiped right! Your invite to connect was accepted.';
    this.commonservice.putCommunityHttpCall(
      {
        url: '/api/pinner/respond-connection-request',
        data: { id: id, is_approved: status },
        contenttype: 'application/json'
      })
      .then(result => {
        this.request_response = result.data;
        if (result.status == 1) {
          if (status == 1) {
            let postData = {
              'sender_id': this.loginUserId,
              'reciver_id': user_id,
              'post_id': '',
              'title': msg,
              'link': link,
              'show_in_todo': 0,
              /*'todo_title':msg,
              'todo_link': link',*/
            };
            this.myGlobals.notificationSocket.emit('post-community-notification', postData);
          }
          this.responseMessageSnackBar(result.msg);
          this.friendrequest_list = [];
          this.totalNumberOfPinnerDoers();
          this.getAllFriendRequest(this.offset, this.limit, this.type_of_page);
          this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
        }
      });
  }

  /**
   * Clears the all filter value and show all results
   */
  clearFilter() {
    this.filter_by_type = 'all';
    this.filter_by_letter = '';
    this.sort_by = '';
    this.getContactListUser(this.filter_by_type, this.filter_by_letter, this.sort_by);
  }

  /**
 * Opens user details
 * @param user_id 
 * @param user_type 
 */
  openUserDetails(user_id: number, user_type: number) {
    let b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    if (user_type == 1) {
      // this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      this.router.navigate([`public/pinner-profile/${eHex}`]);
    } else {
      // this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      this.router.navigate([`doer/doer-profile/${eHex}`]);
    }
  }

  /**
   * Finds community toggle
   */
  findCommunityToggle() {
    if (this.show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  /**
   * Tags list open dialog
   */
  tagListOpenDialog(): void {
    const dialogRef = this.dialog.open(TagListDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      // data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /**
   * Opens services offered dialog
   * @param catagori_list (all actefory list)
   * @param doer_id (listed user id)
   */
  openServicesOfferedDialog(catagori_list: any, doer_id: number, user_type: number): void {
    const dialogRef = this.dialog.open(ServicesOfferedDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      data: { list_cat_val: catagori_list, doer_id: doer_id, user_type: user_type }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Opens services offered dialog
   */
  openEndorseServicesDialog(friend_user_id, name): void {
    const dialogRef = this.dialog.open(EndorseServicesDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      disableClose: true,
      data: { id: friend_user_id, name: name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'success') {

      }
    });
  }

  /**
   * Remove dropdown open
   * @param index 
   */
  actionDropdownOpen(index: Number) {
    this.cardContent.forEach((value, i) => {
      if (i === index) {
        value.showRemove = true;
      }
    });
  }

  /**
   * Remove dropdown close
   * @param index 
   */
  actionByDropdownClose(index: Number) {
    // this.actionMenuOpen = false;
    this.cardContent.forEach((value, i) => {
      if (i === index) {
        value.showRemove = false;
      }
    });
  }

  /**
   * Lefts filter tgl
   * @param clickItem 
   */
  leftFilterTgl(clickItem) {
    clickItem.stopPropagation();
    if (this.leftFilterBoxOpen === false) {
      this.leftFilterBoxOpen = true;
    } else {
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
   * Rights filter tgl
   * @param clickItem 
   */
  rightFilterTgl(clickItem) {
    clickItem.stopPropagation();
    if (this.rightFilterBoxOpen === false) {
      this.rightFilterBoxOpen = true;
    } else {
      this.rightFilterBoxOpen = false;
    }
  }

  /**
   * Rights filter over click
   * @param clickItem 
   */
  rightFilterOverClick(clickItem) {
    clickItem.stopPropagation();
    clickItem.preventDefault();
    this.rightFilterBoxOpen = false;
  }

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   */
  public responseMessageSnackBar(message, res_class = 'orangeSnackBar') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

  /**
   * Go to doer chat
   * @param doer_id 
   */
  goToDoerChat(doer_id) {

    let pub_pinner_id = doer_id;
    let pub_pin_id = 0;
    let pub_doer_id = atob(localStorage.getItem('frontend_user_id'));

    let postData = {
      'pub_pinner_id': pub_pinner_id,
      'pub_doer_id': pub_doer_id,
      'pub_pin_id': pub_pin_id,
      'user_type': 2
    };

    this.myGlobals.notificationSocket.emit('save-log-last-message-data', postData);
    this.myGlobals.notificationSocket.on('get-log-last-message-data', (res) => {
      localStorage.setItem('pinner_id_again', btoa(doer_id));
      this.router.navigate(['/doer/chat']);
    });
  }
}