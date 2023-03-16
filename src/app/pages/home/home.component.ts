import { Component, OnInit, AfterViewInit, Pipe, PipeTransform, ViewEncapsulation, HostListener, ElementRef, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../commonservice';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { Subject } from 'rxjs/Subject';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as CryptoJS from 'crypto-js';
// import { Globalconstant }           from './global_constant';
//import { Router } from '@angular/router';
//import { MatIconRegistry } from '@angular/material';

import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';
import { Globalconstant } from 'src/app/global_constant';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';

import { Meta } from "@angular/platform-browser";

declare var jQuery: any;
declare var $: any;
declare var Swiper: any;
declare var wow: any;
declare var WOW: any;

@Component({
	selector: 'home',
	templateUrl: 'home.html',
	styleUrls: ['./home.component.scss'],
	providers: [],
	animations: [
		trigger('scrollAnimation', [
			state('show', style({
				opacity: 1,
				transform: 'translateX(0)'
			})),
			state('hide', style({
				opacity: 0,
				transform: 'translateX(100%)'
			})),
			transition('show => hide', animate('700ms ease-out')),
			transition('hide => show', animate('700ms ease-in'))
		])
	]
})

export class HomeComponent implements OnInit {

	public limit = 3;
	public success_msg = '';
	public imagePath: any;
	state = 'hide';
	myControl: FormControl = new FormControl();
	options = [
		'One',
		'Two',
		'Three'
	];
	filteredOptions: Object;
	fieldval = '';

	categories = [];
	localDoersList: any = [];
	categoryList = [];

	swiperhero: any;
	selectedslideIndex: any = 1;

	searchTerm$ = new Subject<any>();
	homeSearchField: any;
	imageUrl_own: any = this.myGlobals.uploadUrl;
	placeholderText: any = 'Search';
	sliderautocomplete = 'herosliderpanel';
	benefitImageSrc = 'assets/images/local.svg';

	deviceInfo = null;
	isMob = false;


	//@ViewChild('howItworks') howItworks: ElementRef;
	constructor(
		private appService: AppComponent,
		private titleService: Title,
		public commonservice: CommonService,
		public dialog: MatDialog,
		private router: Router,
		public el: ElementRef,
		private route: ActivatedRoute,
		private deviceService: DeviceDetectorService,
		public myGlobals: Globalconstant,
		private meta: Meta
	) {
		this.getCategories();
		// Change Page Title
		this.titleService.setTitle('PinDo | Home');
		this.commonservice.homeSearch(this.searchTerm$, '/home-page-search-autocomplete?search=').subscribe((data) => {
			this.filteredOptions = data['data'];
		});
		//console.log(this.commonservice.myGlobals.imagepath)
		this.imagePath = this.commonservice.myGlobals.uploadUrl + '/categories';
		this.deviceInfo = this.deviceService.getDeviceInfo();
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		this.isMob = isMobile;
		const sendData = {
			url: '/get-local-doer-list',
			data: {}
		};
		this.commonservice.postHttpCall(sendData).then(res => {
			if (res.status == 1) {
				this.localDoersList = res.data;
				console.log('LOCAL DOER', res.data);
				setTimeout(function () {
					let localDoer_swiper = new Swiper('.home-localDoer-slider .swiper-container', {
						slidesPerView: 2,
						slidesPerColumn: 3,
						spaceBetween: 20,
						navigation: {
							nextEl: '.home-localDoer-slider .swiper-button-next',
							prevEl: '.home-localDoer-slider .swiper-button-prev',
						},
						breakpoints: {
							1199: {
								slidesPerView: 2,
								slidesPerColumn: 2,
							},
							991: {
								slidesPerView: 1,
								slidesPerColumn: 2,
							},
							767: {
								slidesPerView: 1,
								slidesPerColumn: 1,
								autoHeight: true,
							}
						}
					});
				}, 0);
			}
		});
	}

	// @HostListener('window:scroll', ['$event'])
	// checkScroll() {

	// const componentPosition = this.howItworks.nativeElement.offsetTop
	// const scrollPosition = window.pageYOffset

	// if (scrollPosition >= componentPosition) {
	// this.state = 'show'
	// } else {
	// this.state = 'hide'
	// }

	// }

	ngOnInit() {
		// SEO Tags
		this.meta.updateTag({property: "og:title", content: "PinDo"});
		this.meta.updateTag({name: "description", content: "Your One-Stop Shop to Get Stuff Done. Post Jobs. Connect Your Social Network. Find Customers. Available now in Fairfield."});
		this.meta.updateTag({property: "og:description", content: "Your One-Stop Shop to Get Stuff Done. Post Jobs. Connect Your Social Network. Find Customers. Available now in Fairfield."});

		//wow.init();
		// this.filteredOptions = this.myControl.valueChanges
		//      .pipe(
		//        startWith(''),
		//        map(val => val.length >= 1 ? this.filter(val): [])
		//      );

		this.route.params.subscribe(params => {
			//console.log('fdsfsdf',params);
			if (params['reff_code'] && params['email']) {
				const reb64 = CryptoJS.enc.Hex.parse(params['reff_code']);
				const bytes = reb64.toString(CryptoJS.enc.Base64);
				const decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
				const plain = decrypt.toString(CryptoJS.enc.Utf8);
				// this.invitedByUser = plain;

				setTimeout(() => {
					const reb64 = CryptoJS.enc.Hex.parse(params['email']);
					const bytes = reb64.toString(CryptoJS.enc.Base64);
					const decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
					const plain = decrypt.toString(CryptoJS.enc.Utf8);
					// this.registerdata['email'] = plain;
					// this.keepEmailInputReadOnly = true;
				}, 500);
			}
		});
	}

	openExtraCategories(rem, item) {
		console.log(rem, item);
		const dialogRef = this.dialog.open(ExcessCategoriesComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { list: rem, cat_name: item }
		});
		dialogRef.afterClosed().subscribe(result => {
		});

	}

	selectedVal(evt) {
		console.log(evt);
		localStorage.setItem('homesearch', JSON.stringify(evt));
		this.router.navigate(['/services']);
	}

	displayFn(user?: any): string | undefined {
		return user ? user.text : undefined;
	}

	initHeroSlider() {
		this.swiperhero = new Swiper('.heroSlider .swiper-container', {
			navigation: {
				nextEl: '.heroSlider .swiper-button-next',
				prevEl: '.heroSlider .swiper-button-prev',
			},
			speed: 700,
			loop: true,
			autoplay: {
				delay: 8000,
			}
		});

		this.swiperhero.on('slideChange', () => {
			//console.log('slide changed', this.swiperhero.activeIndex);
			if (this.swiperhero.activeIndex > this.categories.length) {
				this.swiperhero.activeIndex = 1;
			} else if (this.swiperhero.activeIndex == 0) {
				// this.swiperhero.activeIndex = this.categories.length;
			} else { }
			console.log('slide changed', this.swiperhero.activeIndex);
			//this.selectedslideIndex = this.swiperhero.activeIndex - 1;
			this.selectedslideIndex = this.swiperhero.activeIndex;

		});
	}

	getCategories() {
		//http://dev.uiplonline.com:4046/api/user/list-privacy
		this.commonservice.postHttpCall({ url: '/get-categories', contenttype: 'application/json' }).then(result => this.onGetCategoriesSuccess(result));
	}

	onGetCategoriesSuccess(result) {
		if (result.status == 1) {
			this.categories = result.data;
			setTimeout(() => {
				this.initHeroSlider();
			}, 0);
		}
	}

	gotoSlide(indexVal) {
		//console.log('index',indexVal);
		const userType = (localStorage.getItem('user_type')) ? atob(localStorage.getItem('user_type')) : null;
		console.log(userType);
		if (parseInt(userType) == 1) {
			this.commonservice.selectedCategoryFromHomepage = this.categories[indexVal]['id'];
			this.router.navigate(['/pinner/create-new-pin']);
		} else {
			//console.log('index plus',indexVal + 1);
			// this.swiperhero.slideTo(indexVal);
			// this.selectedslideIndex = indexVal;
			this.swiperhero.slideTo(indexVal + 1);
			this.selectedslideIndex = indexVal + 1;
		}
	}

	showautomplete() {

	}


	openstateDetection() {
		if (!($('.search_field').hasClass('gototop'))) {
			$('.search_field').addClass('gototop');
		}
	}

	closestateDetection() {
		if ($('.search_field').hasClass('gototop')) {
			$('.search_field').removeClass('gototop');
			this.myControl.patchValue('');
		}
	}

	openSearch(e) {
		//$(e.target).toggleClass('big');
		if (!($('.search_total').hasClass('big'))) {
			$('.search_total').addClass('big');
			this.placeholderText = 'Search Doers, Categories and Subcategories';
		}
	}

	closeSearch(e) {
		if ($('.search_total').hasClass('big')) {
			$('.search_total').removeClass('big');
			this.homeSearchField = '';
			this.filteredOptions = [];
			this.placeholderText = 'Search';
		}
	}

	activeBenefit(toActivate) {
		switch (toActivate) {
			case 'local':
				this.benefitImageSrc = 'assets/images/local.svg';
				break;
			case 'network':
				this.benefitImageSrc = 'assets/images/network-socially.svg';
				break;
			case 'secure':
				this.benefitImageSrc = 'assets/images/secure-payments.svg';
				break;
			case 'background':
				this.benefitImageSrc = 'assets/images/background-checks.svg';
				break;
			case 'you':
				this.benefitImageSrc = 'assets/images/you.svg';
				break;
			case 'merit':
				this.benefitImageSrc = 'assets/images/merit-based.svg';
				break;
		}
	}

	ngAfterViewInit() {
		//console.log(this.howItworks.nativeElement);
		/*var swiper = new Swiper('.rightHerosection .swiper-container', {
	      navigation: {
	        nextEl: '.leftHeroSection .swiper-button-next',
	        prevEl: '.leftHeroSection .swiper-button-prev',
	      },
	    });*/

		let swiperfeatured = new Swiper('.featured-section .swiper-container', {
			navigation: {
				nextEl: '.featured-section .swiper-button-next',
				prevEl: '.featured-section .swiper-button-prev',
			}
		});
		let swiperrecent = new Swiper('.rightRecentlyCompleted .swiper-container', {
			slidesPerView: 'auto',
			spaceBetween: 0,
			navigation: {
				nextEl: '.recentsliderarrows .swiper-button-next',
				prevEl: '.recentsliderarrows .swiper-button-prev',
			}
		});
		let swiperpress = new Swiper('.pressslider .swiper-container', {
			direction: 'vertical',
			slidesPerView: 1,
			spaceBetween: 30,
			navigation: {
				nextEl: '.pressslider .swiper-button-next',
				prevEl: '.pressslider .swiper-button-prev',
			}
		});

		// var swiperlocal = new Swiper('.localDoerSlider .swiper-container', {
		//   	direction: 'vertical',
		//   	slidesPerView: 4,
		// 	spaceBetween: 0,
		// 	navigation: {
		//         nextEl: '.localDoerSlider .swiper-button-next',
		//         prevEl: '.localDoerSlider .swiper-button-prev',
		//     },
		//     breakpoints: {
		//         991: {
		//           slidesPerView: 3,
		//           spaceBetween: 0,
		//         }
		//     }
		// });
	}
	goToRegister(type){
		localStorage.setItem('preselectedType', type);
		this.router.navigate(['register/']);
	}
}
