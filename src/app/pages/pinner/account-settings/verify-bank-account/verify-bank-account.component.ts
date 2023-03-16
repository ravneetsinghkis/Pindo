import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'verify-bank-account',
  templateUrl: './verify-bank-account.component.html',
  styleUrls: ['./verify-bank-account.component.scss']
})
export class VerifyBankAccountComponent implements OnInit {
  @ViewChild('popUpVar') popupref;

  contactModel: any = {};
  @Output() onVerifyingBankAccount = new EventEmitter();

  basicDetailsFormModel = {
    first_deposite: '',
    second_deposite: '',
  };

  constructor(public commonservice: CommonService, public renderer: Renderer2,
    public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {
      // console.log(this.myGlobals.frontend_url);
      // if(this.myGlobals.frontend_url==https://beta.pindoit.com){

      // }
  }

  ngOnInit() { }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      // this.basicDetailsFormModel = {
      //   first_deposite: '',
      //   second_deposite: '',
      // }

    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Closes modal
   */
  closeModal() {
    this.togglePopup();
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

  /*****************************************************************************
    *                       VERIFY PINNER BANK DETAILS                           *
    ******************************************************************************/
  verifyBankAccount(values, validcheck, totForm, submitType) {
    //console.log('bank_dtls',this.display_data.bank_details.id);
    // console.log(values);
    let temObj = {
      id: localStorage.getItem('bank_id'),
      first_deposite: parseInt(values.first_deposite),
      second_deposite: parseInt(values.second_deposite)
    };

    // console.log('temObj',temObj);
    if (validcheck) {
      this.commonservice.postHttpCall({ url: '/pinners/verify-bank-account', data: temObj, contenttype: "application/json" }).then((data) => this.verifyBankDetailSuccess(data));
    }
  }

  verifyBankDetailSuccess(response) {
    console.log('pinner bank details', response);

    if (response.status == 1) {
      localStorage.removeItem('bank_id');
      this.togglePopup();
      //this.cardList = response.data;
      this.onVerifyingBankAccount.emit(true);
      this.responseMessageSnackBar(response.msg);
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

}
