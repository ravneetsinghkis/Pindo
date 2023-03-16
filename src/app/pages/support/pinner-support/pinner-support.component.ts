import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../commonservice';
import { ToastrService } from 'ngx-toastr';
import { myValidator } from './../email-validator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pinner-support',
  templateUrl: './pinner-support.component.html',
  styleUrls: ['./pinner-support.component.scss']
})
export class PinnerSupportComponent implements OnInit {
  pinner_support: FormGroup;
  total_filename_pinner = [];
  pinnerFileUploadError = false;
  submitted = true;
  files = [];
  readOnly = false;

  @Input() subjectOptns = [];
  @ViewChild('pinnerForm') pinnerForm;
  userDetail = {};


  constructor(public commonservice: CommonService, private _fb: FormBuilder, public snackBar: MatSnackBar, private toastr: ToastrService, private router: Router, private location: Location) { }

  ngOnInit() {
    this.createPinnerForm();
    this.getUserDetails();
  }

  getUserDetails() {
    this.commonservice.postHttpCall({ url: '/get-user-details', data: {}, contenttype: 'application/json' }).then((result) => this.ongetUserDetailsSuccess(result));
  }

  ongetUserDetailsSuccess(response) {
    if (response.status == 1 && response.data.user_type == 1) {
      this.userDetail = response.data;
      this.pinner_support['controls']['first_name'].patchValue(this.userDetail['first_name']);
      this.pinner_support['controls']['last_name'].patchValue(this.userDetail['last_name']);
      this.pinner_support['controls']['emailGroup']['controls']['email'].patchValue(this.userDetail['email']);
      this.pinner_support['controls']['emailGroup']['controls']['confirmEmail'].patchValue(this.userDetail['email']);
      this.readOnly = true;
    }

  }

  createPinnerForm() {
    this.pinner_support = this._fb.group({
      'subject': ['', Validators.required],
      'first_name': [(JSON.stringify(this.userDetail) != '{}') ? this.userDetail['first_name'] : '', Validators.required],
      'last_name': [(JSON.stringify(this.userDetail) != '{}') ? this.userDetail['last_name'] : '', Validators.required],
      'emailGroup': this._fb.group({
        'email': [(JSON.stringify(this.userDetail) != '{}') ? this.userDetail['email'] : '', [Validators.required, Validators.email]],
        'confirmEmail': [(JSON.stringify(this.userDetail) != '{}') ? this.userDetail['email'] : '', [Validators.required, Validators.email]],
      }, {
        validator: myValidator('email', 'confirmEmail')
      }),
      'description': ['', Validators.required]
    });
    // if((JSON.stringify(this.userDetail) != '{}')) {
    // 	this.pinner_support['controls']['first_name'].readOnly();
    // 	this.pinner_support.updateValueAndValidity(); 
    // }
  }

  deleteFile(index) {
    this.total_filename_pinner.splice(index, 1);
  }

  onSubmitPinnerForm(form) {
    event.preventDefault();
    event.stopPropagation();
    this.submitted = true;
    console.log(this.pinner_support);
    if (this.pinner_support.valid) {
      let fd = new FormData();
      let values = this.pinner_support.value;
      Object.keys(values).forEach(function (key) {
        if (key == 'emailGroup') {
          for (let emailKey in values[key]) {
            if (values[key].hasOwnProperty(emailKey) && emailKey != 'confirmEmail') {
              fd.append(emailKey, values[key][emailKey]);
            }
          }
        } else {
          fd.append(key, values[key]);
        }
      });
      //fd.append('attachment[]', totalFileObj);
      for (let val of this.total_filename_pinner) {
        let totalFileObj = val;
        fd.append('attachment[]', totalFileObj);
      }
      fd.append('user_type', '1');
      this.commonservice.postHttpCall({ url: '/submit-support', data: fd, contenttype: 'form-data' }).then((result) => this.onSubmitPinnerFormSuccess(result));
    }
  }

  onSubmitPinnerFormSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      this.pinnerForm.resetForm();
      this.submitted = false;
      this.total_filename_pinner = [];
      if (JSON.stringify(this.userDetail) != '{}') {
        this.pinner_support['controls']['first_name'].patchValue(this.userDetail['first_name']);
        this.pinner_support['controls']['last_name'].patchValue(this.userDetail['last_name']);
        this.pinner_support['controls']['emailGroup']['controls']['email'].patchValue(this.userDetail['email']);
        this.pinner_support['controls']['emailGroup']['controls']['confirmEmail'].patchValue(this.userDetail['email']);
        this.readOnly = true;
      }
      this.location.back();
      // Swal({
      //   title: 'Support Request Submitted',
      //   text: '',
      //   type: 'success',
      //   showCancelButton: true,
      //   confirmButtonColor: '#bad141',
      //   cancelButtonColor: '#bad141',
      //   confirmButtonText: 'HOME',
      //   cancelButtonText: 'SUBMIT ANOTHER REQUEST'
      // }).then((result) => {
      //   if (result.value) {
      //     this.router.navigate(['/']);
      //   }
      // });
    }
  }

  //######################### Select and Upload Attachment ###########################//

  public onChange(fileInput: any, fileuploadFor = 'pinner') {
    this.files = [].slice.call(fileInput.target.files);
    var filename = this.readURL(fileInput.target, fileuploadFor);
    if (fileInput.target.files && fileInput.target.files[0]) {
      // this.chatImage = fileInput.target.files[0];
    }
  }


  public readURL(input, fileuploadFor) {
    var url = input.value;
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files) {
      for (let i = 0; i < input.files.length; i++) {
        // let fName = input.files[i].name.replace(/^.*\\/, "");
        let fileType = input.files[i]['name'].split('.');
        fileType = fileType[fileType.length - 1];
        let filesize = input.files[i]['size'];
        if (fileType == 'png' || fileType == 'jpeg' || fileType == 'jpg' || fileType == 'gif' || fileType == 'pdf' || fileType == 'doc' || fileType == 'docx') {
          console.log('asdasdasd', filesize);
          if (filesize > 2 * 1024 * 1024) {
            // this.responseMessageSnackBar(`File Size Exceeded for File Named ${input.files[i]['name']}`,'error','top');
            this.showError(`File Size Exceeded for File Named ${input.files[i]['name']}`, 'File Size Exceeded');
          } else {
            this.total_filename_pinner.push(input.files[i]);
          }
        } else {
          if (fileuploadFor == 'pinner') {
            // this.pinnerFileUploadError = true;
            this.showError(`Only png/jpeg/jpg/gif/pdf/doc/docx allowed`, 'InValid File Format');
            // this.responseMessageSnackBar('Only png/jpeg/jpg/gif/pdf/doc/docx allowed','error','top');
          }
        }
      }
    }
  }

  showError(msg, errorHeading) {
    this.toastr.error(msg, errorHeading);
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
