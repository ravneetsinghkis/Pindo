import { Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonService } from '../../../../../../commonservice';
import { Globalconstant } from '../../../../../../global_constant';
import * as moment from 'moment';

@Component({
	selector: 'course-dialog',
	templateUrl: './choose-optiondialog.component.html',
	styleUrls: ['./choose-optiondialog.component.scss']
})
export class CourseDialogComponent implements OnInit {

	display_data: any = {};
	choosePaymentMethodForm: FormGroup;
	paymentSubmit: boolean = false;
	selectedPaymentMethod: any = [];
	amount_with_ccard_charges: any;
	amount_with_ach_charges: any;

	@Output() onAddNewMilestoneReqstSend = new EventEmitter();
	@Output() onChoosePaymentMethod = new EventEmitter();
	@Output() onSendingQuotaionBeforeHire = new EventEmitter();
	@Output() paymentRequestSend = new EventEmitter();
	@Output() paymentInfoRequestSend = new EventEmitter();


	chosenSkipOption: string;
	chosenPaymentOptionModel: any;

	skipOptions: string[] = ['Normal Milestone', 'Additional Milestone'];
	chosenPaymentOptionList: any = [];
	doer_name: string = '';
	totalPinCost: any;
	totalPinFrees: any;

	constructor(
		public commonservice: CommonService,
		public gbConstant: Globalconstant,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		public snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<CourseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		// console.log("MODAL DATA = ",data);
		this.totalPinCost = data;
		// console.log('****DDD*******', this.totalPinCost);


		this.totalPinFrees = ((data.totalQuationAmount * data.admin_commission_percentage) / 100);
		if (this.totalPinFrees < .5) {
			this.totalPinFrees = .5;
		}
		this.totalPinFrees = this.totalPinFrees.toFixed(2);
		this.doer_name = parseInt(atob(localStorage.getItem('profile_type'))) == 2 ? localStorage.getItem('company_name') : localStorage.getItem('name');
	}

	ngOnInit() {
		this.display_data = this.data;
		this.chosenPaymentOptionList = [];
		if (this.display_data['option'] == 'choose_payment') {

			let amount_with_ccard_charges = (this.display_data.totalData.totalPrice * 2.9 / 100) + 0.30;
			let amount_with_ach_charges = this.display_data.totalData.totalPrice * 0.8 / 100;
			this.amount_with_ccard_charges = amount_with_ccard_charges.toFixed(2);
			this.amount_with_ach_charges = amount_with_ach_charges.toFixed(2);
			if (this.amount_with_ccard_charges > 250) {
				this.amount_with_ccard_charges = 250;
			}
			if (this.amount_with_ach_charges > 5) {
				this.amount_with_ach_charges = 5;
			}

			let tempData = this.display_data['totalData']['paymentOptions'];

			if (tempData['accept_payment_by_bank'] == 1) {
				this.chosenPaymentOptionList.push({ 'isSelected': true, 'value': '4', 'text': 'Accept by Bank Account' });
			}
			if (tempData['accept_payment_by_cards'] == 1) {
				this.chosenPaymentOptionList.push({ 'isSelected': true, 'value': '1', 'text': 'Accept by Credit Card' });
			}
			if (tempData['accept_payment_by_cash'] == 1) {
				this.chosenPaymentOptionList.push({ 'isSelected': true, 'value': '2', 'text': 'Accept in Cash' });
			}
			if (tempData['accept_payment_by_cheque'] == 1) {
				this.chosenPaymentOptionList.push({ 'isSelected': true, 'value': '3', 'text': 'Accept By Check' });
			}
			this.createPaymentMethodForm();
		}

		let payment_method = this.display_data['payment_method'];
		if (payment_method == 3) {
			this.skipOptions = ['Additional Milestone'];
		} else {
			this.skipOptions = ['Normal Milestone', 'Additional Milestone'];
		}
	}


	close() {
		this.dialogRef.close();
	}

	/**
	 * Applys choose
	 */
	applyChoose() {
		let mlstnType: any;
		if (this.chosenSkipOption == 'Normal Milestone') {
			mlstnType = 0;
		} else if (this.chosenSkipOption == 'Additional Milestone') {
			mlstnType = 1;
		}
		this.sendCreateNewMilestoneReqst(this.chosenSkipOption);
	}


	/**
	 * Creates payment method form
	 */
	createPaymentMethodForm() {
		this.choosePaymentMethodForm = this.fb.group({
			'payment_method': ['', Validators.required],
			'description': [''],
		});
	}

	/**
		 * Gets select payment receive methods
		 * @returns select payment receive methods
		 */
	getSelectPaymentReceiveMethods(): any {
		this.selectedPaymentMethod = [];
		for (let i = 0; i < this.chosenPaymentOptionList.length; i++) {
			if (this.chosenPaymentOptionList[i].isSelected) {
				this.selectedPaymentMethod.push(this.chosenPaymentOptionList[i].value);
			}
		}
		return this.selectedPaymentMethod;
	}

	/**
	 * Requests payment release
	 * @param validate
	 */
	requestPaymentRelease(validate) {
		this.paymentSubmit = true;
		this.selectedPaymentMethod = this.getSelectPaymentReceiveMethods();
		if (validate) {
			if (this.selectedPaymentMethod.length > 0) {
				this.paymentSubmit = false;
				let form_data = {
					//'paymentType':this.choosePaymentMethodForm.value.payment_method,
					'description': this.choosePaymentMethodForm.value.description,
					'quotation_id': this.display_data['totalData']['quotation_id'],
					'pin_id': this.display_data['totalData']['applicationDetails']['pin_id'],
					'pinner_id': this.display_data['totalData']['applicationDetails']['posted_by'],
					'doer_id': this.display_data['totalData']['applicationDetails']['doer_id'],
					'paymentType': this.selectedPaymentMethod
				};

				this.commonservice.postHttpCall({ url: '/doers/request-for-payment', data: form_data, contenttype: 'application/json' }).then(result => this.onRequestPaymentReleaseSuccess(result));
			}
		}

	}

	/**
	 * Determines whether request payment release success on
	 * @param response
	 */
	onRequestPaymentReleaseSuccess(response) {
		this.close();
		if (response.status == 1) {
			let postData = {
				'sender_id': atob(localStorage.getItem('frontend_user_id')),
				'reciver_id': this.display_data['totalData']['fetchedPinDetails']['pinner_id'],

				'title': 'Doer ' + this.doer_name + ' has requested payment on Pin ' + this.display_data['totalData']['fetchedPinDetails']['title'] + '.',
				'link': 'pinner/active-quotation-details/' + this.display_data['totalData']['fetchedPinDetails']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
				'show_in_todo': 1,
				'todo_title': 'Doer ' + this.doer_name + ' has requested payment on Pin ' + this.display_data['totalData']['fetchedPinDetails']['title'] + '.',
				'todo_link': 'pinner/active-quotation-details/' + this.display_data['totalData']['fetchedPinDetails']['slug'] + '/' + localStorage.getItem('frontend_user_id'),

				'doer_title': 'The Pinner has been notified that Pin ' + this.display_data['totalData']['fetchedPinDetails']['title'] + ' is completed and is expecting your invoice.',
				'doer_link': 'doer/apply-pins/' + this.display_data['totalData']['fetchedPinDetails']['slug'],
				'doer_show_in_todo': 1,
				'doer_todo_title': 'The Pinner has been notified that Pin ' + this.display_data['totalData']['fetchedPinDetails']['title'] + ' is completed and is expecting your invoice.',
				'doer_todo_link': 'doer/apply-pins/' + this.display_data['totalData']['fetchedPinDetails']['slug'],

				'pin_id': this.display_data['totalData']['fetchedPinDetails']['id'],
				'emailTemplateSlug': 'payment_request_submitted_by_doer',
				'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',
			};

			// var postDataPinner = {

			//     'sender_id': atob(localStorage.getItem('frontend_user_id')),
			//     'reciver_id': this.display_data['totalData']['fetchedPinDetails']['pinner_id'],

			//     'title': 'Pin ' + this.display_data['totalData']['fetchedPinDetails']['title'] + ' has been completed!  It’s time to send in payment, and review your Doer.',
			//     'link': 'pinner/active-quotation-details/' + this.display_data['totalData']['fetchedPinDetails']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
			//     'show_in_todo': 1,
			//     'todo_title': 'Pin ' + this.display_data['totalData']['fetchedPinDetails']['title'] + ' has been completed!  It’s time to send in payment, and review your Doer.',
			//     'todo_link': 'pinner/active-quotation-details/' + this.display_data['totalData']['fetchedPinDetails']['slug'] + '/' + localStorage.getItem('frontend_user_id'),

			//     'pin_id': this.display_data['totalData']['fetchedPinDetails']['id'],
			//     'emailTemplateSlug': '',
			//     'doerEmailTemplateSlug': '',

			// };

			this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postData);
			setTimeout(() => {
				this.gbConstant.notificationSocket.emit('post-notification-to-doer-himself', postData);
			}, 5000);
			// setTimeout(() => {
			//     this.gbConstant.notificationSocket.emit("post-notification-to-pinner", postDataPinner);
			// }, 5000);

			this.paymentRequestSend.emit();
			this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
			this.commonservice.changePaymentRequest(true);
			this.router.navigate(['doer/dashboard']);
		} else {
			this.responseMessageSnackBar(response.msg, 'error');
		}

	}

	/*nevigateToActivePinListing(){
			this.router.navigate(['pinner/my-pins']);
	}*/


	/**
	 * Sends create new milestone reqst
	 * @param mlstnType
	 */
	sendCreateNewMilestoneReqst(mlstnType) {
		this.onAddNewMilestoneReqstSend.emit(mlstnType);
		this.close();
	}

	/**
	 * Onsends create new milestone reqst success
	 * @param response
	 */
	onsendCreateNewMilestoneReqstSuccess(response) {
		if (response.status == 1) {
			this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
			this.onAddNewMilestoneReqstSend.emit(true);
			this.close();
		}
	}

	/**
	 * Proceed to charge pinner
	 */
	proceedToChargePinner() {
		this.onSendingQuotaionBeforeHire.emit(true);
		this.close();
	}

	/**
	 * Prevents quotation
	 */
	preventQuotation() {
		this.onSendingQuotaionBeforeHire.emit(false);
		this.close();
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
	 * Send data
	 * @param val Number
	 */
	sendConfirmationData(value: number) {
		this.commonservice.listenBidPageMoveDialogData(value);
		this.close();
	}

	goToAccountPaymentSettings() {
		this.paymentInfoRequestSend.emit(true);
		this.close();
	}

}
