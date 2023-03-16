import { Component, OnInit, AfterViewInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } 			from '../../../commonservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreditCardValidator } from 'angular-cc-library';
import { MatSnackBar } from '@angular/material';
import { Globalconstant }      from '../../../global_constant';
import { AddBankComponent } from './add-bank/add-bank.component';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { VerifyBankComponent } from './verify-bank/verify-bank.component'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pinner-payment-settings',
  templateUrl: './pinner-payment-settings.component.html',
  styleUrls: ['./pinner-payment-settings.component.scss']
})
export class PinnerPaymentSettingsComponent implements OnInit {
  @ViewChild('addBank') private addBank: AddBankComponent;
  @ViewChild('popupref')
  popupref;

  ifCardsExist:boolean = true;
  addStripeBanksLinks:any;
  updateStripeBanksLinks:any;
  addBankshow: boolean = false;
  payment_form: FormGroup;
  submitted: boolean = false;
  ifBankCardExist: boolean = false;
  bankcard_data:any = [];

  cardList = [];
  editMode = false;
  code:any;

  cardVal:any;
  editedCardId:any;
  choosePayByOptn = '1';

  constructor( private route: ActivatedRoute, public titleService:Title,public commonservice:CommonService,public renderer: Renderer2, public el: ElementRef,private _fb: FormBuilder,public snackBar: MatSnackBar, private globalconstant: Globalconstant, private router: Router, public dialog: MatDialog ) {
  	this.titleService.setTitle('Payment Settings');
    //this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+this.globalconstant.frontend_url+'/pinner/payment-settings&client_id=ca_AAhA8boB1x100ZQb3yZChrwyO8CDHv5b&scope=read_write&stripe_landing=register';

    //PinDo demo stripe client id
    this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+this.globalconstant.frontend_url+'/pinner/payment-settings&client_id=ca_F4XIBJkhf63PuNYlcY05ItPmG72fgV5E&scope=read_write&stripe_landing=register';

    //PinDo live stripe client id
    //this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+this.globalconstant.frontend_url+'/pinner/payment-settings&client_id=ca_F4XIPAExOZWq3IPNXWRzX7W4lCgCEquM&scope=read_write&stripe_landing=register';

    this.populateCard();
  }

  ngOnInit() {
    this.formInit();
    this.code = this.route.snapshot.queryParams['code'] || '';
    if(this.code != undefined && this.code != ''){
        this.confirm_account();
    } else {
      this.getBankCardDetails();
    }

    this.getPinnerBankDetails();
  }

  ngAfterViewInit(){

  }

  /*
   * open popup
   *
  */
  openDialog(popupType='bank-added-successfully',addintional_info=null,innIndex=null,OutIndex=null) {
    let popup_width:any = '615px';

    let popupDta= {
      'popType': popupType,
      'bank_details':addintional_info
    }

    let tempDialogRef = this.dialog.open(VerifyBankComponent, {
      width: popup_width,
      disableClose:false,
      data: popupDta
    });

    tempDialogRef.componentInstance.onVerifyingBankAccount.subscribe((evt) => {
        this.getPinnerBankDetails();
    });
  }

  formInit() {
    this.payment_form = this._fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [<any>CreditCardValidator.validateExpDate]],
      cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
      name: ['',[<any>Validators.required]]
    });
  }

  bankAddRes(){
    //console.log('-----------------------------------');
    this.openDialog('bank-added-successfully');
    this.getPinnerBankDetails();
    /*Swal({
        title: "",
        text: "Bank account has been added successfully. Now, you need to verify the bank account for doing the transaction.",
        type: 'info',
        confirmButtonColor: '#bad141',
        cancelButtonColor: "#bad141",
        confirmButtonText: 'Ok',
        })*/
  }


  /*****************************************************************************
  *                       VERIFY PINNER BANK DETAILS                           *
  ******************************************************************************/
  verifyBankAccount(bank_dtls){
    this.openDialog('verify-bank-account',bank_dtls);
    /*console.log('bank_dtls',bank_dtls);
    this.commonservice.postHttpCall({url:'/pinners/verify-bank-account', data:{'id':bank_dtls.id}, contenttype:"application/json"}).then((data) => this.verifyBankDetailSuccess(data));*/
  }

  /*verifyBankDetailSuccess(response) {
    console.log('pinner bank details',response);
    if(response.status==1) {
      //this.cardList = response.data;
      this.getPinnerBankDetails();
      this.responseMessageSnackBar(response.msg);
    }
    else{
      this.responseMessageSnackBar(response.msg,'error');
    }
  }*/

  /*****************************************************************************
  *                       FETCH PINNER BANK DETAILS                            *
  ******************************************************************************/

  getPinnerBankDetails(){
    this.commonservice.postHttpCall({url:'/pinners/get-bank-details', data:{}, contenttype:"application/json"}).then((data) => this.getBankDetailsSuccess(data));
  }

  getBankDetailsSuccess(response) {
    console.log('pinner bank details',response);
    if(response.status==1) {
      if(response.data){
        this.bankcard_data = response.data;
        if(response.data.length>0){
          this.ifBankCardExist = true;
        }
      }
      //this.cardList = response.data;
    }
  }

  changePrimaryBank(bank_id){
    console.log(bank_id);
    this.commonservice.postHttpCall({url:'/pinners/change-primary-bank', data:{'bank_id':bank_id}, contenttype:"application/json"}).then((data) => this.changePrimaryBankSuccess(data));
  }

  changePrimaryBankSuccess(response){
    if(response.status==1) {
      //this.cardList = response.data;
      this.getPinnerBankDetails();
      this.responseMessageSnackBar(response.msg);
    }
    else{
      this.responseMessageSnackBar(response.msg,'error');
    }
  }

  removeCustomBank(custom_bank_details){
    console.log('custom_bank_details',custom_bank_details);
    this.commonservice.postHttpCall({url:'/pinners/remove-customer-bank', data:{'custom_bank_details': custom_bank_details}, contenttype:"application/json"}).then(result=>this.removeCustomBankSuccess(result));
  }

  removeCustomBankSuccess(response){
    this.responseMessageSnackBar(response.msg);
    this.getPinnerBankDetails();
  }

  /*****************************************************************************
  *                       FETCH PINNER CARD DETAILS                            *
  ******************************************************************************/
  populateCard() {
    this.commonservice.postHttpCall({url:'/pinners/get-cards', data:{}, contenttype:"application/json"}).then((data) => this.onpopulateCard(data));
  }

  onpopulateCard(response) {
    if(response.status==1) {
      this.cardList = response.data;
    }
  }

  /*****************************************************************************
  *                       ADD PINNER CARD TO STRIPE                            *
  ******************************************************************************/
  addCard(totalObj) {
    if(!this.editMode) {
      this.commonservice.postHttpCall({url:'/pinners/add-card-to-stripe', data:totalObj, contenttype:"application/json"}).then(result=>this.onaddCard(result));
    }
    else {
      this.commonservice.postHttpCall({url:'/pinners/update-card', data:totalObj, contenttype:"application/json"}).then(result=>this.onaddCard(result));
    }
  }

  onaddCard(response) {
    console.log(this.payment_form);
    if(response.status==1) {
      this.formInit()
      Object.keys(this.payment_form).forEach((name)=> {
         if (this.payment_form.controls[name]) {
          this.payment_form.controls[name].updateValueAndValidity();
         }
      });
      this.editMode = false;
      this.cardVal = '';
      this.responseMessageSnackBar(response.msg);
      //this.payment_form.submitted = false;
      this.populateCard();
      this.togglePopup();
    }
    else{
      this.responseMessageSnackBar(response.msg,'error');
    }
  }

  onSubmit(form) {
    this.submitted = true;
    if(form.valid) {
      let totalExp = this.payment_form.controls.expirationDate.value;
      let tempMonth = totalExp.split('/')[0].trim();
      let tempYear = totalExp.split('/')[1].trim();
      let tempVal:any;
      let tempcardId:any;
      if(this.editMode) {
        tempVal = '';
        tempcardId = this.editedCardId;
      }
      else {
        tempVal = this.payment_form.controls.creditCard.value;
        tempcardId = '';
      }
      tempVal = tempVal.split(' ').join("");
      let tempObj = {
        'number': tempVal,
        'card_id': tempcardId,
        'cvc': parseInt(this.payment_form.controls.cvc.value),
        'exp_month': parseInt(tempMonth),
        'exp_year': parseInt(tempYear),
        'name': this.payment_form.controls.name.value
      }
      this.addCard(tempObj);
    }
  }

  /**
	 * toggle Popup
	 *
	 * this toggle the popup to add card
	 *
  */
  togglePopup() {
  	if(this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement,'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
      this.editMode = false;
  	}
  	else{
  		this.renderer.addClass(this.popupref.nativeElement,'opened');
  		this.renderer.addClass(document.body, 'popup-open');
  	}
    //console.log(this.payment_form);

    //this.updateValueAndValidity();
  }

  toggleParentPopup() {
      this.addBank.togglePopup();
    }

  getTwodigitExpMonth(indexVal) {
    let tempExpMonth:any;
    if(`${this.cardList[indexVal]['expiry_month']}`.split('').length == 1) {
      tempExpMonth = `0${this.cardList[indexVal]['expiry_month']}`;
    }
    else {
      tempExpMonth = `${this.cardList[indexVal]['expiry_month']}`;
    }
    return tempExpMonth;
  }

  editCard(indexVal) {
    console.log(this.cardList[indexVal]);
    let exp_month = this.getTwodigitExpMonth(indexVal);
    let _tempExpDate = `${exp_month}/${this.cardList[indexVal]['expiry_year']}`
    this.payment_form.controls['expirationDate'].patchValue(_tempExpDate);
    this.payment_form.controls['name'].patchValue(`${this.cardList[indexVal]['display_name']}`);
    this.editMode = true;
    this.payment_form.removeControl('creditCard');
    this.cardVal = `${this.cardList[indexVal]['card_number']}`;
    this.editedCardId = `${this.cardList[indexVal]['card_id']}`
    this.togglePopup();
  }

  removeCard(indexVal){
    this.commonservice.postHttpCall({url:'/pinners/remove-card', data:{'card_id':this.cardList[indexVal]['card_id']}, contenttype:"application/json"}).then(result=>this.onremoveCardSuccess(result));
  }

  onremoveCardSuccess(response) {
    if(response.status==1) {
      this.populateCard();
      //this.payment_form.submitted = false;
      this.responseMessageSnackBar(response.msg);
    }
  }

  changePrimaryCard(card_id){
    console.log(card_id);
    this.commonservice.postHttpCall({url:'/pinners/mark-as-primary-card', data:{'card_id':card_id}, contenttype:"application/json"}).then(result=>this.changePrimaryCardSuccess(result));
  }

  changePrimaryCardSuccess(response) {
    if(response.status==1) {
      this.populateCard();
      //this.payment_form.submitted = false;
      this.responseMessageSnackBar(response.msg);
    }
  }

    confirm_account(){
      this.commonservice.postHttpCall({url:'/pinners/save-bank-card', data:{stripe_code: this.code}, contenttype:"application/json"}).then(result=>this.saveBankCardsSuccess(result));
    }

    saveBankCardsSuccess(response){
      if(response.status==1){
        this.responseMessageSnackBar(response.msg);
        this.createStripeLoginLink();
      }
      else{
        this.responseMessageSnackBar(response.msg,'error');
      }
      this.getBankCardDetails();
      this.router.navigate(['pinner/payment-settings/']);
    }

    getBankCardDetails(){
      this.commonservice.postHttpCall({url:'/pinners/get-bank-card-details', data:{}, contenttype:"application/json"}).then(result=>this.bankDetailsSuccess(result));
    }

    bankDetailsSuccess(response){
      if(response.status==1 && response.data != null){
        if(response.data.hasOwnProperty('id')){
            this.ifBankCardExist = true;
            //this.bankcard_data = response.data;
            this.createStripeLoginLink();
        }
      }
    }

    isObjectIsBank(val) {
      return val == 'bank_account' ? true : false;
    }

    createStripeLoginLink(){
      this.commonservice.postHttpCall({url:'/pinners/stripe-login-link', data:{}, contenttype:"application/json"}).then(result=>this.createStripeLoginLinkSuccess(result));

    }
    createStripeLoginLinkSuccess(response){
      if (response.status==1) {
        this.updateStripeBanksLinks = response.data.url;
      } else{
        this.updateStripeBanksLinks = '#';
      }
    }

    public responseMessageSnackBar(message,res_class:any='',vertical_position:any='bottom'){
        this.snackBar.open(message,'', {
            duration: 6000,
            horizontalPosition:'right',
            verticalPosition:vertical_position,
            panelClass:res_class
        });
    }

}
