import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
declare var loadImage: any;
var currentFile = null, sourceimage;

@Component({
  selector: 'account-setting-basic-details',
  templateUrl: './account-setting-basic-details.component.html',
  styleUrls: ['./account-setting-basic-details.component.scss']
})
export class AccountSettingBasicDetailsComponent implements OnInit {
  @Input() isHiddenBasicDetails;
  @ViewChild('popUpVar') popupref;

  imageObj: any = null;
  exceedSizeLimit = false;
  basicDetailsForm: FormGroup;
  oldBasicDetailsFormModel: any = {};
  basicDetailsFormModel = {
    profile_type: '',
    name: '',
    first_name: '',
    last_name: '',
    username: '',
    company_name: '',
    description: '',
    company_logo_img: null
  };

  imgUrl: string = '';
  ckEditorConfig = {};
  // fileToUpload: File = null;
  // fileToUploadBackup: File = null;
  doer_logo: string = 'assets/images/default-userImg-orange-square.svg';
  imageUrl_own: string = 'assets/images/default-userImg-orange-square.svg';
  // backupImg: any;
  // photo: any;
  clearFlag: number;
  // photo_url: any;
  userType: any;
  submitted: boolean = false;
  // temp_image: any = '';
  // globalURL: any;

  @Output() profileBasicDetails = new EventEmitter();

  crewMemberDetails: any;

  constructor(
    private fb: FormBuilder,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {

    // this.globalURL = this.myGlobals.uploadUrl;
    this.getProfileDetails();
    this.basicDetailsForm = this.fb.group({
      profileType: ['', Validators.compose([Validators.required])],
      // name: ['', Validators.compose([Validators.required])],
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      company_name: ['', Validators.compose([Validators.required])],
      description: [''],
    });
    this.ckEditorConfig = {
      uiColor: '#ffffff',
      toolbar: [
        ['-', 'Bold', 'Italic', 'Underline'],
        {
          name: 'paragraph',
          items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
        },
      ],
      height: 160,
      removePlugins: 'elementspath',
      resize_enabled: false
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    sourceimage = <HTMLImageElement>document.querySelector('#image');
  }

  togglePopup() {
    this.clearFlag = 0;

    // this.fileToUpload = null;
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      sourceimage.src = this.imageUrl_own;
    } else {
      currentFile = null;
      if (this.basicDetailsFormModel.company_logo_img && this.basicDetailsFormModel.company_logo_img != 'null') {
        this.imageUrl_own = this.myGlobals.uploadUrl + '/company_logo/' + this.basicDetailsFormModel.company_logo_img;
      } else {
        this.imageUrl_own = this.doer_logo;
      }
      sourceimage.src = this.imageUrl_own;

      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  get userDetailsController() { return this.basicDetailsForm.controls; }

  getProfileDetails() {
    this.commonservice.postHttpCall({
      url: '/doers/get-basic-details',
      data: {},
      contenttype: 'application/json'
    })
      .then(result => this.profileDetailsSuccess(result));
  }

  profileDetailsSuccess(response) {
    if (response.status == 1) {
      this.basicDetailsFormModel.company_logo_img = null;

      if (response.data.company_logo && response.data.company_logo != 'null') {
        // this.temp_image = response.data.company_logo;
        // this.photo_url = response.data.company_logo;
        this.imageUrl_own = this.myGlobals.uploadUrl + '/company_logo/' + response.data.company_logo;
        this.basicDetailsFormModel.company_logo_img = response.data.company_logo;
        sourceimage.src = this.myGlobals.uploadUrl + '/company_logo/' + response.data.company_logo;

      }
      //  else {
      // this.temp_image = null;
      // this.photo_url = null;
      // }
      this.userType = response.data.profile_type;
      this.basicDetailsFormModel.profile_type = response.data.profile_type.toString();
      // this.basicDetailsFormModel.name = response.data.name;
      this.basicDetailsFormModel.first_name = response.data.first_name;
      this.basicDetailsFormModel.last_name = response.data.last_name;
      this.basicDetailsFormModel.username = response.data.username;
      this.basicDetailsFormModel.company_name = response.data.company_name;
      this.basicDetailsFormModel.description = response.data.description;
      localStorage.setItem('doer_profile_type', btoa(response.data.profile_type));
      // this.basicDetailsFormModel.company_logo_img = this.temp_image;

      this.oldBasicDetailsFormModel = JSON.parse(JSON.stringify(this.basicDetailsFormModel));
      if (response.data.profile_type == 1) {
        // this.basicDetailsForm.removeControl('company_name');
        this.basicDetailsForm.controls['company_name'].setValidators(null);
      } else {
        // this.basicDetailsForm.removeControl('username');
        this.basicDetailsForm.controls['username'].setValidators(null);
      }
      this.basicDetailsForm.controls['username'].updateValueAndValidity();
      this.basicDetailsForm.controls['company_name'].updateValueAndValidity(); 
      this.setFormDetailsValue(response.data);

      // this.basicDetailsFormModel.tag_line = response.data.tag_line;
      // this.basicDetailsFormModel.profile_type = response.data.profile_type;
      // this.basicDetailsFormModel.username = response.data.username;
      // console.log(this.basicDetailsFormModel.username);
      this.profileBasicDetails.emit(response);

      this.getCrewMemberDetails(response.data.id);
    }
  }

  /**
   * Sets form details value
   * @param basicDetails 
   */
  setFormDetailsValue(basicDetails: any) {
    if (this.userType == 1) {
      this.basicDetailsForm.patchValue({
        profileType: basicDetails.profile_type.toString(),
        // name: basicDetails.name,
        first_name: basicDetails.first_name,
        last_name: basicDetails.last_name,
        username: basicDetails.username,
        description: basicDetails.description,
      });
    } else {
      this.basicDetailsForm.patchValue({
        profileType: basicDetails.profile_type.toString(),
        // name: basicDetails.name,
        first_name: basicDetails.first_name,
        last_name: basicDetails.last_name,
        company_name: basicDetails.company_name,
        description: basicDetails.description,
      });
    }
  }

  /**
   * Files change handler
   * @param event 
   */
  fileChangeHandler(event) {
    event.preventDefault();
    var file = event.target.files[0];
    if (!file) {
      return;
    }
    currentFile = file;
    this.displayImage(file);
  }

  /**
   * Displays image
   * @param file 
   */
  displayImage(file) {
    var options = {
      maxWidth: 1024,
      canvas: true,
      pixelRatio: window.devicePixelRatio,
      downsamplingRatio: 0.5,
      orientation: true
    };

    if (!loadImage(file, this.updateResults, options)) {
      alert('Your browser does not support the URL or FileReader API.');
    }
  }

  /**
   * Updates results
   * @param img 
   * @param data 
   */
  updateResults(img, data) {
    var fileName = currentFile.name;
    var href = currentFile.url || img.src;
    var dataURLStart;
    if (img.src || img instanceof HTMLCanvasElement) {
      if (!href) {
        href = img.toDataURL(currentFile.type);
        // Check if file type is supported for the dataURL export:
        dataURLStart = 'data:' + currentFile.type;
        if (href.slice(0, dataURLStart.length) !== dataURLStart) {
          fileName = fileName.replace(/\.\w+$/, '.png');
        }
      }
    }
    sourceimage.src = href;
  }


  clearImage() {
    this.clearFlag = 1;
    currentFile = null;
    this.imageUrl_own = this.doer_logo;
    sourceimage.src = this.imageUrl_own;
    // this.photo = null;
    // this.photo_url = null;
    // this.fileToUpload = null;
    // this.imageUrl_own = null;
    // this.temp_image = null;
  }

  submitDetails() {
    console.log('*****', this.basicDetailsForm.get('description').value);

    let desc: any;
    if (this.basicDetailsForm.get('description').value == null) {
      desc = '';
    } else {
      desc = this.basicDetailsForm.get('description').value;
    }


    this.submitted = true;
    if (this.basicDetailsForm.invalid) {
      return;
    }
    /* else if (this.basicDetailsForm.get('name').value.trim() == '') {
     this.basicDetailsForm.patchValue({
       name: this.basicDetailsForm.get('name').value.trim(),
     });
     return;
   } else if (this.userType == 1 && this.basicDetailsForm.get('username').value.trim() == '') {
     this.basicDetailsForm.patchValue({
       username: this.basicDetailsForm.get('username').value.trim(),
     });
     return;
   } else if (this.userType == 2 && this.basicDetailsForm.get('company_name').value.trim() == '') {
     this.basicDetailsForm.patchValue({
       company_name: this.basicDetailsForm.get('company_name').value.trim(),
     });
     return;
   } else if (this.basicDetailsForm.get('description').value) {
     this.basicDetailsForm.patchValue({
       description: this.basicDetailsForm.get('description').value,
     });
     return;
   } */
    else {
      this.submitted = false;
      const fd = new FormData();
      if (this.basicDetailsForm.get('profileType').value == 1) {
        // fd.append('name', this.basicDetailsForm.get('name').value.trim());
        fd.append('username', this.basicDetailsForm.get('username').value.trim());
        // fd.append('company_name', this.oldBasicDetailsFormModel.company_name);
      } else {
        // fd.append('name', this.basicDetailsForm.get('name').value.trim());
        // fd.append('username', this.oldBasicDetailsFormModel.username);
        fd.append('company_name', this.basicDetailsForm.get('company_name').value.trim());
      }
      fd.append('first_name', this.basicDetailsForm.get('first_name').value);
      fd.append('last_name', this.basicDetailsForm.get('last_name').value);
      fd.append('description', desc);
      fd.append('profile_type', this.basicDetailsForm.get('profileType').value);

      // if (this.fileToUpload) {
      //   this.photo = this.fileToUpload;
      // } else {
      //   if (this.clearFlag == 0) {
      //     this.photo = this.photo_url;
      //   }
      // }

      let photo = currentFile ? this.commonservice.dataURItoBlob(sourceimage.src) : this.clearFlag == 0 ? this.basicDetailsFormModel.company_logo_img : null;

      fd.append('company_logo', photo);
      // fd.append('company_logo', this.photo);

      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/edit-doer-user-profile',
        data: fd, contenttype: ''
      })
        .then(result => this.submitSuccess(result));
    }
  }


  submitSuccess(response) {
    if (response.status == 1) {
      this.getProfileDetails();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.commonservice.filter('Register click');
      this.togglePopup();
      localStorage.setItem('profile_type', btoa(this.basicDetailsForm.get('profileType').value));
			localStorage.setItem('user_first_name', btoa(this.basicDetailsForm.get('first_name').value));
			localStorage.setItem('company_name', btoa(this.basicDetailsForm.get('company_name').value));
			localStorage.setItem('user_name', btoa(this.basicDetailsForm.get('username').value));      
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  populateUserData() {
    this.commonservice.postHttpCall({ url: '/get-user-profile', data: {}, contenttype: 'application/json' }).then(result => this.onpopulateUserData(result));
  }

  onpopulateUserData(response) {
    if (response.status) {
      this.myGlobals.userData = response.data;
      // console.log('HERE I AM');

    }
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

  resetFunction(frmElm) {
    frmElm.reset();
    frmElm.submitted = false;
  }

  closeModal() {
    if (this.checkValueUpdateORNot()) {
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
          this.submitDetails();
        } else {
          this.setPreviousDataWithOutSavingBackTime();
        }
      });
    } else {
      this.setPreviousDataWithOutSavingBackTime();
    }
  }

  setPreviousDataWithOutSavingBackTime() {
    this.basicDetailsFormModel.profile_type = this.oldBasicDetailsFormModel.profile_type;
    // this.basicDetailsFormModel.name = this.oldBasicDetailsFormModel.name;
    this.basicDetailsFormModel.first_name = this.oldBasicDetailsFormModel.first_name;
    this.basicDetailsFormModel.last_name = this.oldBasicDetailsFormModel.last_name;
    this.basicDetailsFormModel.company_name = this.oldBasicDetailsFormModel.company_name;
    this.basicDetailsFormModel.description = this.oldBasicDetailsFormModel.description;
    this.basicDetailsFormModel.company_logo_img = this.oldBasicDetailsFormModel.company_logo_img;
    // this.temp_image = this.oldBasicDetailsFormModel.company_logo_img;
    this.imageUrl_own = this.myGlobals.uploadUrl + '/company_logo/' + this.basicDetailsFormModel.company_logo_img;
    this.setFormDetailsValue(this.basicDetailsFormModel);
    this.togglePopup();
  }

  checkValueUpdateORNot(): boolean {

    if (this.userType == 1) {
      const description = this.basicDetailsForm.get('description').value;
      /* if (this.basicDetailsForm.get('description')) {
        description = this.basicDetailsForm.get('description').value.trim();
      } */
      if (
        // this.basicDetailsFormModel.name != this.basicDetailsForm.get('name').value.trim() 
        this.basicDetailsFormModel.first_name != this.basicDetailsForm.get('first_name').value.trim() 
        || this.basicDetailsFormModel.last_name != this.basicDetailsForm.get('last_name').value.trim() 
        || this.basicDetailsFormModel.description != description
        || this.basicDetailsFormModel.username != this.basicDetailsForm.get('username').value.trim()
        || this.basicDetailsFormModel.profile_type != this.basicDetailsForm.get('profileType').value
        || currentFile || this.clearFlag) {
        return true;
      } else {
        return false;
      }
    } else {
      const description = this.basicDetailsForm.get('description').value;
      /* if (this.basicDetailsForm.get('description')) {
        description = this.basicDetailsForm.get('description').value.trim();
      } */
      if (
        this.basicDetailsFormModel.company_name != this.basicDetailsForm.get('company_name').value.trim()
        // || this.basicDetailsFormModel.name != this.basicDetailsForm.get('name').value.trim()
        || this.basicDetailsFormModel.first_name != this.basicDetailsForm.get('first_name').value.trim()
        || this.basicDetailsFormModel.last_name != this.basicDetailsForm.get('last_name').value.trim()
        || this.basicDetailsFormModel.description != description
        || this.basicDetailsFormModel.profile_type != this.basicDetailsForm.get('profileType').value
        || currentFile) {
        return true;
      } else {
        return false;
      }
    }
  }

  profileTypeChanged() {
    let selectedValue = this.basicDetailsForm.get('profileType').value;

    if (selectedValue == "1") {
      this.basicDetailsForm.controls['username'].setValidators([Validators.required]);
      this.basicDetailsForm.controls['company_name'].setValidators(null);
    } else if (selectedValue == "2") {
      this.basicDetailsForm.controls['username'].setValidators(null);
      this.basicDetailsForm.controls['company_name'].setValidators([Validators.required]);
    }

    this.basicDetailsForm.controls['username'].updateValueAndValidity();
    this.basicDetailsForm.controls['company_name'].updateValueAndValidity();    
  }

  /**
   * Get Crew Member Details
   */
  getCrewMemberDetails(user_id) {
    this.commonservice.postHttpCall({
      url: '/crew-member-details',
      data: { 
        user_id: btoa( user_id )
      },
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.crewMemberDetails = result.data;
      }
    })
    .catch(error => console.log(error));
  }   

}
