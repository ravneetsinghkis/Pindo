import { Component, OnInit, Input, Output, ViewChild, Renderer2, EventEmitter, ElementRef } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material';


@Component({
	selector: 'app-request-advertisement',
	templateUrl: './request-advertisement.component.html',
	styleUrls: ['./request-advertisement.component.css']
})
export class RequestAdvertisementComponent implements OnInit {

	@Output() addRequestSend = new EventEmitter();
	currentValue = this.addRequestSend.asObservable();

	@Input() isHiddenRequestAdds;
	@ViewChild('popuprefadd') popuprefadd;

	isAccepted: boolean = false;
	request_add_form: FormGroup;
	insufficientPindoDollar: boolean = false;
	imgUrl = '';
	imageObj: any;
	uploadedFileName: any = '';
	add_request_page_title = '';
	add_request_page_content = '';
	pindoDollarPerMonth = 0;
	maxPindoDollar = 0;
	dollarPerMonth = 0;
	//isSubmitted:boolean:true;
	isSubmitted: boolean = false;

	totalPindoDollar = 0;
	totalDollar = 0;
	minDate = new Date();
	payment_mode = '1';

	advertisement_category: any = [
		{ value: '', viewValue: 'Select Category' },
	];

	advertisement_subcategory: any = [
		{ value: '', viewValue: 'Select SubCategory' },
	];

	communities: any = [{ value: '', viewValue: 'Select Community' }];

	constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, private _fb: FormBuilder) {
	}

	/**
	 * on init
	 */
	ngOnInit() {
		this.request_add_form = this._fb.group({
			number_of_month: ['', Validators.required],
			add_start_date: ['', Validators.required],
			category: ['', Validators.required],
			sub_category: ['', Validators.required],
			community: ['', Validators.required],
			payment_mode: ['1', Validators.required],
			remarks: [''],
			file_name: ['']
		});
	}

	get f() { return this.request_add_form.controls; }

	/**
	 * Determines whether delete on
	 * @param e 
	 */
	onDelete(e) {
		this.imageObj = '';
	}

	/**
	 * Determines whether change on
	 * @param e 
	 */
	onChange(e) {
		this.imageObj = e.target.files[0];
		this.imgUrl = '';
		this.uploadedFileName = this.imageObj.name;
	}

	/**
	 * Determines whether change month on
	 */
	onChangeMonth() {
		this.totalPindoDollar = this.f.number_of_month.value * this.pindoDollarPerMonth;
		this.totalDollar = this.f.number_of_month.value * this.dollarPerMonth;
	}

	/**
	 * Posts add request
	 * @param form 
	 */
	postAddRequest(form) {
		if (form.valid) {
			if ((this.f.number_of_month.value * this.pindoDollarPerMonth) > this.maxPindoDollar && this.f.payment_mode.value == 1) {
				this.insufficientPindoDollar = true;
				this.isSubmitted = false;
			} else {
				let fd = new FormData();
				let values = form.value;
				Object.keys(values).forEach(function (key) {
					if (key == 'attachment_file') {
						fd.append(key, values[key].formatted);
					} else {
						fd.append(key, values[key]);
					}
				});
				if (this.imageObj) {
					fd.append('request_file', this.imageObj);
				}
				if (this.payment_mode == '1') {
					fd.append('subtotal_amount', this.totalPindoDollar.toString());
				} else {
					fd.append('subtotal_amount', this.totalDollar.toString());
				}

				console.log(this.totalPindoDollar.toString() + "_" + this.totalDollar.toString());
				this.commonservice.postHttpCall({ url: '/doers/request-advertisement', data: fd, contenttype: "form-data" }).then(result => this.requestSuccess(result));
			}
		}
	}

	/**
	 * Checks payment mode
	 * @param modeVal 
	 */
	checkPaymentMode(modeVal) {
		this.payment_mode = modeVal;
	}

	/**
	 * Requests success
	 * @param response 
	 */
	requestSuccess(response) {
		if (response.status == 1) {
			this.request_add_form.reset();
			this.addRequestSend.next(true);
			this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
			this.togglePopup();
		}
		else {
			this.responseMessageSnackBar(response.msg, 'error');
		}
	}

	/**
	 * Gets advertising settings
	 */
	getAdvertisingSettings() {
		this.commonservice.postHttpCall({ url: '/doers/get-advertising-settings', data: {}, contenttype: "application/json" }).then(result => this.getAdvertisingSettingsSuccess(result));
	}

	/**
	 * Gets advertising category
	 */
	getAdvertisingCategory() {
		this.commonservice.postHttpCall({ url: '/doers/get-advertising-category', data: {}, contenttype: "application/json" }).then(result => this.getAdvertisingCategorySuccess(result));
	}

	/**
	 * Gets advertising category success
	 * @param response 
	 */
	getAdvertisingCategorySuccess(response) {
		if (response.status == 1) {
			for (var i = response.data.length - 1; i >= 0; i--) {
				this.advertisement_category.push({ value: response.data[i]['id'], viewValue: response.data[i]['name'] });
			}
		}
	}

	/**
	 * Determines whether change category on
	 * @param e 
	 */
	onChangeCategory(e) {
		this.getAdvertisingSubCategory(e.value);
		this.advertisement_subcategory = [
			{ value: '', viewValue: 'Select SubCategory' },
		];
	}

	/**
	 * Gets advertising sub category
	 * @param parent_id 
	 */
	getAdvertisingSubCategory(parent_id) {
		this.commonservice.postHttpCall({ url: '/doers/get-advertising-subcategory', data: { 'parent_id': parent_id }, contenttype: "application/json" }).then(result => this.getAdvertisingSubCategorySuccess(result));
	}

	/**
	 * Gets advertising sub category success
	 * @param response 
	 */
	getAdvertisingSubCategorySuccess(response) {
		if (response.status == 1) {
			for (var i = response.data.length - 1; i >= 0; i--) {
				this.advertisement_subcategory.push({ value: response.data[i]['id'], viewValue: response.data[i]['name'] });
			}
		}
	}


	/**
	 * Gets advertising settings success
	 * @param response 
	 */
	getAdvertisingSettingsSuccess(response) {
		if (response.status == 1) {
			this.add_request_page_title = response.data.cms.title;
			this.add_request_page_content = response.data.cms.content;
			this.pindoDollarPerMonth = response.data.settings.pindo_dollars_per_month;
			this.totalPindoDollar = response.data.settings.pindo_dollars_per_month;
			this.totalDollar = response.data.settings.dollars_per_month;
			this.maxPindoDollar = response.data.doer_pindo_dollar;
			this.dollarPerMonth = response.data.settings.dollars_per_month;
		}
	}


	// Fetching doer's community list
	/**
	 * Doers community list
	 */
	doerCommunityList() {
		this.commonservice.postHttpCall({ url: '/doers/doer-communities', data: {}, contenttype: "application/json" }).then(result => this.doerCommunityListSuccess(result));
	}

	/**
	 * Doers community list success
	 * @param response 
	 */
	doerCommunityListSuccess(response) {
		console.log('doerCommunityList', response);
		if (response.status == 1) {
			for (var i = response.data.length - 1; i >= 0; i--) {
				this.communities.push({ value: response.data[i]['community_details']['id'], viewValue: response.data[i]['community_details']['name'] });
			}
		}
	}

	/**
	 * Toggles popup
	 */
	togglePopup() {
		if (this.popuprefadd.nativeElement.classList.contains('opened')) {
			this.renderer.removeClass(this.popuprefadd.nativeElement, 'opened');
			this.renderer.removeClass(document.body, 'popup-open');
		} else {
			this.getAdvertisingSettings();
			this.getAdvertisingCategory();
			this.doerCommunityList();
			this.renderer.addClass(this.popuprefadd.nativeElement, 'opened');
			this.renderer.addClass(document.body, 'popup-open');
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
			duration: 6000,
			horizontalPosition: 'right',
			verticalPosition: vertical_position,
			panelClass: res_class
		});
	}

}