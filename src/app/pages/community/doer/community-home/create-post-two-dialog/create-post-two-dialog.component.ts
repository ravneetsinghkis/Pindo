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
} from '.././../../grouprequired-validator';
import { CommonService } from '../../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import {
  Observable
} from 'rxjs';
import {
  startWith,
  map
} from 'rxjs/operators';
import { Globalconstant } from '../../../../../global_constant';
declare var $: any;

@Component({
  selector: 'create-post-two-dialog',
  templateUrl: 'create-post-two-dialog.html',
})

export class CreatePostTwoDialog {

  allparent_category: any = [];
  child_cat_list: any = [];
  subcategory_id: any = [];
  subcategory: any;
  description_msg: any;
  // parentcategory: any;
  submitted: boolean = false;
  create_post: FormGroup;
  image_url: any;
  options: string[] = ['One', 'Two', 'Three'];
  totaloptions: any = [];
  userDetailsList: any=[];
  selectedUserId: number=0;
  addService: string[] = [];
  doer_search: any = [];
  filteredStreets: Observable<string[]>;
  filteredAddService: Observable<string[]>;
  msgCountNumb: number = 500;
  companylogo_url: any;
  // @Output() listingPopulated = new EventEmitter();
  public showList: boolean = false;
  constructor(public dialogRef: MatDialogRef<CreatePostTwoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public commonservice: CommonService,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {

    this.create_post = this.fb.group({
      send_to: ['', Validators.compose([Validators.required])],
      doer_prfile_id: ['', Validators.compose([Validators.required])],
      category_id: ['', Validators.compose([Validators.required])],
      sub_category: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
  }

  ngOnInit() {
    this.getALlCategorylist();
    this.searchTotalNumberOfuser();
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.companylogo_url = window.location.protocol + '//' + window.location.hostname + '/pindo-server/uploads/company_logo/';
  }

  /**
   * Searchs recomended user in keyup function
   * @param event (pass the value from input field)
   */
  searchRecomendedUser(event) {
    if (event.target.value) {
      //filter the value from total user and store into array
      this.userDetailsList = this.totaloptions.filter(
        el =>
          el.username.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
      );
    } else {
      this.userDetailsList = [];
    }
  }
  /**
   * Gets selected user from dropdown
   * @param data (user id)
   */
  getSelectedUser(data) {
    this.selectedUserId = data.id;
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
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.create_post.controls.category_id.value }, contenttype: "application/json" }).then(result => {
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
    } else if(this.selectedUserId==0){
      this.create_post.controls.doer_prfile_id.setErrors({ error: true });
      this.create_post.patchValue({
        doer_prfile_id: ''
      });
    } else {
      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/add-post', data: {
          title: 'Recomendation',
          receiver_id: 0,
          target_id: 0,
          send_to: val.send_to,
          category_id: val.category_id,
          subcategory_id: this.subcategory,
          type: 'recomendation',
          tagged_user_id: this.selectedUserId,
          message: this.description_msg
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
}