import { Component, OnInit, AfterViewInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var jQuery: any;
declare var $: any;
/*export interface Fruit {
  name: string;
}*/

@Component({
	selector: 'app-profile-services',
	templateUrl: './profile-services.component.html',
	styleUrls: ['./profile-services.component.scss']
})
export class ProfileServicesComponent implements OnInit {
	inEditMode = false;
	parentServices = [];

	ServiceSubCat = [];
	ServiceSubCatTaskList = [];
	serviceOffered = [];
	@Input()
	isHiddenService = false;
	@Output() listingPopulated = new EventEmitter();

	@ViewChild('popUpAddServices')
	popUpAddServices;
	counterTocheckPopupopenCount = 0;

	selectedServiceCheckData = false;

	profileServicesModel = {
		tasks: {},
		servicerate: {},
		unitName: {},
		billingrate: {}
	};

	prevVal = '';

	previouslySelectedSubCat = [];


	//billing_rates: string[] = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];
	favseason = 1;
	billing_rates = [{
		'name': 'Daily',
		'value': 1
	}, {
		'name': 'Weekly',
		'value': 2
	}, {
		'name': 'Bi-weekly',
		'value': 3
	}, {
		'name': 'Monthly',
		'value': 4
	}];
	parent_category_id: number;
	afterAddStoreSelectedCat: any = null;
	serviceDetailsArrayIndex: any = [];
	serviceIndex: any = 0;
	constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, private deviceService: DeviceDetectorService) {
		//this.populateServices();
		this.getServiceoffred();
		/*this.viewPortWidth = screen.availWidth;
		this.inMobView = (screen.availWidth<768) ? true : false;  */
		const isMobile = this.deviceService.isMobile();

		if (isMobile) {
			this.inMobView = true;
		}
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		//this.addPriceTemplate();
	}


	///below section new
	taskOfIndvSubCategory = [];
	selectedTasks = [];
	serviceRateVal: any;
	unitNameVal: any;
	selectedService: any;
	selectedsubCatId: any = '';
	toEditData = {};
	ifbothSaveAndContinue: boolean = false;
	selectedCatValue: any;
	selectedSubCatValue: any;
	viewPortWidth: Number;
	inMobView: boolean = false;

	private count: number = 1;

	service_pricing: any[] = [];

	removePriceTemplate(i: number) {
		console.log('this.service_pricing', this.service_pricing);
		this.service_pricing.splice(i, 1);
		this.serviceDetailsArrayIndex.splice(i, 1);
		console.log('this.service_pricing', this.service_pricing);
	}

	addPriceTemplate(tempObj1) {
		if (tempObj1) {
			console.log('tempObj', tempObj1);
			this.service_pricing.push(tempObj1);
		} else {
			let tmpObjDefault = { 'serviceRate': '', 'unitName': '' };
			this.service_pricing.push(tmpObjDefault);
		}
		console.log('this.service_pricing', this.service_pricing);
		this.serviceDetailsArrayIndex.push(this.serviceIndex);
		this.serviceIndex++;
	}

	selectedSubCats(subCatId) {
		this.selectedsubCatId = subCatId;
		this.selectedTasks = [];
		this.populateTask(subCatId);
	}

	populateTask(subCatId) {
		//this.serviceRateVal = null;
		//this.unitNameVal = null;		
		this.commonservice.postHttpCall({ url: '/doers/service-task-list', data: { 'sub_category_id': subCatId }, contenttype: 'application/json' }).then(result => this.populateTaskSuccess(result, subCatId));
	}

	populateTaskSuccess(response, subCatId) {
		/*if(response.status==1) {
			this.taskOfIndvSubCategory = response.data;  			
			if(JSON.stringify(this.toEditData)!='{}' && (this.toEditData['id'] === subCatId)) {				
			let tempTasks = this.toEditData['task_ids'].split(',');
			setTimeout(()=>{					
				for(let eachTask=0;eachTask<this.toEditData['doer_categories']['doer_tasks'].length;eachTask++) {
					if(this.toEditData['doer_categories']['doer_tasks'][eachTask]['doer_task_details']) {
						let tempTaskId = this.toEditData['doer_categories']['doer_tasks'][eachTask]['doer_task_details']['id'];
						console.log(tempTaskId);
						$('#subCatTask-'+tempTaskId).trigger('click');
					}
				}
				this.unitNameVal = this.toEditData['doer_categories']['unit_name'];
				this.serviceRateVal = this.toEditData['doer_categories']['hourly_rate'];	
				//this.toEditData = {};				
			},0);				
		}
		}*/
	}

	onChangeTasks(indexVal, evt) {
		if (evt.target.checked) {
			this.selectedTasks.push(this.taskOfIndvSubCategory[indexVal]);
			console.log(this.selectedTasks);
		} else {
			this.removeArrVal(indexVal);
		}
	}

	removeArrVal(indexVal) {
		for (let a = this.selectedTasks.length - 1; a >= 0; a--) {
			if (this.selectedTasks[a]['id'] == this.taskOfIndvSubCategory[indexVal]['id']) {
				this.selectedTasks.splice(a, 1);
			}
		}
	}

	deselectFilter(indexVal) {
		let tempId = this.selectedTasks[indexVal]['task_id'];
		$('#subCatTask-' + tempId).trigger('click');
	}

	doerServiceSubmit(frmElm, saveAndContinue: boolean = false) {
		console.log('frmElm', frmElm.form.value);
		//console.log(JSON.parse(JSON.stringify(frmElm.form.value.categoryPriceGroup)));
		console.log(saveAndContinue);
		if (saveAndContinue) {
			frmElm.submitted = true;
			this.ifbothSaveAndContinue = true;
		} else {
			this.ifbothSaveAndContinue = false;
		}
		if (frmElm.valid) {
			let tempObjToSend = {
				'catId': this.selectedService,
				'subCatId': this.selectedsubCatId,
				'selectedTasks': this.selectedTasks,
				'serviceRate': this.serviceRateVal,
				'unitName': this.unitNameVal,
				'service_details': frmElm.form.value,
				'service_pricing': this.service_pricing,
				'serviceDetailsArrayIndex': this.serviceDetailsArrayIndex
				/*'service_rate' : Object.values(frmElm.form.value),
				'unit_name' : Object.keys(frmElm.form.value)*/

			};
			if (this.inEditMode) {
				//console.log(this.toEditData);
				//return false;
				tempObjToSend['dbRowId'] = this.toEditData['doer_categories']['id'];
				//tempObjToSend['categoryPriceGroup'] = this.service_pricing;
			}
			/*else{
				tempObjToSend['categoryPriceGroup'] = Object.values(frmElm.form.value.categoryPriceGroup);
			}*/

			console.log(this.service_pricing);
			console.log('tempObjToSend', tempObjToSend);
			this.commonservice.postHttpCall({ url: '/doers/update-doer-service-pricing', data: tempObjToSend, contenttype: 'application/json' }).then(result => this.onSubmitService(result));
		}
	}

	onSubmitService(response) {
		this.serviceDetailsArrayIndex = [];
		this.serviceIndex = 0;
		if (response.status == 1) {
			//this.populateServices();
			this.responseMessageSnackBar(response.msg,'orangeSnackBar');
			this.getServiceoffred();
			if (this.ifbothSaveAndContinue) {
				console.log('save and continue');
				this.populateServices();
				this.resetServiceFields();
				this.togglePopup();
				// if(this.inEditMode) {
				// 	console.log(this.toEditData);
				// }
			} else {
				console.log('save', this.inEditMode);
				if (this.inEditMode) {
					// console.log('editmode',this.toEditData);
					// let tempData = this.serviceOffered.filter((val) => {
					// 	let innerTemp = val['children'].filter((innerVal) => {
					// 		if(innerVal['doer_categories']['id'] == this.toEditData['doer_categories']['id']) {
					// 			console.log(innerVal['doer_categories']['id'],this.toEditData['doer_categories']['id']);
					// 			return innerVal;
					// 		}
					// 	});
					// 	return innerTemp.flat();
					// });
					// console.log('aftercomp',tempData);
					//this.toEditData = this.serviceOffered[indexVal]['children'][childIndex];
				} else {
					// console.log(this.selectedService);
					this.afterAddStoreSelectedCat = this.selectedService;
					this.resetServiceFields();
					this.populateServices();
				}
				//this.inEditMode = false;
				//this.togglePopup();
				//this.populateServices();
			}

		}
	}

	resetServiceFields() {
		this.parentServices = [];
		this.taskOfIndvSubCategory = [];
		this.selectedTasks = [];
		this.ServiceSubCat = [];
		this.serviceRateVal = '';
		this.unitNameVal = '';
		this.selectedService = '';
		this.selectedsubCatId = '';
		this.previouslySelectedSubCat = [];
	}


	editService(indexVal, childIndex) {
		this.inEditMode = true;
		console.log(this.serviceOffered[indexVal]['children'][childIndex]);
		this.toEditData = this.serviceOffered[indexVal]['children'][childIndex];
		this.togglePopup();
	}

	deleteService(indexVal, childIndex) {
		let tempObj = this.serviceOffered[indexVal]['children'][childIndex];
		console.log(tempObj);
		let parentId = tempObj['doer_categories']['parent_cat_id'];
		let catID = tempObj['doer_categories']['category_id'];
		let doer_cat_id = tempObj['doer_categories']['id'];
		this.commonservice.postHttpCall({ url: '/doers/remove-doer-service-pricing', data: { 'category_id': catID, 'parent_cat_id': parentId, 'doer_cat_id': doer_cat_id }, contenttype: 'application/json' }).then(result => this.ondeleteService(result));
	}

	ondeleteService(response) {
		if (response.status == 1) {
			this.responseMessageSnackBar(response.msg,'orangeSnackBar');
			this.getServiceoffred();
		}
	}

	///upper section new

	/**
  * populate sub Category
*/
	populateSubCategory(parCatID) {
		this.parent_category_id = parCatID;
		let tempData: any = null;
		if (JSON.stringify(this.toEditData) != '{}') {
			tempData = {
				'inEditMode': this.inEditMode,
				'subCatId': this.toEditData['id']
			};
		}
		this.commonservice.postHttpCall({ url: '/doers/get-sub-cat-list', data: { 'parent_category_id': parCatID, 'totalData': tempData }, contenttype: 'application/json' }).then(result => this.populateSuccessSubCat(result));
	}

	populateSuccessSubCat(response) {
		this.service_pricing.length = 0;
		console.log('subCat', response);
		if (response.status == 1) {
			this.ServiceSubCat = response.data;
			this.previouslySelectedSubCat = response['selected_categories'];
			console.log(this.previouslySelectedSubCat);
			if (JSON.stringify(this.toEditData) != '{}') {
				let tempCatId = this.toEditData['id'];
				setTimeout(() => {
					if (!this.inMobView) {
						$('#subCat-' + tempCatId).trigger('click');
					} else {
						this.selectedSubCatValue = tempCatId;
						this.selectedSubCats(tempCatId);
					}
				}, 0);
			}
			if (response.selected_doer_category_price_dtls) {
				this.serviceRateVal = response.selected_doer_category_price_dtls.hourly_rate;
				this.unitNameVal = response.selected_doer_category_price_dtls.unit_name;
			}
			if (response.arrenged_arr_for_frontend.length > 0) {
				//var that = this;
				this.serviceIndex = 0;
				this.serviceDetailsArrayIndex = [];
				for (let index = 0; index < response.arrenged_arr_for_frontend.length; index++) {
					//this.serviceDetailsArrayIndex.push(this.serviceIndex);
					this.addPriceTemplate(response.arrenged_arr_for_frontend[index]);
					//this.serviceIndex++;
				}
				/*response.arrenged_arr_for_frontend.forEach(function(element) {
				  	that.addPriceTemplate(element);
				});*/
				console.log(this.service_pricing);
				//this.service_pricing = response.arrenged_arr_for_frontend;
			} else {
				this.addPriceTemplate(null);
			}
		}
	}

	/**
  * Category listing
*/
	populateServices() {
		this.commonservice.postHttpCall({ url: '/doers/category-list', contenttype: 'application/json' }).then(result => this.populateSuccess(result));
	}

	populateSuccess(response) {
		console.log('asdasdasd', response);
		if (response.status == 1) {
			//this.parentServices = JSON.parse(JSON.stringify(response.data));
			this.parentServices = response.data;
			setTimeout(() => {
				if (JSON.stringify(this.toEditData) != '{}') {
					console.log(this.toEditData['parent_id']);
					let tempParentId = this.toEditData['parent_id'];

					//console.log($('#checkCat-'+tempParentId).length,tempParentId);
					setTimeout(() => {
						if (!this.inMobView) {
							$('#checkCat-' + tempParentId).trigger('click').trigger('change');
						} else {
							this.selectedCatValue = tempParentId;
							this.selectCat(tempParentId);
						}
					}, 200);
				}
				if (!this.inEditMode && this.afterAddStoreSelectedCat != null) {
					$('#checkCat-' + this.afterAddStoreSelectedCat).trigger('click').trigger('change');
					this.afterAddStoreSelectedCat = null;
				}
			}, 0);

		}
	}


	togglePopup() {
		this.counterTocheckPopupopenCount++;
		if (this.popUpAddServices.nativeElement.classList.contains('opened')) {
			this.resetServiceFields();
			this.renderer.removeClass(this.popUpAddServices.nativeElement, 'opened');
			this.renderer.removeClass(document.body, 'popup-open');
			this.ifbothSaveAndContinue = false;
			this.toEditData = {};
			this.inEditMode = false;
		} else {
			this.populateServices();
			this.renderer.addClass(this.popUpAddServices.nativeElement, 'opened');
			this.renderer.addClass(document.body, 'popup-open');

			if (this.counterTocheckPopupopenCount == 1) {
				//console.log($('.singleService:first-child').find('input[type="radio"]'));
				//$('.singleService:first-child').find('input[type="radio"]').trigger('click');
			}
		}

	}

	onChangePopulate(evt, subCatId) {
		//console.log(evt.target.value);
		if (this.prevVal == '') {
			this.prevVal = evt.target.value;
			this.getTask(evt.target.value, subCatId, evt);
		} else {
			if (this.prevVal == evt.target.value || evt.target.value == '') {
				this.ServiceSubCatTaskList = [];
				this.prevVal = '';
			} else {
				this.prevVal = evt.target.value;
				console.log(evt.target.value);
				this.getTask(evt.target.value, subCatId, evt);
			}
		}
		/*if(evt.target.value!='')
			this.getTask(evt.target.value,subCatId);
		else
			this.ServiceSubCatTaskList = [];*/
	}

	getTask(taskVal, subCatId, evt) {
		$(evt.target).parents('mat-chip-list').find('mat-spinner').show();
		this.commonservice.postHttpCall({ url: '/doers/get-task-list', data: { 'task_name': taskVal, 'sub_cat_id': subCatId }, contenttype: 'application/json' }, true).then(result => this.onSuccessTaskPopulate(result));
		$(evt.target).parents('mat-chip-list').find('mat-spinner').hide();
	}

	onSuccessTaskPopulate(response) {
		if (response.status == 1) {
			this.ServiceSubCatTaskList = response.data;
		}
	}

	/**
  * select Category
*/
	selectCat(parentCatID) {
		console.log('asdasd', parentCatID);
		this.selectedService = parentCatID;
		this.taskOfIndvSubCategory = [];
		this.selectedSubCatValue = '';
		this.selectedsubCatId = '';
		this.populateSubCategory(parentCatID);
		this.selectedTasks = [];
	}

	/**
	  * dummy chips
	*/
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = false;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	//fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	fruits: string[] = ['Lemon', 'Apple'];
	allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

	@ViewChild('fruitInput') fruitInput: ElementRef;



	/**
	 * Adds profile services component
	 * @param event 
	 * @param index 
	 * @param userIndex 
	 */
	add(event: MatChipInputEvent, index, userIndex): void {

		const input = event.input;
		const value = event.value;

		// Add our fruit
		/*if ((value || '').trim()) {
		  
			this.ServiceSubCat[index].user_category[userIndex].user_task_details_arr.push(value);

			  
			//this.fruits.push(value.trim());

			console.log(value.trim())
		}*/

		// Reset the input value
		if (input) {
			console.log('asdasd');
			input.value = '';
		}

		//this.fruitCtrl.setValue(null);
	}

	/**
	 * Removes profile services component
	 * @param task 
	 * @param indexVal 
	 * @param userIndex 
	 */
	remove(task: string, indexVal, userIndex): void {
		console.log('remove');
		//const index = this.fruits.indexOf(fruit);
		const index = this.ServiceSubCat[indexVal].user_category[userIndex].user_task_details_arr.indexOf(task);

		if (index >= 0) {
			//this.fruits.splice(index, 1);
			this.ServiceSubCat[indexVal].user_category[userIndex].user_task_details_arr.splice(index, 1);
		}
	}

	/**
	 * Selected profile services component
	 * @param event 
	 * @param index 
	 * @param userIndex 
	 * @param idOfInput 
	 * @returns  
	 */
	selected(event: MatAutocompleteSelectedEvent, index, userIndex, idOfInput) {
		console.log(event.option.viewValue);

		let tempTaskArr = [];
		tempTaskArr = this.ServiceSubCat[index].user_category[userIndex].user_task_details_arr;
		let hasValueFlag = false;
		for (let x = 0; x < tempTaskArr.length; x++) {
			if (tempTaskArr[x] == event.option.viewValue) {
				hasValueFlag = true;
				this.prevVal = '';
				$('#' + idOfInput).val('');
				this.responseMessageSnackBar('Task Already Added', 'error', 'top');
				return false;
			}
		}
		if (!hasValueFlag) {
			this.ServiceSubCat[index].user_category[userIndex].user_task_details_arr.push(event.option.viewValue);
			//console.log($('#'+idOfInput));
			this.ServiceSubCatTaskList = [];
			this.prevVal = '';
			$('#' + idOfInput).val('');
		}
		//console.log(this.ServiceSubCat[index].user_task_details_arr);
		//this.fruitCtrl.setValue(null);
	}

	/**
	 * Prices change
	 * @param index 
	 * @param evt 
	 * @param userIndex 
	 */
	priceChange(index, evt, userIndex) {
		let tempVal = evt.target.value;
		/*let tempObj = {'hourly_rate':evt.target.value};
		this.ServiceSubCat[index].user_category.push(tempObj);*/

		/*if(this.ServiceSubCat[index].user_category.constructor==Array){
			let tempObj = {'hourly_rate':evt.target.value};
			this.ServiceSubCat[index].user_category.push(tempObj);
		}
		else*/
		this.ServiceSubCat[index].user_category[userIndex].hourly_rate = evt.target.value;
	}

	/**
	 * Units name change
	 * @param index 
	 * @param evt 
	 * @param userIndex 
	 */
	unitNameChange(index, evt, userIndex) {
		let tempVal = evt.target.value;
		this.ServiceSubCat[index].user_category[userIndex].unit_name = evt.target.value;
	}

	/**
	 * Recurring work type change
	 * @param index 
	 * @param userIndex 
	 */
	recurring_work_typeChange(index, userIndex) {

		let tempModelName = this.ServiceSubCat[index].user_category[userIndex].model_name;
		this.ServiceSubCat[index].user_category[userIndex].recurring_work_type = this.profileServicesModel.billingrate[tempModelName];
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
	}

	/**
	 * Generates random id
	 * @param i 
	 * @returns  
	 */
	generateRandomId(i) {
		let tempUniqueId = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
		for (let indexUser = 0; indexUser < this.ServiceSubCat[i].user_category.length; indexUser++) {
			if (tempUniqueId == this.ServiceSubCat[i].user_category[indexUser].id) {
				this.generateRandomId(i);
			}
		}
		return tempUniqueId;
	}

	/*getUniqueModelName(indexVal) {
		  let modelName = this.ServiceSubCat[indexVal].name;
		  modelName = modelName.split(" ").join()
		  return modelName;
	}*/

	getrecurval(i, modelName) {
		if (this.ServiceSubCat[i].billing_rate == 3) {
			return this.profileServicesModel.billingrate[modelName];
		}
	}


	/**
	 * Adds user category
	 * @param i 
	 * @param frmElm 
	 */
	addUser_category(i, frmElm) {
		frmElm.submitted = false;
		let tempId = this.generateRandomId(i);
		let tempObjUser = {
			category_id: this.ServiceSubCat[i].id,
			hourly_rate: '',
			id: tempId,
			model_name: this.ServiceSubCat[i].name.split(' ').join('_') + tempId,
			price_label_name: 'Service Rate',
			unit_name: '',
			recurring_work_type_type: this.getrecurval(i, this.ServiceSubCat[i].name.split(' ').join('_') + tempId),
			user_task_details_arr: []
		};

		this.profileServicesModel.servicerate[tempObjUser.model_name] = '';
		this.profileServicesModel.unitName[tempObjUser.model_name] = '';
		/*if(this.ServiceSubCat[i].billing_rate==3)
		  	this.profileServicesModel.billingrate[tempObjUser.model_name] = 1;*/
		this.ServiceSubCat[i].user_category.push(tempObjUser);
		console.log(this.profileServicesModel);
	}

	/**
	 * Removes this user cat
	 * @param serviceCatIndex 
	 * @param userCatIndex 
	 */
	removeThisUserCat(serviceCatIndex, userCatIndex) {
		let tempModelName = this.ServiceSubCat[serviceCatIndex].user_category[userCatIndex].model_name;
		this.ServiceSubCat[serviceCatIndex].user_category.splice(userCatIndex, 1);
		delete this.profileServicesModel.servicerate[tempModelName];
		delete this.profileServicesModel.unitName[tempModelName];
		if (this.ServiceSubCat[serviceCatIndex].billing_rate == 3) {
			delete this.profileServicesModel.billingrate[tempModelName];
		}
	}

	/**
	 * Checks change
	 * @param index 
	 * @param frmelm 
	 */
	checkChange(index, frmelm) {
		if (this.ServiceSubCat[index].has_usr_cat == 0) {
			this.ServiceSubCat[index].has_usr_cat = 1;
			this.selectedServiceCheckData = true;
			if (this.ServiceSubCat[index].user_category.length == 0) {
				this.addUser_category(index, frmelm);
			}
		} else {
			this.ServiceSubCat[index].has_usr_cat = 0;
			let tempHasCatCheck = false;
			for (let property in this.ServiceSubCat) {
				if (this.ServiceSubCat.hasOwnProperty(property)) {
					console.log(this.ServiceSubCat[property]['has_usr_cat']);
					if (this.ServiceSubCat[property]['has_usr_cat'] != 0) {
						tempHasCatCheck = true;
					}
				}
			}
			//this.selectedServiceCheckData = tempHasCatCheck;		
		}
	}



	/**
	 * Doers service success
	 * @param response 
	 */
	doerServiceSuccess(response) {
		this.responseMessageSnackBar(response.msg);
		this.getServiceoffred();
	}


	/*Service offered for displaying data */
	getServiceoffred() {
		this.commonservice.postHttpCall({ url: '/doers/get-services-offered-test', data: {}, contenttype: 'application/json' }).then(result => this.serviceOfferedSuccess(result));
	}

	/**
	 * Services offered success
	 * @param response 
	 */
	serviceOfferedSuccess(response) {
		if (response.status == 1) {
			console.log(response.data);
			this.serviceOffered = response.data;
			setTimeout(() => {
				if (this.inEditMode) {
					let tempData = this.serviceOffered.filter((val) => {
						let innerTemp = val['children'].filter((innerVal) => {
							if (innerVal['doer_categories']['id'] == this.toEditData['doer_categories']['id']) {
								return innerVal;
							}
						});
						return innerTemp[0];
					});
					console.log(tempData);
					this.toEditData = tempData[0];
				}
			}, 0);
			if (this.serviceOffered.length > 0) {
				this.listingPopulated.emit(true);
			} else {
				this.listingPopulated.emit(false);
			}
		}
		//this.responseMessageSnackBar(response.msg);
	}

	public submitPrice(indx) {
		console.log('service_sub_cat', this.ServiceSubCat[indx]);
	}


	/**
	 * Checks error fields name
	 * @param frmelm 
	 * @returns  
	 */
	checkErrorFieldsName(frmelm) {
		let errorMsg = [];
		let tempFormObj = frmelm.form.controls;
		for (let key in tempFormObj) {
			if (tempFormObj.hasOwnProperty(key)) {
				//console.log(tempFormObj[key].status);
				let tempStatus = tempFormObj[key].status;
				if (tempStatus == 'INVALID') {
					errorMsg.push(key.toString());
				}
			}
		}
		return errorMsg;
	}

	/**
	 * Responses message snack bar
	 * @param message 
	 * @param [res_class] 
	 * @param [verticalPos] 
	 */
	public responseMessageSnackBar(message, res_class: any = '', verticalPos: any = 'bottom') {
		this.snackBar.open(message, '', {
			duration: 4000,
			horizontalPosition: 'right',
			verticalPosition: verticalPos,
			panelClass: res_class
		});
	}

}
