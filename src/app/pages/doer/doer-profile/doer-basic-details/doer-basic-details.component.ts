import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import { environment } from 'src/environments/environment';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-doer-basic-details',
  templateUrl: './doer-basic-details.component.html',
  styleUrls: ['./doer-basic-details.component.css']
})
export class DoerBasicDetailsComponent implements OnInit {
  @Input()
  isHiddenBasicDetails;

  @ViewChild('popUpVar')
  popupref;

  imageObj: any = null;
  exceedSizeLimit = false;

  basicDetailsFormModel = {
    name: '',
    imageObj: {},
    company_name: '',
    tag_line: '',
    profile_type: 0,
    company_overview: '',
    username: '',
    imgUrl: []
  };

  imgUrl = '';
  perm_img = '';
  baseUrl = '';
  oncesubmitted: boolean = false;

  @Output() ProfileId = new EventEmitter();

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public globalconstant: Globalconstant) {
    this.baseUrl = globalconstant.uploadUrl;
    this.getProfileDetails();
  }

  ngOnInit() {
    //this.responseMessageSnackBar('demo Success Msg','success-color');
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      this.getProfileDetails();
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
      this.getProfileDetails();
    }
  }

  /**
   * Gets profile details
   */
  getProfileDetails() {
    this.commonservice.postHttpCall({ url: '/doers/get-basic-details', data: {}, contenttype: 'application/json' }).then(result => this.profileDetailsSuccess(result));
  }

  /**
   * Profiles details success
   * @param response 
   */
  profileDetailsSuccess(response) {
    if (response.status == 1) {
      this.basicDetailsFormModel.name = response.data.name;
      this.basicDetailsFormModel.company_name = response.data.company_name;
      this.basicDetailsFormModel.tag_line = response.data.tag_line;
      this.basicDetailsFormModel.company_overview = response.data.company_overview;
      this.imgUrl = response.data.company_logo;
      this.perm_img = response.data.company_logo;
      // this.imageObj = response.data.company_logo;
      this.basicDetailsFormModel.profile_type = response.data.profile_type;
      this.basicDetailsFormModel.username = response.data.username;
      console.log(this.basicDetailsFormModel.username);
      this.ProfileId.emit(response.data['id']);
    }
  }

  /**
   * Determines whether delete on
   * @param e 
   */
  onDelete(e) {
    console.log(e);
    this.imageObj = '';
  }

  /**
   * Clears image
   */
  clearImage() {
    this.imageObj = '';
    this.imgUrl = '';
  }

  /**
   * Accpts file
   * @param e 
   */
  accptFile(e) {
    if (e.file['size'] >= 2097152) {
      setTimeout(() => {
        $(document).find('.remove_custom').trigger('click');
        $(document).find('body .input-file-container .delete-button').trigger('click');
      }, 50);
      this.exceedSizeLimit = true;
    } else {
      this.exceedSizeLimit = false;
      this.imageObj = e.file;
      //$('.rounded-profimgprv').hide();
      this.imgUrl = '';
    }
  }

  /**
   * Submits details
   * @param values 
   * @param validcheck 
   * @param totForm 
   * @param submitType 
   */
  submitDetails(values, validcheck, totForm, submitType) {
    console.log(values);

    if (validcheck) {
      const fd = new FormData();
      Object.keys(values).forEach(function (key) {
        if (key == 'pImg') {
          fd.append(key, values[key].formatted);
        } else {
          fd.append(key, values[key]);
        }
      });

      if (this.imageObj) {
        fd.append('company_logo', this.imageObj);
        fd.append('status', 'haveImage');
      } else if (this.imageObj == null) {
        fd.append('status', 'unchanged');
      } else {
        fd.append('status', 'deleted');
      }

      this.commonservice.postHttpCall({ url: '/doers/update-basic-details', data: fd, contenttype: 'form-data' }).then(result => this.submitSuccess(result, totForm));
    }
  }

  /**
   * Submits success
   * @param response 
   * @param frmElm 
   */
  submitSuccess(response, frmElm) {
    if (response.status == 1) {
      //this.populateListing();
      //this.resetFunction(frmElm);
      this.oncesubmitted = true;
      this.getProfileDetails();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.commonservice.filter('Register click');
      this.togglePopup();
    }
  }

  /**
   * Populates user data
   */
  populateUserData() {
    this.commonservice.postHttpCall({ url: '/get-user-profile', data: {}, contenttype: 'application/json' }).then(result => this.onpopulateUserData(result));
  }

  /**
   * Onpopulates user data
   * @param response 
   */
  onpopulateUserData(response) {
    if (response.status) {
      this.globalconstant.userData = response.data;
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

  /**
   * Resets function
   * @param frmElm 
   */
  resetFunction(frmElm) {
    frmElm.reset();
    frmElm.submitted = false;
  }

}
