import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'insured-doer',
  templateUrl: './insured-doer.component.html',
  styleUrls: ['./insured-doer.component.scss']
})
export class InsuredDoerComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  @ViewChild('fileInput') fileInput: any;
  @Output() refreshInfo = new EventEmitter();

  files: any = [];
  dragOver: boolean;
  options: UploaderOptions;
  imgTotalFile: File[] = [];
  imgTotalFile2: any = [];
  imgURL: any = [];
  imgData: any = {};
  badgeSlug: any;
  uploadText: any;
  badgeID: any;
  badgeData: any;
  photos: any;
  isAllowed: boolean = true;
  isTicked: boolean = false;
  verifyText: any = '';
  fd = new FormData();

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant) {

  }

  ngOnInit() {
  }

  checkDisabled() {
    switch (this.badgeSlug) {
      case 'early_adopter': {
        if (this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      // case 'licensed_doer': {
      //   if (this.imgTotalFile.length == 0) {
      //     this.isAllowed = true;
      //   } else {
      //     this.isAllowed = false;
      //   }
      //   break;
      // }
      case 'licensed_doer': {
        if (this.imgTotalFile.length == 0 || this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      // case 'insured_doer': {
      //   if (this.imgTotalFile.length == 0) {
      //     this.isAllowed = true;
      //   } else {
      //     this.isAllowed = false;
      //   }
      //   break;
      // }
      case 'insured_doer': {
        if (this.imgTotalFile.length == 0 || this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      // case 'certified_doer': {
      //   console.log('ENTERING CERT');

      //   this.isAllowed = false;
      //   break;
      // }
      case 'certified_doer': {
        if (this.imgTotalFile.length == 0 || this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      // case 'background_verified': {
      //   this.isAllowed = false;
      //   break;
      // }
      case 'background_verified': {
        if (this.imgTotalFile.length == 0 || this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      /* case 8: {
        if (this.verifyText) {
          this.verifyText = this.verifyText.trim();
        }
        if (this.isTicked == false && this.verifyText) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      } */

      case 'bbb_rated': {
        if (this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      case 'emergency_doer': {
        if (this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }

      case 'chamber_of_commerce_member': {
        let regex = new RegExp(this.myGlobals.urlpattern);

        if (this.verifyText) {
          this.verifyText = this.verifyText.trim();
        }
        if (this.isTicked == true && this.verifyText != '' && regex.test(this.verifyText)) {
          this.isAllowed = false;
        } else {
          this.isAllowed = true;
        }
        break;
      }

      case 'covid-19_help': {
        if (this.isTicked == false) {
          this.isAllowed = true;
        } else {
          this.isAllowed = false;
        }
        break;
      }
    }
  }

  togglePopup() {
    console.log(this.badgeSlug);

    if (this.popupref.nativeElement.classList.contains('opened')) { console.log("1.");
      this.setToDefault();
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else { console.log("2..");
      this.populateBadge();
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  setToDefault() { console.log(this.badgeSlug);
    if (this.badgeSlug == 'insured_doer') {
      this.uploadText = 'Please upload a picture or scan of the appropriate policy';
    } else if (this.badgeSlug == 'licensed_doer') {
      this.uploadText = 'Please upload a picture or scan of the appropriate license';
    } else if (this.badgeSlug == 'background_verified') {
      this.uploadText = 'Please upload a copy of the background report';
    } else if (this.badgeSlug == 'certified_doer') {
      this.uploadText = 'Please upload a picture or scan of the appropriate certification';
    }
    this.isTicked = false;
    this.imgTotalFile.length = 0;
    this.imgTotalFile = [];
    this.imgURL.length = 0;
    this.imgURL = [];
    this.verifyText = '';
    this.checkDisabled();
    this.fd = new FormData();
  }

  tickConfirm(e) {
    // console.log(e.target.checked);
    this.isTicked = e.target.checked;
    this.checkDisabled();
  }

  onSubmit() {
    console.log(this.imgTotalFile);
    const fd = new FormData();
    fd.append('badge_id', this.badgeID);
    for (let img of this.imgTotalFile) {
      fd.append('file', img);
    }
    if (this.badgeSlug == 'chamber_of_commerce_member') {
      fd.append('verification_field', this.verifyText);
    }
    const sendData = {
      url: '/api/pinner/apply-badge',
      data: fd
    };
    console.log(this.imgTotalFile);

    this.commonservice.postCommunityHttpCall(sendData).then(res => {
      if (res.status == 1) {
        this.snackBar.open(res.msg, '', {
          duration: 4000,
          horizontalPosition: 'right',
          panelClass: 'orangeSnackBar'
        });
        this.togglePopup();
        this.refreshInfo.emit(true);
      } else {
        this.snackBar.open(res.msg, '', {
          duration: 4000,
          horizontalPosition: 'right',
          panelClass: 'error'
        });
        this.togglePopup();
        this.refreshInfo.emit(true);
      }
    });
  }

  populateBadge() {
    const sendData = {
      url: '/api/pinner/get-single-badge-details',
      data: {
        id: this.badgeID
      }
    };
    this.commonservice.postCommunityHttpCall(sendData).then(res => {
      if (res.status == 1) {
        this.badgeData = res.data.rows[0];
        // console.log('BADGE DETAIL', this.badgeData);
        this.badgeSlug = this.badgeData.slug;
        this.setToDefault();
      }
    });
  }
  // upload-photo

  onUploadOutput(output: UploadOutput): void {
    // console.log(output);
    this.fileInput.nativeElement.value = '';

    if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      const mimeType = output.file.type;
      // console.log(mimeType);
      // console.log(mimeType.match(/image\/*/));
      if (mimeType.match(/image\/*/) == null && mimeType != 'application/pdf') {
        this.snackBar.open('Only images and pdf\'s are supported', 'Error', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['color-red'],
        });
      } else if (mimeType.match(/svg\/*/)) {
        this.snackBar.open('SVG images not supported', 'Error', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['color-red'],
        });
      } else {
        this.previewImagem(output.file.nativeFile).then(response => {
          output['file']['imagePreview'] = response; // The image preview
          this.files.push(output.file);

          if (mimeType == 'application/pdf') {
            this.imgURL.push('assets/images/PDF_Symbol.png');
          } else {
            this.imgURL.push(response);
          }
          let obj = output.file.nativeFile;
          // let obj2 = JSON.parse(JSON.stringify(obj));
          // this.fd.append('file', output.file.nativeFile);
          this.imgTotalFile.push(obj);

          // console.log(typeof(output.file.nativeFile), typeof(this.imgURL));
          // console.log(this.imgTotalFile, typeof(this.imgTotalFile));
          this.checkDisabled();

        });

      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
      this.checkDisabled();
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
      this.checkDisabled();
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
      this.checkDisabled();
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
      this.checkDisabled();
    } else if (output.type === 'drop') {
      this.dragOver = false;
      this.checkDisabled();
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      this.snackBar.open('Invalid File Format', 'Error', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['color-red'],
      });
      this.checkDisabled();
      // console.log(output);
    } else if (output.type === 'done') {
      this.checkDisabled();
    }
  }

  previewImagem(file: any) {
    const fileReader = new FileReader();
    return new Promise(resolve => {
      fileReader.readAsDataURL(file);
      fileReader.onload = function (e: any) {
        resolve(e.target.result);
      };
    });
  }

  deleteImg(indexVal) {
    this.files.splice(indexVal, 1);
    this.imgURL.splice(indexVal, 1);
    this.imgTotalFile.splice(indexVal, 1);
    this.checkDisabled();
  }
}
