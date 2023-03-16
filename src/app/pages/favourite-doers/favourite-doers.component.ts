import { Component, OnInit } from '@angular/core';
import { CommonService }      from '../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../global_constant';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
declare var $: any;

@Component({
  selector: 'app-favourite-doers',
  templateUrl: './favourite-doers.component.html',
  styleUrls: ['./favourite-doers.component.scss']
})
export class FavouriteDoersComponent implements OnInit {

  componentapiUrl:any;
  doerListing = [];	
  detectDoerOrPinner:any = null;

  constructor( public commonservice:CommonService,public gbConst:Globalconstant,public snackBar: MatSnackBar,private router:Router ) {
  	this.componentapiUrl = gbConst.uploadUrl;    
    // console.log(this.router['url'])
    const tempUrl = this.router['url'].split('/');    
    if (tempUrl.includes('doer')) {      
      this.detectDoerOrPinner = 'doer';
    } else {
      this.detectDoerOrPinner = 'pinner';
    }
  	this.populateFavDoers();
  }

  ngOnInit() {
  }

  // goToPins(typeOfPin,doerId) {
  //   if(typeOfPin=='Ongoing'){
  //     let b64 = CryptoJS.AES.encrypt(`${doerId}-Ongoing`, 'Secret Key').toString();
  //     let e64 = CryptoJS.enc.Base64.parse(b64);
  //     let eHex = e64.toString(CryptoJS.enc.Hex);
  //     console.log(eHex);
  //     this.router.navigate([]).then(result => {  window.open(`/pin-listing/${eHex}`, '_blank'); });
  //   }
  //   else {
  //     let b64 = CryptoJS.AES.encrypt(`${doerId}-Completed`, 'Secret Key').toString();
  //     let e64 = CryptoJS.enc.Base64.parse(b64);
  //     let eHex = e64.toString(CryptoJS.enc.Hex);
  //     this.router.navigate([]).then(result => {  window.open(`/pin-listing/${eHex}`, '_blank'); });
  //   }
  // }  

  encode(doer_id){
    return btoa(doer_id);
  }

  getAddLink(addressLink) {
    let tempaddress = addressLink;    
    let address = tempaddress.replace(/\,/g, '');
    tempaddress = address.replace(/\ /g, '%20');
    tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
    return tempaddress;
  }
  
  /**
	 * Populate Invite Pins
  */
  populateFavDoers() {
    if(this.detectDoerOrPinner == 'pinner') {
  	 this.commonservice.postHttpCall({url:'/pinners/fauourite-doer-list', contenttype:"application/json"}).then((data) => this.onpopulateFavDoersSuccess(data));
    } else {
      this.commonservice.postHttpCall({url:'/doers/favourite-doer-list', contenttype:"application/json"}).then((data) => this.onpopulateFavDoersSuccess(data));
    }
  }

  /**
 	* Success function for populate fav doers
 	* @param {response} response from service call
 */
  onpopulateFavDoersSuccess(response) {    
  	if(response.status == 1){
  		this.doerListing = response.data;
  		//console.log(this.activePinData);
  	}  	
  }

  /**
  * convert number to array for rating
  * @param {num} = number to convert to array
  * @param {checkType} = type of rating icon (filled/blank)
 */
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

   /**
 * like Doer
 *
 * @param evt = event
 * 
 */
  likeDoer(evt,doerId) {
    //console.log(doerId);
    if(evt.target.classList.contains('liked')){
      evt.target.classList.remove('liked');
    }
    else {
      evt.target.classList.add('liked'); 
    }
    if(this.detectDoerOrPinner == 'pinner') {
      this.commonservice.postHttpCall({url:'/pinners/mark-and-unmark-as-favourite-doer', data:{'doer_id':doerId}, contenttype:"application/json"}).then(result=>this.onlikeDoerSuccess(result));
    } else {
      this.commonservice.postHttpCall({url:'/doers/mark-and-unmark-as-favourite-doer', data:{'doer_id':doerId}, contenttype:"application/json"}).then(result=>this.onlikeDoerSuccess(result));
    }
  	
  }

  onlikeDoerSuccess(response) {
    if(response.status==1) {
      this.responseMessageSnackBar(response.msg);
      this.populateFavDoers();
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

  goToChat(doer_id) {
    localStorage.removeItem('doer_id');
    localStorage.removeItem('pin_id');
    var pin_id = '0';

    localStorage.setItem('doer_id',btoa(doer_id));
    localStorage.setItem('pin_id',btoa(pin_id));
    this.router.navigate(['/pinner/chat']);
  }

}
