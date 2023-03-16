import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CommonService } from '../../commonservice';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pin-listing',
  templateUrl: './pin-listing.component.html',
  styleUrls: ['./pin-listing.component.scss']
})
export class PinListingComponent implements OnInit {

  doerId;
  ongoingPinList = [];
  CompletedPinList = [];
  typeOfPin:any;	
  constructor(private route:ActivatedRoute,private commonService:CommonService) {
  	
  }

  ngOnInit() {
  	this.route.paramMap.subscribe(parameters => {
  		console.log('routepinlisting',parameters);
  		//let tempDoerID  = CryptoJS.AES.decrypt(parameters['params']["id"], 'Secret Key');
  		let reb64 = CryptoJS.enc.Hex.parse(parameters['params']["id"]);
		let bytes = reb64.toString(CryptoJS.enc.Base64);
		let decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
		let plain = decrypt.toString(CryptoJS.enc.Utf8);
      	
	    this.doerId = plain.split('-')[0];
	    this.typeOfPin = plain.split('-')[1];
	    console.log(this.typeOfPin);
	    if(this.typeOfPin == 'Ongoing') {			
			this.populateOngoingPins(); 	
		}
		else if(this.typeOfPin == 'Completed') {
			this.populateCompletedPins();
		}
	});
  	/*this.commonService.listnerGoToPins().subscribe((m:any) => {           
        this.typeOfPin = m.trim();         
        console.log('routepinlisting',this.typeOfPin);  
        
        //this.populateDoer();      
    });*/
  	
	
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

  populateCompletedPins() {
  	this.commonService.postHttpCall({url:'/doer-completed-pins', data:{'doer_id':this.doerId}, contenttype:"application/json"}).then(result=>this.onpopulateCompletedPinsSuccess(result));
  }

  onpopulateCompletedPinsSuccess(response) {
  	if(response.status==1) {
  		this.CompletedPinList = response.data['pin_list'];
  	}
  }

  populateOngoingPins() {
  	this.commonService.postHttpCall({url:'/doer-ongoing-pins', data:{'doer_id':this.doerId}, contenttype:"application/json"}).then(result=>this.onpopulateOngoingPinsSuccess(result));
  }

  onpopulateOngoingPinsSuccess(response) {
  	if(response.status==1) {
  		this.ongoingPinList = response.data['pin_list'];
  	}
  }

}
