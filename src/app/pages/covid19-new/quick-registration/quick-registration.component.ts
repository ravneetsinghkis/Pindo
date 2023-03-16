import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-quick-registration',
  templateUrl: './quick-registration.component.html',
  styleUrls: ['./quick-registration.component.scss'],
})
export class QuickRegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  registrationFormSubmitted: boolean = false;
  hide: boolean = true;
  userType: number;

  loginData: any;
  userdata: any;

  constructor(
    public dialogRef: MatDialogRef<QuickRegistrationComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    public commonservice: CommonService,
    public globalConstant: Globalconstant,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.userType = this.data.user_type;
    this.generateRegistrationForm();
  }

  /**
   * Generate Registration Form
   */
  generateRegistrationForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName : ['', [Validators.required]],
      email    : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required]],
      terms    : ['', [Validators.requiredTrue]],
    });
  }

  /**
   * Get form controls
   */
  get registractionFormControls() {
    return this.registrationForm.controls;;
  }

  /**
   * Closes the modal
   */
  closeDialog(data): void {
    if (! data) {
      this.router.navigate(["/"]);
    }

    this.dialogRef.close(data);
  }

  /**
   * Registers the user
   */
  registerUser() {
    this.registrationFormSubmitted = true;

    if (this.registrationForm.valid) {
      let formValues = this.registrationForm.value;
      formValues.user_type = this.userType;

      this.loginData = {
        email: formValues.email,
        password: formValues.password
      };

      this.commonservice.postHttpCall({ url: '/simple-registration', data: formValues }).then(result => this.registerSuccess(result));
    }
  }

  /**
   * Process action after registration success
   * @param response json
   */
  registerSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      this.registrationForm.reset();
      this.registrationFormSubmitted = false;
      this.userdata = response.data;

      if (this.userdata.user_type == 1) {
        this.notifyPinner();
      } else if (this.userdata.user_type == 2) {
        this.notifyDoer();
      }

      this.closeDialog({
        loginData: this.loginData
      });
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
   * Notify Pinner
   */
  notifyPinner() { console.log("notifying Pinner");
    let postData = {
      'sender_id'            : this.userdata.user_id,
      'reciver_id'           : this.userdata.user_id,
      'pin_id'               : 0,
      'title'                : ' please complete your profile',
      'userEmailTemplateSlug': 'complet_profile',
      'show_in_todo'         : 1
    };

    postData['title'] = 'Your registration was successful. Create a Pin and get stuff done!';
    postData['link'] = 'pinner/create-new-pin';
    postData['todo_title'] = this.userdata.name + ', complete your profile so you can find the right Doer to help get stuff done!';
    postData['todo_link'] = 'pinner/account-settings';

    this.globalConstant.notificationSocket.emit('post-notification-user-registration', postData);
  }

  /**
   * Notify Doer
   */
  notifyDoer() { console.log("notifying Doer");
    let postDataProfile = {
      'sender_id'            : this.userdata.user_id,
      'reciver_id'           : this.userdata.user_id,
      'pin_id'               : 0,
      'title'                : 'Your registration was successful. Create your profile so Pinners can find you.',
      'link'                 : '/doer/account-settings',
      'show_in_todo'         : 1,
      'todo_title'           : 'Your profile is not quite done. Complete your payment method so Pinners can find you!',
      'todo_link'            : '/doer/account-settings',
      'userEmailTemplateSlug': '',
    };

    this.globalConstant.notificationSocket.emit('post-notification-user-registration', postDataProfile);
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

}
