import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { CommonService } from '../../commonservice';

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-footer',
	templateUrl: './footer.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	public detectHomePage = 1;
	
	version: any = 'v2.4.5';

	current_year = new Date().getFullYear();
	footerInfo = [];

	constructor(private appServices: AppComponent, private router: Router, private commonService: CommonService,) {
		this.getFooterInfo();
		router.events.forEach((event: NavigationEvent) => {

			//Before Navigation
			if (event instanceof NavigationStart) {

			}

			//After Navigation
			if (event instanceof NavigationEnd) {
				// console.log(event.url);
				if ((event.url == '/') || (event.url.includes('/faq')) || (event.url.includes('/benefits'))
					|| (event.url.includes('/privacy')) || (event.url.includes('/customerinfo')) || (event.url.includes('/pin-listing/')) || (event.url.includes('/serviceproviderinfo')) || (event.url.includes('/partnerinfo')) || (event.url.includes('/how-it-works')) || (event.url.includes('/about-us')) || (event.url.includes('/press-center')) || (event.url.includes('/investor-relations')) || (event.url.includes('/covid19help'))) {

					if ((event.url.includes("/public-pins/apply-pins/"))) {
						this.detectHomePage = 0;
					}
					else
						this.detectHomePage = 1;
				}
				else if ((event.url == '/pinner/chat') || (event.url.includes("doer/chat")) || (event.url.includes("/login")) || (event.url.includes("/blog-list")) || (event.url.includes("/blog-detail")) || (event.url.includes("/support"))) {
					this.detectHomePage = 2;
				}
				else if (event.url == '/doer-details') {
					this.detectHomePage = 5;
				}
				else if (event.url.includes("/help-center")) {
					this.detectHomePage = 3;
				}
				else
					this.detectHomePage = 2;

			}
		});
	}

	/**
	 * Gets footer info
	 */
	getFooterInfo() {
		this.commonService.postHttpCall({ url: '/get-footer-contact-details', contenttype: "application/json" }).then(result => this.ongetFooterInfoSuccess(result));
	}

	/**
	 * Ongets footer info success
	 * @param response
	 */
	ongetFooterInfoSuccess(response) {
		if (response.status == 1) {
			this.footerInfo = response.data;
		}
	}

	/**
	 * on init
	 */
	ngOnInit() {

	}
}
