import { ReplyDialog } from './reply-dialog/reply-dialog.component';
import { InvitePindoDialog } from './invite-pindo-dialog/invite-pindo-dialog.component';
import { CreatePostDialog } from './create-post-dialog/create-post-dialog.component';
import { CreateReportDialog } from './create-report-dialog/create-report-dialog.component';
import { CreatePostTwoDialog } from './create-post-two-dialog/create-post-two-dialog.component';
import { CreatePostThreeDialog } from './create-post-three-dialog/create-post-three-dialog.component';
import { MapInfoDialog } from './map-info-dialog/map-info-dialog.component';
import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import { BookmarkedListComponent } from './bookmarked-list/bookmarked-list.component';
import { AppComponent } from '../../../../app.component';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

declare var $: any;
declare var Swiper: any;
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'doer-community-home',
  templateUrl: './community-home.component.html',
  styleUrls: ['./community-home.component.scss']
})
export class CommunityHomeComponent implements OnInit {
  @ViewChild('bookmarkInfo')
  private bookmarkInfo: BookmarkedListComponent;
  allparent_category: any = [];
  child_cat_list: any = [];
  subcategory_id: any = [];
  advertisement_data_array: any = [];
  user_profile_location: any;

  image_url: string = '';
  companylogo_url: string = '';
  blog_image_url: string = '';
  admin_post_image_url: string = '';
  advertisement_url: string = '';
  pindologo: string = '';

  selectedtype: string = '';
  selectedSubType: string = '';
  parent_category_id: any = '';

  community_list: any = [];
  communityDetailsList: any = [];
  friendrequest_list: any = [];

  parent_cat_id: any;
  limit: any = 3;
  offset: any = 0;
  total_numberod_request: any;
  number_flag_count: any = 0;
  show_see_all: any = true;
  request_response: any = [];
  search_contact_name: string = '';
  mapdata: any = [];
  maparray: any = [];
  user_lati: any;
  user_lang: any;
  blog_array = [];
  type_of_page: any;


  public show: boolean = false;
  leftFilterBoxOpen: boolean = false;
  rightFilterBoxOpen: boolean = false;
  actionMenuOpenid: number;
  mapObj: any;

  user_location: any;

  postShowFilterType = 'allType';
  pinnerDoerDetailList = [];
  total_number_activity: any = [];
  single_number_community: any = [];
  user_login_id: any;
  owncommunitydata: any = [];
  user_zipcode: any;
  comment_submit_desc: any;
  comment_list: any;

  community_activity_page_number: any = 1;
  community_activity_limit: any = 5;
  nearest_community: any = [];

  searchByText: string = '';
  private searchTextChanged: Subject<string> = new Subject();

  user_type: any;
  loginUserId: any;
  loginUserName: any;
  loadingCommunityList: Boolean = true;

  communityPageLimit: number = 15;
  communityPageNumber: number = 1;
  loadMoreCommunity: Boolean = true;
  adminPostDetailsList: any = [];
  user_first_name: string = '';

  communityPostImageUrl: string;

  constructor(
    public dialog: MatDialog,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public ref: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant,
    public router: Router,
    public appService: AppComponent) {
    this.user_type = parseInt(atob(localStorage.getItem('user_type')));
    this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));
    this.loginUserName = localStorage.getItem('name');
  }


  ngOnInit() {
    this.user_first_name = localStorage.getItem('user_first_name');
    this.getUserLocalLocationsDetails();
    this.selectedSubType = 'all';
    this.selectedtype = 'all';
    this.getAllParentCategory();
    this.getUserLocationInformation();
    this.communityDetailsList = [];
    this.communityPageNumber = 1;
    this.adminPostDetailsList = [];
    this.getAdminPostList();
    // this.getCommunityList();
    this.getSendFriendRequest(this.offset, this.limit, this.type_of_page);
    this.getCommunityActivity();
    // this.fetchcOwnCommunityDataList(this.community_activity_page_number);
    this.getAdvertisementList();

    this.blog_image_url = this.myGlobals.uploadUrl + '/blog/';
    this.admin_post_image_url = this.myGlobals.uploadUrl + '/post/';
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.advertisement_url = this.myGlobals.uploadUrl + '/advertisement/';
    this.pindologo = this.myGlobals.uploadUrl + '/company_logo/pinner_beta_logo.svg';
    this.communityPostImageUrl = this.myGlobals.uploadUrl + '/post_images/';
    const hireDoerSuccess = localStorage.getItem('hireDoerSuccess');
    localStorage.removeItem('hireDoerSuccess');
    if (hireDoerSuccess) {
      Swal({
        //title: "Support Request Submitted",
        text: 'The Doer has been notified that he or she was awarded the job!',
        type: 'success',
        //showCancelButton: true,
        confirmButtonColor: '#bad141',
        //cancelButtonColor: "#bad141",
        confirmButtonText: 'OK',
        //cancelButtonText: 'SUBMIT ANOTHER REQUEST'
      });
    }

    this.searchTextChanged.pipe(
      debounceTime(500),
    ).subscribe(searchTextValue => {
      this.getPinnerOrDoerListApi();
    });
    this.getDoerOrPinnerListByName();
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
   * Gets all parent category
   */
  getAllParentCategory() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/parent-category',
        data: {},
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.allparent_category = result.data.rows;
        }
      });
  }

  /**
  * Changes parent category from category list and search the post by category
  */
  changeParentCategory() {
    this.child_cat_list = [];
    this.subcategory_id = [];
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/child-category',
        data: { parent_id: this.parent_category_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.child_cat_list = result.data.rows;
        }
      });
    this.communityDetailsList = [];
    this.communityPageNumber = 1;

    this.getCommunityList();

  }

  /**
 * Filters search by Type
 */
  filterBySelectedType() {
    this.communityDetailsList = [];
    this.communityPageNumber = 1;

    this.getCommunityList();

  }


  /**
   * Clearfilters community home component
   */
  clearfilter() {
    this.parent_category_id = '';
    this.selectedSubType = 'all';
    this.selectedtype = 'all';
    this.searchByText = '';
    this.subcategory_id = [];
    this.child_cat_list = [];
    this.communityDetailsList = [];
    this.communityPageNumber = 1;

    this.getCommunityList();

  }

  /**
   * Searchs post by any word
   */
  searchPostByText() {
    this.communityDetailsList = [];
    this.communityPageNumber = 1;

    this.getCommunityList();
  }

  /**
  * Adds book mark
  * @param postid
  * @param index
  */
  addBookMark(postid, index) {
    const currentPostDetails = this.communityDetailsList[index];
    const link = currentPostDetails.user.user_type == 1 ? 'community/community-home' : 'doer/community-home';

    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/add-bookmark',
      data: {
        post_id: postid,

        'VISIT_PINDO_URL': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'HOME_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'ACTIVITY_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/dashboard' : '/doer/dashboard' ),
        'MYPINS_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/my-pins' : '/doer/my-pins' ),
        'PIN_A_JOB_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/create-new-pin' : '/public-pins' ),
        'PIN_A_JOB_PAGE': currentPostDetails.user.user_type == 1 ? 'PIN A JOB' : 'FIND A JOB',
        'SITEURL': environment.chatUrl,
      },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.communityDetailsList[index].bookmark = { id: result.data.id };
          let name = '';
          if (currentPostDetails.child_category != undefined && currentPostDetails.child_category != null) {
            name = currentPostDetails.child_category.name;
          }

          const postData = {
            'sender_id': this.loginUserId,
            'reciver_id': currentPostDetails.user_id,
            'post_id': postid,
            'title': 'Another PinDo user bookmarked your ' + currentPostDetails.title + ' - ' + name + ' post . Thanks for your contribution!',
            'link': link,
            'show_in_todo': 0,
          };
          this.myGlobals.notificationSocket.emit('post-community-notification', postData);
          this.responseMessageSnackBar(result.msg,'orangeSnackBar');
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
 * Removes bookmark
 * @param bookmarkid
 * @param index
 */
  removeBookmark(bookmarkid, index) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/delete-bookmark',
      data: { id: bookmarkid },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.communityDetailsList[index].bookmark = null;
          this.responseMessageSnackBar(result.msg,'orangeSnackBar');
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
  * Likes post
  * @param postid
  * @param status
  * @param index
  */
  likePost(postid, status, index) {
    const currentPostDetails = this.communityDetailsList[index];
    let dynamic_title = '';
    let link = '';
    console.log(currentPostDetails);
    if (currentPostDetails.user) {
      link = currentPostDetails.user.user_type == 1 ? 'community/community-home' : 'doer/community-home';
      const type = status == 1 ? '“liked”' : '“unliked”';
      dynamic_title = 'Someone just ' + type + ' your post ';
    }
    const temoObj = {
      'id': 33,
      'user_id': currentPostDetails.user_id,
      'post_id': postid,
      'status': 1,
      'createdAt': new Date(),
      'updatedAt': ''
    };


    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/like-post',
      data: {
        post_id: postid,
        status: status,

        'VISIT_PINDO_URL'    : environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'HOME_PAGE_LINK'     : environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'ACTIVITY_PAGE_LINK' : environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/dashboard' : '/doer/dashboard' ),
        'MYPINS_PAGE_LINK'   : environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/my-pins' : '/doer/my-pins' ),
        'PIN_A_JOB_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/create-new-pin' : '/public-pins' ),
        'PIN_A_JOB_PAGE'     : currentPostDetails.user.user_type == 1 ? 'PIN A JOB'                                                                   : 'FIND A JOB',
        'SITEURL'            : environment.chatUrl,
      },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          if (status == 1) {
            this.communityDetailsList[index].post_likes.push(temoObj);
            this.communityDetailsList[index].is_liked.push(temoObj);
          } else {
            this.communityDetailsList[index].post_likes.pop();
            this.communityDetailsList[index].is_liked.pop();
          }
          if (currentPostDetails.user) {
            if (result.data.parent_category != null) {
              dynamic_title += currentPostDetails.title + '!';
            } else {
              dynamic_title += currentPostDetails.title + ' - ' + result.data.parent_category.name + '!';
            }

            const postData = {
              'sender_id': this.loginUserId,
              'reciver_id': currentPostDetails.user_id,
              'post_id': postid,
              'title': dynamic_title,
              'link': link,
              'show_in_todo': 0,
            };
            this.myGlobals.notificationSocket.emit('post-community-notification', postData);
          }
          this.responseMessageSnackBar(result.msg,'orangeSnackBar');
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
   * Comments add post
   * @param post_id
   * @param is_reply
   * @param comment
   * @param index
   */
  commentAddPost(post_id, is_reply, comment, index) {
    const currentPostDetails = this.communityDetailsList[index];
    let parent_category_name = '';
    if (currentPostDetails.parent_category) {
      parent_category_name = currentPostDetails.parent_category.name;
    }
    // let link = currentPostDetails.user.user_type == 1 ? 'community/community-home' : 'doer/community-home';
    if (comment.trim() == '') {
      this.communityDetailsList[index].comment_msg = comment.trim();
      this.responseMessageSnackBar('comment can\'t blank', 'error');
      return;
    }
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/add-comment',
      data: {
        post_id: post_id,
        comment: comment,
        is_reply: is_reply,
        postCommentId: 0,

        'VISIT_PINDO_URL': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'HOME_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'ACTIVITY_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/dashboard' : '/doer/dashboard' ),
        'MYPINS_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/my-pins' : '/doer/my-pins' ),
        'PIN_A_JOB_PAGE_LINK': environment.chatUrl + ( currentPostDetails.user.user_type == 1 ? '/pinner/create-new-pin' : '/public-pins' ),
        'PIN_A_JOB_PAGE': currentPostDetails.user.user_type == 1 ? 'PIN A JOB' : 'FIND A JOB',
        'SITEURL': environment.chatUrl,
      },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.comment_submit_desc = '';
          this.communityDetailsList[index].comment_key = '';
          this.communityDetailsList[index].comment_msg = '';
          this.formatPostCommentAndReplayCommentDetails(result.data.rows, index);

          if (currentPostDetails.user) {
            const postData = {
              'sender_id': this.loginUserId,
              'reciver_id': currentPostDetails.user_id,
              'post_id': post_id,
              'title': 'You’ve just received a comment on your post ' + currentPostDetails.title + ' - ' + parent_category_name + '!',
              'link': currentPostDetails.user.user_type == 1 ? 'community/community-home' : 'doer/community-home',
              'show_in_todo': 0,
            };
            this.myGlobals.notificationSocket.emit('post-community-notification', postData);
          }

          this.responseMessageSnackBar(result.msg,'orangeSnackBar');
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
   * Formats post comment and replay comment details
   * @param post_comments
   * @param index
   */
  formatPostCommentAndReplayCommentDetails(post_comments, index) {
    const comment_array = JSON.parse(JSON.stringify(post_comments));
    const comment_list = comment_array.filter(each_comment =>
      (each_comment.is_reply == 0 && each_comment.status == 1));
    comment_list.forEach((element, index) => {
      comment_list[index].repalies = comment_array.filter(each_comment =>
        (each_comment.thread_id == element.thread_id && each_comment.is_reply != 0 && each_comment.status == 1));
      element = this.commonservice.privacySettingRearrangeComment(element);
      comment_list[index].repalies.forEach((element, index) => {
        element = this.commonservice.privacySettingRearrangeComment(element);
      });
    });
    this.communityDetailsList[index].comments = comment_list;
  }

  /**
   * Replys open dialog
   * @param reply_id
   * @param thread_id
   * @param post_id
   */
  // replyOpenDialog(reply_id, thread_id, post_id): void {
  //   const dialogRef = this.dialog.open(ReplyDialog, {
  //     width: '700px',
  //     panelClass: 'comnDialog-panel',
  //     data: { replyid: reply_id, threadid: thread_id, postid: post_id }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != undefined && result == 'success') {
  //       this.communityDetailsList = [];
  //       this.communityPageNumber = 1;

  //       this.getCommunityList();
  //     }
  //   });
  // }

  /**
   * Replys open dialog
   * @param reply_id
   * @param thread_id
   * @param post_id
   * @param index
   */
  replyOpenDialog(reply_id, thread_id, post_id, index): void {
    let currentPostDetails = this.communityDetailsList[index];

    const dialogRef = this.dialog.open(ReplyDialog, {
      width: '700px',
      panelClass: 'comnDialog-panel',
      data: { replyid: reply_id, threadid: thread_id, postid: post_id, currentPostDetails }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result != 'close') {
        this.formatPostCommentAndReplayCommentDetails(result.data.rows, index);
      }
    });
  }


  /**
   * Changes chield category and search post by subcategory
   * @param e
     * @param categoryid
   */
  changeChieldCategorySearch(e, id) {
    if (e.target.checked) {
      this.subcategory_id.push(id);
    } else {
      const index = this.subcategory_id.indexOf(id);
      if (index > -1) {
        this.subcategory_id.splice(index, 1);
      }
    }
    this.communityDetailsList = [];
    this.communityPageNumber = 1;

    this.getCommunityList();
  }

  /**
   * Fetch nearest community by latutude and longitude
   * @param page_number
   */
  fetchNearestCommunity(page_number) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/nearest-communities', data: { lat: this.user_lati, lng: this.user_lang, page: page_number, limit: this.community_activity_limit }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.nearest_community = result.data.rows;
        this.nearest_community.forEach(resultantdata => {
          this.mapdata.push(resultantdata);
        });
        const that = this;
        this.nearest_community.forEach(function (item) {
          const latitude = parseFloat(item.latitude);
          const longitude = parseFloat(item.longitude);
          const population = parseFloat(item.distance);
          that.maparray.push({
            center: { lat: latitude, lng: longitude },
            population: population
          });

        });
        // this.initMap(this.maparray, this.user_lati, this.user_lang);
      }
    });
  }

  //---------fetch own community----------
  /**
   * Fetchc Joined community list
   * @param page_number
   */
  fetchcOwnCommunityDataList(page_number) {
    //this.maparray = [];
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/my-communities', data: { page: page_number, limit: this.community_activity_limit }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        const that = this;
        result.data.rows.forEach(resultantdata => {
          this.owncommunitydata.push(resultantdata);
          //this.mapdata.push(resultantdata.community);
          const latitude = parseFloat(resultantdata.community.latitude);
          const longitude = parseFloat(resultantdata.community.longitude);
          const population = parseFloat(resultantdata.community.distance);
          that.maparray.push({
            center: { lat: latitude, lng: longitude },
            population: population
          });
        });
        // console.log('this.owncommunitydata',this.owncommunitydata);

      }
    });
  }

  /**
   * Add to join newcommunity
   * @param communityid
   */
  addJoinCommunity(communityid) {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-user-community', data: { community_id: communityid }, contenttype: 'application/json' }).then(result => {

      if (result.status == 1) {
        this.refreshingBothNearybyAndJoinedCommunityListing();
        this.responseMessageSnackBar(result.msg,'orangeSnackBar');
      }
    });
  }

  /**
   * Refreshing both nearyby and joined community listing
   */
  refreshingBothNearybyAndJoinedCommunityListing() {
    // Here refreshing both joined community and nearyby community list.
    this.owncommunitydata = [];
    this.nearest_community = [];
    this.mapdata = [];
    this.maparray = [];
    this.community_activity_page_number = 1;
    // this.fetchcOwnCommunityDataList(this.community_activity_page_number);
    this.getCommunityActivity();
    // this.fetchNearestCommunity(this.community_activity_page_number);
  }

  /**
  * Infinite scroll for pagination for join community and nearest community section
  */
  onScroll() {
    // this.community_activity_page_number = this.community_activity_page_number + 1;
    // this.fetchcOwnCommunityDataList(this.community_activity_page_number);
    // this.fetchNearestCommunity(this.community_activity_page_number);
  }

  /**
   * Gets user local locations details and set into map
   */
  getUserLocalLocationsDetails() {
    this.user_location = localStorage.getItem('pindo_system_current_position_address');
    this.user_lati = localStorage.getItem('pindo_system_current_position_lat');
    this.user_lang = localStorage.getItem('pindo_system_current_position_lng');
  }

  /**
   * Gets user location information
   */
  getUserLocationInformation() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/get-user-locations', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.user_login_id = result.data.rows[0].id;
        this.user_profile_location = result.data.rows[0];
        // if (result.data.rows[0].locations.length > 0) {
        // this.user_location = result.data.rows[0].locations.slice(-1).pop().address;
        // this.user_lati = parseFloat(result.data.rows[0].locations.slice(-1).pop().lat);
        // this.user_lang = parseFloat(result.data.rows[0].locations.slice(-1).pop().lng);
        // this.user_zipcode = result.data.rows[0].locations.zipcode;
        // } else {
        // this.user_location = 'Fairfield, CT, USA';
        // this.user_lati = 41.1408363;
        // this.user_lang = -73.26126149999999;
        // this.user_zipcode = '06824';
        // }
      }
      // this.initMap([], this.user_lati, this.user_lang);
      // this.fetchNearestCommunity(this.community_activity_page_number);

    });
  }

  /**
   * Gets All community activity
   */
  getCommunityActivity() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/community-activity', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.total_number_activity = result.data;
      }
    });

  }

  /**
   * Singles community activity number (post , pins, dors, pinners)
   * @param community_id
   */
  singleCommunityActivity(community_id) {

    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/single-community-details', data: { community_id: community_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.single_number_community = result.data;
      }
    });
  }

  /**
   * Connection send to add your contact list
   * @param community_id
   */
  connectToContact(friendDetails, index) {
    // console.log('friendDetails',friendDetails);
    const link = friendDetails.user_type == 1 ? 'community/community-home' : 'doer/community-home';
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/connection-request', data: { contacted_user_id: friendDetails.id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.pinnerDoerDetailList[index].is_pending = 1;
        const postData = {
          'sender_id': this.loginUserId,
          'reciver_id': friendDetails.id,
          'post_id': '',
          'title': 'You’ve received an invite to connect from ' + this.loginUserName + '.  It’s so nice to be popular.',
          'link': link,
          'show_in_todo': 0,
          /*'todo_title':'You’ve received a quote from Doer. Wait for more or hire now!',
          'todo_link': 'pinner/active-quotation-details/',*/
        };
        console.log(postData);
        this.myGlobals.notificationSocket.emit('post-community-notification', postData);
        // this.getPinnerOrDoerListApi();
        this.getPinnerOrDoerListApi();
        this.responseMessageSnackBar(result.msg,'orangeSnackBar');
      }
    });
  }

  /**
   * Gets the list of the friend request
   * @param offsetp
   * @param limitp
   * @param type_of_page
   */
  getSendFriendRequest(offsetp, limitp, type_of_page) {
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
        console.log(this.friendrequest_list);
      }
      if (result.status == 0) {
        this.friendrequest_list = [];
      }
    });
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
    const link = user_type == 1 ? 'community/community-contacts' : 'doer/community-contacts';
    const msg = status == 2 ? localStorage.getItem('name') + ' has declined your connection request.' : localStorage.getItem('name') + ' swiped right! Your invite to connect was accepted.';
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
            const postData = {
              'sender_id': this.loginUserId,
              'reciver_id': user_id,
              'post_id': '',
              'title': msg,
              'link': link,
              'show_in_todo': 0,
            };
            this.myGlobals.notificationSocket.emit('post-community-notification', postData);
          }
          this.responseMessageSnackBar(result.msg,'orangeSnackBar');
          this.getSendFriendRequest(this.offset, this.limit, this.type_of_page);
        }
      });
  }

  /**
   * Go to next page of list for invitaion list
   * @param offset
   * @param limit
   * @param type_of_page
   */
  seeNextPage(offset, limit, type_of_page) {
    const newoffset = offset + 3;
    const newlimit = limit;
    this.offset = newoffset;
    this.limit = newlimit;
    this.getSendFriendRequest(newoffset, newlimit, type_of_page);
  }

  /**
   * See previous page of list for invitation list
   * @param offset
   * @param limit
   * @param type_of_page
   */
  seePreviousRequest(offset, limit, type_of_page) {
    const newoffset = offset - 3;
    const newlimit = limit;
    this.offset = newoffset;
    this.limit = newlimit;
    this.getSendFriendRequest(newoffset, newlimit, type_of_page);
  }

  /**
   * Gets nearest community contact search
   */
  getDoerOrPinnerListByName() {
    this.searchTextChanged.next();
  }

  /**
   * Gets pinner or doer list api
   */
  getPinnerOrDoerListApi() {
    this.pinnerDoerDetailList = [];
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/search-contact',
      data: { last_name: this.search_contact_name },
      contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.pinnerDoerDetailList = result.data.rows;
          this.pinnerDoerDetailList.forEach((element, index) => {
            element.firstNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(element.user_control, element.user_control_status, 'first_name');

            element.lastNameShow = this.commonservice.checkPrivacySettingByTypeAndValue(element.user_control, element.user_control_status, 'last_name');

            element.profilePictureShow = this.commonservice.checkPrivacySettingByTypeAndValue(element.user_control, element.user_control_status, 'profile_photo');
            // console.log(element);
          });
        }
      });
  }

  /**
   * Go to blog details using blog id
   * @param blog_id
   */
  goToBlogDetails(blog_id) {
    const b64 = CryptoJS.AES.encrypt(`${blog_id}`, 'Secret Key').toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const eHex = e64.toString(CryptoJS.enc.Hex);
    this.router.navigate([]).then(result => { window.open(`blog-detail/${eHex}`, '_blank'); });
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
   * Map function implemet
   * @param maparray
   * @param userlati
   * @param userlongi
   */
  // initMap(maparray, userlati, userlongi) {
  //   console.log(userlati, userlongi);
  //   // let circleColor = "#BAD141";
  //   // if (this.appService.user_type == 2) {
  //   //   circleColor = "#E6854A";
  //   // }

  //   this.mapObj = {
  //     zoom: 8,
  //     center: { lat: userlati, lng: userlongi },
  //     // size: { 1200: 1200 },
  //     // radius: 15 * 1609.34,
  //     mapTypeControl: false,
  //     // scaleControl: false,
  //     // draggable: false,
  //     // zoomControl: false,
  //     mapTypeId: 'terrain',
  //   };

  //   const map: any = new google.maps.Map(document.getElementById('map'), this.mapObj);
  //   new google.maps.Marker({
  //     position: this.mapObj.center,
  //     map: map,
  //     title: this.user_location
  //   });
  //   // for (var i = 0; i < maparray.length; i++) {
  //   //   // Add the circle for this city to the map.
  //   //   var cityCircle = new google.maps.Circle({
  //   //     strokeColor: circleColor,
  //   //     strokeOpacity: 1,
  //   //     strokeWeight: 2,
  //   //     fillColor: circleColor,
  //   //     fillOpacity: 0.35,
  //   //     map: map,
  //   //     center: maparray[i].center,

  //   //     radius: Math.sqrt(5) * 1000
  //   //   });
  //   //   map.fitBounds(cityCircle.getBounds());
  //   // }
  // }

  /**
   * map dialog open
   * @param communityname
   * @param zipcode
   * @param latitude
   * @param longitude
   * @param communityid
   * @param type
   * @param user_community_id
   */
  mapInfoOpenDialog(communityname, zipcode, latitude, longitude, communityid, type, user_community_id): void {
    const dialogRef = this.dialog.open(MapInfoDialog, {
      width: '878px',
      panelClass: 'comnDialog-panel',
      data: { communityname: communityname, zipcode: zipcode, latitude: latitude, longitude: longitude, communityid: communityid, community_type: type, community_user_id: user_community_id }
    });

    const tempdialogRefconst3 = dialogRef.componentInstance.listingPopulated.subscribe(($event) => {
      this.refreshingBothNearybyAndJoinedCommunityListing();
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Searching for dialog open
   */
  createPostOpenDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      // data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'success') {
        this.communityDetailsList = [];
        this.communityPageNumber = 1;

        this.getCommunityList();
        this.getCommunityActivity();
      }
    });
  }
  /**
    * Repost Post Dialog open
    */
  createReportOpenDialog(postdata): void {
    const dialogRef = this.dialog.open(CreateReportDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      data: postdata
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
    * Recomendation dialog open
    */
  createPostTwoOpenDialog(): void {
    const dialogRef = this.dialog.open(CreatePostTwoDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      autoFocus: false
      // data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'success') {
        this.communityDetailsList = [];
        this.communityPageNumber = 1;
        this.getCommunityList();
        this.getCommunityActivity();
      }
    });
  }

  /**
    * Start a conversation dialog open
    */
  createPostThreeOpenDialog(): void {
    const dialogRef = this.dialog.open(CreatePostThreeDialog, {
      width: '530px',
      panelClass: 'comnDialog-panel',
      autoFocus: false
      // data: {name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result == 'success') {
        this.communityDetailsList = [];
        this.communityPageNumber = 1;
        this.getCommunityList();
        this.getCommunityActivity();
      }
    });
  }

  /**
  * Invite to join pindo dialog open
  */
  invitePindoOpenDialog(): void {
    const dialogRef = this.dialog.open(InvitePindoDialog, {
      width: '700px',
      panelClass: 'comnDialog-panel',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Open dropdown for report
   * @param id
   */
  actionDropdownOpen(id) {
    this.actionMenuOpenid = id;
  }
  /**
   * close dropdown for report
   * @param id
   */
  actionByDropdownClose(id) {
    this.actionMenuOpenid = null;
  }

  /**
   * Responses message snack bar for notification into right side below
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
   * Posts show filter fnc
   * @param type
   */
  postShowFilterFnc(type) {
    this.postShowFilterType = type;
    this.parent_category_id = '';
    this.selectedSubType = 'all';
    this.selectedtype = 'all';
    this.searchByText = '';
    this.communityDetailsList = [];
    this.communityPageNumber = 1;
    this.getCommunityList();
  }

  /**
  * Gets admin post list
  */
  getAdminPostList() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/list-admin-post',
      data: {}, contenttype:
        'application/json'
    }).then(result => {
      if (result.status == 1) {
        // console.log(result.data);
        const temp_admin_community_list = result.data.rows;
        const community_array_val = JSON.parse(JSON.stringify(temp_admin_community_list));
        community_array_val.forEach((array_val, community_index) => {
          const comment_array = JSON.parse(JSON.stringify(array_val.post_comments));
          const comment_list = comment_array.filter(each_comment =>
            (each_comment.is_reply == 0));
          comment_list.forEach((element, index) => {
            comment_list[index].repalies = comment_array.filter(each_comment =>
              (each_comment.thread_id == element.thread_id && each_comment.is_reply != 0));

            element = this.commonservice.privacySettingRearrangeComment(element);
            comment_list[index].repalies.forEach((element, index) => {
              element = this.commonservice.privacySettingRearrangeComment(element);
            });
          });
          temp_admin_community_list[community_index].comments = comment_list;
          temp_admin_community_list[community_index].comment_box_open = false;
          this.adminPostDetailsList.push(temp_admin_community_list[community_index]);
        });
      }

      setTimeout(() => {
        this.getCommunityList();
      }, 500);

    });
  }

  /**
   * Params community home component
   */
  getCommunityList() {
    if (this.communityDetailsList.length == 0) {
      this.communityDetailsList = [...this.adminPostDetailsList];
    }

    const dynamicUrl = this.postShowFilterType == 'allType' ? '/api/pinner/list-post' : '/api/pinner/list-bookmark';
    this.loadingCommunityList = true;
    // this.communityDetailsList = [];
    this.community_list = [];
    this.commonservice.postCommunityHttpCall({
      url: dynamicUrl,
      data: {
        filter_1_by: this.selectedtype,
        filter_2_by: this.selectedSubType,
        filter_3_by: this.parent_category_id,
        filter_4_by: this.subcategory_id,
        filter_5_by: this.searchByText,
        limit: this.communityPageLimit,
        page_no: this.communityPageNumber
      },
      contenttype: 'application/json'
    })
      .then(result => {

        this.loadingCommunityList = false;
        if (result.status == 1) {
          this.community_list = result.data;
          if (this.community_list) {
            this.loadMoreCommunity = false;
            if (this.community_list.length == this.communityPageLimit) {
              this.loadMoreCommunity = true;
            }

            const community_array_val = JSON.parse(JSON.stringify(this.community_list));
            community_array_val.forEach((array_val, community_index) => {
              const comment_array = JSON.parse(JSON.stringify(array_val.post_comments));
              const comment_list = comment_array.filter(each_comment =>
                (each_comment.is_reply == 0 && each_comment.status == 1));
              comment_list.forEach((element, index) => {
                comment_list[index].repalies = comment_array.filter(each_comment =>
                  (each_comment.thread_id == element.thread_id && each_comment.is_reply != 0 && each_comment.status == 1));

                element = this.commonservice.privacySettingRearrangeComment(element);

                comment_list[index].repalies.forEach((element, index) => {

                  element = this.commonservice.privacySettingRearrangeComment(element);
                });

              });

              this.community_list[community_index].comments = comment_list;
              this.community_list[community_index].comment_box_open = false;

              let temp_community_data = this.community_list[community_index];
              if (this.community_list[community_index].type != 'admin_post') {
                temp_community_data = this.commonservice.privacySettingRearrange(this.community_list[community_index]);
              }

              this.communityDetailsList.push(temp_community_data);
            });
          }
        } else {
          if (this.communityPageNumber != 1) {
            this.communityPageNumber = this.communityPageNumber - 1;
          }
        }
        // console.log('COMM LIST', this.communityDetailsList);
      });
    // console.log("this.communityDetailsList= ",this.communityDetailsList);
  }

  /**
   * Gets community list
   */
  // getCommunityList() {
  //   if (this.communityDetailsList.length == 0) {
  //     this.communityDetailsList = [...this.adminPostDetailsList];
  //   }
  //   let dynamicUrl = this.postShowFilterType == 'allType' ? '/api/pinner/list-post' : '/api/pinner/list-bookmark';
  //   this.community_list = [];
  //   this.loadingCommunityList = true;
  //   this.commonservice.postCommunityHttpCall({
  //     url: dynamicUrl,
  //     data: {
  //       filter_1_by: this.selectedtype,
  //       filter_2_by: this.selectedSubType,
  //       filter_3_by: this.parent_category_id,
  //       filter_4_by: this.subcategory_id,
  //       filter_5_by: this.searchByText,
  //       limit: this.communityPageLimit,
  //       page_no: this.communityPageNumber
  //     }, contenttype: "application/json"
  //   })
  //     .then(result => {
  //       this.loadingCommunityList = false;
  //       if (result.status == 1) {
  //         this.community_list = result.data
  //         if (this.community_list != '') {
  //           this.loadMoreCommunity = false;
  //           if (this.community_list.length == this.communityPageLimit) {
  //             this.loadMoreCommunity = true;
  //           }

  //           let community_array_val = JSON.parse(JSON.stringify(this.community_list));
  //           community_array_val.forEach((array_val, community_index) => {
  //             let comment_array = JSON.parse(JSON.stringify(array_val.post_comments));
  //             let comment_list = comment_array.filter(each_comment => (each_comment.is_reply == 0));
  //             comment_list.forEach((element, index) => {
  //               comment_list[index].repalies = comment_array.filter(each_comment => (each_comment.thread_id == element.thread_id && each_comment.is_reply != 0))
  //             });
  //             this.community_list[community_index].comments = comment_list;
  //             this.community_list[community_index].comment_box_open = false;
  //             this.communityDetailsList.push(this.community_list[community_index]);
  //           });
  //         }
  //       } else {
  //         if (this.communityPageNumber != 1) {
  //           this.communityPageNumber = this.communityPageNumber - 1;
  //         }
  //       }
  //     });
  //     console.log(this.communityDetailsList);
  // }

  /**
   * Onscrolls community load
   */
  onscrollCommunityLoad() {
    if (this.loadMoreCommunity) {
      this.communityPageNumber++;
      this.getCommunityList();
    }
  }

  /**
   * Comments write on keyup
   * @param evnt
   */
  commentWriteOnKeyup(evnt) {
    evnt.target.style.height = '32px';
    const scroll_height = $(evnt.target).get(0).scrollHeight;
    $(evnt.target).css('height', scroll_height + 'px');
  }

  /**
   * Opens comment for post
   * @param index
   */
  openCommentonPost(index) {
    const community_array_val = JSON.parse(JSON.stringify(this.communityDetailsList));
    community_array_val.forEach((array_val, community_index) => {
      if (community_index == index) {
        this.communityDetailsList[community_index].comment_box_open = !this.communityDetailsList[community_index].comment_box_open;
      } else {
        this.communityDetailsList[community_index].comment_box_open = false;
      }
    });
    // $('#showcomment_' + id).slideToggle();
  }

  /**
   * Advertisements list show into slider
   */
  getAdvertisementList() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/list-advertisements',
        data: {},
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.advertisement_data_array = result.data.rows;
        }
      });

  }
}
