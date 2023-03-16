import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from '../../../../global_constant';

declare var $: any;

@Component({
	selector: 'app-profile-certificates',
	templateUrl: './certificates.html',
	styleUrls: ['./certificates.scss']
})
export class CertificatesComponent implements OnInit {

	@Input()
	isHiddenCertificates = false;
	@Output() listingPopulated = new EventEmitter();

	@ViewChild('popUpVar')
	popupref;

	public name = '';
	public reference_no = '';
	public description = '';
	public licenseID = '';
	public showList: boolean = false;
	public populateCertificateListing = [];
	public files: any = '';
	attachedfileerror: any = '';
	baseUrl: any;

	multipleFile: any = [];

	constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public gbConst: Globalconstant) {
		this.baseUrl = gbConst.uploadUrl;
	}

	/**
	 * on init
	 */
	ngOnInit() {
		this.populateListing();
		console.log(this.popupref.nativeElement.classList.contains('asdasd'));
	}

	/**
	 * Toggles popup
	 */
	togglePopup() {
		if (this.popupref.nativeElement.classList.contains('opened')) {
			this.renderer.removeClass(this.popupref.nativeElement, 'opened');
			this.renderer.removeClass(document.body, 'popup-open');
		}
		else {
			this.renderer.addClass(this.popupref.nativeElement, 'opened');
			this.renderer.addClass(document.body, 'popup-open');
		}
	}

	/**
	 * Submits function
	 * @param values 
	 * @param validcheck 
	 * @param totForm 
	 * @param submitType 
	 */
	submitFunction(values, validcheck, totForm, submitType) {
		if (submitType == 'save and continue') {
			totForm.submitted = true;
		}
		if (validcheck) {
			let fd = new FormData();
			var item = {};
			Object.keys(values).forEach(function (key) {
				item[key] = (values[key] == null) ? '' : values[key];
				fd.append(key, values[key]);
			});
			//fd.append('attachment_file',this.upload_file);

			if (this.multipleFile.length > 0) {
				for (let i in this.multipleFile) {
					if (this.multipleFile[i]['id']) {
						fd.append('files[]', JSON.stringify(this.multipleFile[i]))
					}
					else {
						fd.append('attachment_file[]', this.multipleFile[i]);
					}
				}
			}

			/*if (this.upload_file) {
				fd.append('attachment_file',this.upload_file);
			} */
			if (this.licenseID == '') {
				this.commonservice.postHttpCall({ url: '/doers/add-certificate', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result, totForm, submitType));
			}
			else {
				fd.append('id', this.licenseID);
				//values['id'] = this.licenseID;
				this.commonservice.postHttpCall({ url: '/doers/update-certificate', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result, totForm, submitType));
			}
		}

	}

	/**
	 * Submits success
	 * @param response 
	 * @param frmElm 
	 * @param submitType 
	 */
	submitSuccess(response, frmElm, submitType) {
		if (response.status == 1) {
			this.multipleFile = [];
			if (submitType != 'save and continue')
				this.togglePopup();
			this.populateListing();
			this.responseMessageSnackBar(response.msg,'orangeSnackBar');
			this.resetFunction(frmElm);
		}
	}

	/**
	 * Populates listing
	 */
	populateListing() {
		this.commonservice.postHttpCall({ url: '/doers/certificate-listing', contenttype: "application/json" }).then(result => this.populateSuccess(result));
	}

	/**
	 * Deletes success
	 * @param response 
	 */
	deleteSuccess(response) {
		if (response.status == 1) {
			this.licenseID = '';
			this.responseMessageSnackBar(response.msg,'orangeSnackBar');
			this.populateListing();
		}
		else{
			this.responseMessageSnackBar(response.msg,'error');
		}

	}

	/**
	 * Populates success
	 * @param response 
	 */
	populateSuccess(response) {
		console.log(response);
		if (response.status == 1) {
			this.populateCertificateListing = JSON.parse(JSON.stringify(response.data));
			if (this.populateCertificateListing.length > 0) {
				this.listingPopulated.emit(true);
			} else {
				this.listingPopulated.emit(false);
			}
		}
	}

	/**
	 * Edits this license
	 * @param index 
	 */
	editThisLicense(index) {
		this.name = this.populateCertificateListing[index].name;
		this.reference_no = this.populateCertificateListing[index].reference_no;
		this.description = this.populateCertificateListing[index].description;
		this.licenseID = this.populateCertificateListing[index].id;
		if (this.populateCertificateListing[index]['documents'])
			this.multipleFile = this.populateCertificateListing[index]['documents'];
	}

	/**
	 * Removes this license
	 * @param index 
	 */
	removeThisLicense(index) {
		this.licenseID = this.populateCertificateListing[index].id;
		let values = { 'id': this.licenseID };
		Swal({
			title: 'Are you sure?',
			text: 'You will not be able to recover this certificate!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#bad141',
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, keep it'
		}).then((result) => {
			if (result.value) {
				this.commonservice.postHttpCall({ url: '/doers/remove-certificate', data: values, contenttype: "application/json" }).then(result => this.deleteSuccess(result));
			}
		})
	}

	/**
	 * Resets function
	 * @param frmElm 
	 */
	resetFunction(frmElm) {
		frmElm.reset();
		frmElm.submitted = false;
		this.licenseID = '';
		this.multipleFile = [];
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

	/**
	 * Determines whether change on
	 * @param fileInput 
	 */
	public onChange(fileInput: any) {
		this.files = [].slice.call(fileInput.target.files);
		console.log(this.files);
		//var filename = this.readURL(fileInput);

		if (fileInput.target.files && fileInput.target.files[0]) {
			let properFileType = true;
			let tempFilestack = [];
			for (let fileIndex in this.files) {
				//console.log(this.files[fileIndex]['name']);
				let filetype = this.files[fileIndex]['name'].split('.');
				filetype = filetype[filetype.length - 1];
				if (filetype == "jpeg" || filetype == "jpg" || filetype == "pdf" || filetype == "png" || filetype == "docx" || filetype == "doc") {
					tempFilestack.push(this.files[fileIndex]);
				}
				else {
					properFileType = false;
				}
			}
			if (!properFileType) {
				this.attachedfileerror = 'Only image/pdf/doc/docx formats are allowed!';
				tempFilestack = [];
			}
			else {
				this.multipleFile.push(...tempFilestack);
				this.attachedfileerror = '';
			}
			console.log(this.multipleFile);
			$(fileInput.target).val("");
		}
	}

	/**
	 * Removes file
	 * @param index 
	 */
	removeFile(index) {
		this.multipleFile.splice(index, 1);
	}
}
