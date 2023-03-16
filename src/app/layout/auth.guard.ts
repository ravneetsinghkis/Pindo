import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		if (localStorage.getItem('frontend_token') && localStorage.getItem('frontend_user_id')) {

			const pindoroute = ['doer', 'pinner', 'notifications', 'community'];
			const spliturl = state.url.split('/');
			const currentslug = spliturl[1];
			// console.log('currentslug',currentslug);

			const user_type: any = atob(localStorage.getItem('user_type'));
			// console.log('user_type',user_type);
			if (user_type == '2') {

				if (jQuery.inArray(currentslug, pindoroute) !== -1 && (currentslug == 'doer' || currentslug == 'notifications')) {
					//return true;
				} else {
					this.router.navigate(['/doer/dashboard']);
				}

			} else {
				if (jQuery.inArray(currentslug, pindoroute) !== -1 && (currentslug == 'pinner' || currentslug == 'notifications' || currentslug == 'community')) {
					// return true;
				} else {
					this.router.navigate(['/pinner/dashboard']);
				}
			}

			// console.log(currentslug);
			return true;
		}
		// not logged in so redirect to login page with the return url
		this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
		//this.router.navigate(['/login']);
		return false;
	}

}

@Injectable()
export class NotAuthGuard implements CanActivate {

	constructor(private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (!localStorage.getItem('frontend_token') && !localStorage.getItem('frontend_user_id')) {
			// logged in so return true
			return true;
		}
		// not logged in so redirect to login page with the return url
		const total_url = state.url;
		const user_type = atob(localStorage.getItem('user_type'));

		// check user type for redirect
		if (user_type == '2') {
			if (total_url.includes('/public-pins') || total_url.includes('/services')) {
				return true;
			} else {
				this.router.navigate(['/doer/dashboard']);
			}
		} else {
			if (total_url.includes('/services')) {
				return true;
			}
			this.router.navigate(['/pinner/dashboard']);
		}


		return false;
	}
}
