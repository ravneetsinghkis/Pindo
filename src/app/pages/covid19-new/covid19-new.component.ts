import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';
import { MatDialog, MatSnackBar } from '@angular/material';
declare var Swiper: any;
import { ChooseLoginStatus } from 'src/app/shared/choose-login-status/choose-login-status.component';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { RestrictUserModalComponent } from './restrict-user-modal/restrict-user-modal.component';
import { QuickRegistrationComponent } from './quick-registration/quick-registration.component';
import { AppComponent } from 'src/app/app.component';

import Swal from 'sweetalert2';
import { Title, Meta } from '@angular/platform-browser';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';

@Component({
  selector: 'app-covid19-new',
  templateUrl: './covid19-new.component.html',
  styleUrls: ['./covid19-new.component.scss']
})
export class Covid19NewComponent implements OnInit {

  swiperCovidslider1: any;
  swiperCovidslider2: any;

  pinList = [];
  pageCount = 1;
  pinLimit = 3;
  totalPinCount: number;

  rad = 30;
  cityField = '';
  zipField = '';
  baseUrl: string;
  imageUrl_own: string;

  selectedPin: any;
  localDoersList: any = [];
  adBanners: any = [];

  @ViewChild('pinDetails')
  pinDetails;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonservice: CommonService,
    public globalconstant: Globalconstant,
    private dialog: MatDialog,
    private appService: AppComponent,
    public snackBar: MatSnackBar,
    private titleService: Title,
    private meta: Meta
  ) {
    this.baseUrl = this.imageUrl_own = globalconstant.uploadUrl;
  }

  scrollToTop() {
    (function smoothscroll() { const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
      }
    })();
  }

  ngOnInit() {
		// SEO Tags
    this.titleService.setTitle('PinDo | Home');
		this.meta.updateTag({
      property: "og:title",
      content: "PinDo"
    });
		this.meta.updateTag({
      name: "description",
      content: "Your One-Stop Shop to Get Stuff Done. Post Jobs. Connect Your Social Network. Find Customers. Available now in Fairfield."
    });
		this.meta.updateTag({
      property: "og:description",
      content: "Your One-Stop Shop to Get Stuff Done. Post Jobs. Connect Your Social Network. Find Customers. Available now in Fairfield."
    });

    this.initCovidSlider1();
    this.initCovidSlider2();
    this.getLocalDoerList();
    this.getPublicPins();
    this.getAds();
    this.magageAdminDoerRegister();
  }

  initCovidSlider1() {
		this.swiperCovidslider1 = new Swiper('.home-localDoer-slider .swiper-container', {
      slidesPerView: 2,
      //slidesPerColumn: 2,
      spaceBetween: 30,
      navigation: {
        nextEl: '.home-localDoer-slider .home-localDoer-slider-next',
        prevEl: '.home-localDoer-slider .home-localDoer-slider-prev',
      },
      breakpoints: {
        1199: {
          slidesPerView: 2,
          //slidesPerColumn: 2,
        },
        991: {
          slidesPerView: 1,
          //slidesPerColumn: 2,
        },
        767: {
          slidesPerView: 1,
          //slidesPerColumn: 1,
          autoHeight: true,
        }
      }
		});
  }

  initCovidSlider2() {
		this.swiperCovidslider2 = new Swiper('.heroSlider .swiper-container', {
      autoHeight: true,
      speed: 700,
      loop: true,
      pagination: {
        el: '.heroSlider .swiper-pagination',
        clickable: true,
      },
			autoplay: {
				delay: 8000,
			}
		});
  }

  getFilterList() {
    let finalObjtoSend = {
      'lat'                  : localStorage.getItem('pindo_system_current_position_lat') || 'null',
      'long'                 : localStorage.getItem('pindo_system_current_position_lng') || 'null',
      'city'                 : this.cityField,
      'zipCode'              : this.zipField,
      'selectedCategoryIds'  : [],
      'selectedSubCatsValues': [],
      'miles'                : this.rad
    };
    return finalObjtoSend;
  }

  getPublicPins() {
    let tosendObj = this.getFilterList();

    this.commonservice.postHttpCall({
      url: '/public-pins',
      data: {
        'page'       : this.pageCount,
        'limit'      : this.pinLimit,
        'search_text': '',
        'filterList' : tosendObj
      },
      contenttype: 'application/json'
    })
    .then((result) => this.populatePinSuccess(result));
  }

  /**
   * populatePin Success function
   *
   * @param response = response from api
   *
  */
  populatePinSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.pinList = [];
      }

      this.totalPinCount = response.data.total_items;

      if (response.data.public_pins.length) {
        this.pinList.push(...response.data.public_pins);
      }
    }
  }

  /**
   * View more public pins
   */
  viewMorePins() {
    if (this.pinList.length < this.totalPinCount) {
      this.pageCount = this.pageCount + 1;
      this.getPublicPins();
    }
  }

  getAddLink(addressLink) {
    if (addressLink != null) {
      let tempaddress = addressLink;
      let address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
      return tempaddress;
    }
  }

  /**getLoginStatus
   * formatLabel
   *
   * @param elm = search input field reference
   *
  */
  getLoginStatus() {
    if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '2') {
      return 2;
    } else if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '1') {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * toggleChildPopup open dialog of angular material
   *
   * @param indexVal = index to search by in pinList[]
   *
  */
  toggleChildPopup(indexVal) {
    this.selectedPin = this.pinList[indexVal].slug;
    this.pinDetails.togglePopup(this.selectedPin);
  }

  /**
   * openDialog open dialog of angular material
   *
   * @param indexVal = doer Id
   *
  */
  openDialog(indexVal, slug = '') {
    //console.log('asdasd',indexVal);
    if (slug != '') {
      localStorage.setItem('slug', slug);
    }
    this.dialog.open(ChooseLoginStatus, {
      width: '650px',
      disableClose: false,
      data: indexVal
    }).afterClosed().subscribe(res => {
      this.getPublicPins();
    });
  }

  /**
   * Get Local Doer List
   */
  getLocalDoerList() {
		const sendData = {
			url: '/get-local-doer-list',
			data: {}
    };

		this.commonservice.postHttpCall(sendData).then(res => {
			if (res.status == 1) {
				this.localDoersList = res.data;

				setTimeout( () => {
					let localDoer_swiper = new Swiper('.home-localDoer-slider .home-swiper-container', {
						slidesPerView: 2,
						slidesPerColumn: 1,
            spaceBetween: 20,
						navigation: {
							nextEl: '.home-localDoer-slider .home-localDoer-slider-next',
							prevEl: '.home-localDoer-slider .home-localDoer-slider-prev',
						},
						breakpoints: {
							1199: {
								slidesPerView: 2,
								slidesPerColumn: 1,
							},
							991: {
								slidesPerView: 1,
								slidesPerColumn: 1,
							},
							767: {
								slidesPerView: 1,
								slidesPerColumn: 1,
								autoHeight: false,
							}
						}
          });
        }, 100);

        setTimeout(() => {
          this.commonservice.initBadgeSlider();
        }, 1000);

			}
		});
  }

  /**
   * Open Extra Categories
   * @param rem string
   * @param item string
   */
	openExtraCategories(rem, item) {
		const dialogRef = this.dialog.open(ExcessCategoriesComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { list: rem, cat_name: item }
    });

		dialogRef.afterClosed().subscribe(result => {
		});
  }

  /**
   * Register As Pinner
   */
  registerAsPinner(user_type: number) {
    let loginStatus = this.getLoginStatus();

    if (loginStatus == 0) {
      // this.openRegistrationModal(user_type);
      this.router.navigate(["/create-pin"]);
    } else if (loginStatus == 1) {
      this.router.navigate(["/pinner/create-new-pin"]);
    } else if (loginStatus == 2) {
      this.restrictUser(loginStatus);
    }
  }

  /**
   * Register As Doer
   */
  registerAsDoer(user_type: number) {
    let loginStatus = this.getLoginStatus();

    if (loginStatus == 0) {
      // this.openRegistrationModal(user_type);
      this.router.navigate(["/account-settings"]);
    } else if (loginStatus == 1) {
      this.restrictUser(loginStatus);
    } else if (loginStatus == 2) {
      this.router.navigate(["/doer/account-settings"]);
    }
  }

  /**
   * Restrict User
   * @param user_type number
   */
  restrictUser(user_type) {
    let content = user_type == 1 ? "Sorry, this function is currently only available for Doers." : "Sorry, this function is currently only available for Pinners.";

    this.dialog.open(RestrictUserModalComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { content: content }
		});
  }

  /**
   * Show remaining categories
   * @param categories object
   */
  showMoreCats(categories: any) {
    this.dialog.open(AllCategoriesDialogComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { categories: categories }
		});
  }

  getAds() {
		const sendData = {
			url: '/all-ads',
			data: {}
    };

		this.commonservice.getHttpCall(sendData).then(res => {
      if (res.status) {
        this.adBanners = res.data;

        setTimeout( () => {
					let localDoer_swiper = new Swiper('.heroSlider .swiper-container', {
            autoHeight: true,
            speed: 700,
            loop: true,
            pagination: {
              el: '.heroSlider .swiper-pagination',
              clickable: true,
            },
            autoplay: {
              delay: 8000,
            }
          });
        }, 100);
      }
    });
  }

  magageAdminDoerRegister() {
    this.route.queryParams.subscribe(params => {
      // Admin Create Doer
      if (params.admin_create_doer) {
        localStorage.setItem('admin_create_doer', '1');
				this.router.navigate(['/register']);
      }
    });
  }

}
