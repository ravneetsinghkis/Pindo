import { Component, Inject,  OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CommonService } from '../../../commonservice';
import { FormBuilder } from '@angular/forms';

@Component({
	selector: 'course-dialog',
	templateUrl: './course-dialog.component.html',
	styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

	description: string;
	display_data: any = {};
	chooseLocation: any = '';
	submitted = false;
	user_type: any = '';
	options: any = [];
	@ViewChild('placesRef') placesRef: any;

	constructor(
		public commonservice: CommonService,
		public formBuilder: FormBuilder,
		public snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<CourseDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {

		if (localStorage.getItem('user_type')) {
			this.user_type = atob(localStorage.getItem('user_type'));
		}
	}

	ngOnInit() {
		this.display_data = this.data;
		console.log("display_data: ", this.display_data);
	}
	ngAfterViewinit() {

	}

	public handleAddressChange(address: any) {
		address['formatted_address'] = address['formatted_address'].substr(0, address['formatted_address'].lastIndexOf(','));

		let tempLat = address.geometry.location.lat();
		let tempLng = address.geometry.location.lng();
		// this.commonservice.addressHeader = address;
		// this.commonservice.headeraddresslat = tempLat;
		// this.commonservice.headeraddressLng = tempLng;
		this.chooseLocation = address['formatted_address'];

		// localStorage.setItem('pindo_system_current_position_lat', tempLat);
		// localStorage.setItem('pindo_system_current_position_lng', tempLng);
		// localStorage.setItem('pindo_system_current_position_address', address['formatted_address']);
		this.commonservice.setHeaderAddress(address['formatted_address'],tempLat,tempLng);
		// this.commonservice.filterHeaderAddressChange(true);
	}


	/**
	 * Closes course dialog component
	 */
	close() {
		this.dialogRef.close();
	}

	/**
	 * Submits form
	 */
	submitForm() {
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
}
