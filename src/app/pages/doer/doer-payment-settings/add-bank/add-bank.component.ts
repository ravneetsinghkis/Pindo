import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
	selector: 'app-doer-add-bank',
	templateUrl: './add-bank.component.html',
	styleUrls: ['./add-bank.component.css']
})
export class AddBankComponent implements OnInit, AfterViewInit {

	@Input() isHiddenaddBank;

	@ViewChild('popuprefbank') popuprefbank;

	@Output() bankAdded = new EventEmitter();

	bank_add_form: FormGroup;
	isformSubmitted: boolean = false;
	afterInit = false;

	constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private _fb: FormBuilder, private router: Router) {
	}

	types: any = [
		{ value: 'individual', viewValue: 'Individual' },
		{ value: 'company', viewValue: 'company' }
	];

	/**
	 * on init
	 */
	ngOnInit() {
		this.bank_add_form = this._fb.group({
			account_holder_name: ['', Validators.required],
			account_holder_type: ['individual', Validators.required],
			// bank_name: ['', Validators.required],
			// country: ['', Validators.required],
			// currency: ['', Validators.required],
			routing_number: ['', Validators.required],
			account_number: ['', Validators.required]
		});
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
	 */
	addUserBank(form) {
		console.log(form.value);

		if (form.valid) {
			this.commonservice.postHttpCall({
				url: '/doers/save-standard-bank-details',
				data: form.value,
				contenttype: "form-data"
			})
			.then(result => {
				this.togglePopup();
				this.bankAdded.emit(true);
				// this.router.navigate(['/doer/account-settings/']);
			});
		}
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

}