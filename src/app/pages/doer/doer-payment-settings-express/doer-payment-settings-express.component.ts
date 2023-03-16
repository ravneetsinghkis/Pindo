import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreditCardValidator } from 'angular-cc-library';
import { CommonService } from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import { AddBankComponent } from './add-bank/add-bank.component';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-doer-payment-settings-express',
  templateUrl: './doer-payment-settings-express.component.html',
  styleUrls: ['./doer-payment-settings-express.component.scss']
})
export class DoerPaymentSettingsExpressComponent implements OnInit {
  @ViewChild('addBank') private addBank: AddBankComponent;
  @ViewChild('popupref') popupref;

  code: any;
  addStripeBanksLinks: any;
  updateStripeBanksLinks: any;

  ifBankCardExist: boolean = false;
  bankcard_data: any;

  bankAccountExists: boolean = false;
  payment_form: FormGroup;
  submitted: boolean = false;

  cardList = [];
  editMode = false;

  cardVal: any;
  editedCardId: any;
  doerAccountType: any = 'individual';
  choosePayByOptn: any = '1';
  default_stripe_account: any;
  userCustomAccountExists: boolean = false;
  userCustomBankAccountList: any = [];
  ifCardExists: boolean = false;
  user_stripe_accounts = [];
  environment: any = environment;

  constructor(private route: ActivatedRoute, public titleService: Title, public commonservice: CommonService, public snackBar: MatSnackBar, private router: Router, private globalconstant: Globalconstant, public renderer: Renderer2, public el: ElementRef, private _fb: FormBuilder) {
    // this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+this.globalconstant.frontend_url+'/doer/payment-settings-express&client_id=ca_AAhA8boB1x100ZQb3yZChrwyO8CDHv5b&scope=read_write&stripe_landing=register';

    //PinDo demo stripe client id
    // this.addStripeBanksLinks = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' + this.globalconstant.frontend_url + '/doer/payment-settings-express&client_id=ca_F4XIBJkhf63PuNYlcY05ItPmG72fgV5E&scope=read_write&stripe_landing=register';

    //PinDo live stripe client id
    // this.addStripeBanksLinks ='https://connect.stripe.com/express/oauth/authorize?redirect_uri='+this.globalconstant.frontend_url+'/doer/payment-settings-express&client_id=ca_F4XIPAExOZWq3IPNXWRzX7W4lCgCEquM&scope=read_write&stripe_landing=register';

     //PinDo common stripe client id
    this.addStripeBanksLinks = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' + this.globalconstant.frontend_url + '/doer/account-settings&client_id=' + this.environment.stripe_client_id + '&scope=read_write&stripe_landing=register';

    
  }

  /**
   * on init
   */
  ngOnInit() {
    this.formInit();
    this.code = this.route.snapshot.queryParams['code'] || '';
    if (this.code != undefined && this.code != '') {
      this.confirm_account();
    } else {
      this.getBankCardDetails();
    }

    this.populateCard();
    this.getBankListing();
    this.getUserStripesAccounts();
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Toggles parent popup
   */
  toggleParentPopup() {
    this.addBank.togglePopup();
  }

  /**
   * Gets user stripes accounts
   */
  getUserStripesAccounts() {
    this.commonservice.postHttpCall({ url: '/doers/get-user-stripe-accounts', data: {}, contenttype: 'application/json' }).then((data) => this.getUserStripesAccountsSuccess(data));
  }

  /**
   * Gets user stripes accounts success
   * @param response 
   */
  getUserStripesAccountsSuccess(response) {
    console.log('getUserStripesAccountsSuccess', response);
    if (response.status == 1) {
      this.user_stripe_accounts = response.data;
      this.default_stripe_account = response.default_account;
    }
  }

  /**
   * Changes default bank account
   * @param account_type 
   */
  changeDefaultBankAccount(account_type) {
    this.default_stripe_account = account_type;
    this.commonservice.postHttpCall({ url: '/doers/change-default-bank-account', data: { 'account_type': account_type }, contenttype: 'application/json' }).then((data) => this.changeDefaultBankAccountSuccess(data));
  }

  /**
   * Changes default bank account success
   * @param response 
   */
  changeDefaultBankAccountSuccess(response) {
    console.log('getUserStripesAccountsSuccess', response);
    this.responseMessageSnackBar(response.msg);
  }
  /********************************************************************************************************
  *                                   Credit card section start                                           *
  ********************************************************************************************************/

  /**
   * Forms init
   */
  formInit() {
    this.payment_form = this._fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [<any>CreditCardValidator.validateExpDate]],
      cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]],
      name: ['', [<any>Validators.required]]
    });
  }


  /**
   * Populates card
   */
  populateCard() {
    this.commonservice.postHttpCall({ url: '/doers/get-cards', data: {}, contenttype: 'application/json' }).then((data) => this.onpopulateCard(data));
  }

  /**
   * Onpopulates card
   * @param response 
   */
  onpopulateCard(response) {
    if (response.status == 1) {
      this.cardList = response.data;
      this.doerAccountType = response.doer_profile_type;
      if (response.admin_commission_charge_by != 0) {
        this.choosePayByOptn = response.admin_commission_charge_by.toString();
      }
      console.log('this.doerAccountType', this.doerAccountType);
      if (this.cardList.length > 0) {
        this.ifCardExists = true;
      }
    }
  }

  /**
   * Chages default payment method
   * @param pay_by_option 
   */
  chageDefaultPaymentMethod(pay_by_option) {
    this.commonservice.postHttpCall({ url: '/doers/change-default-payment-method', data: { 'pay_by_option': pay_by_option }, contenttype: 'application/json' }).then(result => this.onChangeDefaultPaymentMethodSuccess(result));
  }

  /**
   * Determines whether change default payment method success on
   * @param response 
   */
  onChangeDefaultPaymentMethodSuccess(response) {
    if (response.status == 1) {

      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    }
  }


  /**
   * Determines whether submit on
   * @param form 
   */
  onSubmit(form) {
    this.submitted = true;
    if (form.valid) {
      let totalExp = this.payment_form.controls.expirationDate.value;
      let tempMonth = totalExp.split('/')[0].trim();
      let tempYear = totalExp.split('/')[1].trim();
      let tempVal: any;
      let tempcardId: any;
      if (this.editMode) {
        tempVal = '';
        tempcardId = this.editedCardId;
      } else {
        tempVal = this.payment_form.controls.creditCard.value;
        tempcardId = '';
      }
      tempVal = tempVal.split(' ').join('');
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
   * Adds card
   * @param totalObj 
   */
  addCard(totalObj) {
    if (!this.editMode) {
      this.commonservice.postHttpCall({ url: '/doers/add-card-to-stripe', data: totalObj, contenttype: 'application/json' }).then(result => this.onaddCard(result));
    } else {
      this.commonservice.postHttpCall({ url: '/doers/update-card', data: totalObj, contenttype: 'application/json' }).then(result => this.onaddCard(result));
    }
  }

  /**
   * Onadds card
   * @param response 
   */
  onaddCard(response) {
    console.log(this.payment_form);
    if (response.status == 1) {
      this.formInit()
      Object.keys(this.payment_form).forEach((name) => {
        if (this.payment_form.controls[name]) {
          this.payment_form.controls[name].updateValueAndValidity();
        }
      });
      this.editMode = false;
      this.cardVal = '';
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      //this.payment_form.submitted = false;
      this.populateCard();
      this.togglePopup();
    }
  }

  /**
   * Gets twodigit exp month
   * @param indexVal 
   * @returns  
   */
  getTwodigitExpMonth(indexVal) {
    let tempExpMonth: any;
    if (`${this.cardList[indexVal]['expiry_month']}`.split('').length == 1) {
      tempExpMonth = `0${this.cardList[indexVal]['expiry_month']}`;
    } else {
      tempExpMonth = `${this.cardList[indexVal]['expiry_month']}`;
    }
    return tempExpMonth;
  }

  /**
   * Edits card
   * @param indexVal 
   */
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

  /**
   * Removes card
   * @param indexVal 
   */
  removeCard(indexVal) {
    this.commonservice.postHttpCall({ url: '/doers/remove-card', data: { 'card_id': this.cardList[indexVal]['card_id'] }, contenttype: 'application/json' }).then(result => this.onremoveCardSuccess(result));
  }

  /**
   * Onremoves card success
   * @param response 
   */
  onremoveCardSuccess(response) {
    if (response.status == 1) {
      this.populateCard();
      //this.payment_form.submitted = false;
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
  }

  /**
   * Changes primary card
   * @param card_id 
   */
  changePrimaryCard(card_id) {
    console.log(card_id);
    this.commonservice.postHttpCall({ url: '/doers/mark-as-primary-card', data: { 'card_id': card_id }, contenttype: 'application/json' }).then(result => this.changePrimaryCardSuccess(result));
  }

  /**
   * Changes primary card success
   * @param response 
   */
  changePrimaryCardSuccess(response) {
    if (response.status == 1) {
      this.populateCard();
      //this.payment_form.submitted = false;
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    }
  }

  /********************************************************************************************************
  *                                   Credit card section end                                             *
  ********************************************************************************************************/

  /********************************************************************************************************
  *                                CUSTOM BANK ACCOUNT SECTION START                                      *
  ********************************************************************************************************/
  getBankListing() {
    this.commonservice.postHttpCall({ url: '/doers/get-stripe-custom-bank-list', data: {}, contenttype: 'application/json' }).then(result => this.bankListingSuccess(result));
  }

  /**
   * Banks listing success
   * @param response 
   */
  bankListingSuccess(response) {
    console.log('response', response);
    if (response.status == 1) {
      if (response.data.length > 0) {
        this.userCustomBankAccountList = response.data;
        console.log('this.userCustomBankAccountList', this.userCustomBankAccountList);
        this.userCustomAccountExists = true;
      }
    }
    //console.log('this.bankAccountExists',this.bankAccountExists);
  }

  /**
   * Banks add res
   */
  bankAddRes() {
    //console.log('-----------------------------------');
    this.getBankListing();
  }

  /**
   * Changes primary bank account
   * @param user_bank_id 
   */
  changePrimaryBankAccount(user_bank_id) {
    console.log('user_bank_id', user_bank_id);
    this.commonservice.postHttpCall({ url: '/doers/mark-primary-bank-account', data: { 'user_bank_id': user_bank_id }, contenttype: 'application/json' }).then(result => this.changePrimaryBankAccountSuccess(result));
  }

  /**
   * Changes primary bank account success
   * @param response 
   */
  changePrimaryBankAccountSuccess(response) {
    console.log('response', response);
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.getBankListing();
    }
  }

  /**
   * Edits custom bank
   * @param each_custom_account 
   */
  editCustomBank(each_custom_account) {
    console.log('each_custom_account', each_custom_account);
    this.toggleParentPopup();
  }

  /**
   * Removes custom bank
   * @param custom_bank_details 
   */
  removeCustomBank(custom_bank_details) {
    console.log('custom_bank_details', custom_bank_details);
    this.commonservice.postHttpCall({ url: '/doers/remove-custom-bank', data: { 'custom_bank_details': custom_bank_details }, contenttype: 'application/json' }).then(result => this.removeCustomBankSuccess(result));
  }

  /**
   * Removes custom bank success
   * @param response 
   */
  removeCustomBankSuccess(response) {
    this.responseMessageSnackBar(response.msg);
    this.getBankListing();
  }



  /*********************************CUSTOM BANK ACCOUNT SECTION END***************************************/

  /**
   * Go to stripe
   */
  goToStripe() {
    this.doerAccountType = 'individual';
    window.location.href = this.addStripeBanksLinks + '&stripe_user[business_type]=' + this.doerAccountType;
  }

  /**
   * Confirms account
   */
  confirm_account() {
    this.commonservice.postHttpCall({ url: '/doers/save-bank-card', data: { stripe_code: this.code }, contenttype: 'application/json' }).then(result => this.saveBankCardsSuccess(result));
  }

  /**
   * Saves bank cards success
   * @param response 
   */
  saveBankCardsSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      Swal({
        title: '',
        text: 'Thank you for entering your bank account information for payment through Stripe.  To activate this account, please check your email now and click on the link provided.',
        // showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'Ok',
        //cancelButtonText: 'No'
      });
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    this.getBankCardDetails();
    this.createStripeLoginLink();
    // this.router.navigate(['doer/account-settings/']);
  }


  /**
   * Gets bank card details
   */
  getBankCardDetails() {
    this.commonservice.postHttpCall({ url: '/doers/get-bank-card-details', data: {}, contenttype: 'application/json' }).then(result => this.bankDetailsSuccess(result));
  }

  /**
   * Banks details success
   * @param response 
   */
  bankDetailsSuccess(response) {
    if (response.status == 1 && response.data != null) {
      if (response.data.hasOwnProperty('id')) {
        this.bankAccountExists = true;
        this.ifBankCardExist = true;
        this.bankcard_data = response.data;
        this.createStripeLoginLink();
      }
    }
    console.log('this.bankAccountExists', this.bankAccountExists);
  }

  /**
   * Determines whether object is bank is
   * @param val 
   * @returns  
   */
  isObjectIsBank(val) {
    return val == 'bank_account' ? true : false;
  }

  /**
   * Creates stripe login link
   */
  createStripeLoginLink() {
    this.commonservice.postHttpCall({ url: '/doers/stripe-login-link', data: {}, contenttype: 'application/json' }).then(result => this.createStripeLoginLinkSuccess(result));
  }

  /**
   * Creates stripe login link success
   * @param response 
   */
  createStripeLoginLinkSuccess(response) {
    if (response.status == 1) {
      this.updateStripeBanksLinks = response.data.url;
    } else {
      this.updateStripeBanksLinks = '#';
    }
  }

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   * @param [vertical_position] 
   */
  public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 6000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }


}
