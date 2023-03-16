import { Component, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../commonservice';
import { Globalconstant } from '../../global_constant';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  public userdata: any = {};
  public success_msg = '';
  public reg_class = '';
  public errorMsg = '';
  public pageLoder = false;
  public activate_email; any;

  public email = '';
  public password = '';
  public rememberme = false;
  returnUrl: any = '';
  environment: any = environment;

  hide = true;


  constructor(
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppComponent,
    private titleService: Title,
    public commonService: CommonService,
    public globalconstant: Globalconstant,
    private cookieService: CookieService,
    public commonservice: CommonService
  ) {

    window.scrollTo(0, 0);
    // Change Page Title
    this.titleService.setTitle('Pindo | Login');

    //get activate route
    this.route.params.subscribe(params => {
      this.activate_email = params['user_email'];
    });
    if (this.activate_email) {
      this.activateAccount();
    }

    /*Set login details if mark as remember me*/
    const cookieExists: boolean = this.cookieService.check('UserEmail');
    if (cookieExists) {
      let userEmail = this.cookieService.get('UserEmail');
      let bytesEmail = CryptoJS.AES.decrypt(userEmail, 'secret key 123');
      let originalEmail = bytesEmail.toString(CryptoJS.enc.Utf8);

      let userPwd = this.cookieService.get('UserPassword');
      let bytesPwd = CryptoJS.AES.decrypt(userPwd, 'secret key 1234');
      let originalPwd = bytesPwd.toString(CryptoJS.enc.Utf8);

      this.email = originalEmail;
      this.password = originalPwd;
      //console.log(this.cookieService.get('UserEmail'),this.cookieService.get('UserPassword'));
      this.rememberme = true;
    }


    /*Set login details if mark as remember me*/
    /*if(localStorage.getItem('pindo_login_remember')){
      this.email = localStorage.getItem('pindo_login_user_email');
      this.password = localStorage.getItem('pindo_login_user_pass');
      this.rememberme = true;
    }*/

    // GET IF REDIRECT URL IS PRESENT //
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }

  ngOnDestroy() {
    if (localStorage.getItem('slug')) {
      localStorage.removeItem('slug');
    }
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.fbSignUp();
  }

  fbSignUp() {
    console.log('login call');
    // Registration via facebook
    let fb_call_counter = 0;
    this.authService.authState.subscribe((user) => {
      if (fb_call_counter == 0 && user != null) {

        if (user.email != 'undefined') {
          this.commonService.postHttpCall({ url: '/login-with-facebook', data: { 'email': user.email } }).then(result => this.registerWithFBSuccess(result));
        } else {
          this.responseMessageSnackBar('No email is registered with this facebook account.');
        }
      }
      if (user != null) {
        fb_call_counter++;
      }

    });
  }

  registerWithFBSuccess(response) {
    if (response.status == 1) {
      this.reg_class = 'alert alert-success';
      this.success_msg = response.message;

      //After Login //

      localStorage.setItem('frontend_user_id', btoa(response.data.id));
      localStorage.setItem('frontend_token', response.token);
      localStorage.setItem('user_type', btoa(response.data.user_type));

      // localStorage.setItem('x-access-token', response.data.x_access_token);
      // localStorage.setItem('name',response.data.user_details.name);
      // localStorage.setItem('user_first_name',response.data.user_details.first_name);
      // localStorage.setItem('company_name', response.data.user_details.company_name);
      // localStorage.setItem('user_name', response.data.user_details.username);
      // localStorage.setItem('profile_type', btoa(response.data.user_details.profile_type));


      if (response.primary_address != null) {
        if (response.primary_address.address != null) {
          let formatted_address = response.primary_address.address + ' ' + response.primary_address.city + ', ' + response.primary_address.state + ' ' + response.primary_address.zipcode;
          this.commonService.setHeaderAddress(formatted_address, response.primary_address.lat, response.primary_address.lng);
        } else {
          this.commonService.getCurrentLocation();
        }

      } else {
        this.commonService.getCurrentLocation();
      }


      this.globalconstant.userData = response.data;

      this.commonService.islogin = 1;
      this.commonService.countSessionTimeOut = 0;
      this.appService.user_type = response.data.user_type;
      if (response.data.user_type == '1') {
        //window.location.href= this.globalconstant.pinnerUrl;
        this.router.navigate(['/community/community-home']);
      } else {
        //window.location.href= this.globalconstant.doerUrl;
        this.router.navigate(['/doer/dashboard']);
      }

      //Onesignal
      this.oneSingalPush();
    } else {
      /*this.reg_class = "alert alert-danger";*/
      this.success_msg = response.message;
      this.responseMessageSnackBar(response.msg);
    }
  }

  activateAccount() {
    this.commonService.postHttpCall({ url: '/activate-account', data: { 'account_verification_code': this.activate_email } }).then(result => this.activateSuccess(result));
  }

  activateSuccess(response) {
    if (response.status == 1) {
      this.appService.reg_class = 'alert alert-success';
      this.appService.success_msg = response.message;
      this.responseMessageSnackBar(response.msg);
    } else {
      this.appService.reg_class = 'alert alert-danger';
      this.appService.success_msg = response.message;
      this.responseMessageSnackBar(response.msg);
    }
    this.router.navigate(['/login']);
  }

  /**
   * Logins function
   * @param values
   * @param validcheck
   * @param frm_obj
   */
  loginFunction(values, validcheck, frm_obj) {
    /*  Used for remember login details */
    if (this.rememberme) {
      let cipherUserEmail = CryptoJS.AES.encrypt(values.email, 'secret key 123').toString();
      let cipherPwd = CryptoJS.AES.encrypt(values.password, 'secret key 1234').toString();

      this.cookieService.set('UserEmail', cipherUserEmail);
      this.cookieService.set('UserPassword', cipherPwd);

    } else {
      const cookieExists: boolean = this.cookieService.check('UserEmail');
      if (cookieExists) {
        this.cookieService.delete('UserEmail');
        this.cookieService.delete('UserPassword');
      }

    }
    /*  Used for remember login details */

    if (validcheck) {
      this.pageLoder = true;
      this.commonService.postHttpCall({ url: '/login', data: values }).then(result => this.loginSuccess(result));
    }
  }

  loginSuccess(response) {
    // console.log("RESPONSE = ",response);

    if (response.status == 1) {
      this.reg_class = 'alert alert-success';
      this.success_msg = response.message;

      //After Login //
      // localStorage.setItem('frontend_user_id', btoa(response.data.id));
      // localStorage.setItem('x-access-token', response.access_token);
      // localStorage.setItem('frontend_token', response.token);
      // localStorage.setItem('user_type', btoa(response.data.user_type));
      // localStorage.setItem('name', response.data.name);
      // localStorage.setItem('user_first_name', response.data.first_name);
      // localStorage.setItem('company_name', response.data.company_name);
      // localStorage.setItem('user_name', response.data.username);
      // localStorage.setItem('profile_type', btoa(response.data.profile_type));
      // sessionStorage.setItem('show_session_expired_popup', '1');
      this.commonService.setAccountDataToStorage(response);

      if (response.primary_address != null) {
        if (response.primary_address.address != null) {
          let formatted_address = response.primary_address.address + ' ' + response.primary_address.city + ', ' + response.primary_address.state + ' ' + response.primary_address.zipcode;
          this.commonService.setHeaderAddress(formatted_address, response.primary_address.lat, response.primary_address.lng);
        } else {
          this.commonService.getCurrentLocation();
        }

      } else {
        this.commonService.getCurrentLocation();
      }

      this.globalconstant.userData = response.data;

      this.commonService.islogin = 1;
      this.commonService.countSessionTimeOut = 0;
      this.commonService.changeFunction(this.commonService.islogin);

      this.appService.user_type = response.data.user_type;
      if (response.data.user_type == '1') {
        let tempDoerPublicprofRedirectionId = localStorage.getItem('doerPublicProfileId') || null;
        if (tempDoerPublicprofRedirectionId) {
          localStorage.removeItem('doerPublicProfileId');
          this.router.navigate([`doer-details/${tempDoerPublicprofRedirectionId}`]);
        } else {
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          } else {
            if (response.data.redirected_to_profile_page) {
              this.router.navigate(['/community/community-home']);
            } else {
              localStorage.setItem('initial_redirection_to_profile_page', '1');
              this.router.navigate(['/pinner/account-settings']);
            }
          }
        }

      } else {
        if (this.returnUrl) {
          this.router.navigate([this.returnUrl]);
          this.getProfileDetails();
        } else if (localStorage.getItem('slug')) {
          let tempSlug = localStorage.getItem('slug');
          localStorage.removeItem('slug');
          this.router.navigate(['/doer/apply-pins/' + tempSlug]);
          this.getProfileDetails();
        } else {
          if (response.data.redirected_to_profile_page) {
            this.router.navigate(['/doer/dashboard']);
            this.getProfileDetails();
          } else {
            localStorage.setItem('initial_redirection_to_profile_page', '1');
            this.router.navigate(['/doer/account-settings']);
            this.getProfileDetails();
          }
        }
      }

      //Onesignal
      /* if (localStorage.getItem('routeURL')) {
        console.log('ROUTING LOGIN', localStorage.getItem('routeURL'));
        this.router.navigateByUrl(localStorage.getItem('routeURL'));
      } */
      this.oneSingalPush();
    } else {
      this.success_msg = response.message;
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  getProfileDetails() {
    this.commonservice.postHttpCall({
      url: '/doers/get-basic-details',
      data: {},
      contenttype: 'application/json'
    })
      .then(result => {
        // if (result.data.is_volunteer == 1) {
        //   if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || result.data.range_in_miles == null || result.services.length == 0) {
        //     this.profileCompletionAlertPopupVolunteer();
        //   }
        // } else {
        //   if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || (result.data.accept_payment_by_bank == 0 && result.data.accept_payment_by_cards == 0 && result.data.accept_payment_by_cash == 0 && result.data.accept_payment_by_cheque == 0) || result.data.range_in_miles == null || result.data.admin_commission_charge_by == null || result.services.length == 0 || (result.data.stripe_customer_id == null && result.data.stripe_user_id == null)) {
        //     this.profileCompletionAlertPopupStandard();
        //   }
        // }

        // console.table([
        //   ["mobile_no", result.data.mobile_no],
        //   ["email", result.data.email],
        //   ["address", result.data.address],
        //   ["accept_payment_by_bank", result.data.accept_payment_by_bank],
        //   ["accept_payment_by_cards", result.data.accept_payment_by_cards],
        //   ["accept_payment_by_cash", result.data.accept_payment_by_cash],
        //   ["accept_payment_by_cheque", result.data.accept_payment_by_cheque],
        //   ["range_in_miles", result.data.range_in_miles],
        //   ["admin_commission_charge_by", result.data.admin_commission_charge_by],
        //   ["services.length", result.services.length],
        //   ["stripe_customer_id", result.data.stripe_customer_id],
        //   ["stripe_user_id", result.data.stripe_user_id]
        // ]);

        if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || (result.data.accept_payment_by_bank == 0 && result.data.accept_payment_by_cards == 0 && result.data.accept_payment_by_cash == 0 && result.data.accept_payment_by_cheque == 0) || result.data.range_in_miles == null || result.data.admin_commission_charge_by == null || result.services.length == 0 || (result.data.stripe_customer_id == null && result.data.stripe_user_id == null)) {
          this.profileCompletionAlertPopupStandard();
        } else if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || result.data.range_in_miles == null || result.services.length == 0) {
          this.profileCompletionAlertPopupVolunteer();
        }

        localStorage.setItem('is_volunteer', result.data.is_volunteer);
      });
  }

  profileCompletionAlertPopupVolunteer() {
    Swal({
      title: 'Complete Profile',
      // html: '<div style="text-align: justify">To connect with Pinners and bid for jobs, please go to ACCOUNT SETTINGS and fill in the following required fields:</div><br/><ul style="text-align: left"><span style="font-weight: bold; text-decoration: underline;">Volunteer</span> <li>Contact Information: Add a primary phone number</li> <li>Location Settings: Add address and range of service</li> <li>Services Offered: At least one selected</li>',
      html: `<div style="text-align: justify">To connect with Pinners and bid for jobs, please fill in the following required fields:</div>
            <br/>
            <ul style="text-align: left">
              <span style="font-weight: bold; text-decoration: underline;">To be seen by Pinners</span>
              <li>Contact Information: Add a primary phone number</li>
              <li>Location Settings: Add address and range of service</li>
              <li>Services Offered: At least one selected</li>
            </ul>`,
      width: 850,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'OK',
    }).then((res) => {
      if (res.value) {
        this.router.navigate(['/doer/account-settings']);
      }
    });
  }


  profileCompletionAlertPopupStandard() {
    Swal({
      title: 'Complete Profile',
      // html: '<div style="text-align: justify">To connect with Pinners and bid for jobs, please go to ACCOUNT SETTINGS and fill in the following required fields:</div><br/><ul style="text-align: left"><span style="font-weight: bold; text-decoration: underline;">Volunteer</span> <li>Contact Information: Add a primary phone number</li> <li>Location Settings: Add address and range of service</li> <li>Services Offered: At least one selected</li> <span style="font-weight: bold; text-decoration: underline;">Paid Pins</span> <li>How Pinners Pay You: At least one selected</li> <li>How to Receive Electronic Payments and Pay PinDo: Add bank account and/or credit card</li></ul>',
      html: `<div style="text-align: justify">To connect with Pinners and bid for jobs, please fill in the following required fields:</div>
            <br/>
            <ul style="text-align: left">
              <span style="font-weight: bold; text-decoration: underline;">To be seen by Pinners</span>
              <li>Contact Information: Add a primary phone number</li>
              <li>Location Settings: Add address and range of service</li>
              <li>Services Offered: At least one selected</li>
              <br/>
              <span style="font-weight: bold; text-decoration: underline;">To Quote and be Hired</span>
              <li>How to Pay PinDo*: Add credit card</li>
              <li>How Pinners Pay You: At least one selected (credit card, bank, cash, check)</li>
            </ul>
            <div class="text-left">
              <small>
                * PinDo fees only apply if you are awarded a job. NO subscription or lead generation fees.
                <br>
                Your customers can pay you directly by Bank/ACH or credit card when you add a bank account.
              </small>
            </div>`,
      width: 850,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'OK',
    }).then((res) => {
      if (res.value) {
        this.router.navigate(['/doer/account-settings']);
      }
    });
  }


  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

  public rememberMyLoginDtls() { }

  /*one signal*/
  oneSingalPush = () => {
    let that = this;

    setTimeout(() => {

      let OneSignal = window['OneSignal'] || [];

      OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        if (isEnabled) {
          // user has subscribed
          OneSignal.getUserId(function (userId) {
            localStorage.setItem('playerid', userId);
            // Make a POST call to your server with the user ID
            that.commonService.postHttpCall({ url: '/save-player-id', data: { 'player_id': localStorage.getItem('playerid') }, contenttype: 'application/json' }).then(result => that.savePlayerIdSuccess(result));
          });
        }
      });
      if (this.commonService.is_onesignal_initialized == 0) {
        this.commonService.is_onesignal_initialized = 1;
        console.log('Init OneSignal');
        OneSignal.push(['init', {
          appId: 'b95f396e-4215-43c1-aa92-b0826c01e002',
          autoRegister: false,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false,
          }
        }]);
        OneSignal.push(function () {
          OneSignal.push(['registerForPushNotifications']);
        });
        OneSignal.push(function () {
          // Occurs when the user's subscription changes to a new value.
          OneSignal.on('subscriptionChange', function (isSubscribed) {
            OneSignal.getUserId().then(function (playerid) {
              localStorage.setItem('playerid', playerid);
              that.commonService.postHttpCall({ url: '/save-player-id', data: { 'player_id': localStorage.getItem('playerid') }, contenttype: 'application/json' }).then(result => that.savePlayerIdSuccess(result));
            });
          });
        });
      }
    }, 1000);

  }

  savePlayerIdSuccess(response) {
  }
}
