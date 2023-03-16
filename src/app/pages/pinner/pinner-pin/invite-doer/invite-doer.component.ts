import { Component, OnInit, Inject, OnDestroy, HostListener } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Globalconstant } from '../../../../global_constant';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CourseDialogComponent } from './choose-skip-option/choose-skip-optiondialog.component';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import { AppComponent } from '../../../../app.component';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { PublicPinDialog } from './public-pin-dialog/public-pin-dialog.component';
import { InviteDialog } from './invite-dialog/invite-dialog.component';
import { PostSocialDialog } from './post-social-dialog/post-social-dialog.component';
import { FilterDoerComponent } from './filter-doer/filter-doer.component';
import { OpenPindoComponent } from './open-pindo/open-pindo.component';
import { FormGroup } from '@angular/forms';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';
declare var jQuery: any;
declare var $: any;
declare var Swiper: any;
@Component({
  selector: 'app-invite-doer',
  templateUrl: './invite-doer.component.html',
  styleUrls: ['./invite-doer.component.scss']
})
export class InviteDoerComponent implements OnInit, OnDestroy {
  // @HostListener('window:scroll')
  numDoers = 0;
  inviteDoerModel = {};
  componentapiUrl = '';
  pin_id: any;
  selectedDoers = [];

  doerListing = [];
  totalDoer: any;
  filterListingData: any;
  pinLimit: any;
  countTotal: any;
  slugName: any;
  pin_category: any;
  pin_subcategory: any;
  PID: any;
  Pname: any;
  pinnerName: any;
  p: any;

  objFilterData = {
    search_text: '',
    filterList: '',
    sortBy: '',
    showFavSoer: '',
    slug: '',
  };

  constructor(
    public commonservice: CommonService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public titleService: Title,
    public gbConstant: Globalconstant,
    private dialog: MatDialog,
    private appService: AppComponent,
    private _location: Location,
    private sub: FilterDoerComponent,
    private dialogRef: MatDialogRef<PinnerListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pinLimit = gbConstant.paginateCount;
    this.titleService.setTitle('Invite Doer');
    //get activate route
    this.route.params.subscribe(params => {
      this.pin_id = params['pin_id'];
      // console.log(params);
    });

    //this.populateDoer();
    this.componentapiUrl = gbConstant.uploadUrl;
  }

  ngOnInit() {
    this.filterListingData = this.commonservice.listnerPopulateDoer().subscribe((evt) => {
      const tempData = JSON.parse(evt);
      // console.log('EVT DISPLAY', evt);
      this.populateDoer(tempData);
    });
    this.selectedDoers = [];
    this.numDoers = 0;
    this.inviteDoerModel = {};
  }

  ngOnDestroy() {
    this.filterListingData.unsubscribe();
  }

  /**
   * Backs clicked
   */
  backClicked() {
    this._location.back();
  }

  /**
   * Opens pinner list popup
   * @param doer_id
   */

  openPinnerListPopup(list) {
    const popup_width: any = '615px';

    const tempDialogRef = this.dialog.open(PinnerListDialogComponent, {
      width: popup_width,
      disableClose: false,
      data: {
        'hired_list': list,
      }
    });
  }

  /**
   * Go to pins
   * @param typeOfPin
   * @param doerId
   */
  goToPins(typeOfPin, doerId) {
    if (typeOfPin == 'Ongoing') {
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Ongoing`), 'Secret Key').toString();
      const b64 = CryptoJS.AES.encrypt(`${doerId}-Ongoing`, 'Secret Key').toString();
      const e64 = CryptoJS.enc.Base64.parse(b64);
      const eHex = e64.toString(CryptoJS.enc.Hex);
      // console.log(eHex);
      this.router.navigate([]).then(result => { window.open(`/pin-listing/${eHex}`, '_blank'); });
      //this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
    } else {
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Completed`), 'Secret Key').toString();
      const b64 = CryptoJS.AES.encrypt(`${doerId}-Completed`, 'Secret Key').toString();
      const e64 = CryptoJS.enc.Base64.parse(b64);
      const eHex = e64.toString(CryptoJS.enc.Hex);
      this.router.navigate([]).then(result => { window.open(`/pin-listing/${eHex}`, '_blank'); });
    }
  }

  /**
   * Gets add link
   * @param addressLink
   * @returns
   */
  getAddLink(type, fullAddressOrState, city) {
    // let tempaddress = addressLink;
    // const address = tempaddress.replace(/\,/g, '');
    // tempaddress = address.replace(/\ /g, '%20');
    // tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
    // return tempaddress;

    let tempaddress = fullAddressOrState;
    if (type == 'fullAddress') {
      const address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      // console.log('tempaddress=   ', tempaddress);
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
    } else {
      let address = city ? city : '';
      address += fullAddressOrState ? ',' + fullAddressOrState : '';
      tempaddress = `https://maps.google.com/maps?q=${address}`;
    }
    return tempaddress;
  }

  /**
   * Likes doer
   * @param evt
   * @param doerId
   */
  likeDoer(evt, doerId) {
    //console.log(doerId);
    if (evt.target.classList.contains('liked')) {
      evt.target.classList.remove('liked');
    } else {
      evt.target.classList.add('liked');
    }
    this.commonservice.postHttpCall({ url: '/pinners/mark-and-unmark-as-favourite-doer', data: { 'doer_id': doerId }, contenttype: 'application/json' }).then(result => this.onlikeDoerSuccess(result));

  }

  /**
   * Onlikes doer success
   * @param response
   */
  onlikeDoerSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
    }
  }

  /**
   * Populates doer
   * @param [dataToSend]
   */
  populateDoer(dataToSend = {}) {
    //dataToSend.slug = this.pin_id;
    //let tempData = {'page':1,'limit':1000,'search_text':this.searchVal,'filterList':tosendObj,'sortBy':this.selectedSortFilter,'showFavSoer':this.showFavDoerData};
    if (localStorage.getItem('emergencyServicyType') == '0') {
      dataToSend['filterList']['emergency'] = 'yes';
    }
    localStorage.removeItem('emergencyServicyType');
    this.commonservice.postHttpCall({ url: '/pinners/doer-list', data: dataToSend, contenttype: 'application/json' }).then(result => this.populateDoerSuccess(result));
  }

  getFilterData(event) {
    console.log('FROM RIGHT HERE', event);
    this.objFilterData.search_text = event.search_text;
    this.objFilterData.filterList = event.filterList;
    this.objFilterData.sortBy = event.sortBy;
    this.objFilterData.showFavSoer = event.showFavSoer;
    this.objFilterData.slug = event.slug;
  }

  onChangePage(page) {
    console.log(page);
    console.log(this.inviteDoerModel);
    // this.sub.populateDoer(page);
    const tempData = { 'page': page, 'limit': this.gbConstant.paginateCount, 'search_text': this.objFilterData.search_text, 'filterList': this.objFilterData.filterList, 'sortBy': this.objFilterData.sortBy, 'showFavSoer': this.objFilterData.showFavSoer, 'slug': this.objFilterData.slug };
    console.log(JSON.stringify(tempData));
    this.commonservice.filterPopulateDoer(JSON.stringify(tempData));
    window.scroll({
      top: 630,
      left: 0,
      behavior: 'smooth'
    });
  }
  /**
   * Populates doer success
   * @param response
   */
  populateDoerSuccess(response) {
    if (response.status == 1) {
      this.doerListing = response.data;
      setTimeout(() => {
        this.commonservice.initBadgeSlider();
      }, 1000);
      console.log(this.doerListing);
      this.totalDoer = response.count_doer;
      this.slugName = response.pinner_with_pin_details.slug;
      this.pin_category = response.pinner_with_pin_details.parent_category_id;
      this.pin_subcategory = response.pinner_with_pin_details.child_category_id;
      this.PID = response.pinner_with_pin_details.id;
      this.Pname = response.pinner_with_pin_details.title;
      this.pinnerName = response.pinner_with_pin_details.pinner_details.name;
      // this.selectedDoers = [];
      // this.numDoers = 0;
      // this.inviteDoerModel = {};
    }
  }

  /**
   * Selected doer
   * @param index
   */
  selectedDoer(index) {
    const tempName = this.doerListing[index].id;
    this.numDoers = (this.inviteDoerModel[tempName] == true) ? this.numDoers + 1 : this.numDoers - 1;
    //this.selectedDoers.push(tempName);
    const flagALreadyHas = false;
    if (this.inviteDoerModel[tempName] == true) {
      this.selectedDoers.push(this.doerListing[index]);
    } else {
      for (let x = 0; x < this.selectedDoers.length; x++) {
        if (this.selectedDoers[x].id == tempName) {
          this.selectedDoers.splice(x, 1);
        }
      }

    }

  }

  /**
   * Submits invite doer
   * @param frmElm
   */
  submitInviteDoer(frmElm) {
    // console.log("hi");
    // console.log(this.selectedDoers);
    // if (this.numDoers > 0 && this.pin_id) {
    // var postData = {'access_token': localStorage.getItem('frontend_token'), 'pin_id': this.pin_id, 'doer_list': this.selectedDoers };
    // var pubSocketCall1 =1;
    //     this.gbConstant.notificationSocket.emit("post-invite-doers", postData);
    //         this.gbConstant.notificationSocket.on("get-invite-doers", (res)=>{
    //           if (pubSocketCall1==1) {
    //             if (res.status==1) {
    //               console.log(res);
    //               // this.page  = 0;
    //               // this.getAllNotificationAfterRemove();
    //               // this.allNotifications.forEach(element => {
    //               //   if(this.toremoveImg.indexOf(element.id)!==-1){
    //               //     this.allNotifications.splice(this.allNotifications.indexOf(element),1);
    //               //   }
    //               // });
    //               // this.toremoveImg = [];

    //               // this.getAllNotification();
    //             }
    //           }

    //         });
    //     }


    if (this.numDoers > 0 && this.pin_id) {
      this.commonservice.postHttpCall({
        url: '/pinners/invite-doers',
        data: { 'pin_id': this.pin_id, 'doer_list': this.selectedDoers },
        contenttype: 'application/json'
      })
        .then(result => this.inviteDoerSuccess(result));

    } else if (this.numDoers == 0) {
      this.responseMessageSnackBar('Please select doer to send invitation.');
    } else {
      this.responseMessageSnackBar('Invalid pin id');
    }
  }

  /**
   * Invites doer success
   * @param response
   */
  inviteDoerSuccess(response) {
    // this.responseMessageSnackBar(response.msg);
    this.responseMessageSnackBar("You have successfully invited a Doer to your Pin.");
    if (response.status == 1) {
      let responseData = response.pinner_with_pin_details;
      // this.populateDoer();
      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_details': this.selectedDoers,
        //'title' :  response.pinner_with_pin_details.pinner_details.name+' has invited you to quote Pin '+response.pinner_with_pin_details.title+'.',
        'title': 'Heads up!  You’ve received a quote request.',
        'link': 'doer/quotation-preview/' + this.pin_id,
        'show_in_todo': 1,
        'todo_title': 'Heads up! You’ve received a quote request.',
        'todo_link': 'doer/quotation-preview/' + this.pin_id,
        'pin_slug': this.pin_id,
      };

      let postDataPinner = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': atob(localStorage.getItem('frontend_user_id')),
        'title': 'You’ve send a quote request to Doer on Pin ' + responseData['title'] + '. Wait for doer response or hire another doer',
        'PINDETAILSURL': 'pinner/active-quotations/' + btoa(responseData['id']),
        'link': 'pinner/active-quotation-details/' + responseData.slug + '/' + localStorage.getItem('frontend_user_id'),
        'show_in_todo': 0,
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'todo_title': 'You’ve send a quote request to Doer on Pin ' + responseData['title'] + '. Wait for doer response or hire another doer',
        'todo_link': 'pinner/active-quotation-details/' + responseData.slug + '/' + localStorage.getItem('frontend_user_id'),
        'pin_id': responseData['id'],
        'PIN_UNIQUE_ID': responseData['pin_unique_id'],
        // 'MILESTONES': this.quotaionForm.value.items,
        'emailTemplateSlug': 'quotation_submitted_sent_by_doer',
        'doer_title': 'Looking good – your quote was successfully submitted!',
        'doerEmailTemplateSlug': 'quotation_submitted_sent_by_doer',
        'doer_link': 'doer/apply-pins/' + responseData['slug']
      };

      this.gbConstant.notificationSocket.emit('post-invite-doer', postData);
      console.log('OUTER postData 1', postData);
      console.log('OUTER postDataPinner 2', postDataPinner);
      setTimeout(() => {
        // console.log('INNER postDataPinner', postDataPinner);
        this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postDataPinner);
      }, 2000);
      this.router.navigate(['/pinner/dashboard']);
    }
  }

  /**
   * Resets form
   * @param frmelm
   */
  resetForm(frmelm) {
    frmelm.submitted = false;
    frmelm.reset();
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
   * Opens dialog
   */
  openDialog() {
    this.dialog.open(CourseDialogComponent, {
      width: '805px',
      disableClose: false,
      data: this.pin_id
    });
  }

  /**
   * Converts toarray
   * @param num
   * @param checkType
   * @returns
   */
  convertToarray(num, checkType) {
    let checkVal;
    if (checkType == 'filled') {
      checkVal = num;
    } else {
      checkVal = 5 - num;
    }
    const tempArray = [];
    for (let initVal = 1; initVal <= checkVal; initVal++) {
      if (checkType == 'filled') {
        const tempObj = {
          'indexVal': initVal - 1
        };
        tempArray.push(tempObj);
      } else {
        const tempObj = {
          'indexVal': num
        };
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }

  /**
   * Encodes invite doer component
   * @param doer_id
   * @returns
   */
  encode(doer_id) {
    return btoa(doer_id);
  }

  /**
   * Go to chat
   * @param doer_id
   */
  goToChat(doer_id) {
    localStorage.removeItem('doer_id');
    localStorage.removeItem('pin_id');
    const pin_id = '0';

    localStorage.setItem('doer_id', btoa(doer_id));
    localStorage.setItem('pin_id', btoa(pin_id));
    this.router.navigate(['/pinner/chat']);
  }

  /**
   * Makes pin public
   */
  makePinPublic(): void {
    const dialogRef = this.dialog.open(PublicPinDialog, {
      width: '550px',
      panelClass: 'comnDialog-panel',
      data: this.pin_id
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  pindoOpenDialog(slugName): void {
    const dialogRef = this.dialog.open(OpenPindoComponent, {
      width: '550px',
      panelClass: 'comnDialog-panel',
      data: {
        'category': this.pin_category,
        'subcategory': this.pin_subcategory,
        'ID': this.PID,
        'Pname': this.Pname,
        'slug': slugName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  inviteOpenDialog(slugName): void {
    const dialogRef = this.dialog.open(InviteDialog, {
      width: '550px',
      panelClass: 'comnDialog-panel',
      data: {
        'slug': slugName,
        'pinnerName': this.pinnerName,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  postSocialOpenDialog(slugName): void {
    const dialogRef = this.dialog.open(PostSocialDialog, {
      width: '740px',
      panelClass: 'comnDialog-panel',
      data: {
        'slug': slugName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Open Extra Categories
   * @param rem string
   * @param item string
   */
	openExtraCategories(rem, item) {
		const dialogRef = this.dialog.open(ExcessCategoriesComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { list: rem, cat_name: item }
		});
		dialogRef.afterClosed().subscribe(result => {
		});
  }  

  //  badges-slider
  // initBadgeSlider() {
  //   $(".badges-slider").each(function(index, element){
  //     var thisitem = $(this);
  //     thisitem.addClass("instance-" + index);
  //     thisitem.find(".swiper-button-prev").addClass("btn-prev-" + index);
  //     thisitem.find(".swiper-button-next").addClass("btn-next-" + index);
  //     console.log($(".instance-" + index));

  //   let swiper = new Swiper(".instance-" + index+' .swiper-container',{
  //     slidesPerView: 5,
  //     spaceBetween: 0,
  //     navigation: {
  //       nextEl: ".instance-" + index+ ' .btn-next-' + index,
  //       prevEl: ".instance-" + index+ " .btn-prev-" + index,
  //     },
  //     breakpoints: {
  //       1024: {
  //         slidesPerView: 4,
  //         spaceBetween: 0,
  //       },
  //       768: {
  //         slidesPerView: 3,
  //         spaceBetween: 0,
  //       },
  //       640: {
  //         slidesPerView: 3,
  //         spaceBetween: 0,
  //       },
  //       320: {
  //         slidesPerView: 1,
  //         spaceBetween: 0,
  //       }
  //     }
  //   });

  // });

  // }

    /**
   * Show remaining categories
   * @param categories object
   */
  showMoreCats(categories: any) {
    this.dialog.open(AllCategoriesDialogComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { categories: categories }
		});    
  }

}
