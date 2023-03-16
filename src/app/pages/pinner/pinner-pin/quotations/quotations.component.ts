import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.scss']
})
export class QuotationsComponent implements OnInit {

  @ViewChild('popUpVar')
  popupref;

  job_ID = '';
  pinDetails = [];
  doerArray = [];
  pinInviteListingDetails = [];
  doerID = '';
  refferredDoers = [];
  fullyLoaded = false;
  uploadUrl: any;
  mainPinId: any;
  is_registered = 1;
  pinTypeSelected = 'Invited';
  addressLink: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    public commonservice: CommonService,
    private _location: Location,
    public renderer: Renderer2,
    public el: ElementRef,
    public myGlobalsQuot: Globalconstant,
    public snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.mainPinId = (params['job_id']);
      console.log(this.mainPinId);
    });
    this.getInvitedQuotations();
    console.log(myGlobalsQuot);
    this.uploadUrl = myGlobalsQuot.uploadUrl;
  }

  ngOnInit() {

  }

  encode(doer_id) {
    return btoa(doer_id);
  }

  ngAfterViewInit() {
    this.fullyLoaded = true;
  }

  getEncryptedData(val) {
    return btoa(val);
  }

  backClicked() {
    this._location.back();
  }

  getTotalReferralNum(reffererID) {
    const tempArr = this.pinInviteListingDetails.filter((eachDoer) => {
      if (eachDoer.referred_by == reffererID) { return eachDoer; }
    });
    return tempArr;
  }

  togglePopup(reffererID) {

    this.refferredDoers = this.pinInviteListingDetails.filter((eachDoer) => {
      if (eachDoer.referred_by == reffererID) { return eachDoer; }
    });
    // console.log(this.refferredDoers);    
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }
  /**
 	* get Invited DoerList
 	* 
 */
  getInvitedQuotations() {
    this.commonservice.postHttpCall({
      url: '/pinners/get-invited-doer-list',
      data: { 'pin_id': this.mainPinId, 'is_registered': this.is_registered },
      contenttype: 'application/json'
    }).then(result => this.getInvitedQuotationsSuccess(result));
  }

  /**
 	* get Invited DoerList Success
 	* @param response = doerlistService response
 */
  getInvitedQuotationsSuccess(response) {
    console.log(response);
    if (response.status == 1) {
      localStorage.setItem('primary_name', response.data.pin_details.parent_child_cat.parent_det.name);
      localStorage.setItem('secondary_name', response.data.pin_details.parent_child_cat.name);
      this.pinDetails = response.data.pin_details;
      this.doerArray = response.data.applications;
      this.addressLink = this.pinDetails['address'];
      if (this.addressLink) {
        const address = this.addressLink.replace(/\,/g, '');
        this.addressLink = address.replace(/\ /g, '%20');
        this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
      }
      this.pinInviteListingDetails = response.data.applications;
      console.log(this.pinDetails);
      this.job_ID = response.data.pin_details.slug;
      if (response.data.applications.length > 0) {
        this.doerID = btoa(response.data.applications['0'].doer_id);
      }
    }
  }

  /**
 	* convert rating to array
 	* @param num = totalRating
 	* @param checkType = filled star/empty star
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
      tempArray.push(initVal);
    }
    return tempArray;
  }

  /**
 	* tab Change event for invite/anonymous
 	* 
 	* @param pinType = type of event invite/anonymous
  */
  pinTabChange(pinType) {
    if (pinType == 'Invited') {
      this.is_registered = 1;
      this.pinTypeSelected = 'Invited';
      this.getInvitedQuotations();
    } else if (pinType == 'Anonymous') {
      this.is_registered = 0;
      this.pinTypeSelected = 'Anonymous';
      this.getInvitedQuotations();
    }
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


  /*Sending registartion link to the anonymous user*/
  sendRegistrationLink(user_id) {
    // console.log('user_id', user_id);
    this.commonservice.postHttpCall({ url: '/pinners/send-registration-link', data: { 'user_id': user_id }, contenttype: 'application/json' }).then(result => this.sendRegistartionLinkSucess(result));
  }

  sendRegistartionLinkSucess(response) {
    console.log(response);
  }

  //Hiring doer who has not submitted the quotation.
  hireDoer(doer_id, application_id) {
    console.log('doer', doer_id);
    console.log('application_id', application_id);
    Swal({
      title: 'Are you sure?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes, hire!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/pinners/hire-doer-without-quotation', data: { 'application_id': application_id, 'doer_id': doer_id }, contenttype: 'application/json' }).then(result => this.onHireSuccess(result));
      }
    });
  }

  onHireSuccess(response) {
    if (response.status == 1) {
      let postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': atob(this.doerID),
        'title': ' has been hired for the pin ' + this.pinDetails['title'] + '. Please submit quotation and accept the job.',
        'pin_id': this.pinDetails['id'],
        'link': 'doer/apply-pins/' + this.job_ID,
        'emailTemplateSlug': '',
        'user_title': ' you have hired the doer for the pin ' + this.pinDetails['title'],
        'userEmailTemplateSlug': 'hire_doer_without_quotation_for_pinner',
        'user_link': 'pinner/active-quotations/' + btoa(this.pinDetails['id'])
      };

      this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

      setTimeout(() => {
        this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postData);
      }, 3000);
      console.log(response);
      this.responseMessageSnackBar(response.msg);
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }

    this.getInvitedQuotations();
  }


  closePin() {
    Swal({
      title: '',
      text: 'Are you sure you\'re ready to close this pin?',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result['value']) {
        this.commonservice.postHttpCall({
          url: '/pinners/close-pin',
          data: { 'pin_id': this.mainPinId, 'doer_list': this.doerArray }, contenttype: 'application/json'
        })
          .then(result => this.oncompletePinSuccess(result));
      }
    });

  }

  oncompletePinSuccess(response) {
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
      //this.getQuotationDetails();
      this.responseMessageSnackBar(response.msg);
      localStorage.setItem('selectedTab', 'Blocked');
      this.backClicked();
    }
  }


  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

}
