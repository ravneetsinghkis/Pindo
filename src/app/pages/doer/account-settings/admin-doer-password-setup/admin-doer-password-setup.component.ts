import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';

@Component({
  selector: 'app-admin-doer-password-setup',
  templateUrl: './admin-doer-password-setup.component.html',
  styleUrls: ['./admin-doer-password-setup.component.scss']
})
export class AdminDoerPasswordSetupComponent implements OnInit {

  adminDoerPasswordForm: FormGroup;
  adminDoerPasswordFormSubmitted: boolean = false;
  confirmCancel: boolean = false;

  hidePass = true;
  hideConfirmPass = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private commonservice: CommonService,
    public dialogRef: MatDialogRef<AdminDoerPasswordSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.generateForm();
  }

  generateForm() {
    this.adminDoerPasswordForm = this.fb.group({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  submitform() {
    if (this.adminDoerPasswordForm.valid) {
      let formValues = {invitation_id: localStorage.getItem('profile_activate_id'), ...this.adminDoerPasswordForm.value};

      this.commonservice.postHttpCall({ 
        url: '/doers/accept-admin-doer-profile', 
        data: formValues, 
        contenttype: 'application/json' 
      }).then(result => {
        if (result.status) {
          localStorage.removeItem('profile_activate_id');
          this.closeDialog();
          this.responseMessageSnackBar(result.msg, 'orangeSnackBar');
          // this.router.navigate(['/doer/account-settings']);
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> this.router.navigate(['/doer/account-settings']));
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
    }
  }

  clickedCancel() {
    this.confirmCancel = true;
  }

  rejectAccount() {
    this.closeDialog();
    this.commonservice.initiateLogout(true);
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}