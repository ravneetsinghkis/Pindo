
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
  selector    : 'create-post-three-dialog',
  templateUrl : 'create-post-three-dialog.html',
})

export class CreatePostThreeDialog {

  submitted:boolean = false;
  create_post: FormGroup;
  searchfor_send_to:any;
  allparent_category:any = [];
  child_cat_list: any = [];
  subcategory_id:any = [];
  subcategory:any;
  parentcategory:any;
  addService: string[] = [];
  filteredAddService: Observable<string[]>;
  msgCountNumb: number = 500;
  @Output()	listingPopulated = new EventEmitter();
  public showList:boolean = false;

  fileToUpload: any;
  @ViewChild('fileName') fileName;

  constructor(public dialogRef: MatDialogRef<CreatePostThreeDialog>,
              @Inject(MAT_DIALOG_DATA) public data:any,
              public dialog: MatDialog,
              private fb: FormBuilder,public commonservice: CommonService,public snackBar: MatSnackBar
              )
  {
  }

  ngOnInit() {
    this.createPostFormBuild();
    this.getALlCategorylist();
  }
  /**
   * Fetch all category list
   */
  getALlCategorylist() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/parent-category', data: {}, contenttype: "application/json" }).then(result => {

      if (result.status != 0 && result.status != 401) {
        this.allparent_category = result.data.rows;
        console.log('user///////categorylist', this.allparent_category);
      }
    });
  }
   /**
    * Changeparents category and search by category
    */
   changeParentCategorySearch() {
    this.child_cat_list = [];
    this.subcategory_id = [];
    console.log('parentcategory',this.parentcategory);
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.parentcategory }, contenttype: "application/json" }).then(result => {
      if (result.status != 0 && result.status != 401) {
        this.child_cat_list = result.data.rows;
        console.log('user///////categorylist', this.child_cat_list);
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
  createPostFormBuild(){
    this.create_post = this.fb.group({
      send_to:  ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      sub_category: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
  }
 /**
   * Dubmit the form with form data
   * @param val
   */
  onSubmitCreatePost(val){
    this.submitted = true;
    if (this.create_post.invalid) {
      return;
    }
    else{
      //  this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-post', data: {
      //   title:'Conversation',
      //   receiver_id:0,
      //   target_id:0,
      //   send_to:val.send_to,
      //   category_id:val.category,
      //   subcategory_id:val.sub_category,
      //   type:'conversation',
      //   message:val.message }, contenttype: "application/json" }).then(result => {
      //   if (result.status == 1) {
      //     this.dialogRef.close();
      //     this.responseMessageSnackBar(result.msg);
      //     this.showList=true;
      //     this.listingPopulated.emit(true);
      //    // this.child_cat_list = result.data.rows;
      //    // console.log('user///////categorylist', this.child_cat_list);
      //   }
      // });

      let formData = new FormData();
      formData.append("title", 'Conversation');
      formData.append("receiver_id", '0');
      formData.append("target_id", '0');
      formData.append("send_to", val.send_to);
      formData.append("category_id", val.category);
      formData.append("subcategory_id", val.sub_category);
      formData.append("type", 'conversation');
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