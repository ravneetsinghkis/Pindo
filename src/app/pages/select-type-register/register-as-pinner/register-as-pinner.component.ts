import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonService } from '../../../commonservice';
import { AppComponent } from '../../../app.component';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { Globalconstant } from '../../../global_constant';
import Swal from 'sweetalert2';
declare var $: any;
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-as-pinner',
  templateUrl: './register-as-pinner.component.html',
  styleUrls: ['./register-as-pinner.component.scss'],
  inputs: ['shared']
})
export class RegisterAsPinnerComponent implements OnInit {
  @Input() shared;

  public userdata: any = {};
  public success_msg = '';
  public reg_class = '';
  public errorMsg = '';
  public registerdata = {};
  public color = 'primary';
  public mode = 'indeterminate';
  public value = 50;
  facebook_id = '';
  hide = true;
  loginData: any;
  public formLoadedFlag = false;
  public invitedByUser: any = '';
  keepEmailInputReadOnly = false;
  environment: any = environment;

  constructor(
    private authService: AuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    private appService: AppComponent,
    private titleService: Title,
    public commonservice: CommonService,
    public globalConstant: Globalconstant,
    private route: ActivatedRoute
  ) {
    // Change Page Title
    this.titleService.setTitle('Pindo | Pinner Registration');

    this.route.params.subscribe(params => {

      if (params['reff_code'] && params['email']) {

        let reb64 = CryptoJS.enc.Hex.parse(params['reff_code']);
        let bytes = reb64.toString(CryptoJS.enc.Base64);
        let decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
        let plain = decrypt.toString(CryptoJS.enc.Utf8);
        this.invitedByUser = plain;
        console.log('FROM REGISTER PINNER', params['reff_code'], params['email']);

        setTimeout(() => {
          let reb64 = CryptoJS.enc.Hex.parse(params['email']);
          let bytes = reb64.toString(CryptoJS.enc.Base64);
          let decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
          let plain = decrypt.toString(CryptoJS.enc.Utf8);
          this.registerdata['email'] = plain;
          this.keepEmailInputReadOnly = true;
        }, 500);
      }
    });
  }

  ngOnInit() {
    this.registerdata = {
      user_type: 1,
      first_name: '',
      last_name: '',
      screen_name: '',
      username: '',
      email: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      password: '',
      conf_password: '',
      age: false,
      terms: false,
      lat: '',
      lng: '',
      referral_code: ''
    }

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var geocoder = geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'latLng': latlng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                this.handleAddressChange(results[1]);
              }
            }
          });
      });
    } else {
        console.error("Geolocation is not supported by this browser!");
    }

    if (this.shared) {
      this.registerdata['first_name'] = this.shared.first_name;
      this.registerdata['last_name'] = this.shared.last_name;
      this.registerdata['username'] = "";
      this.registerdata['email'] = this.shared.email_address;      
      this.registerdata['password'] = "";
      this.registerdata['referral_code'] = this.shared.referral_code;      
      localStorage.removeItem("invitation_id");
      localStorage.removeItem("invitation_status");
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.formLoadedFlag = true, 0);
  }


  /**
   * Signs in with fb
   */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.fbSignUp();
  }

  fbSignUp() {
    // Registration via facebook
    this.authService.authState.subscribe((user) => {
      this.registerdata['first_name'] = user.firstName;
      this.registerdata['last_name'] = user.lastName;
      this.registerdata['email'] = user.email;
      this.facebook_id = user.id;
    });
  }


	/**
   * Handles address change
   * @param place
   */
  public handleAddressChange(place) {

    setTimeout(function () {
    }, 3000);


    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    var location = place['geometry']['location'];
    /*this.registerdata = {
			lat:place.geometry.location.lat(),
			lng:place.geometry.location.lng(),
      address:place.formatted_address
		}*/
    this.registerdata['lat'] = place.geometry.location.lat();
    this.registerdata['lng'] = place.geometry.location.lng();
    this.registerdata['address'] = place.formatted_address;

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        if (addressType == 'locality') {
          this.registerdata['city'] = val;
        }

        if (addressType == 'administrative_area_level_1') {
          this.registerdata['state'] = val;
        }

        if (addressType == 'country') {
          this.registerdata['country'] = val;
        }

        if (addressType == 'postal_code') {
          this.registerdata['zipcode'] = val;
        }
      }
    }
  }


	/**
   * Registers function
   * @param values
   * @param validcheckm
   * @param frm_obj
   */
  public registerFunction(values, validcheckm, frm_obj) {
    /*if(validcheckm && values.age && values.terms){*/
    values.invitedByUser = this.invitedByUser;
    if (validcheckm && values.terms) {
      this.loginData = {
        email: values.email,
        password: values.password
      };
      this.commonservice.postHttpCall({ url: '/register-user', data: values }).then(result => this.registerSuccess(result, frm_obj));
    }
  }

  /**
   * Registers success
   * @param response
   * @param this_form
   */
  registerSuccess(response, this_form) {
    if (response.status == 1) {
      this.userdata = response.data;

      var postData = {
        'sender_id': this.userdata.user_id,
        'reciver_id': this.userdata.user_id,
        'pin_id': 0,
        'title': ' please complete your profile',
        'userEmailTemplateSlug': 'complet_profile',
        'show_in_todo': 1
      };

      if (this.userdata.user_type == 1) {
        postData['title'] = 'Your registration was successful. Create a Pin and get stuff done!';
        postData['link'] = 'pinner/account-settings';
        postData['todo_title'] = this.userdata.name + ', complete your profile so you can find the right Doer to help get stuff done!';
        postData['todo_link'] = 'pinner/account-settings';
        this.globalConstant.notificationSocket.emit('post-notification-user-registration', postData);

        if (this.invitedByUser) {
          var postNotificationData = {
            'sender_id': this.userdata.user_id,
            'reciver_id': atob(this.invitedByUser),
            'title': 'Your friend ' + this.userdata.name + ' accepted your invite to join us on PinDo!',
            'link': 'community/community-home',
            'show_in_todo': 0,
            /*'todo_title':'You’ve received a quote from Doer. Wait for more or hire now!',
            'todo_link': 'pinner/active-quotation-details/',*/
          };
          this.globalConstant.notificationSocket.emit('post-community-notification', postNotificationData);
        }

      }


      this.responseMessageSnackBar(response.msg);
      this_form.reset();
      this_form.submitted = false;
      // Swal({
      //     title: "Thank You for registering",
      //     text: '',
      //     type: 'success',
      //     showCancelButton: true,
      //     confirmButtonColor: '#bad141',
      //     cancelButtonColor: "#bad141",
      //     confirmButtonText: 'HOME',
      //     cancelButtonText: 'LOGIN'
      //     }).then((result) => {
      //       if (result.value) {
      //         this.router.navigate(['/']);
      //       } else {
      //         this.router.navigate(['/login']);
      //       }
      // })
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }

    if (response.status == 1) {
      this.loginAfterRegistration(this.loginData);
    }
  }

  /**
   * Bodys param
   * @param loginData
   */
  loginAfterRegistration(loginData) {
    this.commonservice.postHttpCall({ url: '/login', data: loginData }).then(result => this.loginSuccess(result));
  }

  loginSuccess(response) {

    console.log("PINNER RESPONSE= ",response);
    if (response.status == 1) {
      this.reg_class = 'alert alert-success';
      this.success_msg = response.message;

      //After Login //
      localStorage.setItem('frontend_user_id', btoa(response.data.id));
      localStorage.setItem('x-access-token', response.access_token);
      localStorage.setItem('frontend_token', response.token);
      localStorage.setItem('user_type', btoa(response.data.user_type));
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('user_first_name', response.data.first_name);
      localStorage.setItem('company_name', response.data.company_name);
      localStorage.setItem('user_name', response.data.username);
      localStorage.setItem('profile_type', btoa(response.data.profile_type));

      if (response.primary_address != null) {
        if (response.primary_address.address != null) {
          let formatted_address = response.primary_address.address + ' ' + response.primary_address.city + ', ' + response.primary_address.state + ' ' + response.primary_address.zipcode;
          this.commonservice.setHeaderAddress(formatted_address, response.primary_address.lat, response.primary_address.lng);
        } else {
          this.commonservice.getCurrentLocation();
        }

      } else {
        this.commonservice.getCurrentLocation();
      }

      this.globalConstant.userData = response.data;

      this.commonservice.islogin = 1;
      this.commonservice.countSessionTimeOut = 0;
      this.commonservice.changeFunction(this.commonservice.islogin);

      this.appService.user_type = response.data.user_type;

      if (response.data.user_type == '1') {
        if (response.data.redirected_to_profile_page) {
          this.router.navigate(['/pinner/dashboard']);
        }
        else {
          this.router.navigate(['/pinner/account-settings']);
        }
      } else {
        if (localStorage.getItem('slug')) {
          let tempSlug = localStorage.getItem('slug');
          localStorage.removeItem('slug');
          this.router.navigate(['/doer/apply-pins/' + tempSlug])
        }
        else {
          if (response.data.redirected_to_profile_page)
            this.router.navigate(['/doer/dashboard']);
          else
            this.router.navigate(['/doer/account-settings']);
        }
      }

      //Onesignal
      //this.oneSingalPush();
    }
    else {
      /*this.reg_class = "alert alert-danger";*/
      this.success_msg = response.message;
      this.responseMessageSnackBar(response.msg, 'error');
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

}