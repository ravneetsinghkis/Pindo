import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { CommonService } from '../../../commonservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { AddBankComponent } from './add-bank/add-bank.component';
import { MatSnackBar } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CreditCardValidator } from 'angular-cc-library';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Router } from '@angular/router';

const moment = _rollupMoment || _moment;
declare var jQuery: any;
declare var $: any;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
	parse: {
		dateInput: 'YYYY-MM-DD',
	},
	display: {
		dateInput: 'LL',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};
class Country {
	name: string;
	iso_2: string;
	currency: string;
}

@Component({
	selector: 'app-doer-payment-settings',
	templateUrl: './doer-payment-settings.component.html',
	styleUrls: ['./doer-payment-settings.component.css']
})
export class DoerPaymentSettingsComponent implements OnInit, AfterViewInit {

	@ViewChild('addBank') private addBank: AddBankComponent;

	@ViewChild('popupref') popupref;

	ifBanksExist: boolean = false;
	startDate = new Date();
	banks_form: FormGroup;
	isformSubmitted: boolean = false;
	addBankshow: boolean = false;
	options: any = [];
	types: any = [
		{ value: 'individual', viewValue: 'Individual' },
		{ value: 'company', viewValue: 'company' }
	];
	address_p: any = [];
	imgUrl = '';
	imageObj: any;

	countries: Observable<Country[]>;

	constructor(
		public titleService: Title, 
		public commonservice: CommonService, 
		public renderer: Renderer2, 
		public el: ElementRef, 
		private _fb: FormBuilder, 
		public snackBar: MatSnackBar,
		private router: Router
	) {
		this.titleService.setTitle('Payment Settings');
	}

	/**
	 * on init
	 */
	ngOnInit() {
		this.commonservice.postHttpCall({ url: '/stripe-countries-listing', contenttype: "application/json" }).then(result => this.populateSuccess(result));
		this.banks_form = this._fb.group({
			// country: ['US', Validators.required],
			// email: ['', Validators.required],
			// dob: ['', Validators.required],
			first_name: ['', Validators.required],
			last_name: '',
			type: ['individual', Validators.required],
			// address: this._fb.group({
			// 	line1: ['', Validators.required],
			// 	postal_code: ['', Validators.required],
			// 	city: ['', Validators.required],
			// 	state: ['', Validators.required],
			// }),
			ssn_last_4: ['', Validators.required],
			currency: '$',
			routing_number: ['', Validators.required],
			account_number: ['', Validators.required],
			// imgUrl: ['', Validators.required]
		});

		//Get Bank details
		this.getBankDetails();
	}

	/**
	 * after view init
	 */
	ngAfterViewInit() {
		this.ifBanksExist = true;
	}

	/**
	 * Gets bank details
	 */
	getBankDetails() {
		this.commonservice.postHttpCall({ url: '/doers/get-bank-details', data: {}, contenttype: "application/json" }).then(result => this.bankDetailsSuccess(result));
	}

	/**
	 * Banks details success
	 * @param response 
	 */
	bankDetailsSuccess(response) {
		console.log('bankDetailsSuccess', response);
		let bank_details = response.data;
		// console.log(this.banks_form);

		if (!bank_details) {
			return;
		}

		this.banks_form.patchValue({
			// country: bank_details.country_code,
			// email: bank_details.email,
			// dob: bank_details.dob,
			first_name: bank_details.first_name,
			last_name: bank_details.last_name,
			//type: bank_details,
			// address: {
			// 	line1: bank_details.address_line,
			// 	postal_code: bank_details.post_code,
			// 	city: bank_details.city,
			// 	state: bank_details.state
			// },
			ssn_last_4: bank_details.ssn_last,
			//currency: '$',
			routing_number: bank_details.routing_number,
			account_number: bank_details.account_number,
		});
	}

	/**
	 * Determines whether delete on
	 * @param e 
	 */
	onDelete(e) {
		console.log(e);
		this.imageObj = '';
	}

	/**
	 * Accpts file
	 * @param e 
	 */
	accptFile(e) {
		console.log(e);
		this.imageObj = e.target.files[0];
		this.imgUrl = '';
	}

	get f() { return this.banks_form.controls; }

	get addressController() { return this.banks_form.controls.address['controls']; }

	/**
	 * Populates success
	 * @param response 
	 */
	populateSuccess(response) {
		if (response.status == 1) {
			this.countries = JSON.parse(JSON.stringify(response.data));
		}
	}


	/**
	 * Determines whether submit on
	 * @param form 
	 */
	onSubmit(form) {
		this.isformSubmitted = false;
		console.log('form.value', form.value);
		if (form.valid) {
			let fd = new FormData();
			let values = form.value;
			Object.keys(values).forEach(function (key) {
				if (key == 'pImg') {
					fd.append(key, values[key].formatted);
				} else if (key == 'address') {
					//fd.append(key,(values[key]));
					let address = values[key];
					Object.keys(address).forEach(function (subkey) {

						fd.append(subkey, (address[subkey]));

					});
				}
				else if (key == 'dob') {
					let dob: any = _moment(values[key], "DD/MM/YYYY");
					fd.append(key, dob);
				}
				else {
					fd.append(key, values[key]);
				}
			});
			if (this.imageObj) {
				fd.append('document', this.imageObj);
			}
			console.log('fd', fd);
			// this.commonservice.postHttpCall({ url: '/doers/add-bank-details', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result));
			this.commonservice.postHttpCall({ url: '/doers/save-standard-bank-details', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result));
		} else {
			this.isformSubmitted = false;
			console.log('required field');
		}
	}

	/**
	 * Submits success
	 * @param response 
	 */
	submitSuccess(response) {
		console.log(response);
		if (response.status == 1) {
			this.responseMessageSnackBar(response.msg , 'orangeSnackBar');
			this.togglePopup();
			this.router.navigate(["/doer/account-settings"]);
		}
		else {
			this.responseMessageSnackBar(response.msg, 'error');
		}

	}

	/**
	 * Responses message snack bar
	 * @param message 
	 * @param [res_class] 
	 * @param [vertical_position] 
	 */
	public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
		this.snackBar.open(message, '', {
			duration: 4000,
			horizontalPosition: 'right',
			verticalPosition: vertical_position,
			panelClass: res_class
		});
	}


	/**
	 * Handles address change
	 * @param place 
	 */
	public handleAddressChange(place) {
		var componentForm = {
			street_number: 'short_name',
			route: 'long_name',
			locality: 'long_name',
			administrative_area_level_1: 'long_name',
			country: 'long_name',
			postal_code: 'short_name'
		};
		var location = place['geometry']['location'];
		this.address_p['lat'] = place.geometry.location.lat();
		this.address_p['lng'] = place.geometry.location.lng();
		this.address_p['address'] = place.formatted_address;
		for (var i = 0; i < place.address_components.length; i++) {
			var addressType = place.address_components[i].types[0];
			if (componentForm[addressType]) {
				var val = place.address_components[i][componentForm[addressType]];
				if (addressType == 'locality') {
					this.banks_form.patchValue({
						address: {
							city: val
						}
					});
				}
				if (addressType == 'administrative_area_level_1') {
					this.banks_form.patchValue({
						address: {
							state: val
						}
					});
				}
				if (addressType == 'postal_code') {
					this.banks_form.patchValue({
						address: {
							postal_code: val
						}
					});
				}
			}
		}
	}

	/**
	 * Toggles popup
	 */
	togglePopup() {
		if (this.popupref.nativeElement.classList.contains('opened')) {
			this.renderer.removeClass(this.popupref.nativeElement, 'opened');
			this.renderer.removeClass(document.body, 'popup-open');
		}
		else {
			this.renderer.addClass(this.popupref.nativeElement, 'opened');
			this.renderer.addClass(document.body, 'popup-open');
		}
	}

	/**
	 * Toggles parent popup
	 */
	toggleParentPopup() {
		this.addBank.togglePopup();
	}

	/**
	 * Reditect to user after bank success
	 * @param status boolean
	 */
	bankAddedSuccess(status) {
		console.log('status', status);
		this.router.navigate(["/doer/account-settings"]);
	}

}
