import { Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { InviteDoerComponent } from '../invite-doer.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonService } from '../../../../../commonservice';
import { Globalconstant } from '../../../../../global_constant';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
declare var jQuery: any;
declare var $: any;
declare var io: any;

@Component({
	selector: 'pinner-list-dialog',
	templateUrl: './pinner-list-dialog.html',
	styleUrls: ['./pinner-list-dialog.scss']
})
export class PinnerListDialogComponent implements OnInit {
	pinner_list = [];
	display_data: any = {};
	selectedDoerId: any;
	@Output() onEndorsing = new EventEmitter();
	originalSubcategoryList = [];

	constructor(
		public commonservice: CommonService,
		private router: Router,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		public snackBar: MatSnackBar,
		public gbConst: Globalconstant,
		private dialogRef: MatDialogRef<PinnerListDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {

	}

	ngOnInit() {
		//console.log('this.data',this.data);
		this.pinner_list = this.data.hired_list;
		console.log(this.display_data.doerID);
		//this.pinnerList();
	}
	ngAfterViewinit() {
	}

	save() {
		this.dialogRef.close();
	}

	close() {
		this.dialogRef.close();
	}

	// pinnerList() {
	// 	this.commonservice.postHttpCall({ url: '/hired-by-pinner-list', data: { 'doer_id': this.display_data['doerID'] }, contenttype: 'application/json' }).then(result => this.pinnerListSuccess(result));
	// }

	// pinnerListSuccess(response) {
	// 	if (response.status == 1) {
	// 		this.pinner_list = response.data;
	// 	}
	// }

	openUserDetails(blog_id) {
		const b64 = CryptoJS.AES.encrypt(`${blog_id}`, 'Secret Key').toString();
		const e64 = CryptoJS.enc.Base64.parse(b64);
		const eHex = e64.toString(CryptoJS.enc.Hex);
		// console.log(eHex);
		this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
	}

	public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
		this.snackBar.open(message, '', {
			duration: 4000,
			horizontalPosition: 'right',
			verticalPosition: vertical_position,
			panelClass: res_class
		});
	}
}
