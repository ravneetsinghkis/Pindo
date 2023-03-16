import { Component, AfterViewInit } from '@angular/core';
import {
	FormGroup, AbstractControl,
	FormBuilder, Validators, EmailValidator
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { Title } from '@angular/platform-browser';
import { Globalconstant } from '../../global_constant';
import { CommonService } from '../../commonservice';

declare var $: any;

@Component({
	selector: 'register',
	templateUrl: 'register.html'
})
export class RegisterComponent {

	public userdata: any = {};
	public success_msg = '';
	public reg_class = '';
	public errorMsg = '';
	public registerdata = {};
	public formLoadedFlag = false;

	constructor(
		private router: Router,
		private appService: AppComponent,
		private titleService: Title,
		private commonService: CommonService,
		public gbConstant: Globalconstant
	) {
		// Change Page Title
		this.titleService.setTitle('Pindo | Register');
	}

	ngOnInit() {
		this.registerdata = {
			user_type: 1,
			first_name: '',
			last_name: '',
			screen_name: '',
			email: '',
			address: '',
			city: '',
			state: '',
			country: '',
			zipcode: '',
			password: '',
			con_password: '',
			lat: '',
			lng: '',
		};
	}
	ngAfterViewInit() {
		setTimeout(() => this.formLoadedFlag = true, 0);
	}

	public handleAddressChange(place) {

		setTimeout(function () {
			console.log(place);
		}, 3000);


		const componentForm = {
			street_number: 'short_name',
			route: 'long_name',
			locality: 'long_name',
			administrative_area_level_1: 'long_name',
			country: 'long_name',
			postal_code: 'short_name'
		};

		const location = place['geometry']['location'];
		/*this.registerdata = {
			lat:place.geometry.location.lat(),
			lng:place.geometry.location.lng(),
						address:place.formatted_address
		}*/
		this.registerdata['lat'] = place.geometry.location.lat();
		this.registerdata['lng'] = place.geometry.location.lng();
		this.registerdata['address'] = place.formatted_address;

		for (let i = 0; i < place.address_components.length; i++) {
			const addressType = place.address_components[i].types[0];
			if (componentForm[addressType]) {
				const val = place.address_components[i][componentForm[addressType]];
				console.log(val, addressType);
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

	public registerFunction(values, validcheck) {
		if (validcheck) {

			this.commonService.postHttpCall({ url: '/register-user', data: values }).then(result => this.registerSuccess(result));
		}
	}

	registerSuccess(response) {

		if (response.status == 1) {
			this.userdata = response.data;
			this.reg_class = 'alert alert-success';
			this.success_msg = response.message;
		} else {
			this.reg_class = 'alert alert-danger';
			this.success_msg = response.message;
		}
	}
}
