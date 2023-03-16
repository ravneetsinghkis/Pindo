import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, Inject, ViewChild, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {Observable} from 'rxjs';
import {Title} from "@angular/platform-browser";
import {map, startWith} from 'rxjs/operators';
import { CommonService } 			from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {Location} from '@angular/common';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-refer-doer',
  templateUrl: './refer-doer.component.html',
  styleUrls: ['./refer-doer.component.scss']
})
export class ReferDoerComponent implements OnInit {

  doerListing = [];
  doerListInfo = [];
  pin_id = '';

  selectedDoer = [];
  doerNameString:any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  duplicates = false;
  emailInput = '';
  notValidDoerEmail = false;
  totalDoerSelected = 0;
  chipval:any = '';

  prevVal = '';

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  baseCompUrl:any;

  constructor(
  				public commonservice:CommonService,
  				public snackBar: MatSnackBar,
  				private router: Router,
  				private route: ActivatedRoute,
          public titleService:Title,
          public globalconstant:Globalconstant,
          private _location:Location,
          private dialog: MatDialog,
          private dialogRef: MatDialogRef<PinnerListDialogComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any
  			)
  {
        this.titleService.setTitle('Refer Doer');

        this.route.params.subscribe(params => {
	      this.pin_id = params['pin_ID'];
	      this.pin_id = btoa(this.pin_id);
        this.baseCompUrl = globalconstant.uploadUrl;
	    });
	    //this.getDoerListing();

      console.log(this.globalconstant.notificationSocket);
  }

  ngOnInit() {
  }


  encode(doer_id){
    return btoa(doer_id);
  }

  backClicked() {
      this._location.back();
  }

  /*
   * open popup
   *
  */
  openPinnerListPopup(doer_id) {
    let popup_width:any = '615px';

    let popupDta= {
      'doerID': doer_id,
    }

    let tempDialogRef = this.dialog.open(PinnerListDialogComponent, {
      width: popup_width,
      disableClose:false,
      data: popupDta
    });

  }

  goToPins(typeOfPin,doerId) {
    if(typeOfPin=='Ongoing'){
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Ongoing`), 'Secret Key').toString();
      let b64 = CryptoJS.AES.encrypt(`${doerId}-Ongoing`, 'Secret Key').toString();
      let e64 = CryptoJS.enc.Base64.parse(b64);
      let eHex = e64.toString(CryptoJS.enc.Hex);
      console.log(eHex);
      this.router.navigate([]).then(result => {  window.open(`/pin-listing/${eHex}`, '_blank'); });
      //this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
    }
    else {
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Completed`), 'Secret Key').toString();
      let b64 = CryptoJS.AES.encrypt(`${doerId}-Completed`, 'Secret Key').toString();
      let e64 = CryptoJS.enc.Base64.parse(b64);
      let eHex = e64.toString(CryptoJS.enc.Hex);
      this.router.navigate([]).then(result => {  window.open(`/pin-listing/${eHex}`, '_blank'); });
    }
  }

  /*
	 * service to hit to populate email ids of doers to invite
	 *
	 *
  */
  getDoerListing(emailString) {
  	this.commonservice.postHttpCall({url:'/doers/doer-list-for-autocomplete',data: {'pin_id':this.pin_id,'email':emailString}, contenttype:"application/json"}).then(result=>this.populateSuccessDoerListing(result));
  }

  /*
	 * after doer email ids are succesfully populated
	 *
	 * @param response = response from service
  */
  populateSuccessDoerListing(response) {
  	console.log(response);
  	this.doerListInfo = response.data;
  	console.log(this.doerListInfo);
  }

  /*
	 * when mat chips value add is triggered
	 *
	 * @param event = event triggered
  */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    console.log(value);

    // Add our fruit
    if ((value || '').trim()) {
    	console.log(value.trim());
    	let checkIfHasEmail = false;
    	for(let initialIndex = 0; initialIndex<this.doerListInfo.length; initialIndex++) {
    		if(this.doerListInfo[initialIndex].toLowerCase()==value.trim().toLowerCase()) {
    			checkIfHasEmail = true;
    		}
    	}

    	let flagVal = this.checkDuplicates(this.selectedDoer,value.trim());

    	if(checkIfHasEmail && !flagVal) {
    		this.selectedDoer.push(value.trim());
    		this.notValidDoerEmail = false;
    	}
    	else {
    		this.duplicates = false;
    		this.notValidDoerEmail = true;
    	}
      //this.selectedDoer.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    //this.fruitCtrl.setValue(null);
  }

  /*
	 * remove selected doer
	 *
	 * @param fruit = email value
  */
  remove(fruit: string): void {
    const index = this.selectedDoer.indexOf(fruit);

    if (index >= 0) {
      this.selectedDoer.splice(index, 1);
      this.removeDoer(index);
    }
  }

  /*
	 * check if duplicate value exits in seleted invite array
	 *
	 * @param tempTaskArr = array to search values from
	 * @param inputVal = single value to compare if it exists
  */
  checkDuplicates(tempTaskArr,inputVal) {
  	let hasValueFlag = false;
  	for(let x=0;x<tempTaskArr.length;x++) {
    	if(tempTaskArr[x]==inputVal) {
    		hasValueFlag = true;
    	}
    }
    return hasValueFlag;
  }

  /*
	 * on select email id from autocomplte email id list
	 *
	 * @param event = event triggered
  */
  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(this.fruitInput);
    let tempTaskArr = [];
    tempTaskArr = this.selectedDoer;

    let flagVal = this.checkDuplicates(tempTaskArr,event.option.viewValue);

    if(!flagVal) {
    	this.selectedDoer.push(event.option.viewValue);
    	this.duplicates = false;
    	this.notValidDoerEmail = false;
    	this.getDoer(event.option.viewValue);
      $('#toremoveVal').val('');
    }
    else{
    	this.notValidDoerEmail = false;
    	this.duplicates = true;
    }

  }

  onChangePopulate(evt) {

    if(this.prevVal==''){
      this.prevVal = evt.target.value;
      this.getDoerListing(evt.target.value);
    }
    else {
      if(this.prevVal == evt.target.value) {}
      else {
        this.prevVal = evt.target.value;
        console.log(evt.target.value);
        this.getDoerListing(evt.target.value);
      }
    }

  }

  /*
	 * service to hit to populate doer
	 *
	 * @param emailVal = email id to invite
  */
  getDoer(emailVal) {
  	this.commonservice.postHttpCall({url:'/doers/get-referred-doer-details', data:{'email':emailVal}, contenttype:"application/json"}).then(result=>this.onSuccessDoerPopulate(result));
  }

  /*
	 * after email list of availbale doers to be populated is succesfully populated
	 *
	 * @param response = response from server
  */
  onSuccessDoerPopulate(response) {

   	if(response.status==1) {
  		this.doerListing.push(response.data);
      this.doerNameString = '';
      for (var i = 0; i < this.doerListing.length; i++) {
         this.doerNameString += this.doerListing[i].name+' , ';
      }

      var lastIndex = this.doerNameString.lastIndexOf(",");
      this.doerNameString = this.doerNameString.substring(0, lastIndex);
      console.log(this.doerNameString);

  		this.totalDoerSelected = this.doerListing.length;
  	}
  }

  /*
	 * remove selected doer from list
	 *
	 * @param indexVal = index to remove value
  */
  removeDoer(indexVal) {
  	this.doerListing.splice(indexVal,1);
  	this.selectedDoer.splice(indexVal, 1);
    this.doerNameString = '';
    for (var i = 0; i < this.doerListing.length; i++) {
       this.doerNameString += this.doerListing[i].name+' , ';
    }
    var lastIndex = this.doerNameString.lastIndexOf(",");
    this.doerNameString = this.doerNameString.substring(0, lastIndex);
    console.log(this.doerNameString);
  }

  /*
	 * service to hit to invite doer
	 *
	 *
  */
  inviteDoer() {
    this.commonservice.postHttpCall({url:'/doers/refer-pin-to-doer', data:{'email':this.selectedDoer,'pin_id':this.pin_id}, contenttype:"application/json"}).then(result=>this.onSuccessDoerInvite(result));
  }


  /*
	 * after doer invited
	 *
	 * @param response = response from service
  */
  onSuccessDoerInvite(response) {
    if(response.status == 1) {
      var postData = {  'sender_id':  atob(localStorage.getItem('frontend_user_id')),
                      'reciver_id': response['pin_dtls']['pinner_id'],
                      'reciver_details': this.doerListing,
                      'show_in_todo':1,
                      'title' : 'Doer '+response.username+' has referred Pin '+response['pin_dtls']['title']+' to you.',
                      'pin_id' : atob(this.pin_id),
                      'link': '/doer/quotation-preview/'+response['pin_dtls']['slug'],
                      'todo_title':'Doer '+response.username+' has referred Pin '+response['pin_dtls']['title']+' to you.  Make sure you send a quote out to the Pinner!',
                      'todo_link':'/doer/quotation-preview/'+response['pin_dtls']['slug'],
                      'emailTemplateSlug':'',
                      'doer_title': 'Your pin has been referred to '+ this.doerNameString +' successfully.',
                      'doerEmailTemplateSlug': 'refer_submitted_sent_by_doer',
                      'doer_link': 'dispute'};

      this.globalconstant.notificationSocket.emit("post-refer-pin-to-doer",postData);

      var postDataPinner = {
                      'sender_id': atob(localStorage.getItem('frontend_user_id')),
                      'reciver_id': response['pin_dtls']['pinner_id'],
                      'title' : 'Doer '+response.username+' has declined to quote Pin '+response['pin_dtls']['title']+' but has referred another Doer.',
                      'pin_id' : response['pin_dtls']['id'],
                      'link': 'pinner/active-quotations/'+btoa(response['pin_dtls']['id']),
                      'emailTemplateSlug':'pin_refer_notification_to_pinner',
                      'doer_title': ' your quote request rejection was sent',
                      'doerEmailTemplateSlug': 'quotation_declined_sent_by_doer',
                      'doer_link': 'doer/my-pins',
                      'PIN_UNIQUE_ID': response['pin_dtls']['pin_unique_id'],
                      'HOME_PAGE_LINK': 'community/community-home',
                      'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
                      'MYPINS_PAGE_LINK': 'pinner/my-pins',
                      'PIN_A_JOB_PAGE': 'PIN A JOB',
                      'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
      };

      console.log('postDataPinner',postDataPinner);

      setTimeout(()=>{
         this.globalconstant.notificationSocket.emit("post-notification-to-doer-himself",postData);
      },2000);

      setTimeout(()=>{
         this.globalconstant.notificationSocket.emit("post-notification-to-pinner",postDataPinner);
      },3000);
  		this.responseMessageSnackBar(response.msg,'orangeSnackBar');

      //setTimeout(()=>{
        this.router.navigate(['/doer/dashboard'])
      //},3000);

  	}
  }

  /*
	 * snackbar message populate
	 * @param res_class = where to show snackbar
	 * @param message = message to show
  */
  public responseMessageSnackBar(message,res_class=''){
    this.snackBar.open(message,'', {
        duration: 4000,
        horizontalPosition:'right',
        panelClass:res_class
    });
  }

  convertToarray(num,checkType) {
    let checkVal;
    if(checkType == 'filled') {
      checkVal = num;
    }
    else {
      checkVal = 5-num;
    }
    let tempArray = [];
    for(let initVal = 1;initVal<=checkVal;initVal++) {
      if(checkType == 'filled') {
        let tempObj = {
          'indexVal': initVal-1
        }
        tempArray.push(tempObj);
      }
      else {
        let tempObj = {
          'indexVal': num
        }
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }

}
