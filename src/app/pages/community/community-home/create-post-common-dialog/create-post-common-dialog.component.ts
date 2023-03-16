import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/commonservice';
import { Observable } from 'rxjs';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-create-post-common-dialog',
  templateUrl: './create-post-common-dialog.component.html',
  styleUrls: ['./create-post-common-dialog.component.scss']
})
export class CreatePostCommonDialogComponent implements OnInit {

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
  housepriceoptions: any;
  totaloptions: any = [];
  housePricesAreaToken: any;
  post_type: any = "";
  post_title: string = "";
  form_type: string = "";
  image_url: string = "";
  companylogo_url: string = "";

  @ViewChild('create_post_general_error') create_post_general_error: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CreatePostCommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, 
    public commonservice: CommonService, 
    public snackBar: MatSnackBar,
    private myGlobals: Globalconstant
  ) { }

  ngOnInit() {
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.generatePostForm();
    this.getALlCategorylist();
    this.searchTotalNumberOfuser();
  }

  /**
   * Generate common post form
   */
  generatePostForm() {
    this.create_post = this.fb.group({
      post_type: ['', [Validators.required]],
      send_to: ['', [Validators.required]],
      category: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      doer_prfl: ['']
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
    this.subcategory = null;

    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.parentcategory }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.child_cat_list = result.data.rows;
      }
    });
  }  

  subcategoryChangeHandler(input) {
    // console.log('input', input);
    if (input) {
      this.child_cat_list = this.child_cat_list.filter(cat => cat.id == input);
    }
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
      window.setTimeout(() => {
        this.create_post_general_error.nativeElement.scrollIntoView({
          behavior: "smooth"
        });
      }, 500);
      return;
    } else {
      let formData = new FormData();
      formData.append("title", this.post_title);
      formData.append("receiver_id", '0');
      formData.append("target_id", '0');
      formData.append("send_to", val.send_to);
      formData.append("category_id", val.category);
      formData.append("subcategory_id", val.sub_category);
      formData.append("type", this.form_type);
      formData.append("message", val.message);
      formData.append("post_image", this.fileToUpload);

      if (this.post_type == "3") {
        formData.append("tagged_user_id", this.housePricesAreaToken);
      }

      // console.log(...formData); return;

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

  

  /**
   * Searchs recomended user in keyup function
   * @param event (pass the value from input field)
   */
  searchRecomendedUser(event) {
    if (event.target.value) {
      //filter the value from total user and store into array
      this.housepriceoptions = this.totaloptions.filter(
        el => el.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
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
   * Set dynamic form controls
   */
  changePostType() {
    switch (this.post_type) {
      case "1":
          this.post_title = "Conversation";
          this.form_type = "conversation";
          this.create_post.controls['doer_prfl'].setValidators(null);
        break;
    
      case "2":
          this.post_title = "Searching For";
          this.form_type = "searching";
          this.create_post.controls['doer_prfl'].setValidators(null);
        break;

      case "3":
          this.post_title = "Recommendation";
          this.form_type = "recomendation";
          this.create_post.controls['doer_prfl'].setValidators([Validators.required]);
        break;        
    }

    this.create_post.controls['doer_prfl'].updateValueAndValidity();
  }

}
