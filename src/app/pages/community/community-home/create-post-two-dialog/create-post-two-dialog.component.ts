import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef, Output, EventEmitter
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';
import {
  wordCountlimit
} from './../../grouprequired-validator';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import {
  Observable
} from 'rxjs';
import {
  startWith,
  map
} from 'rxjs/operators';
import { Globalconstant } from '../../../../global_constant';
declare var $: any;

@Component({
  selector: 'create-post-two-dialog',
  templateUrl: 'create-post-two-dialog.html',
})

export class CreatePostTwoDialog {
  searchfor_send_to: any;
  allparent_category: any = [];
  child_cat_list: any = [];
  subcategory_id: any = [];
  subcategory: any;
  description_msg: any;
  parentcategory: any;
  submitted: boolean = false;
  create_post: FormGroup;
  image_url: any;
  options: string[] = ['One', 'Two', 'Three'];
  totaloptions: any = [];
  housepriceoptions: any;
  housePricesAreaToken: any;
  addService: string[] = [];
  doer_search: any = [];
  filteredStreets: Observable<string[]>;
  filteredAddService: Observable<string[]>;
  msgCountNumb: number = 500;
  companylogo_url: any;
  @Output() listingPopulated = new EventEmitter();
  public showList: boolean = false;

  fileToUpload: any;
  @ViewChild('fileName') fileName;

  constructor(public dialogRef: MatDialogRef<CreatePostTwoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, public commonservice: CommonService, public snackBar: MatSnackBar, public myGlobals: Globalconstant) { }

  ngOnInit() {
    this.getALlCategorylist();
    this.createPostFormBuild();
    this.searchTotalNumberOfuser();
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
  }
  /**
   * Searchs recomended user in keyup function
   * @param event (pass the value from input field)
   */
  searchRecomendedUser(event) {
    if (event.target.value) {
      //filter the value from total user and store into array
      this.housepriceoptions = this.totaloptions.filter(
        el =>
          el.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
          // el.username.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
      );
    } else {
      this.housepriceoptions = [];
    }
  }
  /**
   * Gets selected user from dropdown
   * @param data (user id)
   */
  getSelectedUser(data) {
    this.housePricesAreaToken = data.id;
  }
  /**
   * Searchs total number of user and store into array
   */
  searchTotalNumberOfuser() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/doer-search', data: {}, contenttype: "application/json" }).then(result => {
      if (result.status == 1) {
        this.totaloptions = result.data.rows;
      }
    });
  }
  /**
    * Fetch all category list
    */
  getALlCategorylist() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/parent-category', data: {}, contenttype: "application/json" }).then(result => {

      if (result.status != 0 && result.status != 401) {
        this.allparent_category = result.data.rows;
      }
    });
  }
  /**
   * Changeparents category and search by category
   */
  changeParentCategorySearch() {
    this.child_cat_list = [];
    this.subcategory_id = [];
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.parentcategory }, contenttype: "application/json" }).then(result => {
      if (result.status != 0 && result.status != 401) {
        this.child_cat_list = result.data.rows;
      }
    });
  }
  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
    this.fileName.nativeElement.innerText = "Choose file";
  }
  /**
   * Creates post form build
   */
  createPostFormBuild() {
    this.create_post = this.fb.group({
      send_to: ['', Validators.compose([Validators.required])],
      doer_prfl: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      sub_category: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
  }
  /**
   * Dubmit the form with form data
   * @param val
   */
  onSubmitCreatePost(val) {
    this.submitted = true;
    if (this.create_post.invalid) {
      return;
    }
    // this.commonservice.postCommunityHttpCall({
    //   url: '/api/pinner/add-post', data: {
    //     title: 'Recomendation',
    //     receiver_id: 0,
    //     target_id: 0,
    //     send_to: this.searchfor_send_to,
    //     category_id: this.parentcategory,
    //     subcategory_id: this.subcategory,
    //     type: 'recomendation',
    //     tagged_user_id: this.housePricesAreaToken,
    //     message: this.description_msg
    //   }, contenttype: "application/json"
    // }).then(result => {
    //   if (result.status == 1) {
    //     this.dialogRef.close();
    //     this.responseMessageSnackBar(result.msg);
    //     this.showList = true;
    //     this.listingPopulated.emit(true);
    //   }
    // });


    let formData = new FormData();
    formData.append("title", 'Recomendation');
    formData.append("receiver_id", '0');
    formData.append("target_id", '0');
    formData.append("send_to", this.searchfor_send_to);
    formData.append("category_id", this.parentcategory);
    formData.append("subcategory_id", this.subcategory);
    formData.append("type", 'recomendation');
    formData.append("message", this.description_msg);
    formData.append("post_image", this.fileToUpload);

    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/add-post',
      data: formData,
      contenttype: false,
      processData: false
    }).then(result => {
      if (result.status == 1) {
        this.dialogRef.close();
        this.responseMessageSnackBar(result.msg);
        this.showList = true;
        this.listingPopulated.emit(true);
      } else {
        this.listingPopulated.emit(false);
      }
    });

  }
  /**
     * Words count function for text area
     * @param event
     */
  wordCountFunc(event) {

    setTimeout(() => {
      const msgValLength = this.create_post.controls.message.value.length;

      if (msgValLength !== 0) {
        this.msgCountNumb = 500 - msgValLength;
        if (this.msgCountNumb < 0) {
          this.submitted = true;
          this.msgCountNumb = 0;
        }

      } else {
        this.msgCountNumb = 500;
      }
    }, 100);

  }
  /**
   * Responses message snack bar for show alert
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
   * Uploaded file
   * @param files
   */
  setFile(files: FileList) {
    const file = files.item(0);

    if (!file) {
      return;
    }

    if (! this.commonservice.allowedPostUploadedFiles.includes(file.type)) {
      this.responseMessageSnackBar("Only .jpg, .png, .gif & .pdf files are supported.", "error");
      return;
    }

    this.fileToUpload = file;
    this.fileName.nativeElement.innerText = file.name;
  }


}