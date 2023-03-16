import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @ViewChild('popUpVar')
  popupref;

  userPassword = {
    password: '',
    changePassword: ''
  };

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar) { }

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
   * Submits success
   * @param result 
   * @param totForm 
   */
  submitSuccess(result, totForm) {
    console.log(result);
    if (result.status == 1) {
      this.responseMessageSnackBar(result.msg,'orangeSnackBar');
      this.resetFunction(totForm);
    } else {
      this.responseMessageSnackBar(result.msg, 'error');
      this.resetFunction(totForm);
    }
  }

  /**
   * Resets function
   * @param frmElm 
   */
  resetFunction(frmElm) {
    //frmElm.reset();
    frmElm.submitted = false;
    this.userPassword.password = '';
    this.userPassword.changePassword = '';
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
   * Submits password
   * @param frmElm 
   */
  submitPassword(frmElm) {
    console.log(frmElm.valid)
    if (frmElm.valid) {
      let tempObj = {
        confirmPassword: frmElm.value.passwordValidate.confirmPassword,
        password: frmElm.value.passwordValidate.password
      }
      this.commonservice.postHttpCall({ url: '/doers/change-password', data: tempObj, contenttype: "application/json" }).then(result => this.submitSuccess(result, frmElm));
    }
  }

}
