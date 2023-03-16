import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-profile-licence',
  templateUrl: './profile-licence.component.html',
  styleUrls: ['./profile-licence.component.scss']
})
export class ProfileLicenceComponent implements OnInit {

  @Input()
  isHiddenLicence = false;
  @Output() listingPopulated = new EventEmitter();

  @ViewChild('popUpVar')
  popupref;

  public name = '';
  public registration_no = '';
  public description = '';
  public licenseID = '';
  public showList: boolean = false;
  public populateLicenseListing = [];
  public files: any = '';
  attachedfileerror: any = '';
  baseUrl: any;

  multipleFile: any = [];

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public gbConst: Globalconstant) {
    this.baseUrl = gbConst.uploadUrl;
  }

  ngOnInit() {
    this.populateListing();
    console.log(this.popupref.nativeElement.classList.contains('asdasd'));
  }

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

      /*if (this.upload_file) {
        fd.append('attachment_file',JSON.stringify(this.upload_file));
      }*/
      //fd.append('attachment_file',this.upload_file);
      //fd.append('attachment_file',this.multipleFile);
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
      if (this.licenseID == '') {
        this.commonservice.postHttpCall({ url: '/doers/add-license', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result, totForm, submitType));
      }
      else {
        fd.append('id', this.licenseID);
        //values['id'] = this.licenseID;
        this.commonservice.postHttpCall({ url: '/doers/update-license', data: fd, contenttype: "form-data" }).then(result => this.submitSuccess(result, totForm, submitType));
      }
    }

  }

  submitSuccess(response, frmElm, submitType) {
    if (response.status == 1) {
      this.multipleFile = [];
      if (submitType != 'save and continue')
        this.togglePopup();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.populateListing();
      this.resetFunction(frmElm);
    }
  }

  /**
   * Populates listing
   */
  populateListing() {
    this.commonservice.postHttpCall({ url: '/doers/license-listing', contenttype: "application/json" }).then(result => this.populateSuccess(result));
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
      this.populateLicenseListing = JSON.parse(JSON.stringify(response.data));
      if (this.populateLicenseListing.length > 0) {
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
    this.name = this.populateLicenseListing[index].name;
    this.registration_no = this.populateLicenseListing[index].registration_no;
    this.description = this.populateLicenseListing[index].description;
    this.licenseID = this.populateLicenseListing[index].id;
    if (this.populateLicenseListing[index]['documents'])
      this.multipleFile = this.populateLicenseListing[index]['documents'];
  }

  /**
   * Removes this license
   * @param index 
   */
  removeThisLicense(index) {
    this.licenseID = this.populateLicenseListing[index].id;
    let values = { 'id': this.licenseID };
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this license!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/remove-license', data: values, contenttype: "application/json" }).then(result => this.deleteSuccess(result));
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
