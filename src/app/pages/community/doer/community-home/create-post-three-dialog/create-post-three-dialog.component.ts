
import { Component, OnInit, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { wordCountlimit } from '.././../../grouprequired-validator';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonService } from '../../../../../commonservice';
import { MatSnackBar } from '@angular/material';
declare var $: any;

@Component({
  selector: 'create-post-three-dialog',
  templateUrl: 'create-post-three-dialog.html',
})

export class CreatePostThreeDialog {

  submitted: boolean = false;
  create_post: FormGroup;
  searchfor_send_to: any;
  allparent_category: any = [];
  child_cat_list: any = [];
  subcategory_id: any = [];
  subcategory: any;
  parentcategory: any;
  addService: string[] = [];
  filteredAddService: Observable<string[]>;
  msgCountNumb: number = 500;
  @Output() listingPopulated = new EventEmitter();
  public showList: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreatePostThreeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public commonservice: CommonService,
    public snackBar: MatSnackBar
  ) {
    this.create_post = this.fb.group({
      send_to: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      sub_category: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
  }

  ngOnInit() {
    this.getALlCategorylist();
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
    this.dialogRef.close('close');
  }

  /**
    * Dubmit the form with form data
    * @param val 
    */
  onSubmitCreatePost(val) {
    this.submitted = true;
    if (this.create_post.invalid) {
      return;
    } else if (val.message.trim() == "") {
      val.message = this.create_post.controls.message.value.trim();
      this.create_post.controls.message.setErrors({ error: true });
      this.create_post.patchValue({
        message: val.message
      });
      return;
    } else {
      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/add-post', data: {
          title: 'Conversation',
          receiver_id: 0,
          target_id: 0,
          send_to: val.send_to,
          category_id: val.category,
          subcategory_id: val.sub_category,
          type: 'conversation',
          message: val.message
        }, contenttype: "application/json"
      }).then(result => {
        if (result.status == 1) {
          this.dialogRef.close('success');
          this.responseMessageSnackBar(result.msg);
          this.showList = true;
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
      const msgValLength = this.create_post.controls.message.value.trim().length;
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

}