import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
declare var loadImage:any;
var currentFile=null,sourceimage;
@Component({
  selector: 'account-setting-basic-details',
  templateUrl: './account-setting-basic-details.component.html',
  styleUrls: ['./account-setting-basic-details.component.scss'],
  // animations: [
  //   // Each unique animation requires its own trigger. The first argument of the trigger function is the name
  //   trigger('rotatedState', [
  //     state('default', style({ transform: 'rotate(0)' })),
  //     state('rotated1', style({ transform: 'rotate(90deg)' })),
  //     state('rotated2', style({ transform: 'rotate(180deg)' })),
  //     state('rotated3', style({ transform: 'rotate(270deg)' })),
  //     // state('default', style({ transform: 'rotate(360deg)' })),
  //     transition('default => rotated1', animate('200ms ease-out')),
  //     transition('rotated1 => rotated2', animate('200ms ease-out')),
  //     transition('rotated2 => rotated3', animate('200ms ease-out')),
  //     transition('rotated3 => default', animate('200ms ease-in')),
  //   ])
  // ]
})
export class AccountSettingBasicDetailsComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  @Input() basicDetails;
  @Output() profileBasicDetails = new EventEmitter();
  ckEditorConfig = {};
  profile_url: string;
  user_id: any;
  update_profile: FormGroup;
  user_data_own: any = {};
  pinner_logo: string = 'assets/images/default-userImg-green.svg';
  imageUrl_own: any = '';
  submitted: boolean = false;
  backupBasicDetails: any = {};
  backupImg: any;
  clearFlag: number;

  constructor(
    private fb: FormBuilder,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {
    this.ckEditorConfig = {
      uiColor: '#ffffff',
      toolbar: [
        ['-', 'Bold', 'Italic', 'Underline'],
        {
          name: 'paragraph',
          items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
        },
      ],
      height: 200,
      removePlugins: 'elementspath',
      resize_enabled: false
    };
    
  }

  ngOnInit() {
    this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.user_id = atob(localStorage.getItem('frontend_user_id'));
    this.createPostFormBuild();
  }

  ngAfterViewInit() {
    sourceimage = <HTMLImageElement>document.querySelector('#image');
  }

  // rotate() {
  //   if (this.state == 'default') {
  //     this.state = 'rotated1';
  //   } else if (this.state == 'rotated1') {
  //     this.state = 'rotated2';
  //   } else if (this.state == 'rotated2') {
  //     this.state = 'rotated3';
  //   } else if (this.state == 'rotated3') {
  //     this.state = 'default';
  //   }
  // }

  createPostFormBuild() {
    this.update_profile = this.fb.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      bio: [''],
    });
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    this.clearFlag = 0;
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.backupBasicDetails = { ...this.basicDetails };
      currentFile = null;
      if (this.basicDetails.profile_photo && this.basicDetails.profile_photo != 'null') {
        this.imageUrl_own = this.myGlobals.uploadUrl + '/profile_photo/' + this.basicDetails.profile_photo;
      } else {
        this.imageUrl_own = this.pinner_logo;
      }
       sourceimage.src = this.imageUrl_own;

      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Closes modal
   */
  closeModal() {
    if (this.checkValueUpdateORNot()) {
      Swal({
        title: this.myGlobals.updateDataBackAlertMsg,
        text: '',
        //type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'YES',
        cancelButtonText: 'BACK',
      }).then((resultswal) => {
        if (resultswal.value) {
          this.togglePopup();
          this.basicDetails.first_name = this.backupBasicDetails.first_name;
          this.basicDetails.last_name = this.backupBasicDetails.last_name;
          this.basicDetails.username = this.backupBasicDetails.username;
          this.basicDetails.bio = this.backupBasicDetails.bio;
        }
      });
    } else {
      this.togglePopup();
    }
  }

  /**
   * Determines whether submit update profile on
   * @returns  
   */
  onSubmitUpdateProfile() {
    this.submitted = true;
    if (this.update_profile.invalid) {
      return;
    }
    if (this.update_profile.get('first_name').value.trim() == '') {
      this.update_profile.patchValue({
        first_name: this.update_profile.get('first_name').value.trim(),
      });
      return;
    }

    if (this.update_profile.get('last_name').value.trim() == '') {
      this.update_profile.patchValue({
        last_name: this.update_profile.get('last_name').value.trim(),
      });
      return;
    }

    if (this.update_profile.get('username').value.trim() == '') {
      this.update_profile.patchValue({
        username: this.update_profile.get('username').value.trim(),
      });
      return;
    } else {

      const formData = new FormData();
      formData.append('first_name', this.basicDetails.first_name);
      formData.append('last_name', this.basicDetails.last_name);
      formData.append('username', this.basicDetails.username);
      if (this.basicDetails.bio) {
        formData.append('bio', this.basicDetails.bio.trim());
      } else {
        formData.append('bio', this.basicDetails.bio);
      }


      let photo = currentFile?this.commonservice.dataURItoBlob(sourceimage.src):this.clearFlag==0?this.backupBasicDetails.profile_photo:null;
      
      formData.append('profile_photo', photo);

      // const formData ={};
      // formData['first_name'] = this.basicDetails.first_name;
      // formData['last_name'] = this.basicDetails.last_name;
      // formData['username'] = this.basicDetails.username;
      // formData['bio'] = this.basicDetails.bio?this.basicDetails.bio.trim():this.basicDetails.bio;

      // this.photo = currentFile?this.dataURItoBlob(sourceimage.src):this.clearFlag==0?this.backupBasicDetails.profile_photo:'';
      
      // formData['profile_photo'] = this.photo;


      // console.log("FORMDATA= ",formData);
      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/edit-profile',
        data: formData, contenttype: ''
      })
        .then(result => {
          if (result.status == 1) {
            this.togglePopup();
            this.responseMessageSnackBar(result.msg);
            this.profileBasicDetails.emit(true);
            this.commonservice.filter('Register click');
          } else {
            this.responseMessageSnackBar(result.msg,"error");
          }
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
      return
    }
    currentFile = file;
    this.displayImage(file)
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
    }

    if (!loadImage(file, this.updateResults, options)) {
      alert("Your browser does not support the URL or FileReader API.");
    }
  }

  /**
   * Updates results
   * @param img 
   * @param data 
   */
  updateResults(img, data) {
    var fileName = currentFile.name
    var href = currentFile.url || img.src
    var dataURLStart
    if (img.src || img instanceof HTMLCanvasElement) {
      if (!href) {
        href = img.toDataURL(currentFile.type)
        // Check if file type is supported for the dataURL export:
        dataURLStart = 'data:' + currentFile.type
        if (href.slice(0, dataURLStart.length) !== dataURLStart) {
          fileName = fileName.replace(/\.\w+$/, '.png');
        }
      }
    }
    sourceimage.src= href;
  }
 
/**
 * Clears image
 */
clearImage() {
  this.clearFlag = 1;
  currentFile = null;
  this.imageUrl_own = this.pinner_logo;
  sourceimage.src = this.imageUrl_own;
}

/**
 * Checks value update ornot
 * @returns true if value update ornot 
 */
checkValueUpdateORNot(): boolean {
  let bio = this.update_profile.get('bio').value;
  if (this.update_profile.get('bio').value != null) {
    bio = this.update_profile.get('bio').value.trim();
  }
  let bioBackup = this.backupBasicDetails.bio;
  if (this.backupBasicDetails.bio) {
    bioBackup = this.backupBasicDetails.bio.trim();
  }
  if (this.basicDetails.first_name !== this.backupBasicDetails.first_name || this.basicDetails.last_name !== this.backupBasicDetails.last_name || this.basicDetails.username !== this.backupBasicDetails.username
    || bio !== bioBackup
    || currentFile || this.clearFlag == 1) {
    return true;
  } else {
    return false;
  }
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
}
