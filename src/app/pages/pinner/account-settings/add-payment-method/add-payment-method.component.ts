import { Component, OnInit, Input, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
@Component({
  selector: 'add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit {
  @ViewChild('popUpVar') popupref;
  @ViewChild('cardForm') private cardFormValues: NgForm;
  @Output() accountSettingDetailsPopulate = new EventEmitter();

  showPaymentMethodType: string;
  cardOrBankDetails: any = {};
  cardPaymentDetailsAddOrUpdateForm: FormGroup;
  backAccountDetailsAddOrUpdateForm: FormGroup;
  addOrUpdateBtn: string = 'SAVE';
  addOrUpdateBankBtn: string = 'SAVE';
  tempMonthList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthList: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  current_year = new Date().getFullYear();
  current_month = new Date().getMonth();
  yearList: any = [];
  cardNumber: any;
  cardType: string = '';
  cardMaskFormate = '0000-0000-0000-0000';

  card_pattern: string = '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$';
  routing_number_pattern: string = '^[0-9]{9}$';
  cvv_pattern: string = '^[0-9]{3,4}$';
  cvvMaxLength:number=3;
  cvvMinLength:number =3;
  isNewBankAdd:Boolean = false;

  constructor(public commonservice: CommonService,
    public renderer: Renderer2,
    public snackBar: MatSnackBar,
    private fb: FormBuilder) {
    this.cardPaymentDetailsAddOrUpdateForm = this.fb.group({
      card_name: ['', [Validators.required]],
      card_number: ['', [Validators.required, Validators.pattern(this.card_pattern)]],
      // card_cvv: ['', [Validators.required, Validators.pattern(this.cvv_pattern)]],
      card_cvv: ['', [Validators.required]],
      card_month: ['', [Validators.required]],
      card_year: ['', [Validators.required]],
      is_primary: [''],
    });

    this.backAccountDetailsAddOrUpdateForm = this.fb.group({
      account_holder_name: ['', [Validators.required]],
      account_number: ['', [Validators.required]],
      confirm_account_number: ['', [Validators.required]],
      routing_number: ['', [Validators.required, Validators.pattern(this.routing_number_pattern)]],
      is_primary: [''],
    }, {
        validator: MustMatch('account_number', 'confirm_account_number'),
      });
  }

  ngOnInit() {
    for (let i = 0; i < 30; i++) {
      this.yearList.push(this.current_year);
      this.current_year++;
    }
  }

  /**
   * Changes card year
   * @param event 
   */
  changeCardYear(event) {
    this.monthList = [];
    if (event === this.yearList[0]) {
      for (let i = this.current_month + 1; i <= 12; i++) {
        this.monthList.push(i);
      }
    } else {
      this.monthList = this.tempMonthList;
    }
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      this.showPaymentMethodType = '';
      // this.accountSettingDetailsPopulate.emit('newBankAdd');
    } else {
      this.cardOrBankDetails = {};
      this.addOrUpdateBtn = 'SAVE';
      this.addOrUpdateBankBtn = 'SAVE';
      this.isNewBankAdd = false;


      if (localStorage.getItem('cardOrBankDetails') != null && localStorage.getItem('cardOrBankDetails') != 'newCard'
          && localStorage.getItem('cardOrBankDetails') != 'newBank') {
        this.cardOrBankDetails = JSON.parse(localStorage.getItem('cardOrBankDetails'));

        localStorage.removeItem('cardOrBankDetails');
        setTimeout(() => {
          if (this.cardOrBankDetails.object == 'card') {
            this.backAccountDetailsAddOrUpdateForm.reset();
            this.showPaymentMethodType = 'credit_card';
            this.addOrUpdateBtn = 'UPDATE';
            // tslint:disable-next-line: radix
            this.changeCardYear(parseInt(this.cardOrBankDetails.exp_date));
            this.cardPaymentDetailsAddOrUpdateForm = new FormGroup({
              card_name: new FormControl({ value: this.cardOrBankDetails.name, disabled: false }, Validators.required),
              card_number: new FormControl({ value: '', disabled: false }),
              card_cvv: new FormControl({ value: '', disabled: false }),
              // tslint:disable-next-line: radix
              card_month: new FormControl({ value: parseInt(this.cardOrBankDetails.expiry_month), disabled: false }, Validators.required),
              // tslint:disable-next-line: radix
              card_year: new FormControl({ value: parseInt(this.cardOrBankDetails.exp_date), disabled: false }, Validators.required),
              is_primary: new FormControl({ value: this.cardOrBankDetails.is_primary, disabled: false }),
            });
           
          } else {
            this.cardPaymentDetailsAddOrUpdateForm.reset();
            this.showPaymentMethodType = 'bank_account';
            this.addOrUpdateBankBtn = 'UPDATE';
            this.backAccountDetailsAddOrUpdateForm = new FormGroup({
              account_holder_name: new FormControl({ value: this.cardOrBankDetails.name, disabled: false }, Validators.required),
              account_number: new FormControl({ value: '', disabled: false }),
              confirm_account_number: new FormControl({ value: '', disabled: false }),
              routing_number: new FormControl({ value: '', disabled: false }),
              is_primary: new FormControl({ value: this.cardOrBankDetails.is_primary, disabled: false }),
            });
          }
          
        }, 500);
      } else {
        this.cardPaymentDetailsAddOrUpdateForm.reset();
        this.backAccountDetailsAddOrUpdateForm.reset();
        this.cardNumber = '';
        if (localStorage.getItem('cardOrBankDetails') == 'newCard') {
          this.showPaymentMethodType = 'credit_card';
        } else {
          this.isNewBankAdd = true;
          this.showPaymentMethodType = 'bank_account';
        }
        localStorage.removeItem('cardOrBankDetails');
        
      }
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }

  }

  /**
   * Gets add edit card details controller
   */
  get addEditCardDetailsController() { return this.cardPaymentDetailsAddOrUpdateForm.controls; }

  /**
   * Gets add edit bank details controller
   */
  get addEditBankDetailsController() { return this.backAccountDetailsAddOrUpdateForm.controls; }

  // ---- paymentMethodTypeFnc ----
  paymentMethodTypeFnc(type) {
    this.showPaymentMethodType = type;
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
   * Adds or edit card details
   * @returns  
   */
  addOrEditCardDetails() {
    let tempCardDetails: any = {};
    if (this.cardPaymentDetailsAddOrUpdateForm.invalid) {
      return;
    } else {
      tempCardDetails = {
        name: this.cardPaymentDetailsAddOrUpdateForm.get('card_name').value,
        number: this.commonservice.base64_encode(this.cardPaymentDetailsAddOrUpdateForm.get('card_number').value),
        cvc: this.commonservice.base64_encode(this.cardPaymentDetailsAddOrUpdateForm.get('card_cvv').value),
        // tslint:disable-next-line: radix
        exp_month: this.commonservice.base64_encode(this.cardPaymentDetailsAddOrUpdateForm.get('card_month').value),
        exp_year: this.commonservice.base64_encode(this.cardPaymentDetailsAddOrUpdateForm.get('card_year').value),
        is_primary: this.cardPaymentDetailsAddOrUpdateForm.get('is_primary').value,
        account_type: 'card'
      };
      if (this.addOrUpdateBtn == 'UPDATE') {
        tempCardDetails = {
          name: this.cardPaymentDetailsAddOrUpdateForm.get('card_name').value,
          exp_month:this.commonservice.base64_encode(this.cardPaymentDetailsAddOrUpdateForm.get('card_month').value),
          exp_year: this.commonservice.base64_encode(this.cardPaymentDetailsAddOrUpdateForm.get('card_year').value),
          is_primary: this.cardPaymentDetailsAddOrUpdateForm.get('is_primary').value,
          card_id: this.cardOrBankDetails.object_id,
          account_type: 'card'
        };
      }
    }

    console.log("tempCardDetails= ",tempCardDetails);
    this.uploadOrEditCardDetailsApi(tempCardDetails, 'cardPayment');
  }

  /**
   * Uploads or edit card details api
   * @param cardDetails 
   * @param type 
   */
  uploadOrEditCardDetailsApi(cardDetails, type) {
    cardDetails.is_primary = cardDetails.is_primary ? 1 : 0;

    const url = (type == 'cardPayment') ? this.addOrUpdateBtn == 'UPDATE' ? '/pinners/update-card' : '/pinners/add-card-to-stripe' :
      this.addOrUpdateBankBtn == 'UPDATE' ? '/pinners/update-bank' : '/pinners/create-customer-add-bank';

    this.commonservice.postHttpCall({
      url: url,
      data: cardDetails,
      contenttype: 'application/json'
    })
      .then((result) => {
        if (result.status == 1) {
          if(this.isNewBankAdd){
            this.accountSettingDetailsPopulate.emit('newBankAdd');
          } else {
            this.accountSettingDetailsPopulate.emit(true);
          }
          
          this.responseMessageSnackBar(result.msg);
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
   * Adds or edit bank details
   * @returns  
   */
  addOrEditBankDetails() {
    let tempBankDetails: any = {};
    if (this.backAccountDetailsAddOrUpdateForm.invalid) {
      return;
    } else {
      tempBankDetails = {
        account_holder_name: this.backAccountDetailsAddOrUpdateForm.get('account_holder_name').value,
        account_number: this.backAccountDetailsAddOrUpdateForm.get('account_number').value,
        routing_number: this.backAccountDetailsAddOrUpdateForm.get('routing_number').value,
        is_primary: this.backAccountDetailsAddOrUpdateForm.get('is_primary').value,
        account_type: 'bank_account'
      };
      if (this.addOrUpdateBankBtn == 'UPDATE') {
        tempBankDetails = {
          account_holder_name: this.backAccountDetailsAddOrUpdateForm.get('account_holder_name').value,
          account_number: this.backAccountDetailsAddOrUpdateForm.get('account_number').value,
          routing_number: this.backAccountDetailsAddOrUpdateForm.get('routing_number').value,
          is_primary: this.backAccountDetailsAddOrUpdateForm.get('is_primary').value,
          bank_id: this.cardOrBankDetails.object_id,
          account_type: 'bank_account'
        };
      }
    }

    // console.log("tempBankDetails BANK = ", tempBankDetails);
    this.uploadOrEditCardDetailsApi(tempBankDetails, 'bankAccount');
  }

  /**
   * Gets card type
   */
  getCardType() {
    if (this.cardNumber != null && this.cardNumber != '') {
      this.cardType = '';
      this.cardMaskFormate = '0000-0000-0000-0000';
      this.cvvMaxLength =3;
      this.cvvMinLength =3;
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
        this.cardType = 'americanexpress';
        this.cardMaskFormate = '0000-000000-00000';
        this.cvvMinLength =4;
        this.cvvMaxLength =4;
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

}

/**
 * Must match
 * @param controlName 
 * @param matchingControlName 
 * @returns  
 */
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }
    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
