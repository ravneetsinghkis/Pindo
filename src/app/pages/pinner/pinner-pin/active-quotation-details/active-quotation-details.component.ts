import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { Globalconstant } from '../../../../global_constant';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AppComponent } from '../../../../app.component';
import { Location } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';
import { Subscription } from 'rxjs';
import { PinnerListDialogComponent } from 'src/app/shared/pinner-list-dialog/pinner-list-dialog.component';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-active-quotation-details',
  templateUrl: './active-quotation-details.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./active-quotation-details.component.scss']
})
export class ActiveQuotationDetailsComponent implements OnInit, AfterViewInit {

  @ViewChild('popUpRaiseDispute') popUpRaiseDispute;

  populatedAttachments = [];

  job_ID = '';
  doer_ID = '';
  encrypted_pinId: any;
  Doer_ID: any;
  totalActiveQuotationDetails: any;
  hiredStatus = 0;
  uploadUrl: any;
  rating_avg = 3;
  ratingValues = ['Poor ', 'Mediocre at best', '100% Satisfied', 'Excellent', 'Really Exceptional'];
  ratingValuesService = ['Horribly Rude', 'Less than friendly', '100% Satisfied', 'Really Cares', 'May be my new BFF'];
  ratingValuesValue = ['Not worth it', 'Could be better', '100% Satisfied', 'A bargain', 'Got way more than my moneys worth!'];
  coverLetter = '';
  ratecoverLetter = '';
  todo_list = [];
  filledRating = [];
  unfilledRating = [];

  filledRatingService = [];
  unfilledRatingService = [];

  filledRatingValue = [];
  unfilledRatingValue = [];

  addressLink: any;
  doerAddress: any;

  quotation_details: any = {};
  afterInit = false;
  dynamic_form_data: any;
  faoRate = 3;
  faoRated = false;
  disabledornot = true;

  individualRating = [3, 3, 3];
  doer_name: string = '';
  doerBadges = [];

  constructor(public commonservice: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _location: Location,
    public myGlobalsQuot: Globalconstant,
    private dialog: MatDialog,
    private appService: AppComponent,
    private dp: DecimalPipe) {

    this.route.params.subscribe(params => {
      this.job_ID = params['job_id'];
      this.doer_ID = atob(params['doer-id']);
    });

    this.uploadUrl = myGlobalsQuot.uploadUrl;
    this.filledRating = this.convertToarray(this.rating_avg, 'filled', 'quality');
    this.unfilledRating = this.convertToarray(this.rating_avg, 'empty', 'quality');
    this.filledRatingService = this.convertToarray(this.rating_avg, 'filled', 'service');
    this.unfilledRatingService = this.convertToarray(this.rating_avg, 'empty', 'service');
    this.filledRatingValue = this.convertToarray(this.rating_avg, 'filled', 'value');
    this.unfilledRatingValue = this.convertToarray(this.rating_avg, 'empty', 'value');
  }

  ngOnInit() {
    this.getQuotationDetails();
    //console.log(this.totalActiveQuotationDetails.pin_details)
  }

  ngAfterViewInit() {
    this.afterInit = true;
  }

  backClicked() {
    this._location.back();
  }

  onFaoRate(e) {
    this.faoRated = true;
    this.faoRate = e;
    this.rating_avg = e;
    this.individualRating[0] = e;
    this.individualRating[1] = e;
    this.individualRating[2] = e;
    this.filledRating = this.convertToarray(this.rating_avg, 'filled', 'quality');
    this.unfilledRating = this.convertToarray(this.rating_avg, 'empty', 'quality');
    this.filledRatingService = this.convertToarray(this.rating_avg, 'filled', 'service');
    this.unfilledRatingService = this.convertToarray(this.rating_avg, 'empty', 'service');
    this.filledRatingValue = this.convertToarray(this.rating_avg, 'filled', 'value');
    this.unfilledRatingValue = this.convertToarray(this.rating_avg, 'empty', 'value');
  }

  /**
	 * get quotation Details
	 *
	 *
	 *
  */
  getQuotationDetails() {
    this.commonservice.postHttpCall({ url: '/pinners/doer-quotation-details', data: { 'slug': this.job_ID, 'doer_id': this.doer_ID }, contenttype: 'application/json' }).then(result => this.getQuotationsSuccess(result));
  }

  encode(doer_id) {
    return btoa(doer_id);
  }

  goToPins(typeOfPin, doerId) {
    if (typeOfPin == 'Ongoing') {
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Ongoing`), 'Secret Key').toString();
      const b64 = CryptoJS.AES.encrypt(`${doerId}-Ongoing`, 'Secret Key').toString();
      const e64 = CryptoJS.enc.Base64.parse(b64);
      const eHex = e64.toString(CryptoJS.enc.Hex);
      console.log(eHex);
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

  getTotalPrice(prc, hrs) {
    const totalPrc = parseFloat(prc) * parseFloat(hrs);
    return totalPrc;
  }

  gettotalHrs() {
    const tempArr = this.totalActiveQuotationDetails['quotations'].normal_milestones;
    let totalHrs = 0;
    for (let i = 0; i < tempArr.length; i++) {
      totalHrs = totalHrs + parseInt(tempArr[i].hours);
    }
    return totalHrs;
  }

  /**
	 * quatation populate
	 *
	 * @response response from api
	 *
  */
  getQuotationsSuccess(response) {
    if (response.status == 1 && response.data) {
      this.encrypted_pinId = btoa(response.data.pin_id);
      this.Doer_ID = response.data.doer_id;
      this.totalActiveQuotationDetails = response.data;

      if (this.totalActiveQuotationDetails.user_details && this.totalActiveQuotationDetails.user_details.user_badges) {
        this.doerBadges = this.commonservice.removeDuplicates( this.totalActiveQuotationDetails.user_details.user_badges, 'badge_id' );
      }

      console.log("here: ", this.totalActiveQuotationDetails);

      if (
        this.totalActiveQuotationDetails.pin_details.status == 3 || 
        (this.totalActiveQuotationDetails.pin_details.status == 5 && this.totalActiveQuotationDetails.status == 6) ||
        (this.totalActiveQuotationDetails.pin_details.status == 2 && this.totalActiveQuotationDetails.quotations.status == 4)
      ) {
        if (!this.totalActiveQuotationDetails.rating_review) {
          Swal({
            text: 'Please take a moment and review the Doer. Both the Doer and your Contacts are depending on you! Simply select a Rating and add an optional Comment. The rating is preset to 100% satisfied',
            // text: '',
            confirmButtonColor: '#bad141',
          });
        }
      }
      this.doer_name = this.totalActiveQuotationDetails['user_details'].profile_type == 2 ? this.totalActiveQuotationDetails['user_details'].company_name : this.totalActiveQuotationDetails['user_details'].name;
      /*if(this.totalActiveQuotationDetails['pin_details']['is_blocked']==1){
        this.router.navigate(['/errors']);
      }*/
      if (response.data.quotations.attachments.length > 0) {
        this.populatedAttachments = response.data.quotations.attachments;
      }
      if (this.totalActiveQuotationDetails['pin_details']['dynamicForm'] == '["no data"]') {
        this.dynamic_form_data = null;
      } else {
        this.dynamic_form_data = JSON.parse(this.totalActiveQuotationDetails['pin_details']['dynamicForm']);
      }
      // console.log('SLUGGGGGGGGGGGGGGGGGGg', this.totalActiveQuotationDetails['pin_details']['slug']);
      // console.log('aaaaaaaaa', this.totalActiveQuotationDetails);

      this.hiredStatus = response.status;
      this.todo_list = response.todo_list;

      this.addressLink = this.totalActiveQuotationDetails['pin_details']['address'];
      const address = this.addressLink.replace(/\,/g, '');
      this.addressLink = address.replace(/\ /g, '%20');
      this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;

      this.doerAddress = this.totalActiveQuotationDetails['user_details']['address'] || "";
      const addressDoer = this.doerAddress.replace(/\,/g, '');
      this.doerAddress = addressDoer.replace(/\ /g, '%20');
      this.doerAddress = `https://maps.google.com/maps?q=${this.doerAddress}`;
    }
  }

  getAddLink(type, fullAddressOrState, city) {
    let tempaddress = fullAddressOrState;
    if (type == 'fullAddress') {
      const address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
    } else {
      let address = city ? city : '';
      address += fullAddressOrState ? ',' + fullAddressOrState : '';
      tempaddress = `https://maps.google.com/maps?q=${address}`;
    }
    return tempaddress;
  }

  rejectDoer() {
    if (this.totalActiveQuotationDetails.hasOwnProperty('quotations')) {
      let applnId = this.totalActiveQuotationDetails['quotations'].application_id;
      applnId = btoa(applnId);
      Swal({
        title: 'Are you sure?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'Yes, reject!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.commonservice.postHttpCall({ url: '/pinners/reject-doer-application', data: { 'application_id': applnId }, contenttype: 'application/json' }).then(result => this.onRejectSuccess(result));
        }
      });
    }
  }

  onRejectSuccess(response) {
    var postData = {
      'sender_id': atob(localStorage.getItem('frontend_user_id')),
      'reciver_id': this.totalActiveQuotationDetails['doer_id'],
      'title': 'Sorry but the Pinner has not accepted your quote. On to the next!',
      'pin_id': this.totalActiveQuotationDetails['pin_id'],
      'link': 'doer/quotation-preview/' + this.totalActiveQuotationDetails['pin_details']['slug'],
      'emailTemplateSlug': '',
      'user_title': 'We’ve informed Doer ' + this.doer_name + ' that you did not accept the quote on Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
      'userEmailTemplateSlug': 'application_rejected_by_pinner',
      'user_link': 'pinner/active-quotations/' + btoa(this.totalActiveQuotationDetails['pin_id']),

      'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
      'PINDETAILSURL': 'doer/quotation-preview/' + this.totalActiveQuotationDetails.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
      'HOME_PAGE_LINK': 'doer/community-home',
      'ACTIVITY_PAGE_LINK': 'doer/dashboard',
      'MYPINS_PAGE_LINK': 'doer/my-pins',
      'PIN_A_JOB_PAGE': 'FIND A JOB',
      'PIN_A_JOB_PAGE_LINK': 'public-pins'

    };

    this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

    setTimeout(() => {
      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
    }, 3000);
    this.hiredStatus = 3;
    this.responseMessageSnackBar(response.msg);
  }

  hireDoer() {
    if (this.totalActiveQuotationDetails.hasOwnProperty('quotations')) {
      let applnId = this.totalActiveQuotationDetails['quotations'].application_id;
      console.log(applnId);
      applnId = btoa(applnId);
      Swal({
        title: '',
        text: 'Are you ready to hire this Doer?',
        // type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'Yes, hire!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.commonservice.postHttpCall({ url: '/pinners/hire-doer', data: { 'application_id': applnId }, contenttype: 'application/json' }).then(result => this.onHireSuccess(result));
        }
      });
      //this.commonservice.postHttpCall({url:'/pinners/hire-doer', data:{'application_id':applnId}, contenttype:"application/json"}).then(result=>this.getHireSuccess(result));
    }
  }

  onHireSuccess(response) {
    console.log("onHireSuccess: ", response);
    if (response.status == 1) {

      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['doer_id'],
        'title': 'Awesome! Your quote on Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + ' was accepted and your PinDo fee was processed.',
        'link': 'doer/quotation-preview/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'show_in_todo': 1,
        'todo_title': 'You have been hired! Complete the job then invoice ' + response.data.pinner_name + ' for payment.',
        'todo_link': 'doer/quotation-preview/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': '',
        'user_title': 'Congrats! Your quote acceptance has been sent to Doer ' + this.doer_name,
        'userEmailTemplateSlug': 'hire_doer_without_quotation_for_pinner',
        'user_link': 'pinner/active-quotations/' + btoa(this.totalActiveQuotationDetails['pin_id']),

				'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
				'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails.pin_details['slug'] + '/' + btoa(this.totalActiveQuotationDetails.doer_id),
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
      };
      console.log("postData: ", postData);
      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 3000);

      if (response.status == 1) {
        const hireDoerSuccess: any = true;
        localStorage.setItem('hireDoerSuccess', hireDoerSuccess);
      }

      this.totalActiveQuotationDetails['status'] = 2;
      this.responseMessageSnackBar(response.msg);
      this.hiredStatus = 2;
      this.router.navigate(['/community/community-home']);
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

  populateArray(num, checkType, checkVal, selectArr) {
    const tempArray = [];
    let arrToUse = [];
    if (selectArr == 'quality') {
      arrToUse = this.ratingValues;
    } else if (selectArr == 'service') {
      arrToUse = this.ratingValuesService;
    } else if (selectArr == 'value') {
      arrToUse = this.ratingValuesValue;
    }
    for (let initVal = 1; initVal <= checkVal; initVal++) {
      if (checkType == 'filled') {
        const tempObj = {
          'name': arrToUse[initVal - 1],
          'indexVal': initVal - 1
        };
        tempArray.push(tempObj);
      } else {
        const tempObj = {
          'name': arrToUse[num],
          'indexVal': num
        };
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }

  convertToarray(num, checkType, selectArr) {
    let checkVal;
    if (checkType == 'filled') {
      checkVal = num;
    } else {
      checkVal = 5 - num;
    }

    const tosendArray = this.populateArray(num, checkType, checkVal, selectArr);
    return tosendArray;
  }

  calculateTotalRating() {
    let totalRating: any = this.individualRating.reduce((acc, currentVal) => {
      return acc + currentVal;
    });
    totalRating = (totalRating / 3).toFixed(1);
    this.faoRate = totalRating;
  }

  setRating(indexVal) {
    this.rating_avg = indexVal + 1;
    this.filledRating = this.convertToarray(this.rating_avg, 'filled', 'quality');
    this.unfilledRating = this.convertToarray(this.rating_avg, 'empty', 'quality');
    this.individualRating[0] = this.rating_avg;
    this.calculateTotalRating();
  }

  setRatingService(indexVal) {
    this.rating_avg = indexVal + 1;
    this.filledRatingService = this.convertToarray(this.rating_avg, 'filled', 'service');
    this.unfilledRatingService = this.convertToarray(this.rating_avg, 'empty', 'service');
    this.individualRating[1] = this.rating_avg;
    this.calculateTotalRating();
  }

  setRatingValue(indexVal) {
    this.rating_avg = indexVal + 1;
    this.filledRatingValue = this.convertToarray(this.rating_avg, 'filled', 'value');
    this.unfilledRatingValue = this.convertToarray(this.rating_avg, 'empty', 'value');
    this.individualRating[2] = this.rating_avg;
    this.calculateTotalRating();
  }


  acceptOrRejectEditRequest(mlstnId, statusCode) {
    this.commonservice.postHttpCall({ url: '/pinners/milestone-edit-request-action', data: { 'milestone_id': mlstnId, 'action_val': statusCode }, contenttype: 'application/json' }).then(result => this.onacceptOrRejectEditRequestSuccess(result));
  }
  n
  onacceptOrRejectEditRequestSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      this.getQuotationDetails();
    }
  }

  acceptOrRejectEditedMlstn(mlstnId, statusCode) {
    this.commonservice.postHttpCall({ url: '/pinners/action-on-updated-milestone', data: { 'milestone_id': mlstnId, 'action_val': statusCode }, contenttype: 'application/json' }).then(result => this.onacceptOrRejectEditedMlstnSuccess(result));
    if (statusCode == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['doer_id'],
        'title': ' has been accepted edit milestone for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'milestone_acceptance_sent_to_doer',
        'user_title': ' your edit milestone acceptance was sent to the ' + this.doer_name,
        'userEmailTemplateSlug': 'milestone_acceptance_sent_by_pinner',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
      };
    } else {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['doer_id'],
        'title': ' has been rejected edit milestone for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'milestone_rejection_sent_to_doer',
        'user_title': ' your edit milestone rejection was sent to the ' + this.doer_name,
        'userEmailTemplateSlug': 'milestone_rejection_sent_by_pinner',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
      };
    }

    this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

    setTimeout(() => {
      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
    }, 3000);
  }

  /**
   * Onaccepts or reject edited mlstn success
   * @param response
   */
  onacceptOrRejectEditedMlstnSuccess(response) {
    // console.log(response);
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      this.getQuotationDetails();
    }
  }

  accptOrRejectMilstnRemove(mlstnId, stausCode) {
    let swalText = '';
    let confrmBtnText = '';
    if (stausCode == 1) {
      swalText = 'Are you sure you want to remove the milestone.';
      confrmBtnText = 'Remove Milestone';
    } else {
      swalText = 'Do you want to reject the milestone remove request.';
      confrmBtnText = 'Reject Request';
    }
    Swal({
      title: swalText,
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: confrmBtnText,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/pinners/milestone-remove-request-action', data: { 'milestone_id': mlstnId, 'action_val': stausCode }, contenttype: 'application/json' }).then(result => this.onaccptOrRejectMilstnRemoveSuccess(result, stausCode));
      }
    });
  }

  onaccptOrRejectMilstnRemoveSuccess(response, statusCode) {
    if (response.status == 1) {
      if (statusCode == 1) {
        var postData = {
          'sender_id': atob(localStorage.getItem('frontend_user_id')),
          'reciver_id': this.totalActiveQuotationDetails['doer_id'],
          'title': ' has been removed milestone for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
          'pin_id': this.totalActiveQuotationDetails['pin_id'],
          'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
          'emailTemplateSlug': 'milestone_removed_sent_to_doer',
          'user_title': ' your milestone remove was sent to the ' + this.doer_name,
          'userEmailTemplateSlug': 'milestone_removed_sent_by_pinner',
          'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
        };
      } else {
        var postData = {
          'sender_id': atob(localStorage.getItem('frontend_user_id')),
          'reciver_id': this.totalActiveQuotationDetails['doer_id'],
          'title': ' has been rejected milestone remove request for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
          'pin_id': this.totalActiveQuotationDetails['pin_id'],
          'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
          'emailTemplateSlug': 'milestone_remove_rejection_sent_to_doer',
          'user_title': ' your milestone remove rejection was sent to the ' + this.doer_name,
          'userEmailTemplateSlug': 'milestone_remove_rejection_sent_by_pinner',
          'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
        };
      }
      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 3000);
      this.responseMessageSnackBar(response.msg);
      this.getQuotationDetails();
    }
  }

  acctReqst(qtnId) {
    Swal({
      title: 'Do you want to Accept Request to Add New Milestone',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Accept',
      cancelButtonText: 'Reject'
    }).then((result) => {
      const tempdismissStat: any = result.dismiss;
      if (result.value) {
        this.actionToAccptOrRejectMilstnAddRequest(qtnId, 1);
      } else if (tempdismissStat == 'cancel') {
        this.actionToAccptOrRejectMilstnAddRequest(qtnId, 0);
      }
    });
  }

  actionToAccptOrRejectMilstnAddRequest(qtnId, stausCode) {
    this.commonservice.postHttpCall({ url: '/pinners/milestone-add-request-action', data: { 'quotation_id': qtnId, 'action_val': stausCode }, contenttype: 'application/json' }).then(result => this.onactionToAccptOrRejectMilstnAddRequestSuccess(result));
  }

  onactionToAccptOrRejectMilstnAddRequestSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      this.getQuotationDetails();
    }
  }

  //* Payment release popup options *//
  paymentReleasePopup() {
    this.quotation_details = this.totalActiveQuotationDetails['quotations'];
    console.log('quotationDetails', this.quotation_details);

    console.log(this.totalActiveQuotationDetails);

    const total_quotation_amount = this.quotation_details.total_quotation_amount;

    Swal({
      title: 'Yippee! The job is done.',
      text: 'The Doer has requested payment in the amount of $' + this.dp.transform(total_quotation_amount, '.2'),
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Pay & Close the pin',
      cancelButtonText: 'Go Back',
      // allowOutsideClick: false,
      // showCloseButton: true
    }).then((result) => {
      if (result.value) {
        if (this.totalActiveQuotationDetails.pin_details.parent_category_id == 3) {
          const formData = {
            'doer_id': this.quotation_details.doer_id,
            'quotation_id': this.quotation_details.id,
            'pin_id': this.quotation_details.pin_id,
            'application_id': this.quotation_details.application_id,
            'payment_method': 50
          };
          this.commonservice.postHttpCall({ url: '/pinners/complete-payment', data: formData, contenttype: 'application/json' }).then(result => {
            this.onSuccess(result);
          });
        } else {
          this.openDialog('online', this.totalActiveQuotationDetails);
        }
      }
    });
  }

  onSuccess(response) {
    if (response.status == 1) {
      const pinDetailTempData = {
        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'doer/quotation-preview/' + this.totalActiveQuotationDetails.pin_details['slug'],
        // + '/' + localStorage.getItem('frontend_user_id')
        'PINDETAILSURLFORPINNER': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails.pin_details['slug'] + '/' + btoa(this.totalActiveQuotationDetails.doer_id),
        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins'
      };

      this.responseMessageSnackBar('Your payment has been processed and your job is now complete');

      // Swal({
      //   title: 'PAYMENT SUCCESS!',
      //   text: 'Your payment has been processed and your job is now complete.',
      //   type: 'success',
      //   confirmButtonColor: '#bad141',
      // });

      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.quotation_details['doer_id'],
        'title': 'Pinner ' + localStorage.getItem('name') + ' has submitted payment for your completed job. Thanks for using PinDo!',
        'pin_id': this.quotation_details['pin_id'],
        'show_in_todo': 0,
        'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails.pin_details['slug'],
        'emailTemplateSlug': 'payment_release_submitted_by_pinner',

        'user_title': 'You’ve paid your Doer. Your job is now complete. Thank you for being a PinDo Pinner!',
        'userEmailTemplateSlug': 'payment_release_submitted_send_by_pinner',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails.pin_details['slug'] + '/' + btoa(this.quotation_details['doer_id']),

        'PIN_UNIQUE_ID': pinDetailTempData['PIN_UNIQUE_ID'],
        'PINDETAILSURL': pinDetailTempData['PINDETAILSURL'],
        'HOME_PAGE_LINK': pinDetailTempData['HOME_PAGE_LINK'],
        'ACTIVITY_PAGE_LINK': pinDetailTempData['ACTIVITY_PAGE_LINK'],
        'MYPINS_PAGE_LINK': pinDetailTempData['MYPINS_PAGE_LINK'],
        'PIN_A_JOB_PAGE': pinDetailTempData['PIN_A_JOB_PAGE'],
        'PIN_A_JOB_PAGE_LINK': pinDetailTempData['PIN_A_JOB_PAGE_LINK'],
      };

      const postDataPinner = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.quotation_details['doer_id'],
        'title': 'Pinner ' + localStorage.getItem('name') + ' has submitted payment for your completed job. Thanks for using PinDo!',
        'pin_id': this.quotation_details['pin_id'],
        'show_in_todo': 0,
        'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails.pin_details['slug'],
        'emailTemplateSlug': 'payment_release_submitted_by_pinner',

        'user_title': 'You’ve paid your Doer. Your job is now complete. Thank you for being a PinDo Pinner!',
        'userEmailTemplateSlug': 'payment_release_submitted_send_by_pinner',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails.pin_details['slug'] + '/' + btoa(this.quotation_details['doer_id']),

        'PIN_UNIQUE_ID': pinDetailTempData['PIN_UNIQUE_ID'],
        'PINDETAILSURL': pinDetailTempData['PINDETAILSURLFORPINNER'],
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postDataPinner);
      }, 3000);
      // console.log('online payment= ', postData);
      // console.log('online paymentPinner= ', postDataPinner);
      // this.router.navigate(['pinner/active-quotation-details/' + this.totalActiveQuotationDetails.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id')]);
      // this.router.navigate(['/pinner/my-pins']);
      this.getQuotationDetails();
      // this.getQuotationDetails();
    } else {
      Swal({
        title: 'Payment failed. Please try again',
        confirmButtonColor: '#bad141',
      });
    }
  }


  togglePaymentReleasePopup(milestone_id, payment_method) {


    /*console.log('payment_method',payment_method);
    console.log('milestone_id',milestone_id);
    console.log('doer_id',this.totalActiveQuotationDetails['doer_id']);
    console.log('posted_by',this.totalActiveQuotationDetails['posted_by']);
    console.log('pin_id',this.totalActiveQuotationDetails['pin_id']);*/
    /*let doer_img;
    if(this.totalActiveQuotationDetails['user_details']['company_logo']!=null && this.totalActiveQuotationDetails['user_details']['company_logo']=='') {
      doer_img = this.totalActiveQuotationDetails['user_details']['company_logo'];
    }
    else {
      doer_img = this.totalActiveQuotationDetails['user_details']['profile_photo'];
    }*/
    const doerImgType = (this.totalActiveQuotationDetails['user_details']['company_logo'] != null && this.totalActiveQuotationDetails['user_details']['company_logo'] != '') ? 'company' : 'profile';
    const tempObj = {
      'milestone_id': milestone_id,
      'doer_id': this.totalActiveQuotationDetails['doer_id'],
      'posted_by': this.totalActiveQuotationDetails['posted_by'],
      'pin_id': this.totalActiveQuotationDetails['pin_id'],
      'pin_title': this.totalActiveQuotationDetails['pin_details']['slug'],
      'doer_img': this.totalActiveQuotationDetails['user_details']['company_logo'] || this.totalActiveQuotationDetails['user_details']['profile_photo'],
      'doerTypeImg': doerImgType
    };

    if (payment_method == 0 || payment_method == 1) {
      this.openDialog('online', tempObj);
      /*Swal({
        title: "Release Payment",
        text: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#035670',
        confirmButtonText: 'Release Payment',
        cancelButtonText: 'Reject'
        }).then((result) => {
          let tempdismissStat:any = result.dismiss;
          if (result.value) {
            this.commonservice.postHttpCall({url:'/pinners/complete-payment', data:tempObj, contenttype:"application/json"}).then(result=>this.completePaymentSuccess(result));
          }
          else{
            this.commonservice.postHttpCall({url:'/pinners/reject-payment', data:tempObj, contenttype:"application/json"}).then(result=>this.rejectPaymentSuccess(result));
          }
      })*/

    } else {
      this.openDialog('offline', tempObj);
    }
  }

  completePaymentSuccess(response) {
    if (response.status == 1) {
      Swal('PAYMENT SUCCESS!', 'Your payment has been processed and your job is now complete.', 'success');
      this.getQuotationDetails();
    } else {
      Swal('PAYMENT FAIL!', 'Transaction has been failed.', 'error');
    }

  }

  rejectPaymentSuccess(response) {
    this.getQuotationDetails();
    this.responseMessageSnackBar(response.msg);
    /*if(response.status==1){
      Swal("PAYMENT SUCCESS!", "Transaction has been completed successfully.", "success");
      this.getQuotationDetails();
    }
    else{
      Swal("PAYMENT FAIL!", "Transaction has been failed.", "error");
    }*/

  }



  openDialog(payment_receive_mode, tempObj) {

    let pinDetailTempData = {
      'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
      'PINDETAILSURL': 'doer/quotation-preview/' + this.totalActiveQuotationDetails.pin_details['slug'],
      'HOME_PAGE_LINK': 'doer/community-home',
      'ACTIVITY_PAGE_LINK': 'doer/dashboard',
      'MYPINS_PAGE_LINK': 'doer/my-pins',
      'PIN_A_JOB_PAGE': 'FIND A JOB',
      'PIN_A_JOB_PAGE_LINK': 'public-pins'
    };

    const tempdialogRef = this.dialog.open(CourseDialogComponent, {
      width: '540px',
      disableClose: false,
      data: { 'payment_receive_mode': payment_receive_mode, 'tempObj': tempObj, 'pinDetailTempData': pinDetailTempData }
    });
    tempdialogRef.afterClosed().subscribe(() => {
      this.getQuotationDetails();
    });
    const tempdialogRefconst = tempdialogRef.componentInstance.onAddNewMilestoneReqstSend.subscribe(() => {
      //this.getQuotationPageDetails();
      this.getQuotationDetails();
    });

    // const tempdialogRefconst2 = tempdialogRef.componentInstance.backToPaymentConfimationSweetAlert.subscribe((event) => {
    //   if (event) {
    //     this.paymentReleasePopup();
    //   }
    // });
  }



  //############### Go To the Chat Board #####################//
  goToChat(doer_id, pin_id) {
    localStorage.removeItem('doer_id');
    localStorage.removeItem('pin_id');


    localStorage.setItem('doer_id', btoa(doer_id));
    localStorage.setItem('pin_id', btoa(pin_id));
    this.router.navigate(['/pinner/chat']);
  }

  submitDoerRating(frmElm) {
    if (frmElm.valid) {
      const tempObj = {
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'doer_id': this.totalActiveQuotationDetails['doer_id'],
        'rating': this.faoRate,
        'quality': this.individualRating[0],
        'service': this.individualRating[1],
        'value': this.individualRating[2],
        'review': this.ratecoverLetter
      };
      this.commonservice.postHttpCall({ url: '/pinners/rating-review', data: tempObj, contenttype: 'application/json' }).then(result => this.onsubmitDoerRatingSuccess(result));
    }
  }

  onsubmitDoerRatingSuccess(response) {
    if (response.status == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['doer_id'],

        'title': 'Pinner ' + this.totalActiveQuotationDetails['pinner_details']['name'] + ' has reviewed your completed job.  Thanks for using PinDo!"',
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'link': 'doer/quotation-preview/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'pin_rating_submitted_by_pinner',
        'user_title': 'You’ve paid and reviewed your Doer. Thank you for being a PinDo Pinner!',
        'userEmailTemplateSlug': '',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id']),

        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'doer/quotation-preview/' + this.totalActiveQuotationDetails.pin_details['slug'],
        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins'

      };

      /*var postDataDoer = {
          'sender_id':  atob(localStorage.getItem('frontend_user_id')),
          'reciver_id': this.totalActiveQuotationDetails['doer_id'],

          'title' : 'Pinner has reviewed your completed job.  Thanks for using PinDo!',
          'pin_id' : this.totalActiveQuotationDetails['pin_id'],
          'link': 'doer/quotation-preview/'+this.totalActiveQuotationDetails['pin_details']['slug'],
          'emailTemplateSlug':'',

        };*/

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 5000);
      /*setTimeout(()=>{
        this.myGlobalsQuot.notificationSocket.emit("post-notification-to-doer",postDataDoer);
      },5000);*/
      this.responseMessageSnackBar(response.msg);
      this.router.navigate(['/community/community-home']);
      //this.router.navigate(['/pinner/my-pins']);
    }
  }

  addorrejectNewMilestone(qtnId, statusCode) {

    this.commonservice.postHttpCall({ url: '/pinners/accept-new-milestone', data: { 'milestone_id': qtnId, 'action_val': statusCode }, contenttype: 'application/json' }).then(result => this.onaddorrejectNewMilestoneSuccess(result, statusCode));
  }

  onaddorrejectNewMilestoneSuccess(response, statusCode) {
    if (response.status == 1) {
      if (statusCode == 1) {
        var postData = {
          'sender_id': atob(localStorage.getItem('frontend_user_id')),
          'reciver_id': this.totalActiveQuotationDetails['doer_id'],
          'title': ' has been accepted new milestone for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
          'pin_id': this.totalActiveQuotationDetails['pin_id'],
          'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
          'emailTemplateSlug': 'milestone_acceptance_sent_to_doer',
          'user_title': ' your new milestone acceptance was sent to the ' + this.doer_name,
          'userEmailTemplateSlug': 'milestone_acceptance_sent_by_pinner',
          'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
        };
      } else {
        var postData = {
          'sender_id': atob(localStorage.getItem('frontend_user_id')),
          'reciver_id': this.totalActiveQuotationDetails['doer_id'],
          'title': ' has been rejected new milestone for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
          'pin_id': this.totalActiveQuotationDetails['pin_id'],
          'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
          'emailTemplateSlug': 'milestone_rejection_sent_to_doer',
          'user_title': ' your new milestone rejection was sent to the ' + this.doer_name,
          'userEmailTemplateSlug': 'milestone_rejection_sent_by_pinner',
          'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
        };
      }
      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 3000);
      this.responseMessageSnackBar(response.msg);
      this.getQuotationDetails();
    }
  }

  toggleChildPopup() {
    this.popUpRaiseDispute.togglePopup(this.totalActiveQuotationDetails['pin_details']);
  }

  close() {
    Swal({
      title: '',
      // text: 'Are you sure you\'re ready to close this job?',
      text: 'Are you sure you want to close this Pin without requesting payment for it?  This action cannot be undone',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result['value']) {
        this.commonservice.postHttpCall({ url: '/pinners/close-pin', data: { 'pin_id': this.encrypted_pinId, 'doer_id': this.Doer_ID }, contenttype: 'application/json' }).then(result => this.onClosePinSuccess(result));
      }
    });
  }

  closePin() {
    this.openDialog('reject_payment', this.totalActiveQuotationDetails);
  }

  onClosePinSuccess(response) {
    if (response.status == 1) {
      /*var postData = { 'sender_id':  atob(localStorage.getItem('frontend_user_id')),
                        'reciver_id': this.totalActiveQuotationDetails['doer_id'],
                        'title' : ' has complete the pin '+this.totalActiveQuotationDetails['pin_details']['title'],
                        'pin_id' : this.totalActiveQuotationDetails['pin_id'],
                        'link': 'doer/apply-pins/'+this.totalActiveQuotationDetails['pin_details']['slug'],
                        'emailTemplateSlug':'pin_complete_submitted_by_pinner',
                        'user_title': ' you have complete the job and please reviewing & rating for the pin '+this.totalActiveQuotationDetails['pin_details']['title'],
                        'userEmailTemplateSlug': 'pin_complete_submitted_sent_by_pinner',
                        'user_link': 'pinner/active-quotation-details/'+this.totalActiveQuotationDetails['pin_details']['slug']+'/'+btoa(this.totalActiveQuotationDetails['doer_id'])};

      this.myGlobalsQuot.notificationSocket.emit("post-notification-to-doer",postData);

      setTimeout(()=>{
        this.myGlobalsQuot.notificationSocket.emit("post-notification-to-pinner-himself",postData);
      },3000);*/
      this.getQuotationDetails();
      //this.router.navigate(['/pinner/dashboard']);
      this.responseMessageSnackBar(response.msg);
    }
  }

  completePin() {
    Swal({
      title: 'Are you sure want to mark the job as Complete?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result['value']) {
        this.commonservice.postHttpCall({ url: '/pinners/complete-pin', data: { 'pin_id': this.totalActiveQuotationDetails['pin_id'] }, contenttype: 'application/json' }).then(result => this.oncompletePinSuccess(result));
      }
    });

  }

  oncompletePinSuccess(response) {
    if (response.status == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['doer_id'],
        'title': ' has complete the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'pin_complete_submitted_by_pinner',
        'user_title': ' you have complete the job and please reviewing & rating for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
        'userEmailTemplateSlug': 'pin_complete_submitted_sent_by_pinner',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id']),
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 3000);
      this.getQuotationDetails();
      this.responseMessageSnackBar(response.msg);
    }
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

  /*
   * open popup
   * 
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

}
