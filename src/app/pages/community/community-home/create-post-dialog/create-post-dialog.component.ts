import { Component, OnInit, Inject, ViewChild, ElementRef, Output, EventEmitter}                              from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA}                                      from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray }  from '@angular/forms';
import { wordCountlimit } from './../../grouprequired-validator';

import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
declare var $: any;

@Component({
  selector    : 'create-post-dialog',
  templateUrl : 'create-post-dialog.html',
})

export class CreatePostDialog {
  searchfor_send_to: any;
  allparent_category: any = [];
  child_cat_list: any = [];
  subcategory_id: any = [];
  subcategory: any;
  parentcategory: any;
  submitted: boolean = false;
  create_post: FormGroup;
  addService: string[] = [];
  filteredAddService: Observable<string[]>;
  msgCountNumb: number = 500;
  @Output()	listingPopulated = new EventEmitter();
  public showList: boolean = false;

  fileToUpload: any;
  @ViewChild('fileName') fileName;

  constructor(public dialogRef: MatDialogRef<CreatePostDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private fb: FormBuilder, public commonservice: CommonService, public snackBar: MatSnackBar
              ) {

  }

  ngOnInit() {
   this.createPostFormBuild();
   this.getALlCategorylist();
  }
  /**
   * Creates post form build
   */
  createPostFormBuild() {
    this.create_post = this.fb.group({
      send_to:  ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      sub_category: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
  }

  /**
   * Fetch all category list
   */
  getALlCategorylist() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/parent-category', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
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
    console.log('parentcategory', this.parentcategory);
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.parentcategory }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
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
   * Dubmit the form with form data
   * @param val
   */
  onSubmitCreatePost(val) {
    this.submitted = true;
     if (this.create_post.invalid) {
      return;
    } else {
      // this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-post', data: {
      //   title: 'Searching For',
      //   receiver_id: 0,
      //   target_id: 0,
      //   send_to: val.send_to,
      //   category_id: val.category,
      //   subcategory_id: val.sub_category,
      //   type: 'searching',
      //   message: val.message }, contenttype: 'application/json' }).then(result => {
      //   if (result.status == 1) {
      //     this.dialogRef.close();
      //     this.responseMessageSnackBar(result.msg);
      //     this.showList = true;
      //     this.listingPopulated.emit(true);
      //   } else {
      //     this.listingPopulated.emit(false);
      //   }
      // });

      let formData = new FormData();
      formData.append("title", 'Searching For');
      formData.append("receiver_id", '0');
      formData.append("target_id", '0');
      formData.append("send_to", val.send_to);
      formData.append("category_id", val.category);
      formData.append("subcategory_id", val.sub_category);
      formData.append("type", 'searching');
      formData.append("message", val.message);
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