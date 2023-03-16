import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('myForm') formValues;
  @ViewChild('popUpVar') popupref;
  @Output()	accountSettingDetailsPopulate = new EventEmitter();

  oldPassToggle: string = 'password';
  newPassToggle: string = 'password';
  confPassToggle: string = 'password';
  changePasswordForm: FormGroup;
  submitted: Boolean = false;

  constructor(private fb: FormBuilder,
    public commonservice: CommonService, 
    public renderer: Renderer2,
    public snackBar: MatSnackBar) {

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confPassword: ['', [Validators.required]],
    }, {
        validator: MustMatch('newPassword', 'confPassword'),
      });
  }

  ngOnInit() {
  }

  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.formValues.resetForm();
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  showPass(id) {
    if (id == 1) {
      this.oldPassToggle = this.oldPassToggle == 'password' ? 'text' : 'password';
    } else if (id == 2) {
      this.newPassToggle = this.newPassToggle == 'password' ? 'text' : 'password';
    } else if (id == 3) {
      this.confPassToggle = this.confPassToggle == 'password' ? 'text' : 'password';
    }
  }

  
  changePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    } else {
      const passwordData = {
        old_password: this.changePasswordForm.get('oldPassword').value.trim(),
        new_password: this.changePasswordForm.get('newPassword').value.trim()
      };

      this.commonservice.postHttpCall({
        url: '/doers/change-password-new',
        data: passwordData,
        contenttype: 'application/json'
      })
        .then(result => this.submitSuccess(result));
    }
  }

  get passwordChangeController() { return this.changePasswordForm.controls; }

  submitSuccess(result) {
    console.log(result);
    if (result.status == 1) {
      this.accountSettingDetailsPopulate.emit(true);
      this.responseMessageSnackBar(result.msg , 'orangeSnackBar');
      this.togglePopup();
    } else {
      this.responseMessageSnackBar(result.msg, 'error');
    }
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }
}

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
