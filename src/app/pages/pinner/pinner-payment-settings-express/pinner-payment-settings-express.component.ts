import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MatSnackBar} from '@angular/material';

import { CommonService } 			from '../../../commonservice';

@Component({
  selector: 'app-pinner-payment-settings-express',
  templateUrl: './pinner-payment-settings-express.component.html',
  styleUrls: ['./pinner-payment-settings-express.component.css']
})
export class PinnerPaymentSettingsExpressComponent implements OnInit { 	
  	code:any;
  	addStripeBanksLinks:any;

  	ifBankCardExist:boolean = false;
  	bankcard_data:any;
  	constructor( private route: ActivatedRoute, public titleService:Title, public commonservice:CommonService, public snackBar: MatSnackBar, private router: Router) { 

  		//this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+window.location.protocol+'//'+window.location.hostname+':4242/pinner/payment-settings-express&client_id=ca_DdTwDF5VYgJaPDJg4rvRH4f5iFUAIk67&scope=read_write&stripe_landing=register';
      this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+window.location.protocol+'//'+window.location.hostname+':4242/pinner/payment-settings-express&client_id=ca_F4XIBJkhf63PuNYlcY05ItPmG72fgV5E&scope=read_write&stripe_landing=register';
      
  	}

  	ngOnInit() {
  		this.code = this.route.snapshot.queryParams['code'] || '';
	  	if(this.code != undefined && this.code != ''){
	      	this.confirm_account();  
	  	} else {
	    	this.getBankCardDetails();
	  	}
  	}

  	confirm_account(){
  		this.commonservice.postHttpCall({url:'/pinners/save-bank-card', data:{stripe_code: this.code}, contenttype:"application/json"}).then(result=>this.saveBankCardsSuccess(result));

  	}

    goToStripe() {
      window.location.href = this.addStripeBanksLinks;
    }

  	saveBankCardsSuccess(response){
      if(response.status==1){
        this.responseMessageSnackBar(response.msg);
      }
      else{
        this.responseMessageSnackBar(response.msg,'error');
      }
      this.getBankCardDetails();
      this.router.navigate(['pinner/payment-settings-express/']);
  	}

	getBankCardDetails(){
		this.commonservice.postHttpCall({url:'/pinners/get-bank-card-details', data:{}, contenttype:"application/json"}).then(result=>this.bankDetailsSuccess(result));
	}

	bankDetailsSuccess(response){
		console.log(response.data);
		if(response.status==1 && response.data != null){
			if(response.data.hasOwnProperty('id')){
		  		this.ifBankCardExist = true;
		  		this.bankcard_data = response.data;
			}
  		} 
	}

	isObjectIsBank(val) { 
		return val == 'bank_account' ? true : false;
	}

  public responseMessageSnackBar(message,res_class:any='',vertical_position:any='bottom'){
      this.snackBar.open(message,'', {
          duration: 6000,
          horizontalPosition:'right',
          verticalPosition:vertical_position,       
          panelClass:res_class
      });
  }

  createStripeLoginLink(){
    console.log('dgf');
    this.commonservice.postHttpCall({url:'/pinners/stripe-login-link', data:{}, contenttype:"application/json"}).then(result=>this.createStripeLoginLinkSuccess(result));

  }
  createStripeLoginLinkSuccess(response){
    if (response.status==1) {

    } else{

    }
  }
  // settingService.getLink = function(req,res,next) {
  //     stripe.accounts.createLoginLink("acct_1DItgCHTwT0TXaDH",function(err,link){
  //         console.log(err); console.log(link);
  //     });
  // }


}
