import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import Swal from 'sweetalert2';
declare var loadImage: any;
var currentFile = null, sourceimage;

@Component({
  selector: 'update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  user_id: any;
  user_data_own: any = {};
  old_user_data: any = {};
  profile_url: string;
  company_url: string;
  // fileToUpload: any = null;
  imageUrl_own: any = '';

  pinner_logo: string = 'assets/images/default-userImg-green.svg';
  doer_logo: string = 'assets/images/default-userImg-orange.svg';

  @ViewChild('popUpVar') popupref;
  submitted: boolean = false;
  update_profile: FormGroup;
  @Output() listingPopulated = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {

  }

  /**
   * Toggles popup (close the popup)
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      currentFile = null;
      sourceimage.src = this.pinner_logo;
      this.getUserDetailsOwn(this.user_id);
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  ngOnInit() {
    this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.company_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.user_id = atob(localStorage.getItem('frontend_user_id'));
    this.createPostFormBuild();
  }

  ngAfterViewInit() {
    sourceimage = <HTMLImageElement>document.querySelector('#image');
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
        }
      })
    } else {
      this.togglePopup();
    }
  }

  /**
   * For form validation
   */
  createPostFormBuild() {
    this.update_profile = this.fb.group({
      first_name: ['', Validators.compose([Validators.required])],
      last_name: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
    });
  }

  /**
   * Gets user details own
   * @param user_id 
   */
  getUserDetailsOwn(user_id) {
    this.imageUrl_own = this.pinner_logo;;
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/public-user-details', data: { id: user_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.user_data_own = result.data.rows[0];
        this.old_user_data = { ...this.user_data_own };
        // console.log(this.old_user_data);

        if (this.user_data_own.user_type == 1) {
          if (this.user_data_own.profile_photo != null && this.user_data_own.profile_photo != '' && this.user_data_own.profile_photo != 'null') {
            this.imageUrl_own = this.profile_url + this.user_data_own.profile_photo;
          }
        } else {
          if (this.user_data_own.company_logo != null && this.user_data_own.company_logo != '') {
            this.imageUrl_own = this.company_url + this.user_data_own.company_logo;
          } else {
            this.imageUrl_own = this.doer_logo;
          }
        }

        sourceimage.src = this.imageUrl_own;
        // this.old_user_data.profile_image = this.imageUrl_own;
      }
    });
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
      const formData: FormData = new FormData();
      formData.append('first_name', this.user_data_own.first_name);
      formData.append('last_name', this.user_data_own.last_name);
      formData.append('username', this.user_data_own.username);

      // if (this.fileToUpload) {
      //   formData.append('profile_photo', this.fileToUpload, this.fileToUpload.name);
      // }
      let photo = currentFile ? this.commonservice.dataURItoBlob(sourceimage.src) : this.user_data_own.profile_photo;
      console.log(photo);
      formData.append('profile_photo', photo);

      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/edit-profile',
        data: formData, contenttype: ''
      })
        .then(result => {
          if (result.status == 1) {
            this.togglePopup();
            this.responseMessageSnackBar(result.msg);
            this.listingPopulated.emit(true);
            this.commonservice.filter('Register click');
          }
        });
    }
  }

  /**
   * Handles file input
   * @param file 
   */
  // handleFileInput(file: FileList) {
  //   this.fileToUpload = file.item(0);
  //   var reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.imageUrl_own = event.target.result;
  //   }
  //   reader.readAsDataURL(this.fileToUpload);
  // }


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
    sourceimage.src = href;
  }

  /**
   * Checks value update ornot
   * @returns true if value update ornot 
   */
  checkValueUpdateORNot(): boolean {
    if (this.old_user_data.first_name != this.user_data_own.first_name
      || this.old_user_data.last_name != this.user_data_own.last_name
      || this.old_user_data.username != this.user_data_own.username
      || currentFile) {
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