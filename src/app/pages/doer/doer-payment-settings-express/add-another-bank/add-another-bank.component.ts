import { Component, OnInit, Input, EventEmitter, Output, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
// import { default as _rollupMoment } from 'moment';

// const moment = _rollupMoment || _moment;
declare var jQuery: any;
declare var $: any;
class Country {
	name: string;
	iso_2: string;
	currency: string;
}

@Component({
	selector: 'app-doer-add-another-bank',
	templateUrl: './add-another-bank.component.html',
	styleUrls: ['./add-another-bank.component.css']
})
export class AddAnotherBankComponent implements OnInit, AfterViewInit {

	@Input() isHiddenaddBank;
	@Input() isBankDetailsAdded;

	@ViewChild('popuprefbank') popuprefbank;

	@Output() bank_added = new EventEmitter<boolean>();

	bank_add_form: FormGroup;
	isformSubmitted: boolean = false;
	afterInit = false;

	address_p: any = [];
	imgUrl = '';
	imageObj: any;

	countries: any = [];
	constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private _fb: FormBuilder, public snackBar: MatSnackBar) {
		console.log('isBankDetailsAdded', this.isBankDetailsAdded);
	}

	types: any = [
		{ value: 'individual', viewValue: 'Individual' },
		{ value: 'company', viewValue: 'company' }
	];

	/**
	 * on init
	 */
	ngOnInit() {
		console.log('isBankDetailsAdded', this.isBankDetailsAdded);
		this.commonservice.postHttpCall({ url: '/stripe-countries-listing', contenttype: "application/json" }).then(result => this.populateCountryListSuccess(result));
		this.bank_add_form = this._fb.group({
			first_name: ['', Validators.required],
			last_name: ['', Validators.required],
			account_holder_type: ['individual', Validators.required],
			country: ['', Validators.required],
			//currency: ['', Validators.required],
			routing_number: ['', Validators.required],
			account_number: ['', Validators.required],
			type: ['', Validators.required],
			currency: '$',
			//imgUrl: ['', Validators.required]

		});
	}

	/**
	 * Populates country list success
	 * @param response 
	 */
	populateCountryListSuccess(response) {
		if (response.status == 1) {
			console.log(response.data);
			this.countries = response.data;
		}
	}


	/**
	 * after view init
	 */
	ngAfterViewInit() {
		this.afterInit = true;
	}

	get f() { return this.bank_add_form.controls; }

	/**
	 * Adds user bank
	 * @param form 
	 * @param valid 
	 */
	addUserBank(form, valid) {
		console.log(form, valid);
	}

	/**
	 * Toggles popup
	 */
	togglePopup() {
		if (this.popuprefbank.nativeElement.classList.contains('opened')) {
			this.renderer.removeClass(this.popuprefbank.nativeElement, 'opened');
			this.renderer.removeClass(document.body, 'popup-open');
		} else {
			this.renderer.addClass(this.popuprefbank.nativeElement, 'opened');
			this.renderer.addClass(document.body, 'popup-open');
		}
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
		//this.imgUrl = '';
	}


	get addressController() { return this.bank_add_form.controls.address['controls']; }


	/**
	 * Determines whether submit on
	 * @param form 
	 */
	onSubmit(form) {
		this.isformSubmitted = false;
		console.log('form', form);
		console.log('form.value', form.value);
		console.log('form.value', form.valid);
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
			this.commonservice.postHttpCall({ url: '/doers/add-another-bank-details', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result));
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
			this.togglePopup();
			this.responseMessageSnackBar(response.msg,'orangeSnackBar');
			this.bank_added.emit(true);
		}
		else {
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