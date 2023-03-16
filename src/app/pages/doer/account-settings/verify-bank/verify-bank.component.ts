import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-verify-bank',
  templateUrl: './verify-bank.component.html',
  styleUrls: ['./verify-bank.component.scss']
})
export class VerifyBankComponent implements OnInit {

  @ViewChild('popUpVar') popupref;

  contactModel: any = {};
  @Output() onVerifyingBankAccount = new EventEmitter();

  basicDetailsFormModel = {
    first_deposite: '',
    second_deposite: '',
  };

  constructor(
    public commonservice: CommonService, 
    public renderer: Renderer2,
    public el: ElementRef, 
    private ref: ChangeDetectorRef, 
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant
  ) {

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
      this.commonservice.postHttpCall({ url: '/doers/verify-bank-account', data: temObj, contenttype: "application/json" })
      .then((data) => this.verifyBankDetailSuccess(data))
      .catch(error => console.log(error));
    }
  }

  verifyBankDetailSuccess(response) {
    console.log('pinner bank details', response);

    if (response.status == 1) {
      localStorage.removeItem('bank_id');
      this.togglePopup();
      //this.cardList = response.data;
      this.onVerifyingBankAccount.emit(true);
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

}
