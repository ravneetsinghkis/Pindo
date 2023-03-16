// // import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
// // import { CommonService } from '../../../../commonservice';
// // import { MatSnackBar } from '@angular/material';
// // import { Globalconstant } from '../../../../global_constant';
// // import { FormBuilder } from '@angular/forms';
// // import { Inject, Output, EventEmitter } from '@angular/core';
// // import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
// // import { FormGroup, Validators } from '@angular/forms';
// // import Swal from 'sweetalert2';

// // @Component({
// //   selector: 'account-setting-basic-details',
// //   templateUrl: './account-setting-basic-details.component.html',
// //   styleUrls: ['./account-setting-basic-details.component.scss']
// // })
// // export class AccountSettingBasicDetailsComponent implements OnInit {
// //   @ViewChild('popUpVar')
// //   popupref;
// //   user_id: any;
// //   user_data_own: any = {};
// //   old_user_data: any = {};
// //   profile_url: string;
// //   company_url: string;
// //   fileToUpload: File = null;
// //   pinner_logo: string = 'assets/images/default-userImg-green.svg';
// //   doer_logo: string = 'assets/images/default-userImg-orange.svg';
// //   imageUrl_own: string = '';
// //   submitted: boolean = false;
// //   update_profile: FormGroup;
// //   @Output() listingPopulated = new EventEmitter();

// //   constructor(@Inject(MAT_DIALOG_DATA) public data: any,
// //     public dialog: MatDialog,
// //     private fb: FormBuilder,
// //     public commonservice: CommonService,
// //     public renderer: Renderer2,
// //     public el: ElementRef,
// //     public snackBar: MatSnackBar,
// //     public myGlobals: Globalconstant) {

// //   }
// //   ngOnInit() {
// //     this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
// //     this.company_url = this.myGlobals.uploadUrl + '/company_logo/';
// //     this.user_id = atob(localStorage.getItem('frontend_user_id'));
// //     this.createPostFormBuild();
// //   }
// //   /**
// //    * Toggles popup
// //    */
// //   togglePopup() {
// //     if (this.popupref.nativeElement.classList.contains('opened')) {
// //       this.renderer.removeClass(this.popupref.nativeElement, 'opened');
// //       this.renderer.removeClass(document.body, 'popup-open');
// //     } else {
// //       // this.imageObj=null;
// //       // this.getProfileDetails();
// //       this.renderer.addClass(this.popupref.nativeElement, 'opened');
// //       this.renderer.addClass(document.body, 'popup-open');
// //     }
// //   }
// //   closeModal() {
// //     if (this.checkValueUpdateORNot()) {
// //       Swal({
// //         title: this.myGlobals.updateDataBackAlertMsg,
// //         text: '',
// //         //type: 'warning',
// //         showCancelButton: true,
// //         confirmButtonColor: '#bad141',
// //         confirmButtonText: 'YES',
// //         cancelButtonText: 'BACK',
// //       }).then((resultswal) => {
// //         if (resultswal.value) {
// //           this.togglePopup();
// //         }
// //       });
// //     } else {
// //       this.togglePopup();
// //     }
// //   }
// //   createPostFormBuild() {
// //     this.update_profile = this.fb.group({
// //       first_name: ['', Validators.compose([Validators.required])],
// //       last_name: ['', Validators.compose([Validators.required])],
// //       username: ['', Validators.compose([Validators.required])],
// //     });
// //   }

// //   /**
// //    * Gets user details own
// //    * @param user_id 
// //    */
// //   getUserDetailsOwn(user_id) {
// //     this.commonservice.postCommunityHttpCall({ url: '/api/pinner/public-user-details', data: { id: user_id }, contenttype: 'application/json' }).then(result => {
// //       if (result.status == 1) {
// //         this.user_data_own = result.data.rows[0];
// //         this.old_user_data = { ...this.user_data_own };
// //         if (this.user_data_own.user_type == 1) {
// //           if (this.user_data_own.profile_photo != null && this.user_data_own.profile_photo != '') {
// //             this.imageUrl_own = this.profile_url + this.user_data_own.profile_photo;
// //           } else {
// //             this.imageUrl_own = this.pinner_logo;
// //           }
// //         } else {
// //           if (this.user_data_own.company_logo != null && this.user_data_own.company_logo != '') {
// //             this.imageUrl_own = this.company_url + this.user_data_own.company_logo;
// //           } else {
// //             this.imageUrl_own = this.doer_logo;
// //           }
// //         }
// //         this.old_user_data.profile_image = this.imageUrl_own;
// //       }
// //     });
// //   }

// //   /**
// //    * Determines whether submit update profile on
// //    * @returns  
// //    */
// //   onSubmitUpdateProfile() {
// //     this.submitted = true;
// //     if (this.update_profile.invalid) {
// //       return;
// //     }
// //     if (this.update_profile.get('first_name').value.trim() == '') {
// //       this.update_profile.patchValue({
// //         first_name: this.update_profile.get('first_name').value.trim(),
// //       });
// //       return;
// //     }

// //     if (this.update_profile.get('last_name').value.trim() == '') {
// //       this.update_profile.patchValue({
// //         last_name: this.update_profile.get('last_name').value.trim(),
// //       });
// //       return;
// //     }

// //     if (this.update_profile.get('username').value.trim() == '') {
// //       this.update_profile.patchValue({
// //         username: this.update_profile.get('username').value.trim(),
// //       });
// //       return;
// //     } else {
// //       const formData: FormData = new FormData();
// //       formData.append('first_name', this.user_data_own.first_name);
// //       formData.append('last_name', this.user_data_own.last_name);
// //       formData.append('username', this.user_data_own.username);
// //       if (this.fileToUpload) {
// //         formData.append('profile_photo', this.fileToUpload, this.fileToUpload.name);
// //       }
// //       this.commonservice.postCommunityHttpCall({
// //         url: '/api/pinner/edit-profile',
// //         data: formData, contenttype: ''
// //       })
// //         .then(result => {
// //           if (result.status == 1) {
// //             this.togglePopup();
// //             this.responseMessageSnackBar(result.msg);
// //             this.listingPopulated.emit(true);
// //             this.commonservice.filter('Register click');
// //           }
// //         });
// //     }
// //   }

// //   /**
// //    * Handles file input
// //    * @param file 
// //    */
// //   handleFileInput(file: FileList) {
// //     this.fileToUpload = file.item(0);
// //     let reader = new FileReader();
// //     reader.onload = (event: any) => {
// //       this.imageUrl_own = event.target.result;
// //     };
// //     reader.readAsDataURL(this.fileToUpload);
// //   }

// //   /**
// //    * Checks value update ornot
// //    * @returns true if value update ornot 
// //    */
// //   checkValueUpdateORNot(): boolean {
// //     if (this.old_user_data.first_name != this.user_data_own.first_name
// //       || this.old_user_data.last_name != this.user_data_own.last_name
// //       || this.old_user_data.username != this.user_data_own.username
// //       || this.old_user_data.profile_image != this.imageUrl_own) {
// //       return true;
// //     } else {
// //       return false;
// //     }
// //   }

// //   /**
// //    * Responses message snack bar
// //    * @param message 
// //    * @param [res_class] 
// //    */
// //   public responseMessageSnackBar(message, res_class = '') {
// //     this.snackBar.open(message, '', {
// //       duration: 4000,
// //       horizontalPosition: 'right',
// //       panelClass: res_class
// //     });
// //   }
// // }

// import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
// import { CommonService } from '../../../../commonservice';
// import { MatSnackBar } from '@angular/material';
// import { Globalconstant } from '../../../../global_constant';
// import { FormBuilder } from '@angular/forms';
// @Component({
//   selector: 'account-setting-basic-details',
//   templateUrl: './account-setting-basic-details.component.html',
//   styleUrls: ['./account-setting-basic-details.component.scss']
// })
// export class AccountSettingBasicDetailsComponent implements OnInit {
//   @ViewChild('popUpVar')
//   popupref;
//   constructor(private fb: FormBuilder, public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant) {
//   }
//   ngOnInit() {
//   }
//   /**
//    * Toggles popup
//    */
//   togglePopup() {
//     if (this.popupref.nativeElement.classList.contains('opened')) {
//       this.renderer.removeClass(this.popupref.nativeElement, 'opened');
//       this.renderer.removeClass(document.body, 'popup-open');
//     } else {
//       // this.imageObj=null;
//       // this.getProfileDetails();
//       this.renderer.addClass(this.popupref.nativeElement, 'opened');
//       this.renderer.addClass(document.body, 'popup-open');
//     }
//   }
// }
