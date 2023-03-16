import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-pinner-list-dialog',
  templateUrl: './pinner-list-dialog.component.html',
  styleUrls: ['./pinner-list-dialog.component.scss']
})
export class PinnerListDialogComponent implements OnInit {

	@Output() onEndorsing = new EventEmitter();
	pinner_list = [];
	display_data: any = {};
	selectedDoerId: any;
	originalSubcategoryList = [];  

  constructor(
		public commonservice: CommonService,
		private router: Router,
		public snackBar: MatSnackBar,
		public gbConst: Globalconstant,
		private dialogRef: MatDialogRef<PinnerListDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any    
  ) { }

  ngOnInit() {
    this.pinner_list = this.data.hired_list;
  }

	save() {
		this.dialogRef.close();
	}

	close() {
		this.dialogRef.close();
	}  

	openUserDetails(blog_id) {
		const b64 = CryptoJS.AES.encrypt(`${blog_id}`, 'Secret Key').toString();
		const e64 = CryptoJS.enc.Base64.parse(b64);
		const eHex = e64.toString(CryptoJS.enc.Hex);
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
