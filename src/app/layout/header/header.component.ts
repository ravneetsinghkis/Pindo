import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener, ElementRef, Renderer2, AfterViewChecked, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AppComponent } from '../../app.component';
import { URLSearchParams } from '@angular/http';
import { CommonService } from '../../commonservice';
import { Globalconstant } from '../../global_constant';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import * as CryptoJS from 'crypto-js';
//import { Globalconstant } 			from '../../global_constant';
declare var require: any;
declare var io: any;
declare var google: any;
import { MatIconRegistry } from '@angular/material';
import { CreateBlogComponent } from 'src/app/pages/community/blog-list/create-blog/create-blog.component';
import { Subscription } from 'rxjs';
declare var jQuery: any;
declare var $: any;
declare var window: any;


@Component({
	selector: 'app-header',
	templateUrl: './header.html',
	providers: [],

})
export class HeaderComponent implements OnInit {

	public siteSettingValue: any;
	public siteLogo = '';
	public fb_link = '';
	public twitter_link = '';
	public pinterest_link = '';
	public success_msg = '';
	public reg_class = '';
	//public errorMsg  = '';
	public notiData = [];
	public notiCount: any;
	@ViewChild('createBlogInfo') createBlogInfo: CreateBlogComponent;

	color = 'primary';
	mode = 'determinate';
	value = 0;
	bufferValue = 20;

	public rValue = 0;

	public detectHomePage: any = 1;
	public _islogin_ = false;
	createHost = require('cross-domain-storage/host');
	createGuest = require('cross-domain-storage/guest');
	baseUrl: any;
	userInfo = {};
	public notifyShow = false;
	public chatNotifyShow = false;
	public pinnerMsgCount = 0;
	public doerMsgCount = 0;

	pinnerAutocomplete = [];
	doerAutocomplete = [];

	checkIfFromSearch = false;
	checkIfFromDoerSearch = false;

	searchStringToSend: any;
	smallloaderVal = false;
	params_array = [];

	toggleFilterBool = false;
	current_url: any;
	@Output() onNavToggle = new EventEmitter();

	@Input() mobileNavState;
	environment: any = environment;

	logoutSubscription: Subscription;

	constructor(
		location: Location,
		public commonservice: CommonService,
		public appService: AppComponent,
		public commonService: CommonService,
		private router: Router,
		public matIconRegistry: MatIconRegistry,
		private renderer: Renderer2,
		public el: ElementRef,
		public globalconstant: Globalconstant,
		private dialog: MatDialog,
		private route: ActivatedRoute
	) {
		// console.log('Session timeout');
		// console.log('router url',location.path());
		this.current_url = location.path();
		this.populateUserData();
		let user_type = atob(localStorage.getItem('user_type'));

		/*if(localStorage.getItem('pindo_system_current_position_address')==null || localStorage.getItem('pindo_system_current_position_address')=='null') {
			localStorage.setItem('pindo_system_current_position_address',this.environment.defaultLocationAddress);
			localStorage.setItem('pindo_system_current_position_lat',this.environment.defaultLocationLat);
			localStorage.setItem('pindo_system_current_position_lng',this.environment.defaultLocationLng);
			this.commonService.addressHeader = {
				'formatted_address': this.environment.defaultLocationAddress
			}
			this.commonService.headeraddresslat = this.environment.defaultLocationLat;
			this.commonService.headeraddressLng = this.environment.defaultLocationLng;
		} else {
			this.commonService.addressHeader = {
				'formatted_address': localStorage.getItem('pindo_system_current_position_address')
			}
			this.commonService.headeraddresslat = localStorage.getItem('pindo_system_current_position_lat');
			this.commonService.headeraddressLng = localStorage.getItem('pindo_system_current_position_lng');
		}*/


		this.commonService.currentLoginValue.subscribe(value => {
			/*this.globalconstant.notificationSocket = io.connect(this.globalconstant.CHAT_URL + "/textNotification");
			this.globalconstant.notificationSocket.emit('joinNotificationRoom', "notificationRoom");
			this.globalconstant.notificationSocket.on("err", (res) => console.log(res));*/

			setTimeout(() => {
				this.getNotificationData();
			}, 1100);

			setTimeout(() => {
				this.getDoerHeaderMessage();
			}, 1200);

			setTimeout(() => {
				this.getPinnerHeaderMessage();
			}, 1300);
		});
		setTimeout(() => {
			let user_type = atob(localStorage.getItem('user_type'));

			if (user_type == '2') {

				this.globalconstant.notificationSocket.on('get-doer-notify-data', (res) => {

					this.getNotificationData();
				});

				this.globalconstant.notificationSocket.on('get-doer-header-message-notification', (res) => {
					this.getDoerHeaderMessage();
				});
			}

			if (user_type == '1') {
				this.globalconstant.notificationSocket.on('get-pinner-notify-data', (res) => {
					// console.log('get-pinner-notify-data');
					this.getNotificationData();
				});

				this.globalconstant.notificationSocket.on('get-pinner-header-message-notification', (res) => {
					this.getPinnerHeaderMessage();
				});
			}
		}, 1000);




		this.commonService.listen().subscribe((m: any) => {
			this.populateUserData();
		});

		this.commonService.listnerSessionTimeout().subscribe((m: any) => {
			// console.log('session timeout subscriber',m);
			if (m == 'Blocked') {
				this.openDialog('Blocked');
			} else {
				let show_session_expired_popup = sessionStorage.getItem("show_session_expired_popup");
				// console.log("show_session_expired_popup", show_session_expired_popup, commonService.islogin);
				if (show_session_expired_popup == '1' && commonService.islogin == 1) {
					this.openDialog('session');
				}
			}
			//this.commonService.listnerSessionTimeout().unsubscribe();
		});




		//this.oneSingalPush();

		/*var OneSignal = window.OneSignal || [];
		  console.log('OneSignal',OneSignal);
		  OneSignal.push(function() {
		    OneSignal.init({
		      appId: "b95f396e-4215-43c1-aa92-b0826c01e002",
		    });
		  });*/
		/*console.log(this.createHost);
		var storageHost = this.createHost([
			  {
				  origin: 'http://pindo.com',
				  allowedMethods: ['get', 'set', 'remove']
			  }
		  ]);

		var bazStorage = this.createGuest('http://pindo.com');
		//console.log(storageHost);
		bazStorage.set('aaaa', 'random', function(error, data) {
			 console.log(error,data);
		  });*/


		this.baseUrl = globalconstant.uploadUrl;

		if (localStorage.getItem('user_type')) {
			this.appService.user_type = atob(localStorage.getItem('user_type'));
			//  console.log("USER TYPE= ",this.appService.user_type);
		}
		if (localStorage.getItem('frontend_user_id') && localStorage.getItem('frontend_token')) {
			this.commonService.islogin = 1;
			this.commonService.changeFunction(this.commonService.islogin);
		}
		matIconRegistry.registerFontClassAlias('pindo-font', 'pf');
		router.events.forEach((event: NavigationEvent) => {
			//Before Navigation
			if (event instanceof NavigationStart) {

				this.value = 0;
				$('.total_loader').show();

				/*if(document.querySelectorAll('body')["0"].classList.contains('menu-open')) {
							 this.toggleMobileMenu();
				}  */

				if ($('.burgerMenu').hasClass('open')) {
					$('.burgerMenu').removeClass('open');
					$('.burgerMenu-overlay').removeClass('show');
				}

			}

			//After Navigation
			if (event instanceof NavigationEnd) {
				setTimeout(() => {
					this.value = 100;
				}, 3000);

				if (this.mobileNavState) {
					this.emitNavToggle();
				}
				//this.value = 0;
				let _eventUrl_: any = event.url;
				_eventUrl_ = _eventUrl_.split('/');

				// console.log('event.url',event.url);
				if (this.checkIfFromSearch) {
					this.commonService.filterPinnerSearch(this.searchStringToSend);
					this.checkIfFromSearch = false;
				}

				if (this.checkIfFromDoerSearch) {
					this.commonService.filterDoerSearch(this.searchStringToSend);
					this.checkIfFromDoerSearch = false;
				}

				if ((event.url == '/') || (event.url.includes('/public-pins')) || (event.url.includes('/services')) || (event.url.includes('/faq')) || (event.url.includes('/benefits')) || (event.url.includes('/how-it-works')) || (event.url.includes('/about-us')) || (event.url.includes('/terms-privacy')) || (event.url.includes('/covid19help')) || (event.url.includes('/press-center')) || (event.url.includes('/partnerinfo')) || (event.url.includes('/investor-relations')) || (event.url.includes('/pin-listing/')) || (event.url.includes('/support')) || (event.url.includes('/crew-membership'))) {
					// if(event.url == "/public-pins/apply-pins"){
					// 	this.detectHomePage = 0;
					// }
					// else
					this.detectHomePage = 1;
				} else if ((event.url.includes('/pinner/')) || (event.url.includes('/public/')) || (event.url.includes('/doer/')) || (event.url.includes('/notifications')) || (event.url.includes('/community')) || (event.url.includes('/blog-list')) || (event.url.includes('/blog-detail/'))) {
					// console.log("this.commonService.islogin = ",this.commonService.islogin);
					if ((event.url == '/blog-list' || (event.url.includes('/public/')) || (event.url.includes('/blog-detail/')) || (event.url.includes('/doer/'))) && this.commonService.islogin == 0) {
						// console.log("user_type=  ",user_type);
						this.detectHomePage = 1;
					} else {
						this.detectHomePage = 2;
					}
				} else if ((event.url.includes('/doer-details'))) {
					if ((event.url.includes('/invite-to-pin'))) {
						this.detectHomePage = 1;
					} else {
						this.detectHomePage = 1;
					}
				} else {
					this.detectHomePage = 3;
					if (event.url == '/login') {
						this._islogin_ = true;
					} else
						if (event.url == '/register') {
							this._islogin_ = false;
						}
					/*else if((event.url.includes("/help-center"))) {
						this.detectHomePage = 4;
					}*/
				}

				$('.total_loader').hide();
				this.userInfo = globalconstant.userData;
				window.scrollTo(0, 0);
      		}
		});

		//this.openDialog();
	}
	/**
	 * after view init
	 */
	ngAfterViewInit() {
		if (this.commonService.islogin == 1) {
			this.fetchUserPrimaryAddress();
		} else {
            this.commonService.getCurrentLocation();
		}



	}

	/**
	 * Fetchs user primary address
	 */
	fetchUserPrimaryAddress() {
		this.commonService.postHttpCall({ url: '/fetch-primary-address', data: {}, contenttype: 'application/json' }, this.smallloaderVal).then(result => this.fetcUserPrimaryAddressSuccess(result));
	}

	/**
	 * Fetcs user primary address success
	 * @param response
	 */
	fetcUserPrimaryAddressSuccess(response) {
		// console.log(response);
		if (response.status == 1 && response.data.address != null) {
			setTimeout(() => {
				let formatted_address = response.data.address + ' ' + response.data.city + ', ' + response.data.state + ' ' + response.data.zipcode;
				this.commonService.setHeaderAddress(formatted_address, response.data.lat, response.data.lng);
			}, 2000);
		} else {
		   this.commonService.getCurrentLocation();
		}
	}

	/**
	 * Searchs pin
	 * @param evt
	 */
	searchPin(evt) {
		let searchString = evt.target.value;
		let checkStringLen = searchString.split('');
		//if(checkStringLen.length>2) {
		this.smallloaderVal = true;
		//this.searchEnabled = true;
		if (this.appService.user_type == 1) {
			this.populateAutoCompletePinner(searchString);
		}
		//}
		/*else {
			this.smallloaderVal = false;
			this.searchEnabled = false;
			$('#mat-spinner').hide();
			this.pinnerAutocomplete = [];
		}*/
	}

	/**
	 * Onpopulates auto complete pinner success
	 * @param response
	 */
	onpopulateAutoCompletePinnerSuccess(response) {
		if (response.status == 1) {
			this.pinnerAutocomplete = response.data;
		}
		$('#mat-spinner-header').hide();
		//this.smallloaderVal = false;
	}

	/**
	 * Populates auto complete pinner
	 * @param searchStrng
	 */
	populateAutoCompletePinner(searchStrng) {
		$('#mat-spinner-header').show();
		setTimeout(() => {
			this.commonService.postHttpCall({ url: '/service-list-search-auotcomplete', data: { 'search_text': searchStrng }, contenttype: 'application/json' }, this.smallloaderVal).then(result => this.onpopulateAutoCompletePinnerSuccess(result));
		}, 500);
	}

	/**
	 * Populates string
	 * @param evt
	 */
	populateString(evt) {
		$('#searchField').val(evt.target.innerHTML);
		this.pinnerAutocomplete = [];
		this.router.navigate(['/services']);
		this.searchStringToSend = evt.target.innerHTML;
		this.checkIfFromSearch = true;
		//$('.searchIcon').trigger('click');
	}

	/**
	 * on destroy
	 */
	ngOnDestroy() {
		// alert('destroy header');

		if (this.logoutSubscription) {
			this.logoutSubscription.unsubscribe();
		}
	}

	/**
	   * populateString (on click from autocomplete for search by string)
	   *
	   * @param evt = event
	  */
	populateStringDoerSearch(evt, searchCriteria, searchval) {
		this.searchStringToSend = searchval;
		this.toggleFilterBool = false;

		if (searchCriteria == 'pins') {
			this.checkIfFromDoerSearch = true;
			this.router.navigate(['/public-pins']);
		} else {
			this.checkIfFromSearch = true;
			this.router.navigate(['/services']);
		}
	}

	/**
	   * populateAutocompleteList (on populate autocomplete for string search)
	   *
	   * @param search_text = search by text value
	*/
	populateAutocompleteList(search_text) {
		$('#mat-spinner-header').show();
		setTimeout(() => {
			this.commonService.postHttpCall({ url: '/public-pin-search-auotcomplete', data: { 'search_text': search_text }, contenttype: 'application/json' }, this.smallloaderVal).then((result) => this.populateAutocompletePinSuccess(result));
		}, 500);
	}

	/**
	   * populateAutocompletePin Success
	   *
	   * @param response = response data from api
	*/
	populateAutocompletePinSuccess(response) {
		if (response.status == 1) {
			this.doerAutocomplete = response.data;
			$('#mat-spinner-header').hide();
			setTimeout(() => {
				this.smallloaderVal = false;
			}, 1000);
			this.toggleFilterBool = true;
		}
	}

	/**
	   * getSearchedPins (keyup event for getting string to search by)
	   *
	   * @param evt = event
	*/
	getSearchedPins(evt) {
		if (evt.key === 'Enter') {
			/*$('#searchField').blur();
			$('.searchIcon').trigger('click');
			this.doerAutocomplete = [];*/
		}
		let total_string = evt.target.value;
		if (total_string.split('').length > 0) {
			//this.searchEnabled = true;
			this.smallloaderVal = true;
			this.toggleFilterBool = true;
			this.populateAutocompleteList(total_string);
		} else {
			//this.searchEnabled = false;
			this.doerAutocomplete = [];
			this.toggleFilterBool = false;
		}
	}

	/**
	 * Determines whether clicked outside on
	 * @param evt
	 */
	onClickedOutside(evt) {
		this.toggleFilterBool = false;
	}


	/**
	 * Opens dialog
	 * @param typeOfPopup
	 */
	openDialog(typeOfPopup) {
		let popup_width: any = '545px';
		this.dialog.open(CourseDialogComponent, {
			width: popup_width,
			disableClose: false,
			data: typeOfPopup
		});
	}

	/**
	 * Gets doer header message
	 */
	getDoerHeaderMessage() {
		let postData = { 'reciver_id': atob(localStorage.getItem('frontend_user_id')) };
		let socketCallFlug = 1;
		// if (socketCallFlug == 1) {
			this.globalconstant.notificationSocket.emit('post-doer-header-msg-count', postData);
			this.globalconstant.notificationSocket.on('get-doer-header-msg-count', (response) => {
				if (response.count != 0) {
					this.doerMsgCount = response.count;
				} else {
					this.doerMsgCount = 0;
				}

				socketCallFlug = 0;
			});
		// }
	}

	/**
	 * Gets pinner header message
	 */
	getPinnerHeaderMessage() {
		let postData = { 'reciver_id': atob(localStorage.getItem('frontend_user_id')) };

		this.globalconstant.notificationSocket.emit('post-pinner-header-msg-count', postData);
		this.globalconstant.notificationSocket.on('get-pinner-header-msg-count', (response) => {
			if (response.count != 0) {
				this.pinnerMsgCount = response.count;
			} else {
				this.pinnerMsgCount = 0;
			}
		});
		//this.globalconstant.notificationSocket.removeListener();
	}



	/**
	 * Gets notification data
	 */
	getNotificationData() {
		let frontend_token = localStorage.getItem('frontend_token');
		let postData = { 'access_token': frontend_token };

		let socketCall = 1;
		if (socketCall == 1) {
			this.globalconstant.notificationSocket.emit('post-doer-notification-data', postData);
			this.globalconstant.notificationSocket.on('get-doer-notification-data', (response) => {
				if (response.status == 1) {
					//console.log(response)
					this.notiCount = response.data.count;
					this.notiData = response.data.rows;
					this.notifyShow = true;
					socketCall = 0;
				}
				if (this.notiCount == 0) {
					this.notifyShow = false;
				}
			});
		}
	}

	/**
	 * Shows notification
	 * @param id
	 * @param link
	 */
	showNotification(id, link) {

		let frontend_token = localStorage.getItem('frontend_token');
		let postData = { 'access_token': frontend_token, 'notify_id': id };

		let socketCall = 1;
		if (socketCall == 1) {
			this.globalconstant.notificationSocket.emit('update-doer-notification-data', postData);
			this.globalconstant.notificationSocket.on('get-update-doer-notification-data', (response) => {
				socketCall = 0;
			});
		}
		this.getNotificationData();
		this.router.navigate([link]);
	}

	/**
	 * Shows noti
	 */
	showNoti() {
		this.notifyShow = false;
	}

	/**
	 * Update all notification seen
	 */
	updateNotiSeen() {
		let frontend_token = localStorage.getItem('frontend_token');
		let postData = { 'access_token': frontend_token };

		let socketCall = 1;
		if (socketCall == 1) {
			this.globalconstant.notificationSocket.emit('post-doer-notification-data-seencount', postData);
			this.globalconstant.notificationSocket.on('get-doer-notification-data-seencount', (response) => {
				console.log();
				if (response.status == 1) {
					//console.log(response)
					this.notiCount = response.data.count;
					this.notiData = response.data.rows;
					this.notifyShow = true;
					socketCall = 0;
				}
				if (this.notiCount == 0) {
					this.notifyShow = false;
				}
			});
		}
	}

	/**
	 * Receives message
	 * @param $event
	 */
	receiveMessage($event) {
		alert('receiveMessage');
	}

	/**
	 * Populates user data
	 */
	populateUserData() {
		this.smallloaderVal = false;
		this.commonService.postHttpCall({ url: '/get-user-profile', data: {}, contenttype: 'application/json' }).then(result => this.onpopulateUserData(result));
	}

	/**
	 * Onpopulates user data
	 * @param response
	 */
	onpopulateUserData(response) {
		if (response.status) {
			this.globalconstant.userData = response.data;
			this.userInfo = response.data;
		}
	}

	/**
	 * Loads site setting value
	 */
	public loadSiteSettingValue() {

		let postData = { 'name': 'partha' };
		//this.commonService.postHttpCall({url:'/register-user', data:postData}).then(result=>this.SiteSetting(result));
	}

	/**
	 * Sites setting
	 * @param response
	 */
	SiteSetting(response) {
		if (response.status == 1) {
			//this.allItemsData = response.data;
		} else {
			this.reg_class = 'alert alert-danger';
			this.success_msg = response.msg;
		}
	}

	@HostListener('window:scroll')
	headerScroll() {
		//console.log(this.el);
		if (this.el.nativeElement.querySelector('header') != null) {
			const componentPosition = this.el.nativeElement.querySelector('header').offsetHeight;
			const scrollPosition = window.pageYOffset;
			if (scrollPosition > componentPosition) {
				this.renderer.addClass(this.el.nativeElement.querySelector('header'), 'smallHeader');
			} else {
				this.renderer.removeClass(this.el.nativeElement.querySelector('header'), 'smallHeader');
			}
		}

	}

	/**
	 * on init
	 */
	ngOnInit() {
		setTimeout(() => {
			this.params_array = this.router.url.split('/');
			if (this.params_array[2] && this.params_array[3]) {
				this.detectHomePage = 1;
			}
		}, 500);

		this.loadSiteSettingValue();

		this.logoutSubscription = this.commonService.logoutHandler.subscribe(data => {
			if (data) {
				this.logout();
			}
		});
	}

	onClickRegister() {
		if (this.params_array[2] && this.params_array[3]) {
			this.router.navigate(['/register/' + this.params_array[2] + '/' + this.params_array[3]]);
		} else {
			this.router.navigate(['/register']);
		}
	}

	/**
	 * Logouts header component
	 */
	logout() {
		this.commonservice._listnerForLogoutClickedData(true);
		this.smallloaderVal = false;
		this.commonService.postHttpCall({ url: '/logout', data: {}, contenttype: 'application/json' }).then(result => this.sucessLogOut(result));
	}

	/**
	 * Sucess log out
	 * @param response
	 */
	sucessLogOut(response) {
		// console.log(response);
		if (response.status == 1) {
			localStorage.removeItem('frontend_user_id');
			localStorage.removeItem('frontend_token');
			localStorage.removeItem('user_type');
			localStorage.removeItem('x-access-token');

			localStorage.removeItem('pindo_system_current_position_address');
			localStorage.removeItem('pindo_system_current_position_lat');
			localStorage.removeItem('pindo_system_current_position_lng');

			localStorage.removeItem('company_name');
			localStorage.removeItem('name');
			localStorage.removeItem('profile_type');
			localStorage.removeItem('user_first_name');
			localStorage.removeItem('user_name');
			localStorage.removeItem('is_volunteer');
			localStorage.removeItem('request_payment_init');

			localStorage.removeItem('profile_activate_id');
			localStorage.removeItem('admin_create_doer');

			this.commonService.getCurrentLocation();
			this.appService.user_type = '';
			this.commonService.islogin = 0;
			this.router.navigate(['/']);
		}
	}


	/**
	 * One singal push of header component
	 */
	oneSingalPush = () => {

		let that = this;
		let is_notification_enabled = 0;

		setTimeout(() => {
			let onesignal_initailized = 0;
			//if(onesignal_initailized==0)
			{
				var OneSignal = window['OneSignal'] || [];
			}

			/*if(OneSignal=='Initialized'){
				onesignal_initailized = 1;
			}*/

			OneSignal.isPushNotificationsEnabled(function (isEnabled) {
				if (isEnabled) {
					is_notification_enabled = 1;

					// user has subscribed
					OneSignal.getUserId(function (userId) {

						localStorage.setItem('playerid', userId);
						this.smallloaderVal = false;
						// Make a POST call to your server with the user ID
						that.commonService.postHttpCall({ url: '/save-player-id', data: { 'player_id': localStorage.getItem('playerid') }, contenttype: 'application/json' }).then(result => that.savePlayerIdSuccess(result));
					});
				}
			});

			if (is_notification_enabled == 0) {

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

							this.smallloaderVal = false;
							that.commonService.postHttpCall({ url: '/save-player-id', data: { 'player_id': localStorage.getItem('playerid') }, contenttype: 'application/json' }).then(result => that.savePlayerIdSuccess(result));
						});
					});
				});
			}
		}, 1000);

	}

	/**
	 * Saves player id success
	 * @param response
	 */
	savePlayerIdSuccess(response) {
	}


	/**
	 * Save player id in db of header component
	 */
	savePlayerIdInDB = (playerid) => {
		this.smallloaderVal = false;
		this.commonService.postHttpCall({ url: '/save-player-id', data: { 'player_id': localStorage.getItem('playerid') } }).then(result => this.savePlayerIdSuccess(result));
	}


	/**
	 * Toggles mobile menu
	 */
	toggleMobileMenu() {
		$('body').toggleClass('menu-open');
	}

	/**
	 * Emits nav toggle
	 */
	emitNavToggle() {
		this.onNavToggle.emit(true);
	}

	/**
	 * Toggles parent popup
	 * @param profileSlug
	 */
	toggleParentPopup(profileSlug) {
		if (profileSlug === 'CreateBlogComponent') {
			this.createBlogInfo.togglePopup();
		}
	}

	// ======= for burgerMenu  .burgerMenu =========

	/**
	 * Burgers menu toggle
	 */
	burgerMenuToggle() {
		if ($('.burgerMenu').hasClass('open')) {
			$('.burgerMenu').removeClass('open');
			$('.burgerMenu-overlay').removeClass('show');
		} else {
			$('.burgerMenu').addClass('open');
			$('.burgerMenu-overlay').addClass('show');
		}
	}

	/**
	 * Overlays click
	 * @param overlay_el
	 */
	overlayClick(overlay_el) {
		let overlay_element = overlay_el;

		if (overlay_el = 'burgerMenu-overlay') {
			$('.burgerMenu-overlay').removeClass('show');
			$('.burgerMenu').removeClass('open');
		}

	}

}
