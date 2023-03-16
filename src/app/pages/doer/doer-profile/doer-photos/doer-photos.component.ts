import { Component, OnInit, EventEmitter, Renderer2, ElementRef, ViewChild, Output, DoCheck, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { CrystalLightbox } from 'ngx-crystal-gallery';
import Swal from 'sweetalert2';
import { Globalconstant } from '../../../../global_constant';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-doer-photos',
  templateUrl: './doer-photos.component.html',
  styleUrls: ['./doer-photos.component.scss']
})
export class DoerPhotosComponent implements OnInit {
  @ViewChild('popUpManageImages')
  popupref;

  url = 'http://192.168.1.88/pindo-server/api/doers/add-image';
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  selectedFolderId: any = null;

  masonryItems = [];
  iamgeUrl: any = null;

  toremoveImg = [];
  checkedAll = false;

  createdfolderList = [];
  @Output() editFolderEvent = new EventEmitter();

  public masonryOptions: any = {
    transitionDuration: '0.2s',
    resize: true,
    initLayout: true,
    fitWidth: true,
    percentPosition: true,
    columnWidth: '.grid-sizer',
    gutter: '.gutter-sizer',
    itemSelector: '.masonry-item'
  };

  myImages: any = [];
  myConfig: any = {
    masonry: false,
    masonryMaxHeight: 95,
    masonryGutter: 6,
    loop: false,
    backgroundOpacity: 0.85,
    animationDuration: 100,
    counter: true,
    lightboxMaxHeight: '100vh - 86px',
    lightboxMaxWidth: '100%'
  }
  differ: KeyValueDiffer<string, any>;
  countFiles = 0;
  countDone = 0;
  selectedFolderDescription: any = null;

  constructor(public gbConst: Globalconstant, public renderer: Renderer2, public commonservice: CommonService, public snackBar: MatSnackBar, private lightbox: CrystalLightbox, private toastr: ToastrService) {
    this.options = { concurrency: 1, maxUploads: 1000, allowedContentTypes: ['image/jpeg', 'image/png', 'image/jpg'] };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;

    this.commonservice.listnerCreateNewFolder().subscribe((data) => {
      this.getFolders();
    });
  }

  // ngDoCheck() {
  //   if(this.differ) {
  //     const change = this.differ.diff(this);
  //     if (change) {
  //       change.forEachChangedItem(item => {        
  //         if(item['key'] == "files" && item['previousValue'] && !item['currentValue']) {          
  //           //this.pinAutocomplete = [];
  //         }
  //       });
  //     }
  //   }
  // }

  ngOnInit() {
    this.getFolders();
  }

  // showSuccess() {
  //   this.toastr.success('Hello world!', 'Toastr fun!');
  // }

  showError(msg, errorHeading) {
    this.toastr.error(msg, errorHeading);
  }

  /**
   * Gets images
   */
  getImages() {
    this.commonservice.postHttpCall({ url: '/doers/image-listing', data: { 'folder_id': this.selectedFolderId }, contenttype: 'application/json' }).then(result => this.onGetImagesSuccess(result));
  }

  /**
   * Determines whether get images success on
   * @param response 
   */
  onGetImagesSuccess(response) {
    if (response.status == 1) {
      //this.masonryItems = response.data;
      this.iamgeUrl = response.image_url;
      this.masonryItems = response.data.map((value, index, array) => {
        value['checkboxStatus'] = false;
        value['imagepath'] = `${this.iamgeUrl}/${value['name']}`;
        value['preview'] = `${this.iamgeUrl}/${value['name']}`;
        value['full'] = `${this.iamgeUrl}/${value['name']}`;
        return value;
      });

    }
  }

  /**
   * Toggles popup
   * @param [indexVal] 
   */
  togglePopup(indexVal = '') {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      this.selectedFolderId = null;
      this.selectedFolderDescription = null;
      this.clearOnpopupclose();
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
      if (indexVal !== '') {
        this.selectedFolderId = this.createdfolderList[indexVal]['id'];
        this.selectedFolderDescription = this.createdfolderList[indexVal]['description'];
        this.getImages();
      }
    }
  }

  // handleMasonryLayoutEvents(evt) {
  // 	console.log(evt);
  // }

  /**
   * Determines whether upload output on
   * @param output 
   */
  onUploadOutput(output: UploadOutput): void {
    //console.log(output);
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        //url: this.url,
        url: this.gbConst.apiUrl + '/doers/add-image',
        headers: { 'access-token': localStorage.getItem('frontend_token') },
        data: { 'folder_id': this.selectedFolderId },
        includeWebKitFormBoundary: true
      };
      console.log(event);
      
      this.uploadInput.emit(event);
      //this.togglePopup();
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.countFiles++;
      this.files.push(output.file);
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
      //this.responseMessageSnackBar(`${output.file.name} rejected`,'error');
      let temperrorType = 'Invalid File Format';
      // let temperrorType; 
      // if(output.file.fileIndex > 4) {
      //   temperrorType = 'Max limit to upload at a time reached';
      // }
      // else {
      //   temperrorType = 'Invalid File Format';
      // }
      this.showError(`${output.file.name} rejected`, temperrorType);
      console.log(output);
    } else if (output.type === 'done') {
      this.countDone++;
      this.files.forEach(file => {
        console.log(file.response);
        if (file.response) {
          if (file.response.status == 0) {
            this.responseMessageSnackBar(file.response.msg, 'error');
            this.showError(`${file.response.msg}`, 'File Upload Error');
          }
        }
        //this.response.emit(file.response);
      });
      if (this.countFiles == this.countDone) {
        this.countDone = 0;
        this.countFiles = 0;
        this.getFolders();
        this.getImages();
        this.responseMessageSnackBar('Files Uploaded Successfully','orangeSnackBar');
      }
    }

    this.files = this.files.filter(file => file.progress.status !== UploadStatus.Done);
    //this.getImages();
  }

  /**
   * Starts upload
   */
  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.url,
      method: 'POST',
      headers: { 'access-token': localStorage.getItem('frontend_token') },
      data: { foo: 'bar', 'folder_id': this.selectedFolderId },
      includeWebKitFormBoundary: true
    };

    this.uploadInput.emit(event);
  }

  /**
   * Cancels upload
   * @param id 
   */
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  /**
   * Removes file
   * @param id 
   */
  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  /**
   * Removes all files
   */
  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  /**
   * Clears onpopupclose
   */
  clearOnpopupclose() {
    this.toremoveImg = [];
    this.files = [];
    this.masonryItems = [];
    this.iamgeUrl = null;
    this.checkedAll = false;
  }

  /**
   * Edits folder name
   * @param indexVal 
   */
  editFolderName(indexVal) {
    const indvFolder = this.createdfolderList[indexVal];
    this.editFolderEvent.emit(indvFolder);
  }

  /**
   * Gets folders
   */
  getFolders() {
    this.commonservice.postHttpCall({ url: '/doers/folder-lists', contenttype: 'application/json' }).then(result => this.onGetFoldersSuccess(result));
  }

  /**
   * Determines whether get folders success on
   * @param response 
   */
  onGetFoldersSuccess(response) {
    if (response.status == 1) {
      this.createdfolderList = response.data;
    }
  }

  /**
   * Removes this folder
   * @param indexVal 
   */
  removeThisFolder(indexVal) {
    Swal({
      title: 'Are You sure you want to remove this folder.',
      text: 'All your saved images in this folder will be lost.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/remove-folder', data: { 'folder_id': this.createdfolderList[indexVal]['id'] }, contenttype: 'application/json' }).then(result => this.onRemoveThisFolderSuccess(result));
      }
    })
    //this.commonservice.postHttpCall({url:'/doers/remove-folder', data: {'folder_id':this.createdfolderList[indexVal]['id']}, contenttype:"application/json"}).then(result=>this.onRemoveThisFolderSuccess(result));
  }

  /**
   * Determines whether remove this folder success on
   * @param response 
   */
  onRemoveThisFolderSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.getFolders();
    }
  }

  /**
   * Checkunchecks to remove
   * @param indexVal 
   */
  checkuncheckToRemove(indexVal) {
    if (this.masonryItems[indexVal]['checkboxStatus']) {
      this.toremoveImg.push(this.masonryItems[indexVal]['id']);
      if (this.toremoveImg.length === this.masonryItems.length) {
        this.checkedAll = true;
      }
    } else {
      console.log(this.masonryItems[indexVal]['id']);
      const tempArr = this.toremoveImg.filter((val) => {
        if (val !== this.masonryItems[indexVal]['id']) {
          return val
        }
      });
      this.toremoveImg = [...tempArr];
      console.log(this.toremoveImg);
      this.checkedAll = false;
    }
  }

  /**
   * Selects all images
   */
  selectAllImages() {
    if (this.checkedAll) {
      const tempArr = this.masonryItems.map((val, index, arr) => {
        val['checkboxStatus'] = true;
        return val;
      });
      this.masonryItems = [...tempArr];
      this.toremoveImg = this.masonryItems.map((val, index, arr) => {
        return val['id'];
      });
    } else {
      this.toremoveImg = [];
      const tempArr = this.masonryItems.map((val, index, arr) => {
        val['checkboxStatus'] = false;
        return val;
      });
      this.masonryItems = [...tempArr];
    }

  }

  /**
   * Selects all trigger
   */
  selectAllTrigger() {
    this.checkedAll = true;
    this.selectAllImages();
  }

  /**
   * Selects none trigger
   */
  selectNoneTrigger() {
    this.checkedAll = false;
    this.selectAllImages();
  }

  /**
   * Removes images
   */
  removeImages() {
    this.commonservice.postHttpCall({ url: '/doers/remove-image', data: { 'image_id': this.toremoveImg }, contenttype: 'application/json' }).then(result => this.onRemoveImagesSuccess(result));
  }

  /**
   * Determines whether remove images success on
   * @param response 
   */
  onRemoveImagesSuccess(response) {
    if (response.status == 1) {
      this.checkedAll = false;
      this.getImages();
      this.toremoveImg = [];
      this.getFolders();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
  }

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   * @param [vertical_position] 
   */
  public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class,
    });
  }

}
