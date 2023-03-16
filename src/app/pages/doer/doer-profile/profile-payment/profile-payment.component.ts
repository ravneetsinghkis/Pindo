import { Component, OnInit, Input, Output, ViewChild, Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-profile-payment',
  templateUrl: './profile-payment.component.html',
  styleUrls: ['./profile-payment.component.scss']
})
export class ProfilePaymentComponent implements OnInit {

  @Input()
  isProfilePayment = false;
  @Output() listingPopulated = new EventEmitter();

  @ViewChild('popUpVar')
  popupref;

  public name = '';
  public reference_no = '';
  public description = '';
  public insuranceID = '';
  public showList: boolean = false;
  public populateInsuranceListing = [];

  paymentModel = {
    choosePayment: {
      paymentCredit: false,
      paymentCheque: false,
      paymentCash: false,
      paymentByBank: false
    }
  };

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar) {
    this.populateListing();
  }

  ngOnInit() {
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
   * Submits payment form
   * @param { value, valid } 
   */
  submitPaymentForm({ value, valid }: { value: any, valid: boolean }) {

    if (valid) {
      this.commonservice.postHttpCall({ url: '/doers/update-payment-options', data: value.choosePayment, contenttype: "application/json" }).then(result => this.submitSuccess(result));
    }

  }

  /**
   * Submits success
   * @param response 
   */
  submitSuccess(response) {
    if (response.status == 1) {
      //if(submitType != 'save and continue')
      //this.togglePopup();
      this.populateListing();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
    this.responseMessageSnackBar(response.msg,'error');
  }

  /**
   * Populates listing
   */
  populateListing() {
    this.commonservice.postHttpCall({ url: '/doers/get-payment-options', contenttype: "application/json" }).then(result => this.populateSuccess(result));
  }


  /**
   * Populates success
   * @param response 
   */
  populateSuccess(response) {
    console.log(response);
    if (response.status == 1) {
      if (response.data.accept_payment_by_cards || response.data.accept_payment_by_cheque || response.data.accept_payment_by_cash) {
        this.paymentModel.choosePayment.paymentCredit = response.data.accept_payment_by_cards;
        this.paymentModel.choosePayment.paymentCheque = response.data.accept_payment_by_cheque;
        this.paymentModel.choosePayment.paymentCash = response.data.accept_payment_by_cash;
        this.paymentModel.choosePayment.paymentByBank = response.data.accept_payment_by_bank;
        this.listingPopulated.emit(true);
      }
      else {
        this.listingPopulated.emit(false);
      }

    }
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
   * Resets function
   * @param frmElm 
   */
  resetFunction(frmElm) {
    frmElm.reset();
    frmElm.submitted = false;
    this.populateListing();
  }

}
