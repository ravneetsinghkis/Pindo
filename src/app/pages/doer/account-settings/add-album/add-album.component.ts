import { Component, OnInit, EventEmitter, Renderer2, ElementRef, ViewChild, Output, DoCheck, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { CrystalLightbox } from 'ngx-crystal-gallery';
import Swal from 'sweetalert2';
import { Globalconstant } from '../../../../global_constant';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TouchSequence } from 'selenium-webdriver';


@Component({
  selector: 'add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.scss']
})
export class AddAlbumComponent implements OnInit {
  @ViewChild('popUpManageImages') popupref;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInput2') fileInput2: any;
  @Output() refreshGallery = new EventEmitter();
  //  options: UploaderOptions;
  files: any[] = [];
  dragOver: boolean;
  imgTotalFile: File[] = [];
  imgURL: any[] = [];
  imgURLBackup: any[] = [];
  imgURL2: any[] = [];
  delete: any[] = [];
  edit: any[] = [];
  photo: any[] = [];
  caption_new: any[] = [];
  album_id: any;

  captions: string[] = [''];
  captions_backup: string[] = [''];
  caption: any;
  album_name: any;
  album_name_backup: any;
  edit_data: any;
  toSplice: any;
  globalURL: any;
  isAddOrEdit = 'add';

  constructor(public gbConst: Globalconstant, public renderer: Renderer2, public commonservice: CommonService, public snackBar: MatSnackBar, private lightbox: CrystalLightbox, private toastr: ToastrService, private http: HttpClient, ) {
    this.globalURL = this.gbConst.uploadUrl;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    //this.addPriceTemplate();
  }

  togglePopup() {
    this.files = [];
    this.files.length = 0;
    this.dragOver = false;
    this.imgTotalFile = [];
    this.imgTotalFile.length = 0;
    this.captions = [];
    this.captions.length = 0;
    this.delete = [];
    this.delete.length = 0;
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.files = [];
      this.files.length = 0;
      this.dragOver = false;
      this.imgTotalFile = [];
      this.imgTotalFile.length = 0;
      this.imgURL = [];
      this.imgURL.length = 0;
      this.captions = [];
      this.captions.length = 0;
      this.delete = [];
      this.delete.length = 0;
      this.caption = '';
      this.album_name = '';
      this.edit_data = null;
      this.isAddOrEdit = 'add';
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      if (this.isAddOrEdit == 'edit') {
        this.imgURL = this.edit_data.rows[0].photos;
        this.imgURL2 = JSON.parse(JSON.stringify(this.edit_data.rows[0].photos));
        this.imgURLBackup = JSON.parse(JSON.stringify(this.edit_data.rows[0].photos));
        this.toSplice = this.edit_data.rows[0].photos.length;
        this.album_name = this.edit_data.rows[0].folder_name;
        this.album_name_backup = JSON.parse(JSON.stringify(this.edit_data.rows[0].folder_name));
        this.captions_backup = JSON.parse(JSON.stringify(this.captions));
      }
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  closeModal() {
    if (this.isAddOrEdit == 'edit') {
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
            this.onSubmit();
          } else {
            this.togglePopup();
          }
        });
      } else {
        this.togglePopup();
      }
    } else {
      this.togglePopup();
    }
  }
  checkValueUpdateORNot() {
    console.log(this.imgURL, this.imgURLBackup);
    console.log(this.captions, this.captions_backup);
    let flag_image = 0;
    let flag_captions = 0;

    if (this.imgURL.length != this.imgURLBackup.length) {
      flag_image = 1;
    } else {
      for (let i = 0; i < this.imgURL.length; i++) {
        if (this.imgURL[i].caption != this.imgURLBackup[i].caption ||
          this.imgURL[i].createdAt != this.imgURLBackup[i].createdAt ||
          this.imgURL[i].created_at != this.imgURLBackup[i].created_at ||
          this.imgURL[i].folder_id != this.imgURLBackup[i].folder_id ||
          this.imgURL[i].id != this.imgURLBackup[i].id ||
          this.imgURL[i].name != this.imgURLBackup[i].name ||
          this.imgURL[i].updatedAt != this.imgURLBackup[i].updatedAt ||
          this.imgURL[i].user_id != this.imgURLBackup[i].user_id) {
          flag_image = 1;
          break;
        }
      }
    }

    if (this.captions.length != this.captions_backup.length) {
      flag_captions = 1;
    } else {
      for (let i = 0; i < this.captions.length; i++) {
        if (this.captions[i] != this.captions_backup[i]) {
          flag_captions = 1;
          break;
        }
      }
    }

    if (flag_image == 1 || flag_captions == 1 || this.album_name != this.album_name_backup) {
      console.log(this.imgURL != this.imgURLBackup);
      console.log(this.captions != this.captions_backup);
      console.log(this.album_name != this.album_name_backup);
      return true;
    } else {
      return false;
    }
  }

  onUploadOutput(output: UploadOutput): void {
    if (this.imgURL.length == 0) {
      this.fileInput.nativeElement.value = '';
    }
    if (this.imgURL.length > 0) {
      this.fileInput2.nativeElement.value = '';
    }

    if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      const mimeType = output.file.type;
      // console.log(mimeType);
      // console.log(mimeType.match(/image\/*/));
      if (mimeType.match(/image\/*/) == null) {
        this.snackBar.open('Only images are supported', 'Error', {
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
          this.imgTotalFile.push(output.file.nativeFile);
        });

      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      this.snackBar.open('Invalid File Format', 'Error', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['color-red'],
      });
    } else if (output.type === 'done') {
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

  deleteImg(indexVal, id) {
    if (id && id != undefined) {
      this.delete.push(id);
    }
    this.files.splice(indexVal, 1);
    this.imgURL.splice(indexVal, 1);
    if (indexVal < this.imgURL2.length) {
      this.imgURL2.splice(indexVal, 1);
    }
    this.toSplice = this.imgURL2.length;
    if (this.isAddOrEdit == 'add') {
      this.imgTotalFile.splice(indexVal, 1);
    } else {
      this.imgTotalFile.splice(indexVal - this.toSplice, 1);
    }
    this.captions.splice(indexVal, 1);
  }

  deleteAlbum() {
    console.log(this.album_id);
    Swal({
      title: 'Are you sure you want to delete this album??',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'YES',
      cancelButtonText: 'CANCEL',
    }).then((resultswal) => {
      if (resultswal.value) {
        this.commonservice.postCommunityHttpCall({
          url: '/api/pinner/delete-doer-gallery',
          data: {
            id: this.album_id
          }
        }).then(res => {
          if (res.status == 1) {
            this.togglePopup();
            this.responseMessageSnackBar(res.msg, 'orangeSnackBar');
            this.refreshGallery.emit(true);
          } else {
            this.responseMessageSnackBar(res.msg, 'error');
          }
        });
      }
    });
  }

  onSubmit() {
    if (!this.album_name) {
      this.responseMessageSnackBar('Please enter an Album Name', 'error');
      return;
    }
    if (this.isAddOrEdit == 'add') {
      const fd = new FormData();
      fd.append('folder_name', this.album_name);
      for (const img of this.imgTotalFile) {
        fd.append('gallery_photos', img);
      }
      for (const img of this.captions) {
        fd.append('captions', img);
      }
      if (this.captions.length == 0) {
        fd.append('captions', '');
      }

      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/add-doer-photo-gallery',
        data: fd
      }).then(res => {
        if (res.status == 1) {
          this.responseMessageSnackBar(res.msg, 'orangeSnackBar');
          this.refreshGallery.emit(true);
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(res.msg, 'error');
        }
      });
    } else {
      let flag = 0;
      const fd = new FormData();
      fd.append('folder_name', this.album_name);
      fd.append('id', this.edit_data.rows[0].id);

      for (const i of this.delete) {
        fd.append('delete_photo_ids', i);
        flag = 1;
      }

      if (flag == 0) {
        fd.append('delete_photo_ids', '');
      }

      for (let i = 0; i < this.imgURL.length; i++) {
        if (this.imgURL[i].id) {
          fd.append('edit_photo_ids', this.imgURL[i].id);
        }
        if (this.imgURL[i].name) {
          fd.append('edit_photo_name', this.imgURL[i].name);
        }
        if (this.imgURL[i].caption) {
          fd.append('edit_photo_caption', this.imgURL[i].caption);
        } else {
          if (i < this.imgURL2.length) {
            fd.append('edit_photo_caption', '');
          }
        }
      }

      if (this.imgURL2.length == 0) {
        fd.append('edit_photo_ids', '');
        fd.append('edit_photo_name', '');
        fd.append('edit_photo_caption', '');
      }

      for (const img of this.imgTotalFile) {
        fd.append('gallery_photos', img);
      }

      for (let i = (this.toSplice - 1); i < this.imgURL.length; i++) {
        if (!this.captions[i] || this.captions[i] == null || this.captions[i] == undefined) {
          this.captions[i] = '';
        } else {
          this.captions[i] = this.captions[i];
        }
      }
      this.captions.splice(0, this.toSplice);

      for (const cap of this.captions) {
        fd.append('captions', cap);
      }

      // console.log(this.imgTotalFile);
      // console.log(this.imgURL);
      // console.log(this.imgURL2);
      // console.log(this.toSplice);
      // console.log(this.captions);

      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/edit-doer-photo-gallery',
        data: fd
      }).then(res => {
        if (res.status == 1) {
          this.responseMessageSnackBar(res.msg, 'orangeSnackBar');
          this.refreshGallery.emit(true);
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(res.msg, 'error');
        }
      });
    }
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }
}
