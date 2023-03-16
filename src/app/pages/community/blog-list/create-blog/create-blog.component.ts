import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss']
})
export class CreateBlogComponent implements OnInit {
  @ViewChild('popUpVar') popupref;
  @ViewChild('myForm') formValues;
  @ViewChild('myckeditor') ckeditor: any;
  @Output() listingPopulated = new EventEmitter();
  name = 'ng2-ckeditor';
  ckeConfig: any;

  log: string = '';
  allparent_category: any = [];
  child_cat_list: any = [];
  subcategory_id: any = [];
  subcate_id: any;
  parentcategory: any;
  ckEditorConfig = {};
  submitted: boolean = false;
  blog_submit: FormGroup;
  profile_url: any;
  fileToUpload: File = null;
  imageUrl: string = '';

  public showList: boolean = false;
  constructor(private fb: FormBuilder,
    public commonservice: CommonService,
    public appService: AppComponent,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {
    this.createPostFormBuild();
    this.ckEditorConfig = {
      uiColor: '#ffffff',
      toolbar: [
        ['-', 'Bold', 'Italic', 'Underline'],
        {
          name: 'paragraph',
          items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
        },
      ],
      height: 200,
      removePlugins: 'elementspath',
      resize_enabled: false
    };
  }

  /**
   * Toggles popup open close
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Backs btn
   */
  backBtn() {
    this.submitted = false;
    this.formValues.resetForm();
    // this.createPostFormBuild();
    this.imageUrl = '';
    this.togglePopup();
  }

  /**
   * on init
   */
  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.getFetchAllCategory();
  }

  /**
   * Creates post form build
   */
  createPostFormBuild() {
    this.blog_submit = this.fb.group({
      blog_title: ['', Validators.compose([Validators.required])],
      myckeditor: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      subcate_id: ['', Validators.compose([Validators.required])],

    });
  }

  /**
  * Gets fetch all category list
  */
  getFetchAllCategory() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/parent-category', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.allparent_category = result.data.rows;
      }
    });
  }

  /**
    * Changes parent category from category list and search the post by category
    */
  changeParentCategory() {
    this.child_cat_list = [];
    this.subcategory_id = [];
    // console.log('parentcategory', this.parentcategory);
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.parentcategory }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.child_cat_list = result.data.rows;
      }
    });
  }

  /**
   * Changes chield category and store the value
   */
  changeChieldCategory() {
    this.subcategory_id = [this.subcate_id];
  }

  /**
   * Determines whether submit create post on
   * @param blog_title (blog title)
   * @param myckeditor (blog descriptions)
   * @param category (blog category)
   */
  onSubmitCreatePost(blog_title, myckeditor, category) {
    this.submitted = true;
    if (this.blog_submit.invalid) {
      return;
    } else if (blog_title.value.trim() == '') {
      this.blog_submit.controls.blog_title.setErrors({ error: true });
      this.blog_submit.patchValue({
        blog_title: blog_title.value.trim(),
      });
      return;
    } else if (myckeditor.value.trim() == '') {
      this.blog_submit.controls.myckeditor.setErrors({ error: true });
      this.blog_submit.patchValue({
        myckeditor: myckeditor.value.trim(),
      });
      return;
    } else if (!this.fileToUpload) {
      this.responseMessageSnackBar('Blog Image Required ', 'error');
      return;
    } else {
      const formData: FormData = new FormData();
      formData.append('category_id', category.value);
      formData.append('subcategory_id', this.subcategory_id);
      formData.append('name', blog_title.value);
      formData.append('description', myckeditor.value);

      if (this.fileToUpload) {
        formData.append('blog_image', this.fileToUpload, this.fileToUpload.name);
      }
      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/add-blog',
        data: formData, contenttype: ''
      })
        .then(result => {
          if (result.status == 1) {
            this.showMessageAlert();
          } else {
            this.responseMessageSnackBar(result.msg, 'error');
          }
        });
    }
  }

  /**
   * Shows message alert
   */
  showMessageAlert() {
    Swal({
      title: '',
      text: this.myGlobals.blogCreateMessage,
      //type: 'success',
      confirmButtonText: 'Ok!',
      confirmButtonColor: '#E6854A',
      allowOutsideClick: false
    }).then((resultswal) => {
      this.backBtn();
      this.showList = true;
      this.listingPopulated.emit(true);
    });
  }

  /**
   * Handles file input
   * @param file 
   */
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
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
}
