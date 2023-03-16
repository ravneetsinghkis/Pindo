import { Component, OnInit, AfterViewInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var jQuery: any;
declare var $: any;
declare var Swiper: any;
/*export interface Fruit {
  name: string;
}*/

@Component({
	selector: 'account-setting-services',
	templateUrl: './account-setting-services.component.html',
	styleUrls: ['./account-setting-services.component.scss']
})
export class AccountSettingServicesComponent implements OnInit {

	@ViewChild('popUpVar') popupref;
	@ViewChild('radio') radio;
	@Output() listingPopulated = new EventEmitter();

	parentServices = [];
	childServices = [];
	rateServices: any;
	selectedChildServices = [];
	serviceOffered = [];
	pID: any;
	cID: any;
	backupCID: any;
	pName: any;
	sName: any;
	selected_id: any;
	selectedSubValue: any;
	inEditMode = false;
	toEditData = {};
	submitted = false;

	formRate: FormGroup;

	// New service request
	formNewServiceRequest: FormGroup;
	emptyNewServiceName: boolean = true;
	userDetails: any = {};

	// Multiple subcats
	subCatIds = [];
	subCatNames = [];

	constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, private deviceService: DeviceDetectorService, public fb: FormBuilder) {
		this.formRate = this.fb.group({
			rate: [''],
			qty: [''],
		});
		this.getServiceoffred();

		this.formNewServiceRequest = this.fb.group({
			newService: ['', [Validators.required]],
		});
	}

	ngOnInit() {
		this.formNewServiceRequest.get('newService').valueChanges.subscribe(value => {
			this.emptyNewServiceName = ! Boolean(value.length);
		});

		this.getUserDetails();
	}

	ngAfterViewInit() {

	}

	swiper_categorySelect() {
		new Swiper('.service-categorySelect-wrap .swiper-container', {
			slidesPerView: 7,
			spaceBetween: 20,
			navigation: {
				nextEl: '.service-categorySelect-wrap .swiper-button-next',
				prevEl: '.service-categorySelect-wrap .swiper-button-prev',
			},
			breakpoints: {
				991: {
					slidesPerView: 4,
				},
				767: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				575: {
					slidesPerView: 3,
					spaceBetween: 20,
				}
			}
		});
	}

	togglePopup(a = '', b = '') {
		this.pName = '';
		this.sName = '';
		this.parentServices = [];
		this.parentServices.length = 0;
		this.childServices = [];
		this.childServices.length = 0;
		this.selectedChildServices = [];
		this.selectedChildServices.length = 0;
		this.submitted = false;
		this.formRate = this.fb.group({
			rate: [''],
			qty: [''],
		});

		if (this.popupref.nativeElement.classList.contains('opened')) {
			this.inEditMode = false;
			this.selected_id = '';
			this.pID = '';
			this.cID = '';
			this.backupCID = '';
			this.selectedSubValue = '';
			this.renderer.removeClass(this.popupref.nativeElement, 'opened');
			this.renderer.removeClass(document.body, 'popup-open');

			// Multiple subcats
			this.subCatIds = [];
			this.subCatNames = [];
		} else {
			this.populateServices(a, b);
			this.renderer.addClass(this.popupref.nativeElement, 'opened');
			this.renderer.addClass(document.body, 'popup-open');
		}
	}

	closeModal() {
		if (this.inEditMode == true) {
			if (this.cID != this.backupCID) {
				Swal({
					title: 'Do you want to save your activity?',
					text: '',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#E6854A',
					confirmButtonText: 'SAVE',
					cancelButtonText: 'CANCEL',
				}).then((resultswal) => {
					if (resultswal.value) {
						this.onSubmit('exit');
					} else {
						this.togglePopup();
					}
				});
			} else {
				this.togglePopup();
			}
		} else {
			this.togglePopup();
		}
	}

	getServiceoffred() {
		this.commonservice.postHttpCall({ url: '/doers/get-services-offered-test', data: {}, contenttype: 'application/json' }).then(result => this.serviceOfferedSuccess(result));
	}

	serviceOfferedSuccess(response) {
		if (response.status == 1) {
			let servicesOffered = response.data;
			servicesOffered.sort((a, b) => a.position - b.position);
			this.serviceOffered = servicesOffered;

			if (response.data.length > 0) {
				this.listingPopulated.emit(true);
			} else {
				this.listingPopulated.emit(false);
			}
		}
	}

	populateServices(a = '', b = '') {
		this.commonservice.postHttpCall({ url: '/doers/category-list', contenttype: 'application/json' }).then(result => this.populateSuccess(result, a, b));
	}

	populateSuccess(response, id, child_id) {
		if (response.status == 1) {
			this.parentServices = response.data;
			console.log(this.inEditMode);

			setTimeout(() => {
				this.swiper_categorySelect();
			}, 1000)


			if (this.inEditMode == true) {
				this.populateSubCategory(id);
				for (let i = 0; i < response.data.length; i++) {
					if (id == response.data[i].id) {
						this.pName = response.data[i].name;
					}
				}
			}
		}
	}

	selectCat(parentCatID, parentName) {
		console.log('asdasd', parentCatID);
		this.populateSubCategory(parentCatID);
		this.pID = parentCatID;
		this.pName = parentName;
		this.sName = '';

		// Multiple subcats
		this.subCatIds = [];
		this.subCatNames = [];
	}

	selectSubcategory(subID, subname, elem) {
		this.sName = subname;
		this.cID = subID;

		// Multiple subcats
		if (elem.checked) {
			this.subCatIds.push(subID);
			this.subCatNames.push(subname);
		} else {
			this.subCatIds = this.subCatIds.filter(item => item != subID);
			this.subCatNames = this.subCatNames.filter(item => item != subname);
		}

		if (this.subCatIds.length == 0) {
			this.cID = '';
			this.sName = '';
		}
	}

	editService(pid, cid) {
		this.inEditMode = true;
		this.selected_id = pid;
		this.selectedSubValue = cid;
		this.pID = pid;
		this.cID = cid;
		this.backupCID = cid;
		this.togglePopup(pid, cid);
	}

	deleteService(indexVal, childIndex, doer) {
		Swal({
			title: 'Are you sure you want to delete this?',
			text: '',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#E6854A',
			confirmButtonText: 'YES',
			cancelButtonText: 'CANCEL',
		}).then((resultswal) => {
			if (resultswal.value) {
				this.commonservice.postHttpCall({ url: '/doers/remove-doer-service-pricing', data: { 'category_id': indexVal, 'parent_cat_id': childIndex, 'doer_cat_id': doer }, contenttype: 'application/json' }).then(result => this.ondeleteService(result));
			}
		});
	}

	ondeleteService(response) {
		if (response.status == 1) {
			this.responseMessageSnackBar('Service  deleted successfully', 'orangeSnackBar');
			this.getServiceoffred();
		}
	}

	populateSubCategory(parCatID) {
		if (!this.inEditMode) {
			this.commonservice.postHttpCall({ url: '/doers/get-sub-cat-list', data: { 'parent_category_id': parCatID }, contenttype: 'application/json' }).then(result => this.populateSuccessSubCat(result));
		} else {
			this.commonservice.postHttpCall({ url: '/doers/get-sub-cat-list', data: { 'parent_category_id': parCatID }, contenttype: 'application/json' }).then(response => {
				this.childServices = response.data;
				this.selectedChildServices = response.selected_categories;

				for (let i = 0; i < response.selected_categories.length; i++) {
					if (this.selectedSubValue == response.selected_categories[i].id) {
						this.sName = response.selected_categories[i].name;
					}
				}
			});

			this.commonservice.postHttpCall({ url: '/doers/get-sub-cat-list', data: { 'parent_category_id': parCatID, totalData: { 'inEditMode': this.inEditMode, 'subCatId': this.cID } }, contenttype: 'application/json' }).then(response => {
				this.rateServices = response.selected_doer_category_price_dtls[0];
			}).then(res => {
				this.formRate.patchValue({
					rate: this.rateServices.hourly_rate,
					qty: this.rateServices.unit_name,
				});
			});
		}
	}

	populateSuccessSubCat(response) {
		this.childServices = response.data;
		this.rateServices = response.selected_doer_category_price_dtls;
		this.selectedChildServices = response.selected_categories;

		if (this.inEditMode == true) {
			for (let i = 0; i < response.selected_categories.length; i++) {
				if (this.selectedSubValue == response.selected_categories[i].id) {
					this.sName = response.selected_categories[i].name;
				}
			}
		}
	}

	onSubmit(msg) {
		const rate = this.formRate.get('rate').value;
		const qty = this.formRate.get('qty').value;

		if ((rate && !qty) || (!rate && qty)) {
			this.responseMessageSnackBar('You must enter both rate and quantity or neither', 'error');
			return;
		}
		console.log('EDIT', this.pID, this.cID);

		if (this.pID == 3) {
			this.commonservice.postHttpCall({
				url: '/doers/volunteer-badge-add',
				data: {
					'badge_id': atob(localStorage.getItem('badge'))
				},
				contenttype: 'application/json'
			}).then(res => {

			});
		}

		const tempObjToSend = {
			'catId': this.pID,
			'subCatId': this.cID,
			'subCatIds': this.subCatIds,
			'selectedTasks': [],
			'serviceDetailsArrayIndex': [0],
			'service_details': {
				'serviceRate_0': rate,
				'unitName_0': qty,
			},
			'service_pricing': [{
				'serviceRate': '',
				'unitName': '',
			}],
		};
		if (this.inEditMode == false) {
			this.commonservice.postHttpCall({ url: '/doers/update-doer-service-pricing', data: tempObjToSend, contenttype: 'application/json' }).then(result => this.onSuccess(result, msg));
		} else {
			const tempObjToSend2 = {
				category_id: this.selectedSubValue,
				data: [{
					'parent_cat_id': this.pID,
					'category_id': this.cID,
					'hourly_rate': rate,
					'unit_name': qty,
				}]
			};
			this.commonservice.postCommunityHttpCall({ url: '/api/pinner/doer-edit-service-offered', data: tempObjToSend2, contenttype: 'application/json' }).then(result => this.onSuccess(result, msg));
		}
	}

	onSuccess(response, msg) {
		if (response.status == 1) {
			this.getServiceoffred();
			if (msg == 'exit') {
				this.togglePopup();
			} else {
				this.childServices = [];
				// this.serviceOffered = [];
				// this.pID = '';
				this.cID = '';
				// this.pName = '';
				this.sName = '';
				this.formRate.reset();
				this.populateSubCategory(this.pID);

				// Multiple subcats
				this.subCatIds = [];
				this.subCatNames = [];
			}
		}
	}

	public responseMessageSnackBar(message, res_class: any = '', verticalPos: any = 'bottom') {
		this.snackBar.open(message, '', {
			duration: 4000,
			horizontalPosition: 'right',
			verticalPosition: verticalPos,
			panelClass: res_class
		});
	}

	/**
	 * Get logged in user details
	 */
	getUserDetails() {
		this.commonservice.postHttpCall({ url: '/get-user-details', data: {}, contenttype: 'application/json' }).then((result) => {
			if (result.status == 1 ) {
				this.userDetails = result.data;
			}
		});
	}

	/**
	 * Submit subcategory request
	 */
	requestSubcategorySubmit() {
		if ('email' in this.userDetails) {
			let fd = new FormData();

			fd.append("subject", "10");
			fd.append("first_name", this.userDetails.first_name);
			fd.append("last_name", this.userDetails.last_name);
			fd.append("email", this.userDetails.email);
			fd.append("description", "New subcategory request: " + this.formNewServiceRequest.value.newService);
			fd.append("user_type", "2");

			this.commonservice.postHttpCall({ url: '/submit-support', data: fd, contenttype: 'form-data' }).then((result) => {
				if (result.status == 1) {
					this.formNewServiceRequest.patchValue({
						newService: ""
					});
					this.responseMessageSnackBar('New subcategory request has been submitted successfully.', 'orangeSnackBar');
				}
			});
		}

	}
}
