import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { Globalconstant } from '../../../../global_constant';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AppComponent } from '../../../../app.component';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare var $: any;

import { QuoteBlockerDialogComponent } from "./quote-blocker-dialog/quote-blocker-dialog.component";
import { SiteVisitDialogComponent } from './site-visit-dialog/site-visit-dialog.component';

@Component({
  selector: 'app-quotation-preview',
  templateUrl: './quotation-preview.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quotation-preview.component.scss']
})
export class QuotationPreviewComponent implements OnInit, AfterViewInit {

  @ViewChild('popUpRaiseDispute') popUpRaiseDispute;

  populatedAttachments = [];

  job_ID = '';
  doer_ID = '';
  Pinner_ID: any;
  Pin_ID: any;
  slug = '';
  public totalActiveQuotationDetails = {};
  hiredStatus = 0;
  uploadUrl: any;
  rating_avg = 5;
  ratingValues = ['Terrible', 'Very Bad', 'Average', 'Very Good', 'Fantastic'];
  coverLetter = '';
  ratecoverLetter = '';
  todo_list = [];
  filledRating = [];
  unfilledRating = [];
  addressLink: any;
  doerAddress: any;
  dynamic_form_data: any;
  quotation_details: any = {};
  totalDataToPrepoluate: any = {};
  afterInit = false;
  show_quotaion_preview: any = 'false';
  pin_details: any;
  doerName: any = '';
  doer_name: any = '';
  pinnerName: any;
  public isMsgExists: any;
  selectedPaymentOptions = [];
  apiCalls: number = 0;
  interval: any;

  constructor(public commonservice: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _location: Location,
    public myGlobalsQuot: Globalconstant,
    private dialog: MatDialog,
    private appService: AppComponent,
  ) {

    this.route.params.subscribe(params => {
      this.slug = params['slug'];
    });
    this.uploadUrl = myGlobalsQuot.uploadUrl;
    this.filledRating = this.convertToarray(this.rating_avg, 'filled');
    this.unfilledRating = this.convertToarray(this.rating_avg, 'empty');
    this.doerName = localStorage.getItem('name');
    this.doer_name = parseInt(atob(localStorage.getItem('profile_type'))) == 2 ? localStorage.getItem('company_name') : localStorage.getItem('name');
  }

  ngOnInit() {
    this.getQuotationDetails();
    this.getQuotationPageDetails();

    this.interval = setInterval(() => {
      if (this.apiCalls == 2) {
        clearInterval(this.interval);
        this.checkRequestPaymentRequest();
      }
    }, 1000);

  }

  checkMsg(pinner_id, pin_id) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-is-message-sent',
      data: {
        'user_id': pinner_id,
        'pin_id': pin_id
      }
    }).then(res => {
      this.isMsgExists = res.data;
    });
  }

  getQuotationPageDetails() {
    this.commonservice.postHttpCall({
      url: '/doers/quotation-page-details',
      data: { slug: this.slug }, contenttype: 'application/json'
    })
      .then(result => this.getDetailsSuccess(result));
  }

  getDetailsSuccess(response) {
    if (response.status == 1) {
      this.totalDataToPrepoluate = response.data;
      console.log('******QPDetails******', response.data);
      this.setupSelectedPaymentMethods();
      this.apiCalls++;
    }
  }

  requestPayment() {
    this.openDialog();
  }

  openDialog() {
    let tempData: any;
    let widthOfPopup = '950px';

    if (this.totalActiveQuotationDetails['quotations']['save_and_preview'] == 1) {
      tempData = {
        'option': 'Edit Charge',
        'totalData': { 'paymentOptions': this.totalDataToPrepoluate.doer_payment_options, 'quotation_id': this.totalDataToPrepoluate.quotation_dtls.id, 'applicationDetails': this.totalDataToPrepoluate.application_dtls, 'fetchedPinDetails': this.totalDataToPrepoluate.pin_details, 'totalPrice': this.totalDataToPrepoluate.quotation_dtls.total_quotation_amount, 'quotation': this.totalDataToPrepoluate.quotation_dtls, 'admin': this.totalDataToPrepoluate.admin_commission_details },
        'pinData': this.totalActiveQuotationDetails['pin_details']
      };
      widthOfPopup = '545px';
    } else {
      tempData = {
        'option': 'choose_payment',
        'totalData': { 'paymentOptions': this.totalDataToPrepoluate.doer_payment_options, 'quotation_id': this.totalDataToPrepoluate.quotation_dtls.id, 'applicationDetails': this.totalDataToPrepoluate.application_dtls, 'fetchedPinDetails': this.totalDataToPrepoluate.pin_details, 'totalPrice': this.totalDataToPrepoluate.quotation_dtls.total_quotation_amount, 'quotation': this.totalDataToPrepoluate.quotation_dtls, 'admin': this.totalDataToPrepoluate.admin_commission_details },
        'pinData': this.totalActiveQuotationDetails['pin_details']
      };
    }

    if (this.totalActiveQuotationDetails['pin_details']['parent_category_id'] != 3) {
      const tempdialogRef = this.dialog.open(CourseDialogComponent, {
        width: widthOfPopup,
        disableClose: false,
        data: tempData
      });

      const tempdialogRefconst2 = tempdialogRef.componentInstance.onSendingQuotaionBeforeHire.subscribe(($event) => {
        if ($event) {
          this.commonservice.postHttpCall({ url: '/doers/submit-quotation', data: {}, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
        }
      });

      const tempdialogRefconst3 = tempdialogRef.componentInstance.paymentRequestSend.subscribe(($event) => {
      });
    } else {
      let form_data = {
        'description': 'Volunteer',
        'quotation_id': this.totalActiveQuotationDetails['quotations']['normal_milestones'][0]['quotation_id'],
        'pin_id': this.totalActiveQuotationDetails['quotations']['pin_id'],
        'pinner_id': this.totalActiveQuotationDetails['pin_details']['pinner_id'],
        'doer_id': this.totalActiveQuotationDetails['doer_id'],
        'paymentType': ['4', '1', '2', '3']
      };

      this.commonservice.postHttpCall({ url: '/doers/request-for-payment', data: form_data, contenttype: 'application/json' }).then(result => this.onRequestPaymentReleaseSuccess(result));
    }
  }

  onRequestPaymentReleaseSuccess(response) {
    if (response.status == 1) {
      let postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['pin_details']['pinner_id'],

        'title': 'Doer ' + this.doer_name + ' has requested payment on Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
        'link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'show_in_todo': 1,
        'todo_title': 'Doer ' + this.doer_name + ' has requested payment on Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
        'todo_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),

        'doer_title': 'The Pinner has been notified that Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + ' is completed and is expecting your invoice.',
        'doer_link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'doer_show_in_todo': 1,
        'doer_todo_title': 'The Pinner has been notified that Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + ' is completed and is expecting your invoice.',
        'doer_todo_link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],

        'pin_id': this.totalActiveQuotationDetails['pin_details']['id'],
        'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',

        'MILESTONES': this.totalActiveQuotationDetails['quotations']['normal_milestones'][0],
        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINNAME': this.totalActiveQuotationDetails['pin_details']['title'],

        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
      };


      let doerPostData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['pin_details']['pinner_id'],

        'title': 'Doer ' + this.doer_name + ' has requested payment on Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
        'link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'show_in_todo': 1,
        'todo_title': 'Doer ' + this.doer_name + ' has requested payment on Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
        'todo_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),

        'doer_title': 'The Pinner has been notified that Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + ' is completed and is expecting your invoice.',
        'doer_link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'doer_show_in_todo': 1,
        'doer_todo_title': 'The Pinner has been notified that Pin ' + this.totalActiveQuotationDetails['pin_details']['title'] + ' is completed and is expecting your invoice.',
        'doer_todo_link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],

        'pin_id': this.totalActiveQuotationDetails['pin_details']['id'],
        'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',

        'MILESTONES': this.totalActiveQuotationDetails['quotations']['normal_milestones'][0],
        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINNAME': this.totalActiveQuotationDetails['pin_details']['title'],

        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins',
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner', postData);
      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer-himself', doerPostData);
      }, 5000);

      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.commonservice.changePaymentRequest(true);
      this.router.navigate(['doer/dashboard']);
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }

  }

  submitFunSuccess(response) {
    if (response.status == 1) {
      let postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalDataToPrepoluate.pin_details['pinner_id'],
        'title': 'Great news! You’ve received a quote from Doer ' + this.doer_name + ' on Pin ' + this.totalDataToPrepoluate.pin_details['title'] + '.',
        'link': 'pinner/active-quotation-details/' + this.totalDataToPrepoluate.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'show_in_todo': 1,
        'todo_title': 'You’ve received a quote from Doer ' + this.doer_name + ' on Pin ' + this.totalDataToPrepoluate.pin_details['title'] + '. Wait for more or hire now!',
        'todo_link': 'pinner/active-quotation-details/' + this.totalDataToPrepoluate.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'pin_id': this.totalDataToPrepoluate.pin_details['id'],
        'emailTemplateSlug': 'quotation_submitted_by_doer',
        'doer_title': 'Looking good – your quote was successfully submitted!',
        'doerEmailTemplateSlug': 'quotation_submitted_sent_by_doer',
        'doer_link': 'doer/apply-pins/' + this.totalDataToPrepoluate.pin_details['slug']
      };
      console.log(postData);

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner', postData);
      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 3000);
    }

    this.responseMessageSnackBar('Quotation updated successfully', 'orangeSnackBar');

    this.router.navigate(['/doer/quotation-preview/' + this.slug]);
  }
  /**
   * after view init
   */
  ngAfterViewInit() {
    this.afterInit = true;
    if (localStorage.getItem('show_quotaion_preview')) {
      this.show_quotaion_preview = localStorage.getItem('show_quotaion_preview');
    }
    localStorage.setItem('show_quotaion_preview', 'false');
  }

  /**
   * Toggles child popup
   */
  toggleChildPopup() {
    this.popUpRaiseDispute.togglePopup(this.totalDataToPrepoluate.pin_details);
  }

  /**
   * Backs clicked
   */
  backClicked() {
    this._location.back();
  }

  /**
   * Triggers payment request
   */
  triggerPaymentRequest() {
    localStorage.setItem('request_payment', 'true');

    this.router.navigate(['doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug']]);
  }
  /**
	 * get quotation Details
	 *
	 *
	 *
  */
  getQuotationDetails() {
    this.commonservice.postHttpCall({ url: '/doers/quotation-preview', data: { 'slug': this.slug }, contenttype: 'application/json' }).then(result => this.getQuotationsSuccess(result));
  }

  /**
   * Encodes quotation preview component
   * @param doer_id
   * @returns
   */
  encode(doer_id) {
    return btoa(doer_id);
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

  /**
   * Gets total price
   * @param prc
   * @param hrs
   * @returns
   */
  getTotalPrice(prc, hrs) {
    const totalPrc = parseFloat(prc) * parseFloat(hrs);
    return totalPrc;
  }

  /**
   * Gettotals hrs
   * @returns
   */
  gettotalHrs() {
    const tempArr = this.totalActiveQuotationDetails['quotations'].normal_milestones;
    let totalHrs = 0;
    for (let i = 0; i < tempArr.length; i++) {
      totalHrs = totalHrs + parseInt(tempArr[i].hours);
    }
    return totalHrs;
  }

  /**
   * Declines the job
   * @param pin_id
   * @param application_id
   */
  public declineTheJob(pin_id, application_id) {
    Swal({
      title: 'Are you sure you want to decline the job?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({
          url: '/doers/decline-job', data:
          {
            'pin_id': pin_id,
            'application_id': application_id
          }
          , contenttype: 'application/json'
        }).then(result => this.declineTheJobSuccess(result));
      }
    });
  }

  declineTheJobSuccess(response) {
    if (response.status == 1) {
      //this.onJobDeclineRequestSend.emit(true);

      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['pin_details']['pinner_id'],
        'title': this.doerName + ' has declined your invitation to quote job ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
        //'title':'We’re sorry but your quote request was declined by '+this.doerName+'.',
        'link': 'pinner/active-quotations/' + btoa(this.totalActiveQuotationDetails['pin_details']['id']),
        'pin_id': this.totalActiveQuotationDetails['pin_details']['id'],
        'show_in_todo': 1,
        'todo_title': 'Your Pin quote request has been declined. Np, invite another Doer to quote now.',
        'todo_link': 'pinner/invite-doer/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'quotation_declined_by_doer',
        'doer_title': 'Your message to decline a quote request has been sent.',
        'doerEmailTemplateSlug': 'quotation_declined_sent_by_doer',
        'doer_link': 'doer/my-pins',

        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalDataToPrepoluate.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin'
      };

      const doerPostData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['pin_details']['pinner_id'],
        'title': this.doerName + ' has declined your invitation to quote job ' + this.totalActiveQuotationDetails['pin_details']['title'] + '.',
        //'title':'We’re sorry but your quote request was declined by '+this.doerName+'.',
        'link': 'pinner/active-quotations/' + btoa(this.totalActiveQuotationDetails['pin_details']['id']),
        'pin_id': this.totalActiveQuotationDetails['pin_details']['id'],
        'show_in_todo': 1,
        'todo_title': 'Your Pin quote request has been declined. Np, invite another Doer to quote now.',
        'todo_link': 'pinner/invite-doer/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'quotation_declined_by_doer',
        'doer_title': 'Your message to decline a quote request has been sent.',
        'doerEmailTemplateSlug': 'quotation_declined_sent_by_doer',
        'doer_link': 'doer/my-pins',

        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalDataToPrepoluate.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins'
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer-himself', doerPostData);
      }, 3000);



      //this.getQuotationPageDetails();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');

    } else {
      //this.onJobDeclineRequestSend.emit(false);
    }
    this.router.navigate(['/doer/dashboard']);
  }

  /**
	 * quatation populate
	 *
	 * @response response from api
	 *
  */

  getQuotationsSuccess(response) {

    if (response.status == 1 && response.data) {
      this.pinnerName = response.data.pinner_details.name;
      this.Pinner_ID = response.data.pinner_details.id;
      this.Pin_ID = response.data.pin_details.id;
      this.totalActiveQuotationDetails = response.data;
      this.doerName = response.data.user_details.name;
      // console.log(this.doerName);
      console.log('this.totalActiveQuotationDetails', this.totalActiveQuotationDetails);

      setTimeout(() => {
        this.checkMsg(response.data.pinner_details.id, response.data.pin_details.id);
      }, 500);
      if (this.totalActiveQuotationDetails['pin_details']['dynamicForm'] == '["no data"]') {
        this.dynamic_form_data = null;
      } else {
        this.dynamic_form_data = JSON.parse(this.totalActiveQuotationDetails['pin_details']['dynamicForm']);
      }
      // console.log('this.dynamic_form_data', this.dynamic_form_data);
      /*if(this.totalActiveQuotationDetails['pin_details']['is_blocked']==1){
        this.router.navigate(['/errors']);
      }*/
      if (response.data.quotations != null && response.data.quotations.attachments.length > 0) {
        this.populatedAttachments = response.data.quotations.attachments;
      }

      this.hiredStatus = response.status;
      this.todo_list = response.todo_list;

      this.addressLink = this.totalActiveQuotationDetails['pin_details']['address'];
      if (this.addressLink != null) {
        const address = this.addressLink.replace(/\,/g, '');
        this.addressLink = address.replace(/\ /g, '%20');
        this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
      }


      this.doerAddress = this.totalActiveQuotationDetails['pinner_details']['address'];
      if (this.doerAddress != null) {
        const addressDoer = this.doerAddress.replace(/\,/g, '');
        this.doerAddress = addressDoer.replace(/\ /g, '%20');
        this.doerAddress = `https://maps.google.com/maps?q=${this.doerAddress}`;
      }
      
      this.apiCalls++;
    }
  }


  /*********************************************************************************************************
  *                        Offline payment confirmation accepted by doer                                   *
  **********************************************************************************************************/

  /**
   * Payments confirmation
   * @param linked_id
   */
  paymentConfirmation(linked_id) {
    Swal({
      title: 'Payment Confirmation',
      text: 'By clicking on "Confirm" your are confirming that you received the payment.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Confirm',
      // allowOutsideClick: false,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/doer-confirms-payment-received-via-offline', data: { 'quotation_id': linked_id }, contenttype: 'application/json' }).then(result => this.onPaymentConfirnationSuccess(result));
      } else { }
    });
  }


  /**
   * Determines whether payment confirnation success on
   * @param response
   */
  onPaymentConfirnationSuccess(response) {
    if (response.status == 1) {
      this.pin_details = response.data;
      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.pin_details['pinner_id'],
        'title': this.doerName + ' has received the payment & completed the pin ' + this.pin_details['title'] + '. Please give you feedback for the pin',
        'pin_id': this.pin_details['id'],
        'show_in_todo': 1,
        'todo_title': this.doerName + ' has received the payment & completed the pin ' + this.pin_details['title'] + '. Please give you feedback for the pin',
        'todo_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        // 'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'emailTemplateSlug': 'payment_release_submitted_send_by_pinner',
        'doer_title': ' Your payment request has been sent',
        // 'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',
        'doerEmailTemplateSlug': 'payment_release_submitted_by_pinner',
        'doer_link': 'doer/apply-pins/' + this.pin_details['slug'],
        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalDataToPrepoluate.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin'
      };

      const postDataDoer = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.pin_details['pinner_id'],
        'title': this.doerName + ' has received the payment & completed the pin ' + this.pin_details['title'] + '. Please give you feedback for the pin',
        'pin_id': this.pin_details['id'],
        'show_in_todo': 1,
        'todo_title': this.doerName + ' has received the payment & completed the pin ' + this.pin_details['title'] + '. Please give you feedback for the pin',
        'todo_link': 'doer/quotation-preview/' + this.pin_details['slug'],
        'link': 'doer/quotation-preview/' + this.pin_details['slug'],
        // 'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'emailTemplateSlug': 'payment_release_submitted_send_by_pinner',
        'doer_title': ' Your payment request has been sent',
        // 'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',
        'doerEmailTemplateSlug': 'payment_release_submitted_by_pinner',
        'doer_link': 'doer/apply-pins/' + this.pin_details['slug'],
        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'doer/quotation-preview/' + this.totalDataToPrepoluate.pin_details['slug'],
        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins'
      };

      // console.log(postData);

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner', postData);
      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer-himself', postDataDoer);
      }, 5000);

      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    this.router.navigate(['/doer/dashboard']);
  }

  /*********************************************************************************************************
  *                         Offline payment confirmation rejected by doer                                  *
  **********************************************************************************************************/

  /**
   * Payments rejection
   * @param linked_id
   */
  paymentRejection(linked_id) {
    Swal({
      title: 'You are rejecting the Pinner\'s confirmation that you have been paid. Is that right?',
      // text: 'Are you sure?',
      // type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Reject',
      // allowOutsideClick: false,
      cancelButtonText: 'Go Back'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/doer-rejects-payment-received-via-offline', data: { 'quotation_id': linked_id }, contenttype: 'application/json' }).then(result => this.onPaymentRejectionSuccess(result));
      }
    });
  }

  /**
   * Determines whether payment rejection success on
   * @param response
   */
  onPaymentRejectionSuccess(response) {
    // console.log('this.doerName', this.doerName);
    if (response.status == 1) {
      this.pin_details = response.data;
      // console.log(this.pin_details);

      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.pin_details['pinner_id'],
        'title': 'Doer ' + this.doerName + ' says “he/she” has not received your cash or check payment.',
        // 'title' : this.doerName +' has rejected the payment confirmation for the pin ' + this.pin_details['title'],
        'pin_id': this.pin_details['id'],
        'link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'show_in_todo': 1,
        'todo_title': 'The payment confirmation you sent to Doer ' + this.doerName + ' was rejected.  Please verify your check or cash payment and try again.',
        'todo_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'payment_not_recieved_offline_submitted_send_by_doer_recieved_by_pinner',
        'doer_title': ' Your payment request has been sent',
        'doerEmailTemplateSlug': 'payment_not_recieved_offline_submitted_send_by_doer_recieved_by_doer',
        'doer_link': 'doer/apply-pins/' + this.pin_details['slug'],

        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'doer/quotation-preview/' + this.totalDataToPrepoluate.pin_details['slug'],
        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins'
      };

      const postDataPinner = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.pin_details['pinner_id'],
        'title': 'Doer ' + this.doerName + ' says “he/she” has not received your cash or check payment.',
        // 'title' : this.doerName +' has rejected the payment confirmation for the pin ' + this.pin_details['title'],
        'pin_id': this.pin_details['id'],
        'link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'show_in_todo': 1,
        'todo_title': 'The payment confirmation you sent to Doer ' + this.doerName + ' was rejected.  Please verify your check or cash payment and try again.',
        'todo_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'payment_not_recieved_offline_submitted_send_by_doer_recieved_by_pinner',
        'doer_title': ' Your payment request has been sent',
        'doerEmailTemplateSlug': 'payment_not_recieved_offline_submitted_send_by_doer_recieved_by_doer',
        'doer_link': 'doer/apply-pins/' + this.pin_details['slug'],

        'PIN_UNIQUE_ID': this.totalActiveQuotationDetails['pin_details']['pin_unique_id'],
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.totalDataToPrepoluate.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin'
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner', postDataPinner);
      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 5000);

      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    this.router.navigate(['/doer/dashboard']);
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
          'name': this.ratingValues[initVal - 1],
          'indexVal': initVal - 1
        };
        tempArray.push(tempObj);
      } else {
        const tempObj = {
          'name': this.ratingValues[num],
          'indexVal': num
        };
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }

  /**
   * Sets rating
   * @param indexVal
   */
  setRating(indexVal) {
    this.rating_avg = indexVal + 1;
    this.filledRating = this.convertToarray(this.rating_avg, 'filled');
    this.unfilledRating = this.convertToarray(this.rating_avg, 'empty');
  }

  //############### Go To the Chat Board #####################//

  /**
   * Go to chat
   * @param pinner_id
   * @param pin_id
   */
  goToChat(pinner_id, pin_id) {
    console.log('********', pinner_id, pin_id);

    const pub_pinner_id = pinner_id;
    const pub_pin_id = pin_id;
    const pub_doer_id = atob(localStorage.getItem('frontend_user_id'));

    const postData = {
      'pub_pinner_id': pub_pinner_id,
      'pub_doer_id': pub_doer_id,
      'pub_pin_id': pub_pin_id
    };

    this.myGlobalsQuot.notificationSocket.emit('save-log-last-message-data', postData);
    this.myGlobalsQuot.notificationSocket.on('get-log-last-message-data', (res) => {
      localStorage.setItem('pinner_id_again', btoa(pinner_id));
      localStorage.setItem('pinner_id_another', pinner_id);
      localStorage.setItem('pin_id', btoa(pin_id));
      localStorage.setItem('slug', this.slug);
      this.router.navigate(['/doer/chat']);
    });
  }

  /**
   * Closes pin
   */
  closePin() {
    Swal({
      title: '',
      // text: 'Are you sure you\'re ready to close this job?',
      text: 'Are you sure you want to close this Pin without requesting payment for it?  This action cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result['value']) {
        this.commonservice.postHttpCall({ url: '/doers/close-pin', data: { 'pin_id': this.slug, 'pinner_id': this.Pinner_ID }, contenttype: 'application/json' }).then(result => this.onClosePinSuccess(result));
      }
    });

  }

  /**
   * Determines whether close pin success on
   * @param response
   */
  onClosePinSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.router.navigate(['/doer/dashboard']);
    }
  }


  /**
   * Completes pin
   */
  completePin() {
    Swal({
      title: 'Are you sure you\'re ready to close this job?',
      text: '',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result['value']) {
        this.commonservice.postHttpCall({ url: '/pinners/complete-pin', data: { 'pin_id': this.totalActiveQuotationDetails['pin_id'] }, contenttype: 'application/json' }).then(result => this.oncompletePinSuccess(result));
      }
    });

  }

  /**
   * Oncompletes pin success
   * @param response
   */
  oncompletePinSuccess(response) {
    if (response.status == 1) {
      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalActiveQuotationDetails['doer_id'],
        'title': 'Doer ' + localStorage.getItem('name') + ' has complete the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
        'pin_id': this.totalActiveQuotationDetails['pin_id'],
        'link': 'doer/apply-pins/' + this.totalActiveQuotationDetails['pin_details']['slug'],
        'emailTemplateSlug': 'pin_complete_submitted_by_pinner',
        'user_title': ' you have complete the job and please reviewing & rating for the pin ' + this.totalActiveQuotationDetails['pin_details']['title'],
        'userEmailTemplateSlug': 'pin_complete_submitted_sent_by_pinner',
        'user_link': 'pinner/active-quotation-details/' + this.totalActiveQuotationDetails['pin_details']['slug'] + '/' + btoa(this.totalActiveQuotationDetails['doer_id'])
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 3000);
      this.getQuotationDetails();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    }
  }

  setupSelectedPaymentMethods() {
    let paymentOptions = this.totalDataToPrepoluate.doer_payment_options;
    this.selectedPaymentOptions = [];
    
    if (paymentOptions.accept_payment_by_cards == 1) {
      this.selectedPaymentOptions.push(1);
    }
    if (paymentOptions.accept_payment_by_cheque == 1) {
      this.selectedPaymentOptions.push(2);
    }
    if (paymentOptions.accept_payment_by_cash == 1) {
      this.selectedPaymentOptions.push(3);
    }
    if (paymentOptions.accept_payment_by_bank == 1) {
      this.selectedPaymentOptions.push(4);
    }
  }

  allowDoerToQuote() {
    let quoteDetails = <any> this.totalActiveQuotationDetails;
    
    if (quoteDetails.pin_details.status == 1) {
      if (this.totalDataToPrepoluate.doer_payment_options.stripe_customer_id == null && this.selectedPaymentOptions.length == 0) {
        this.openPreventDialog(1);
      } else if (this.totalDataToPrepoluate.doer_payment_options.stripe_customer_id == null && this.selectedPaymentOptions.length > 0) {
        this.openPreventDialog(2);
      } else if (this.totalDataToPrepoluate.doer_payment_options.stripe_customer_id != null && this.totalDataToPrepoluate.doer_payment_options.stripe_user_id == null && this.selectedPaymentOptions.length == 0) {
        this.openPreventDialog(3);
      } else {
        this.router.navigate(['/doer/apply-pins/' + this.slug]);
      }      
    } else {
      this.router.navigate(['/doer/apply-pins/' + this.slug]);
    }
  }

  openPreventDialog(preventType: number) {
    let tempData: any;
    let widthOfPopup = '950px';
    // widthOfPopup = '545px';

    if (preventType == 1) {
      tempData = {
        'option': 'disable_apply_pin_1',
      };      
    } else if(preventType == 2) {
      tempData = {
        'option': 'disable_apply_pin_2',
      };
    } else if(preventType == 3) {
      tempData = {
        'option': 'disable_apply_pin_3',
      };
    }

    const tempdialogRef = this.dialog.open(QuoteBlockerDialogComponent, {
      width: widthOfPopup,
      disableClose: false,
      data: tempData
    });
  }

  openSiteVisitDialog() {
    const siteVisitDialogRef = this.dialog.open(SiteVisitDialogComponent, {
      width: '545px',
      disableClose: false,
      panelClass: 'comnDialog-panel',
      data: {
        pin_slug: this.totalActiveQuotationDetails['pin_details']['slug'],
      }
    });
  }

  checkRequestPaymentRequest() {
    const isRequested = +localStorage.getItem("request_payment_init");

    if (isRequested) {
      this.requestPayment();
      localStorage.removeItem("request_payment_init");
    }
  }

}
