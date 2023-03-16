import { Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Globalconstant } from '../../../../../global_constant';
import { CommonService } from '../../../../../commonservice';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
	selector: 'course-dialog',
	templateUrl: './choose-optiondialog.component.html',
	styleUrls: ['./choose-optiondialog.component.scss']
})
export class CourseDialogComponent implements OnInit {
	form: FormGroup;
	description: string;
	display_data: any = {};
	payment_receive_mode: any;
	tempObj: any = {};
	uploadUrl: any;
	reasons: any = [];
	paymentRejectForm: FormGroup;
	submitted: boolean = false;
	creditCardCharges: any;
	grossAmount: any;
	pin_details: any = {};
	pinner_details = {};
	chosenPaymentOption: any = [];
	payment_method: any = 0;
	pinDetail_receive: any;

	@Output() onAddNewMilestoneReqstSend = new EventEmitter();
	@Output() backToPaymentConfimationSweetAlert = new EventEmitter();

	chosenSkipOption: string;
	skipOptions: string[] = ['Normal Milestone', 'Additional Milestone'];
	favoriterelasePaymentOptns: string = '';
	relasePaymentOptns = ['Pay the Doer Now and Close the Job', 'Reject the Request'];

	constructor(
		public commonservice: CommonService,
		private router: Router,
		private route: ActivatedRoute,
		public myGlobalsQuot: Globalconstant,
		private fb: FormBuilder,
		public snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<CourseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {

		this.uploadUrl = myGlobalsQuot.uploadUrl;
	}

	/**
	 * on init
	 */
	ngOnInit() {
		console.log('this.data', this.data.tempObj.user_details.name);
		this.payment_receive_mode = this.data.payment_receive_mode;
		this.pinDetail_receive = this.data.pinDetailTempData;
		this.pin_details = this.data.tempObj['pin_details'];
		// console.log('pin_details= ', this.pin_details);
		this.pinner_details = this.data.tempObj['pinner_details'];
		this.tempObj = this.data.tempObj.quotations;
		// console.log('pin_title', this.pin_details['title']);
		// Creating payment select option for pinner to pay the amount
		if (this.tempObj.payment_method.length > 0) {
			for (let index = 0; index < this.tempObj.payment_method.length; index++) {

				if (this.tempObj.payment_method[index] == '1') {
					this.chosenPaymentOption.push({ 'value': '1', 'text': 'Pay by Credit Card' });
					if (this.payment_method == 0) {
						this.payment_method = '1';
					}
				}

				if (this.tempObj.payment_method[index] == '2') {
					this.chosenPaymentOption.push({ 'value': '2', 'text': 'Pay in Cash' });
					if (this.payment_method == 0) {
						this.payment_method = '2';
					}
				}

				if (this.tempObj.payment_method[index] == '3') {
					this.chosenPaymentOption.push({ 'value': '3', 'text': 'Pay in Check' });
					if (this.payment_method == 0) {
						this.payment_method = '3';
					}
				}

				if (this.tempObj.payment_method[index] == '4') {
					this.chosenPaymentOption.push({ 'value': '4', 'text': 'Pay by Bank Account' });
					if (this.payment_method == 0) {
						this.payment_method = '4';
					}
				}

			}

			if (this.payment_method == '1') {
				this.creditCardCharges = ((this.tempObj.total_quotation_amount * 2.9) / 100) + 0.30;
				this.grossAmount = this.tempObj.total_quotation_amount + this.creditCardCharges;
			}
		}

		//console.log('this.chosenPaymentOption', this.chosenPaymentOption);
		// Calculating credit card payment charges and adding to total quotation amount.
		/*if(this.tempObj.payment_mode==1){
				this.creditCardCharges = ((this.tempObj.total_quotation_amount*2.9)/100)+0.30;
				this.grossAmount = this.tempObj.total_quotation_amount+this.creditCardCharges;
		}*/
		this.createPaymentRejectForm();
		console.log('tttttyyy', this.pinDetail_receive);
	}

	/**
	 * Determines whether change payment method on
	 * @param event
	 */
	onChangePaymentMethod(event) {

		// Calculating credit card payment charges and adding to total quotation amount.
		setTimeout(() => {
			console.log('this.payment_method', this.payment_method);
			if (this.payment_method == '1') {
				this.creditCardCharges = ((this.tempObj.total_quotation_amount * 2.9) / 100) + 0.30;
				this.grossAmount = this.tempObj.total_quotation_amount + this.creditCardCharges;
			}
		}, 300);

	}

	ngAfterViewinit() { }

	ngOnDestroy() { }


	/**
	 * Closes course dialog component
	 */
	close() {
		this.dialogRef.close();
	}

	/*********************************************************************************************************
	*                           Payment reject form and back process                                         *
	**********************************************************************************************************/
	createPaymentRejectForm() {

		this.reasons = [{ 'title': 'Job not complete' }, { 'title': 'Problem with job done' }, { 'title': 'Job total is incorrect' }, { 'title': 'Other' }];
		this.paymentRejectForm = this.fb.group({
			'reason': ['', Validators.required],
			'description': ['', Validators.required],
		});

	}

	//While going back from payment reject popup form choose complete payment option.
	choosePaymentRequest() {
		this.backToPaymentConfimationSweetAlert.emit(true);
	}


	/*********************************************************************************************************
	*                       Completing payment and colose the Job                                            *
	**********************************************************************************************************/
	public acceptPayment() {

		console.log('this.tempObj', this.tempObj);
		let formData = {
			'doer_id': this.tempObj.doer_id,
			'quotation_id': this.tempObj.id,
			'pin_id': this.tempObj.pin_id,
			'application_id': this.tempObj.application_id,
			'payment_method': this.payment_method
		};
		console.log('this.formData', formData);
		if (this.payment_method == '1' || this.payment_method == '4') {
			this.commonservice.postHttpCall({ url: '/pinners/complete-payment', data: formData, contenttype: 'application/json' }).then(result => this.completePaymentSuccess(result));
		} else {
			this.completeOfflinePayment(formData);
		}
	}

	/**
	 * Completes payment success
	 * @param response
	 */
	completePaymentSuccess(response) {
		if (response.status == 1) {
			Swal('PAYMENT SUCCESS!', 'Your payment has been processed and your job is now complete.', 'success');
			var postData = {
				'sender_id': atob(localStorage.getItem('frontend_user_id')),
				'reciver_id': this.tempObj['doer_id'],
				'title': 'Pinner ' + localStorage.getItem('name') + ' has submitted payment for your completed job. Thanks for using PinDo!',
				'pin_id': this.tempObj['pin_id'],
				'show_in_todo': 0,
				'link': 'doer/apply-pins/' + this.pin_details['slug'],
				'emailTemplateSlug': 'payment_release_submitted_by_pinner',

				'user_title': 'You’ve paid your Doer. Your job is now complete. Thank you for being a PinDo Pinner!',
				'userEmailTemplateSlug': 'payment_release_submitted_send_by_pinner',
				'user_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),

				'PIN_UNIQUE_ID': this.pinDetail_receive['PIN_UNIQUE_ID'],
				'PINDETAILSURL': this.pinDetail_receive['PINDETAILSURL'],
				'HOME_PAGE_LINK': this.pinDetail_receive['HOME_PAGE_LINK'],
				'ACTIVITY_PAGE_LINK': this.pinDetail_receive['ACTIVITY_PAGE_LINK'],
				'MYPINS_PAGE_LINK': this.pinDetail_receive['MYPINS_PAGE_LINK'],
				'PIN_A_JOB_PAGE': this.pinDetail_receive['PIN_A_JOB_PAGE'],
				'PIN_A_JOB_PAGE_LINK': this.pinDetail_receive['PIN_A_JOB_PAGE_LINK'],

			};


			var postDataPinner = {
				'sender_id': atob(localStorage.getItem('frontend_user_id')),
				'reciver_id': this.tempObj['doer_id'],
				'title': 'Pinner ' + localStorage.getItem('name') + ' has submitted payment for your completed job. Thanks for using PinDo!',
				'pin_id': this.tempObj['pin_id'],
				'show_in_todo': 0,
				'link': 'doer/apply-pins/' + this.pin_details['slug'],
				'emailTemplateSlug': 'payment_release_submitted_by_pinner',

				'user_title': 'You’ve paid your Doer. Your job is now complete. Thank you for being a PinDo Pinner!',
				'userEmailTemplateSlug': 'payment_release_submitted_send_by_pinner',
				'user_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),

				'PIN_UNIQUE_ID': this.pinDetail_receive['PIN_UNIQUE_ID'],
				'PINDETAILSURL': this.pinDetail_receive['PINDETAILSURL'],
				'HOME_PAGE_LINK': 'community/community-home',
				'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
				'MYPINS_PAGE_LINK': 'pinner/my-pins',
				'PIN_A_JOB_PAGE': 'PIN A JOB',
				'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',

			};

			this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

			setTimeout(() => {
				this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postDataPinner);
			}, 3000);
			console.log('online payment= ', postData);
			console.log('online paymentPinner= ', postDataPinner);
		} else if (response.status == 5 || response.status == 4) {
			var title_text = 'No Bank Account Found!';
			var button_text = 'Add Bank!';
			if (response.status == 4) {
				title_text = 'No Card Added!';
				button_text = 'Add Card!';
			}

			Swal({
				title: title_text,
				text: response.msg,
				type: 'error',
				showCancelButton: true,
				confirmButtonColor: '#035670',
				confirmButtonText: button_text,
				cancelButtonText: 'Skip'
			}).then((result) => {
				if (result.value) {
					// this.router.navigate(['/pinner/payment-settings']);
					this.router.navigate(['/pinner/account-settings']);
				}
			})
		} else {
			Swal('PAYMENT FAIL!', response.msg, 'error');

		}
		setTimeout(() => {
			this.onAddNewMilestoneReqstSend.emit(true);
		}, 3000);		
	}


	/*********************************************************************************************************
	*                               Rejecting payment by pinner                                              *
	**********************************************************************************************************/
	public rejectPaymentRequest(validate) {
		this.submitted = true;
		console.log('validate', validate);
		console.log('this.paymentRejectForm', this.paymentRejectForm);
		let formData = {
			'doer_id': this.tempObj.doer_id,
			'quotation_id': this.tempObj.id,
			'pin_id': this.tempObj.pin_id,
			'application_id': this.tempObj.application_id,
			'pinner_id': this.pin_details.pinner_id,
			'reason': this.paymentRejectForm.value.reason,
			'description': this.paymentRejectForm.value.description,
		};
		console.log('formData', this.paymentRejectForm.value.description);
		if (this.paymentRejectForm.value.description.trim() == '' && validate == true) {
			this.responseMessageSnackBar('Description cannot be empty', 'error');
			return;
		}
		if (validate == true) {
			this.close();
			this.commonservice.postHttpCall({ url: '/pinners/reject-payment', data: formData, contenttype: 'application/json' }).then(result => this.rejectPaymentSuccess(result));
		}
	}

	rejectPaymentSuccess(response) {
		this.responseMessageSnackBar(response.msg);
		setTimeout(() => {
			this.onAddNewMilestoneReqstSend.emit(true);
		}, 3000);

		var postData = {
			'sender_id': atob(localStorage.getItem('frontend_user_id')),
			'reciver_id': this.tempObj['doer_id'],
			'title': 'Pinner ' + localStorage.getItem('name') + ' has rejected the payment for the pin ' + this.pin_details['title'],
			'pin_id': this.tempObj['pin_id'],
			'link': 'doer/quotation-preview/' + this.pin_details['slug'],
			'emailTemplateSlug': 'payment_rejected_submitted_by_pinner',
			'show_in_todo': 1,
			'todo_title': 'Your payment request for the Pin named ' + '<b><i>' + this.pin_details['title'] + '</i></b>' + ' has been rejected. Please edit the payment request and resubmit.',
			'todo_link': 'doer/quotation-preview/' + this.pin_details.slug,
			'user_title': this.data.tempObj.user_details.name + ' has been rejected the payment for the pin ' + this.pin_details['title'],
			'userEmailTemplateSlug': 'payment_rejected_submitted_send_by_pinner',
			'user_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),

			'PIN_UNIQUE_ID': this.pinDetail_receive['PIN_UNIQUE_ID'],
			'PINDETAILSURL': this.pinDetail_receive['PINDETAILSURL'],
			'HOME_PAGE_LINK': this.pinDetail_receive['HOME_PAGE_LINK'],
			'ACTIVITY_PAGE_LINK': this.pinDetail_receive['ACTIVITY_PAGE_LINK'],
			'MYPINS_PAGE_LINK': this.pinDetail_receive['MYPINS_PAGE_LINK'],
			'PIN_A_JOB_PAGE': this.pinDetail_receive['PIN_A_JOB_PAGE'],
			'PIN_A_JOB_PAGE_LINK': this.pinDetail_receive['PIN_A_JOB_PAGE_LINK'],
		};

		var postDataPinner = {
			'sender_id': atob(localStorage.getItem('frontend_user_id')),
			'reciver_id': this.tempObj['doer_id'],
			'title': 'Pinner ' + localStorage.getItem('name') + ' has rejected the payment for the pin ' + this.pin_details['title'],
			'pin_id': this.tempObj['pin_id'],
			'link': 'doer/quotation-preview/' + this.pin_details['slug'],
			'emailTemplateSlug': 'payment_rejected_submitted_by_pinner',
			'show_in_todo': 1,
			'todo_title': 'Your payment request for the Pin named ' + '<b><i>' + this.pin_details['title'] + '</i></b>' + ' has been rejected. Please edit the payment request and resubmit.',
			'todo_link': 'doer/quotation-preview/' + this.pin_details.slug,
			'user_title': this.data.tempObj.user_details.name + ' has been rejected the payment for the pin ' + this.pin_details['title'],
			'userEmailTemplateSlug': 'payment_rejected_submitted_send_by_pinner',
			'user_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),

			'PIN_UNIQUE_ID': this.pinDetail_receive['PIN_UNIQUE_ID'],
			'PINDETAILSURL': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),
			'HOME_PAGE_LINK': 'community/community-home',
			'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
			'MYPINS_PAGE_LINK': 'pinner/my-pins',
			'PIN_A_JOB_PAGE': 'PIN A JOB',
			'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
		};

		this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);

		setTimeout(() => {
			this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postDataPinner);
		}, 3000);
		console.log('reject payment= ', postData);
	}

	/*********************************************************************************************************
	*                         Offline payment completion request to doer                                     *
	**********************************************************************************************************/

	public completeOfflinePayment(formData) {
		this.commonservice.postHttpCall({ url: '/pinners/offline-payment-confiramtion-request-to-doer', data: formData, contenttype: 'application/json' }).then(result => this.offlinePaymentSuccess(result));
	}

	offlinePaymentSuccess(response) {
		if (response.status == 1) {
			var postData = {
				'sender_id': atob(localStorage.getItem('frontend_user_id')),
				'reciver_id': this.tempObj['doer_id'],
				// 'title' : ' , payment confirmation request for the pin '+this.pin_details['title']+' has been sent to doer',
				'title': localStorage.getItem('name') + ' indicated that you received payment by cash or check.',
				'pin_id': this.tempObj.pin_id,
				'show_in_todo': 1,
				'todo_title': this.pinner_details['name'] + ' indicated payment has been made by cash or check.  Verify that you’ve received that payment to close the job.',
				'todo_link': 'doer/quotation-preview/' + this.pin_details['slug'],
				'linked_id': this.tempObj['id'],
				'link': 'doer/quotation-preview/' + this.pin_details['slug'],
				// 'emailTemplateSlug': 'payment_release_submitted_by_pinner',
				'emailTemplateSlug': 'payment_release_offline_submitted_by_pinner',
				'user_title': 'payment confirmation request for the pin ' + this.pin_details['title'] + ' has been sent to doer',
				// 'userEmailTemplateSlug': 'payment_release_submitted_send_by_pinner',
				'userEmailTemplateSlug': 'payment_release_offline_submitted_send_by_pinner',
				'user_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),

				'PIN_UNIQUE_ID': this.pinDetail_receive['PIN_UNIQUE_ID'],
				'PINDETAILSURL': this.pinDetail_receive['PINDETAILSURL'],
				'HOME_PAGE_LINK': this.pinDetail_receive['HOME_PAGE_LINK'],
				'ACTIVITY_PAGE_LINK': this.pinDetail_receive['ACTIVITY_PAGE_LINK'],
				'MYPINS_PAGE_LINK': this.pinDetail_receive['MYPINS_PAGE_LINK'],
				'PIN_A_JOB_PAGE': this.pinDetail_receive['PIN_A_JOB_PAGE'],
				'PIN_A_JOB_PAGE_LINK': this.pinDetail_receive['PIN_A_JOB_PAGE_LINK'],
			};

			var postDataPinner = {
				'sender_id': atob(localStorage.getItem('frontend_user_id')),
				'reciver_id': this.tempObj['doer_id'],
				// 'title' : ' , payment confirmation request for the pin '+this.pin_details['title']+' has been sent to doer',
				'title': localStorage.getItem('name') + ' indicated that you received payment by cash or check.',
				'pin_id': this.tempObj.pin_id,
				'show_in_todo': 1,
				'todo_title': this.pinner_details['name'] + ' indicated payment has been made by cash or check.  Verify that you’ve received that payment to close the job.',
				'todo_link': 'doer/quotation-preview/' + this.pin_details['slug'],
				'linked_id': this.tempObj['id'],
				'link': 'doer/quotation-preview/' + this.pin_details['slug'],
				// 'emailTemplateSlug': 'payment_release_submitted_by_pinner',
				'emailTemplateSlug': 'payment_release_offline_submitted_by_pinner',
				'user_title': 'payment confirmation request for the pin ' + this.pin_details['title'] + ' has been sent to doer',
				// 'userEmailTemplateSlug': 'payment_release_submitted_send_by_pinner',
				'userEmailTemplateSlug': 'payment_release_offline_submitted_send_by_pinner',
				'user_link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),

				'PIN_UNIQUE_ID': this.pinDetail_receive['PIN_UNIQUE_ID'],
				'PINDETAILSURL': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + btoa(this.tempObj['doer_id']),
				'HOME_PAGE_LINK': 'community/community-home',
				'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
				'MYPINS_PAGE_LINK': 'pinner/my-pins',
				'PIN_A_JOB_PAGE': 'PIN A JOB',
				'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
			};

			this.myGlobalsQuot.notificationSocket.emit('post-notification-to-doer', postData);
			console.log('offline payment= ', postData);
			console.log('offline payment pinner= ', postDataPinner);
			setTimeout(() => {
				this.myGlobalsQuot.notificationSocket.emit('post-notification-to-pinner-himself', postDataPinner);
			}, 3000);

			this.responseMessageSnackBar(response.msg);
			setTimeout(() => {
				this.onAddNewMilestoneReqstSend.emit(true);
			}, 3000);
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

}
