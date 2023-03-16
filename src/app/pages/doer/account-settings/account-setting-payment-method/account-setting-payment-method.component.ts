import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'account-setting-payment-method',
  templateUrl: './account-setting-payment-method.component.html',
  styleUrls: ['./account-setting-payment-method.component.scss']
})
export class AccountSettingPaymentMethodComponent implements OnInit {
  @Input() isProfilePayment = false;
  @Input() sibling: any;
  @Input() cardList: any;
  @Output() listingPopulated = new EventEmitter();
  @ViewChild('popUpVar') popupref;
  @Input() stripeAccountConnected: boolean = false;
  @Input() addBankComp;
  
  @Input() doerBankTotal;
  @Output() openBankModal = new EventEmitter();
  @Input() doerBankAccounts;
  @Output() connectStripe = new EventEmitter();
  @Output() toggleParentModal = new EventEmitter();
  @Output() deleteBankInit = new EventEmitter();

  public name = '';
  public reference_no = '';
  public description = '';
  public insuranceID = '';
  public showList: boolean = false;
  public populateInsuranceListing = [];
  card_list: any = [];

  paymentModel = {
    choosePayment: {
      paymentCredit: 0,
      paymentCheque: 0,
      paymentCash: 0,
      paymentByBank: 0
    }
  };
  paymentModelBackup = {
    choosePayment: {
      paymentCredit: 0,
      paymentCheque: 0,
      paymentCash: 0,
      paymentByBank: 0
    }
  };
  credit_flag: boolean = false;
  bank_flag: boolean = false;
  cash_flag: boolean = true;
  check_flag: boolean = true;
  // showPaymentMethodType:string ='credit_card';

  creditCardCount: number = 0;
  bankCount: number = 0;

  constructor(public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar) {
    this.populateListing();
  }

  ngOnInit() {
  }

  getCardList() {
    this.commonservice
      .postHttpCall({
        url: '/doers/get-cards',
        data: {},
        contenttype: 'application/json'
      })
      .then(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.card_list = res.data;
          this.checkIfAccountExists();
        }
      })
      .catch(error => console.log(error));
  }

  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.setPreviousDataWithOutSavingBackTime();
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.checkIfAccountExists();
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }  
  }

  checkIfAccountExists() {
    this.credit_flag = false;
    this.bank_flag = false;
    this.creditCardCount = 0;
    this.bankCount = 0;

    for (let i = 0; i < this.card_list.length; i++) {
      if (this.cardList[i].object == 'card') {
        this.credit_flag = true;
        this.creditCardCount++;
      }
      if (this.cardList[i].object == 'bank_account') {
        this.bank_flag = true;
        this.bankCount++;
        // this.credit_flag = true;
      }
    }
    // if (this.credit_flag == true && this.bank_flag == false) {
    //   this.credit_flag = false;
    // }
    // if (this.card_list.length == 0) {
    //   this.check_flag = false;
    //   this.cash_flag = false;
    // }
    console.log('LIST', this.card_list);
    console.log('CREDIT', this.credit_flag);
    console.log('BANK', this.bank_flag);
  }

  closeModal() {
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
          this.submitPaymentForm();
        } else {
          this.togglePopup();
          this.setPreviousDataWithOutSavingBackTime();
        }
      });
    } else {
      this.togglePopup();
      this.setPreviousDataWithOutSavingBackTime();
    }
  }

  checkValueUpdateORNot() {
    if (this.paymentModel.choosePayment.paymentByBank != this.paymentModelBackup.choosePayment.paymentByBank || this.paymentModel.choosePayment.paymentCash != this.paymentModelBackup.choosePayment.paymentCash ||
      this.paymentModel.choosePayment.paymentCheque != this.paymentModelBackup.choosePayment.paymentCheque ||
      this.paymentModel.choosePayment.paymentCredit != this.paymentModelBackup.choosePayment.paymentCredit) {
      return true;
    } else {
      return false;
    }
  }

  setPreviousDataWithOutSavingBackTime() {
    this.paymentModel.choosePayment.paymentByBank = this.paymentModelBackup.choosePayment.paymentByBank;
    this.paymentModel.choosePayment.paymentCash = this.paymentModelBackup.choosePayment.paymentCash;
    this.paymentModel.choosePayment.paymentCheque = this.paymentModelBackup.choosePayment.paymentCheque;
    this.paymentModel.choosePayment.paymentCredit = this.paymentModelBackup.choosePayment.paymentCredit;
  }

  submitPaymentForm() {
    this.commonservice.postHttpCall({
      url: '/doers/update-payment-options',
      data: {
        paymentByBank: this.paymentModel.choosePayment.paymentByBank,
        paymentCash: this.paymentModel.choosePayment.paymentCash,
        paymentCheque: this.paymentModel.choosePayment.paymentCheque,
        paymentCredit: this.paymentModel.choosePayment.paymentCredit,
      },
      contenttype: 'application/json'
    })
      .then(result => this.submitSuccess(result));
  }

  submitSuccess(response) {
    if (response.status == 1) {
      this.populateListing();
      this.togglePopup();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }

  }

  populateListing() {
    this.commonservice.postHttpCall({
      url: '/doers/get-payment-options',
      contenttype: 'application/json'
    })
      .then(result => {
        this.populateSuccess(result);
        this.getCardList();
      });
  }

  populateSuccess(response) {
    if (response.status == 1) {
      if (response.data) {
        this.paymentModel.choosePayment.paymentCredit = response.data.accept_payment_by_cards;
        this.paymentModel.choosePayment.paymentCheque = response.data.accept_payment_by_cheque;
        this.paymentModel.choosePayment.paymentCash = response.data.accept_payment_by_cash;
        this.paymentModel.choosePayment.paymentByBank = response.data.accept_payment_by_bank;

        this.paymentModelBackup.choosePayment.paymentCredit = response.data.accept_payment_by_cards;
        this.paymentModelBackup.choosePayment.paymentCheque = response.data.accept_payment_by_cheque;
        this.paymentModelBackup.choosePayment.paymentCash = response.data.accept_payment_by_cash;
        this.paymentModelBackup.choosePayment.paymentByBank = response.data.accept_payment_by_bank;

        // from pinner apply pin page
        if (localStorage.getItem("open_accept_payment_popup") == "1") {
          this.paymentModel.choosePayment.paymentCash = 1;
          this.paymentModel.choosePayment.paymentCheque = 1;
          localStorage.removeItem("open_accept_payment_popup");
        }  
      }
      if (response.data.accept_payment_by_cards == 1 || response.data.accept_payment_by_cheque == 1 || response.data.accept_payment_by_cash == 1 || response.data.accept_payment_by_bank == 1) {
        this.listingPopulated.emit(true);
      } else {
        this.listingPopulated.emit(false);
      }
    }
  }

  openCard(msg) {
    if (msg == 'credit' && this.bank_flag == true) {
      this.sibling.isAddOrEdit = 'add';
      this.sibling.showPaymentMethodType = 'credit_card';
      this.sibling.siblingMsg = 'credit_card';
      this.sibling.togglePopup('credit_card');
    } else {
      if (this.bankCount == 0) {
        this.addBankComp.togglePopup();
      } else {
        this.sibling.isAddOrEdit = 'add';
        this.sibling.showPaymentMethodType = 'bank_account';
        this.sibling.siblingMsg = 'bank_account';
        this.sibling.togglePopup('bank_account');
      }
    }
    this.closeModal();
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

  resetFunction(frmElm) {
    frmElm.reset();
    frmElm.submitted = false;
    this.populateListing();
  }

  openBankFormPopup() {
    this.openBankModal.emit();
  }

  goToStripe() {
    this.connectStripe.emit();
  }

  toggleParentPopup(card) {
    this.toggleParentModal.emit(card);
  }

  deleteCard(card) {
    console.log({card}, 'cardDeatils');
    this.deleteBankInit.emit(card);
  }

}
