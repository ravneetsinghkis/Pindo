import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Globalconstant } from 'src/app/global_constant';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  @ViewChild('formDirective') myNgForm;
  @Output() refreshCardList = new EventEmitter;
  @Input() sibling: any;
  @ViewChild('bankForm') bankForm : NgForm;
  @Output() bankAdded = new EventEmitter();
  @Output() openBankFormPopupEvent = new EventEmitter();

  showPaymentMethodType: string = 'credit_card';
  current_year = new Date().getFullYear();
  formCredit: FormGroup;
  monthList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  cardType: string = '';
  cardNumber: any = '';
  cardMaskFormate: any = '';
  doerAccountType = 'individual';
  yearList: any = [];
  isAddOrEdit: any;
  cardDetails: any;
  addStripeBanksLinks: any;
  code: any;
  siblingMsg: any;
  bankAccountExists: boolean = false;
  updateStripeBanksLinks: any;
  isCheckedPrimary: boolean = false;
  isCheckedPindo: boolean = false;
  checked_primary_credit: boolean = false;
  is_Primary: boolean = false;
  bank_exists: boolean = false;
  bank: any;
  payment_msg = 'Payment information has been successfully added.';
  payment_method_title: string = "ADD Payment Method";
  hideBank: boolean = false;
  defaultCheckboxLabel = "Select this method to pay PinDo for Pin related fees and advertising";

  backupDetials = {
    brand: '',
    created_at: '',
    customer_id: '',
    exp_date: '',
    expiry_month: '',
    fingerprint: '',
    id: 0,
    is_primary: 0,
    is_verified: 0,
    last4: '',
    name: '',
    object: '',
    object_id: '',
    updated_at: '',
    user_id: 0,
  };

  card_pattern: string = '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$';
  cvv_pattern: string = '^[0-9]{3,4}$';
  success: boolean = false;

  stripeAutoFields: any;

  stripeAccountConnected: boolean = false;
  for_pindo_payment: boolean = false;
  admin_commission_charge_by: number = 0;
  creditCardCount: number = 0;

  // Add Bank
  backAccountDetailsAddOrUpdateForm: FormGroup;
  isformSubmitted: boolean = false;
  types: any = [
		{ value: 'individual', viewValue: 'Individual' },
		{ value: 'company', viewValue: 'Company' }
	];

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, private fb: FormBuilder, private globalconstant: Globalconstant, private route: ActivatedRoute, private router: Router) {

    // this.addStripeBanksLinks = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' + this.globalconstant.frontend_url + '/doer/account-settings&client_id=' + environment.stripe_client_id + '&scope=read_write&stripe_landing=register';

    this.addStripeBanksLinks = 'https://connect.stripe.com/oauth/authorize?redirect_uri=' + window.location.href + '&client_id=' + environment.stripe_client_id + '&scope=read_write&stripe_landing=register&response_type=code'; // Stripe Standard Account

    // this.addStripeBanksLinks = 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' + window.location.href + '&client_id=' + environment.stripe_client_id + '&scope=read_write&stripe_landing=register'; // using for local

    // this.addStripeBanksLinks = 'https://connect.stripe.com/express/oauth/authorize?&client_id=' + environment.stripe_client_id + '&scope=read_write&stripe_landing=register';

    // this.addStripeBanksLinks = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id='  + environment.stripe_client_id + '&scope=read_write';

    for (let i = 0; i < 30; i++) {
      this.yearList.push(this.current_year);
      this.current_year++;
    }

    this.formCredit = this.fb.group({
      card_name: ['', Validators.required],
      card_number: ['', [Validators.required, Validators.pattern(this.card_pattern)]],
      card_month: ['', Validators.required],
      card_year: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(this.cvv_pattern)]],
    });
  }

  ngOnInit() {
    let deniedStripe = this.route.snapshot.queryParams['error'] || '';

    if (deniedStripe) {
      window.location.href = window.location.origin + window.location.pathname;
    }

    this.code = this.route.snapshot.queryParams['code'] || '';

    if (this.code != undefined && this.code != '') {
      this.confirm_account();
    } else {
      this.getBankCardDetails();
    }

    this.getStripeAutofillFields();
    this.generateBankForm();
  }

  populateCardDetails() {
    if (this.cardDetails.is_primary == 1) {
      this.is_Primary = true;
    } else {
      this.is_Primary = false;
    }

    this.backupDetials.name = this.cardDetails.name;
    this.backupDetials.expiry_month = this.cardDetails.expiry_month;
    this.backupDetials.exp_date = this.cardDetails.exp_date;

    this.for_pindo_payment = this.cardDetails.is_primary == 1 ? true : false;
    this.isCheckedPindo = !!this.cardDetails.default_bank;

    if (this.cardDetails.object == "bank_account") {
      this.bank = this.cardDetails;
    }

    this.formCredit.patchValue({
      card_name: this.cardDetails.name,
      card_month: parseInt(this.cardDetails.expiry_month, 10),
      card_year: parseInt(this.cardDetails.exp_date, 10)
    });
  }

  togglePopup(msg = '') {
    // console.log('CLIENT ID', environment.stripe_client_id);

    this.success = false;
    this.isCheckedPindo = false;
    this.checked_primary_credit = false;

    if (this.isAddOrEdit == 'add') {
      this.showPaymentMethodType = 'credit_card';
    }
    if (msg) {
      this.showPaymentMethodType = msg;
    }

    // from pinner apply pin page
    if (localStorage.getItem("open_payment_popup") == "1") {
      this.togglePrimary();
      localStorage.removeItem("open_payment_popup");
    }

    // if (this.bank_exists == false && this.isAddOrEdit == 'add') {
    //   this.siblingMsg = 'bank_account';
    //   this.showPaymentMethodType = 'bank_account';
    // }

    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.siblingMsg = '';
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      if (this.showPaymentMethodType == 'credit_card') {
        if (this.myNgForm) {
          this.myNgForm.resetForm();
        }
        // this.checked_primary_credit = false;
      }
      if (this.isAddOrEdit == 'edit') {
        this.populateCardDetails();
      }
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  paymentMethodTypeFnc(type) {
    if (type == "bank_account") {
      this.closeModal();
      this.openBankFormPopupEvent.emit();
    } else {
      this.showPaymentMethodType = type;
    }
  }

  getCardType() {
    if (this.cardNumber != null && this.cardNumber != '') {
      this.cardType = '';
      this.cardMaskFormate = '0000-0000-0000-0000';
      // visa
      let re = new RegExp('^4');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'visa';
      }
      // return "Visa";

      // Mastercard
      // Updated for Mastercard 2017 BINs expansion
      if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(this.cardNumber)) {
        this.cardType = 'mastercard';
      }
      // return "Mastercard";

      // AMEX
      re = new RegExp('^3[47]');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'american express';
        this.cardMaskFormate = '0000-000000-00000';
      }

      // return "AMEX";

      // Discover
      re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'discover';
      }
      // return "Discover";

      // Diners
      re = new RegExp('^36');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'diners';
      }
      // return "Diners";

      // Diners - Carte Blanche
      re = new RegExp('^30[0-5]');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'diners';
      }
      // return "Diners - Carte Blanche";

      // JCB
      re = new RegExp('^35(2[89]|[3-8][0-9])');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'jcb';
      }
      // return "JCB";

      // Visa Electron
      re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
      if (this.cardNumber.match(re) != null) {
        this.cardType = 'visa';
      }
      // return "Visa Electron";
    } else {
      this.cardType = '';
    }
  }

  goToStripe() {
    // if (this.bankAccountExists == true) {
    //   this.responseMessageSnackBar('You already have a connected bank account!', 'error');
    //   return;
    // }
    // console.log(atob(localStorage.getItem('doer_profile_type')));

    let url = new URL(this.addStripeBanksLinks);

    if (atob(localStorage.getItem('doer_profile_type')) == '2') {
      this.doerAccountType = 'company';
    } else {
      this.doerAccountType = 'individual';
    }

    for (const property in this.stripeAutoFields) {
      url.searchParams.set(property, this.stripeAutoFields[property] || "");
    }

    // window.location.href = this.addStripeBanksLinks + '&stripe_user[business_type]=' + this.doerAccountType;
    window.location.href = url.href;
  }

  goToLink() {
    // this.router.navigateByUrl(this.updateStripeBanksLinks);
    window.open(
      this.updateStripeBanksLinks, '_blank'
    );
  }

  confirm_account() {
    this.commonservice.postHttpCall({ url: '/doers/save-bank-card', data: { stripe_code: this.code }, contenttype: 'application/json' }).then(result => this.saveBankCardsSuccess(result));
  }

  /**
   * Saves bank cards success
   * @param response
   */
  saveBankCardsSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(this.payment_msg, 'orangeSnackBar');
      Swal({
        title: '',
        text: 'Thank you for entering your bank account information for payment through Stripe. To activate this account, please check your email now and click on the link provided.',
        // showCancelButton: true,
        confirmButtonColor: '#E6854A',
        confirmButtonText: 'Ok',
        //cancelButtonText: 'No'
      }).then(() => {
        // DISABLED TO CHECK STANDARD ACCOUNT
        // this.router.navigate(['/doer/account-settings/']).then(() => {
        //   this.refreshCardList.emit('refresh');
        //   this.sibling.populateListing();
        // });

        // ENABLED FOR STANDARD ACCOUNT
        // this.router.navigate(['/doer/payment-settings/']);
        window.location.href = window.location.origin + window.location.pathname;
      });


      // Swal({
      //   title: '',
      //   text: '',
      //   html: '<p> Your bank account must be verified before it can be used. This is a banking requirement and will take a day or two but only has to be done once so please bear with us. </p> <p>Steps to bank account verification:</p> <ol> <li>Two deposits under $1 will be deposited into your bank account. In a day or two the deposits will hit your account and will be labeled from PinDo Inc.</li> <li>As soon as they do, go to your PinDo account and click "verify" next to your bank account in Payment Information. </li> <li>When prompted, enter the two deposit amounts in the fields provided (enter $0.71 as 71)</li> <li>The two deposits will automatically be removed from your account after you have verified.</li> </ol> <h5>You will then be able to collect payments from Pinners by either Bank / ACH or Credit Card.</h5> <h6>*If verification fails after a couple of attempts, please contact us at <a href="/support" target="_blank" style="color:#E6854A">PinDoit.com/Support</a>. Please note: 10 failed attempts or more will lock your bank account out of PinDo so contact us before that happens!</h6>',
      //   confirmButtonColor: '#E6854A',
      //   confirmButtonText: 'Ok',
      // }).then(() => {
      //   window.location.href = window.location.origin + window.location.pathname;
      // });

    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    this.getBankCardDetails(); // DISABLED TO CHECK STANDARD ACCOUNT
    this.createStripeLoginLink(); // DISABLED TO CHECK STANDARD ACCOUNT
    // this.router.navigate(['/doer/account-settings/']);
  }

  getBankCardDetails() {
    this.commonservice.postHttpCall({ url: '/doers/get-bank-card-details', data: {}, contenttype: 'application/json' }).then(result => this.bankDetailsSuccess(result));
  }

  bankDetailsSuccess(response) {
    if (response.status == 1 && response.data) {
      this.bank = response.data;
      if (response.data.hasOwnProperty('id')) {
        this.bankAccountExists = true;
        this.isCheckedPrimary = response.data.is_primary as boolean;
        this.createStripeLoginLink(); // DISABLED TO CHECK STANDARD ACCOUNT
        console.log('IS CHECKED', this.isCheckedPrimary);
        this.bankAccountExists = true;
      }
    } else {
      this.bank = null;
      this.bankAccountExists = false;
    }
  }

  deletePrimary(e) {
    this.commonservice
      .postHttpCall({
        url: '/doers/remove-bank',
        data: {
          account_holder_name: this.bank.name,
          account_type: 'bank_account',
          bank_id: this.bank.object_id,
          is_primary: this.isCheckedPindo
        },
        contenttype: 'application/json'
      });
  }

  makePrimary(e) {
    console.log(e);
    console.log('BANK', this.bank);

    if (this.bank) {
      this.commonservice
        .postHttpCall({
          url: '/doers/update-bank',
          data: {
            account_holder_name: this.bank.name,
            account_type       : 'bank_account',
            bank_id            : this.bank.object_id,
            is_primary         : this.isCheckedPindo,
            for_pindo_payment  : this.for_pindo_payment,
          },
          contenttype: 'application/json'
        }).then(res => {
          if (res.status == 1) {
            this.snackBar.open(res.msg, '', {
              duration: 4000,
              horizontalPosition: 'right',
              panelClass: 'orangeSnackBar'
            });
            this.refreshCardList.emit('refresh');
            this.getBankCardDetails();
            this.togglePopup();
          } else {
            this.snackBar.open(res.msg, '', {
              duration: 4000,
              horizontalPosition: 'right',
              panelClass: 'error'
            });
          }
        });
    } else {
      this.snackBar.open('Please add a bank first!', '', {
        duration: 4000,
        horizontalPosition: 'right',
        panelClass: 'error'
      });
    }
  }

  closeModal() {
    if (this.isAddOrEdit == 'edit') {
      if (this.siblingMsg != 'bank_account') {
        if (this.checkValueUpdateORNot()) {
          Swal({
            title: 'Do you want to save your activity?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E6854A',
            confirmButtonText: 'SAVE',
            cancelButtonText: 'CANCEL',
          }).then((resultswal) => {
            if (resultswal.value) {
              this.submitCard();
            } else {
              this.togglePopup();
            }
          });
        } else {
          this.togglePopup();
        }
      } else {
        this.togglePopup();
      }
    } else {
      this.togglePopup();
    }
    // else {
    //   const name = this.formCredit.get('card_name').value;
    //   const number = this.formCredit.get('card_number').value;
    //   const month = this.formCredit.get('card_month').value;
    //   const year = this.formCredit.get('card_year').value;
    //   const cvv = this.formCredit.get('cvv').value;

    //   if (name || month || year || number || cvv) {
    //     Swal({
    //       title: 'Do you want to save your activity?',
    //       text: '',
    //       type: 'warning',
    //       showCancelButton: true,
    //       confirmButtonColor: '#E6854A',
    //       confirmButtonText: 'SAVE',
    //       cancelButtonText: 'CANCEL',
    //     }).then((resultswal) => {
    //       if (resultswal.value) {
    //         this.submitCard();
    //         if (this.success == false) {
    //           this.responseMessageSnackBar('Please fill the the form properly to save it!', 'error');
    //         }
    //       } else {
    //         this.togglePopup();
    //       }
    //     });
    //   } else {
    //     this.togglePopup();
    //   }
    // }

    this.for_pindo_payment = false;
    this.isCheckedPindo = false;
  }

  checkValueUpdateORNot() {
    const name = this.formCredit.get('card_name').value;
    const month = this.formCredit.get('card_month').value;
    const year = this.formCredit.get('card_year').value;

    if (this.backupDetials.name != name || this.backupDetials.expiry_month != month || this.backupDetials.exp_date != year || this.checked_primary_credit) {
      return true;
    } else {
      return false;
    }
  }

  createStripeLoginLink() {
    this.commonservice.postHttpCall({ url: '/doers/stripe-login-link', data: {}, contenttype: 'application/json' }).then(result => this.createStripeLoginLinkSuccess(result));
  }

  createStripeLoginLinkSuccess(response) {
    if (response.status == 1) {
      this.updateStripeBanksLinks = response.data.url;
      this.refreshCardList.emit(this.updateStripeBanksLinks);

      if (response.stripe_user_id) {
        this.stripeAccountConnected = true;
      }
    } else {
      this.updateStripeBanksLinks = '#';
    }
  }

  public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

  togglePrimary() {
    this.checked_primary_credit = !this.checked_primary_credit;
  }

  submitCard() {
    if (this.isAddOrEdit == 'add') {
      if (this.formCredit.invalid) {
        return;
      }
      this.success = true;

      const name = this.formCredit.get('card_name').value;
      const number = this.formCredit.get('card_number').value;
      const month = this.formCredit.get('card_month').value;
      const year = this.formCredit.get('card_year').value;
      const cvv = this.formCredit.get('cvv').value;

      const fd = new FormData();
      fd.append('name', name);
      fd.append('number', this.commonservice.base64_encode(number));
      fd.append('exp_month', this.commonservice.base64_encode(month));
      fd.append('exp_year', this.commonservice.base64_encode(year));
      fd.append('cvc', this.commonservice.base64_encode(cvv));

      // fd.append('name', name);
      // fd.append('number', number);
      // fd.append('exp_month', month);
      // fd.append('exp_year', year);
      // fd.append('cvc', cvv);
      if (this.checked_primary_credit == true || this.creditCardCount == 0) {
        fd.append('is_primary', '1');
      } else {
        fd.append('is_primary', '0');
      }
      fd.append('account_type', 'card');

      this.commonservice.postHttpCall({
        url: '/doers/add-card-to-stripe',
        data: fd,
        contenttype: 'application/json'
      }).then(res => {
        if (res.status == 1) {
          this.snackBar.open(this.payment_msg, '', {
            duration: 4000,
            horizontalPosition: 'right',
            panelClass: 'orangeSnackBar'
          });
          this.refreshCardList.emit('refresh');
          this.sibling.populateListing();
          this.getBankCardDetails();
          this.togglePopup();
        } else {
          this.snackBar.open(res.msg, '', {
            duration: 4000,
            horizontalPosition: 'right',
            panelClass: 'error'
          });
        }
      })
      .catch(error => console.log(error));
    } else if (this.isAddOrEdit == 'edit') {
      this.formCredit.removeControl('card_number');
      this.formCredit.removeControl('cvv');

      if (this.formCredit.invalid) {
        this.formCredit.addControl('card_number', new FormControl('', [Validators.required, Validators.pattern(this.card_pattern)]));
        this.formCredit.addControl('cvv', new FormControl('', [Validators.required, Validators.pattern(this.cvv_pattern)]));
        return;
      }

      this.success = true;
      const name = this.formCredit.get('card_name').value;
      const month = this.formCredit.get('card_month').value;
      const year = this.formCredit.get('card_year').value;

      const fd = new FormData();
      fd.append('card_id', this.cardDetails.object_id);
      fd.append('name', name);
      fd.append('exp_month', this.commonservice.base64_encode(month));
      fd.append('exp_year', this.commonservice.base64_encode(year));
      // fd.append('exp_month', month);
      // fd.append('exp_year', year);
      if (this.checked_primary_credit == true) {
        fd.append('is_primary', '1');
      } else {
        fd.append('is_primary', '0');
      }
      fd.append('account_type', 'card');

      this.commonservice.postHttpCall({
        url: '/doers/update-card',
        data: fd,
        contenttype: 'application/json'
      }).then(res => {
        if (res.status == 1) {
          this.snackBar.open(this.payment_msg, '', {
            duration: 4000,
            horizontalPosition: 'right',
            panelClass: 'orangeSnackBar'
          });
          this.refreshCardList.emit('refresh');
          this.getBankCardDetails();
          this.formCredit.addControl('card_number', new FormControl('', [Validators.required, Validators.pattern(this.card_pattern)]));
          this.formCredit.addControl('cvv', new FormControl('', [Validators.required, Validators.pattern(this.cvv_pattern)]));
          this.togglePopup();
        } else {
          this.snackBar.open(res.msg, '', {
            duration: 4000,
            horizontalPosition: 'right',
            panelClass: 'error'
          });
        }
      });
    }
  }

  getStripeAutofillFields() {
    this.commonservice.getHttpCall({
      url: '/doers/stripe-autocomplete-fields',
      contenttype: 'application/json'
    })
    .then(res => {
      if (res.status == 1) {
        this.stripeAutoFields = res.fields;
      }
    })
    .catch(err => console.log(`ERROR: ${err}`));
  }

  generateBankForm() {
    this.backAccountDetailsAddOrUpdateForm = this.fb.group({
			account_holder_name: ['', Validators.required],
			type: ['individual', Validators.required],
      account_number: ['', Validators.required],
			routing_number: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
		});
  }

  get formControls() {
    return this.backAccountDetailsAddOrUpdateForm.controls;
  }

  addBankDetails() {
    this.isformSubmitted = true;

    if (this.backAccountDetailsAddOrUpdateForm.valid) {
      this.commonservice.postHttpCall({
				url: '/doers/save-standard-bank-details',
				data: this.backAccountDetailsAddOrUpdateForm.value,
				contenttype: "form-data"
			})
			.then(result => {
				this.togglePopup();
        this.bankAdded.emit(true);
        this.bankForm.resetForm();
      })
      .catch(error => console.log(error));
    }
  }

}
