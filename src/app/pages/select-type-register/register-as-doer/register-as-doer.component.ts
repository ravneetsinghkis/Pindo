import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonService } from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import { AppComponent } from '../../../app.component';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import Swal from 'sweetalert2';
declare var $: any;
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-register-as-doer',
	templateUrl: './register-as-doer.component.html',
	styleUrls: ['./register-as-doer.component.scss'],
	inputs: ['shared']
})
export class RegisterAsDoerComponent implements OnInit {
	@Input() shared;
	@Input() showPasswords;

	public userdata: any = {};
	public success_msg = '';
	public reg_class = '';
	public errorMsg = '';
	public registerdata = {};
	public color = 'primary';
	public mode = 'indeterminate';
	public value = 50;
	public referral_code_param = '';
	hide = true;
	facebook_id = '';
	invitedByUser: any = '';
	keepEmailInputReadOnly = false;
	public formLoadedFlag = false;
	loginData: any;
	environment: any = environment;

	constructor(
		private authService: AuthService,
		public snackBar: MatSnackBar,
		private route: ActivatedRoute,
		private router: Router,
		private appService: AppComponent,
		private titleService: Title,
		public commonservice: CommonService,
		public globalConstant: Globalconstant,
	) {
		// Change Page Title
		this.titleService.setTitle('Pindo | Doer Registration');
		window.scrollTo(0, 0);
		this.route.params.subscribe(params => {
			//console.log('fdsfsdf',params);
			if (params['reff_code'] && params['email']) {
				const reb64 = CryptoJS.enc.Hex.parse(params['reff_code']);
				const bytes = reb64.toString(CryptoJS.enc.Base64);
				const decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
				const plain = decrypt.toString(CryptoJS.enc.Utf8);
				this.invitedByUser = plain;
				console.log('FROM REGISTER DOER', params['reff_code'], params['email']);


				setTimeout(() => {
					const reb64 = CryptoJS.enc.Hex.parse(params['email']);
					const bytes = reb64.toString(CryptoJS.enc.Base64);
					const decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
					const plain = decrypt.toString(CryptoJS.enc.Utf8);
					this.registerdata['email'] = plain;
					this.keepEmailInputReadOnly = true;
				}, 500);
			}
		});
	}

	ngOnInit() {
		this.registerdata = {
			user_type: 2,
			is_volunteer: '',
			first_name: '',
			last_name: '',
			screen_name: '',
			username: '',
			email: '',
			password: '',
			conf_password: '',
			company_name: '',
			//age:false,
			terms: false,
			profile_type: '',
			referral_code: this.referral_code_param
		};

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

	volunteerChange() {
		// console.log(this.registerdata['volunteer']);
	}

	signInWithFB(): void {
		this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
		this.fbSignUp();
	}

	fbSignUp() {
		// Registration via facebook
		this.authService.authState.subscribe((user) => {
			console.log('user', user);
			this.registerdata['first_name'] = user.firstName;
			this.registerdata['last_name'] = user.lastName;
			this.registerdata['email'] = user.email;
			this.facebook_id = user.id;
			console.log('this.facebook_id', this.facebook_id);
		});
	}


	/**
	 * Registers function
	 * @param values
	 * @param validcheck
	 * @param frm_obj
	 */
	public registerFunction(values, validcheck, frm_obj) {
		// console.log("values= ", values, " validcheck= ", validcheck, " frm_obj= ", frm_obj);
		//if(validcheck && values.age && values.terms && values.profile_type){
		// console.log(values);


		if (validcheck && values.terms && values.profile_type) {
			// Admin doer register
			if (! this.showPasswords) {
				values.password = values.conf_password = this.generatePassword();
				values.is_admin_doer = 1;
			}

			this.loginData = {
				email: values.email,
				password: values.password
			};
			values.facebook_id = this.facebook_id;
			values.invitedByUser = this.invitedByUser;

			this.commonservice.postHttpCall({ url: '/register-service-provier', data: values }).then(result => this.registerSuccess(result, frm_obj, values.referral_code));
		}
	}

	registerSuccess(response, this_form, referral_code) {

		if (response.status == 1) {
			if (referral_code != '') {

				const postData: any = { 'referral_code': referral_code };
				this.globalConstant.notificationSocket.emit('post-email-notification-to-crew', postData);
			}
			this.userdata = response.data;

			// console.log(this.userdata.user_id);

			const postDataProfile = {
				'sender_id': this.userdata.user_id,
				'reciver_id': this.userdata.user_id,
				'pin_id': 0,
				'title': 'Your registration was successful. Create your profile so Pinners can find you.',
				'link': '/doer/account-settings',
				'show_in_todo': 1,
				//'todo_title': 'Complete your profile so Pinners can find you.',
				'todo_title': 'Your profile is not quite done. Complete your payment method so Pinners can find you!',
				'todo_link': '/doer/account-settings',
				'userEmailTemplateSlug': '',
				//'userEmailTemplateSlug': 'complet_profile',
			};


			// console.log(postDataProfile);

			this.globalConstant.notificationSocket.emit('post-notification-user-registration', postDataProfile);
			if (this.invitedByUser) {
				const postNotificationData = {
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
			this.responseMessageSnackBar(response.msg);
			this_form.reset();
			this_form.submitted = false;
			this.loginAfterRegistration(this.loginData);
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
			//       	this.router.navigate(['/login']);
			//       }
			// })
		} else {
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
				if (result.data.is_volunteer == 1) {
					if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || result.data.range_in_miles == null || result.services.length == 0) {
						this.profileCompletionAlertPopupVolunteer();
					}
				} else {
					if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || (result.data.accept_payment_by_bank == 0 && result.data.accept_payment_by_cards == 0 && result.data.accept_payment_by_cash == 0 && result.data.accept_payment_by_cheque == 0) || result.data.range_in_miles == null || result.data.admin_commission_charge_by == null || result.services.length == 0 || (result.data.stripe_customer_id == null && result.data.stripe_user_id == null)) {
						this.profileCompletionAlertPopupStandard();
					}
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
              <br/>
              <span style="font-weight: bold; text-decoration: underline;">To Quote and be Hired</span>
              <li>How Pinners Pay You: At least one selected (credit card, bank, cash, check)</li>
			  <li>How to Pay PinDo: Add credit card</li>
			  <li>How to Receive Electronic Payments: Add bank account</li>
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


	/**
	 * Logins after registration
	 * @param loginData
	 */
	loginAfterRegistration(loginData) {
		this.commonservice.postHttpCall({ url: '/login', data: loginData }).then(result => this.loginSuccess(result));
	}

	loginSuccess(response) {
		console.log('PINNER RESPONSE= ', response);
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
			// localStorage.setItem('user_id', response.data.id);

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
			// console.log(this.globalConstant.userData);

			this.commonservice.islogin = 1;
			this.commonservice.countSessionTimeOut = 0;
			this.commonservice.changeFunction(this.commonservice.islogin);

			this.appService.user_type = response.data.user_type;
			if (response.data.user_type == '1') {
				if (response.data.redirected_to_profile_page) {
					this.router.navigate(['/pinner/dashboard']);
				} else {
					this.router.navigate(['/pinner/account-settings']);
				}

			} else {
				if (localStorage.getItem('slug')) {
					const tempSlug = localStorage.getItem('slug');
					localStorage.removeItem('slug');
					this.router.navigate(['/doer/apply-pins/' + tempSlug]);
				} else {
					if (response.data.redirected_to_profile_page) {
						this.router.navigate(['/doer/dashboard']);
						this.getProfileDetails();
					} else {
						this.router.navigate(['/doer/account-settings']);
						this.getProfileDetails();
					}
				}
			}

			//Onesignal
			//this.oneSingalPush();
		} else {
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

	/**
	 * Generate random password
	 * @returns string
	 */
	generatePassword() {
		var buf = new Uint8Array(6);
		window.crypto.getRandomValues(buf);
		return btoa(String.fromCharCode.apply(null, buf));
	}

}
