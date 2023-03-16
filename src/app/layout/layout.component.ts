import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonService } from '../commonservice';

declare var jQuery: any;
declare var $: any;
declare var window: any;

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html'
})
export class LayoutComponent {
	availWidth: Number;
	//inMobileView:boolean = false;
	inTabletView: boolean = false;
	openstateMobileMenu = false;
	//isMobile:boolean = false;
	onMobileView: boolean = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title,
		private deviceService: DeviceDetectorService,
		private commonService: CommonService
	) {
		//this.availWidth = screen.availWidth;
		/*if(this.availWidth<=767) {
			this.inMobileView = true;
		}*/
		this.getToken();
		//const isMobile = this.deviceService.isMobile();
		//const isTablet = this.deviceService.isTablet();

		// if(isMobile) {
		// 	this.inMobileView = true;
		// }
		// if(isTablet) {
		// 	this.inTabletView = true;
		// }
		//console.log(isMobile);
	}
	/**
	 * on init
	 */
	ngOnInit() {
		this.router.events
			.filter((event) => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.map((route) => {
				while (route.firstChild) route = route.firstChild;
				return route;
			})
			.filter((route) => route.outlet === 'primary')
			.mergeMap((route) => route.data)
			.subscribe((event) => {
				if (event['title']) {
					this.titleService.setTitle(event['title']);
				}
			} );
	}

	/**
	 * after view init
	 */
	ngAfterViewInit() {

		if ($(window).width() < 1200) {
			this.onMobileView = true;

		}

		$(window).resize(function () {

			if ($(window).width() < 1200) {
				this.onMobileView = true;
			}


		});

	}

	/**
	 * Displays state
	 */
	displayState() {
		//console.log('23423423');
	}

	/**
	 * Gets token
	 */
	getToken() {
		if (localStorage.getItem('frontend_user_id')) {
			this.commonService.firstTimeLoad = true;
			this.commonService.postHttpCall({ url: '/check-frontend-token', data: {}, contenttype: "application/json" }).then(result => this.ongetTokenSuccess(result));
		}
	}

	/**
	 * Ongets token success
	 * @param response
	 */
	ongetTokenSuccess(response) {
		if (response.status == 2) {
			this.commonService.firstTimeLoad = false;
			//this.commonService.csrf_token = response['csrf_token'];
		}
	}

	// ======= for burgerMenu  .burgerMenu =========
	/**
	 * Burgers menu toggle
	 */
	burgerMenuToggle() {
		jQuery('.burgerMenu').addClass('open');
		jQuery('.burgerMenu-overlay').addClass('show');
	}

	/**
	 * Overlays click
	 * @param overlay_el
	 */
	overlayClick(overlay_el) {
		var overlay_element = overlay_el;

		if (overlay_el = 'burgerMenu-overlay') {
			jQuery('.burgerMenu-overlay').removeClass('show');
			jQuery('.burgerMenu').removeClass('open');
		}

	}


}
