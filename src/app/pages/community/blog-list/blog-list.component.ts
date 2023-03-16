import { CreateBlogComponent } from './create-blog/create-blog.component';
import { InvitePindoDialog } from '../community-home/invite-pindo-dialog/invite-pindo-dialog.component';
import { CreatePostDialog } from '../community-home/create-post-dialog/create-post-dialog.component';
import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import { MatSlideToggleChange } from '@angular/material';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
declare var $: any;
declare var Swiper: any;
@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  blog_list_array: any = [];
  profile_url: any;
  blog_image_url: any;
  name: any = '';
  allparent_category: any = [];
  child_cat_list: any = [];
  parentcategory: any = '';
  subcategory_id: any = [];
  commonsearch: any = '';
  tranding_list: any = [];
  trending: any;
  blogRightBoxOpen: boolean = false;
  page_number: any = 1;
  limit: any = 5;
  subcate_id: any;
  companylogo_url: any;
  pindologo: any;
  @ViewChild('createBlogInfo') createBlogInfo: CreateBlogComponent;

  constructor(public dialog: MatDialog,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    private ref: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant,
    public appService: AppComponent,
    private router: Router) { }

  ngOnInit() {
    this.getAllBlogList(this.commonsearch, this.parentcategory, this.subcategory_id);
    this.getFetchAllCategory();
    this.getTrandingBlogList(this.page_number);
    this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.blog_image_url = this.myGlobals.uploadUrl + '/blog/';
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.pindologo = this.myGlobals.uploadUrl + '/company_logo/pinner_beta_logo.svg';
  }

  /**
    * Gets all blog listing
    * @param commonsearch 
    * @param category_id 
    * @param subcategory_id 
    */
  getAllBlogList(commonsearch, category_id, subcategory_id) {
    this.blog_list_array = [];
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/list-blog', data: { search: commonsearch, category_id: category_id, subcategory_id: subcategory_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        if (result.data != '') {
          this.blog_list_array = result.data.rows;
        }
      }
    });
  }

  /**
   * Searchs blog by name
   */
  searchBlogByName() {
    this.getAllBlogList(this.name, this.parentcategory, this.subcategory_id);
  }

  /**
    * Gets fetch all category list
    */
  getFetchAllCategory() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/parent-category', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.allparent_category = result.data.rows;
        this.allparent_category.push({ name: 'PinDo Reference', id: 0 });
        console.log('ARAYYYYYYYYY', this.allparent_category);

      }
    });
  }

  /**
   * Changes parent category from category list and search the Blog by category
   */
  changeParentCategory(id) {
    console.log('IDDDDDDDDDDDDDDDDDdd', id);

    this.child_cat_list = [];
    this.subcategory_id = [];
    if (id == 0) {
      this.commonservice.postCommunityHttpCall({ url: '/api/pinner/list-blog', data: { search: this.commonsearch, category_id: 0, subcategory_id: [0] }, contenttype: 'application/json' }).then(result => {
        if (result.data) {
          this.blog_list_array = result.data.rows;
        } else {
          this.blog_list_array = [];
        }
      });
    } else {
      this.commonservice.postCommunityHttpCall({ url: '/api/pinner/child-category', data: { parent_id: this.parentcategory }, contenttype: 'application/json' }).then(result => {
        if (result.status == 1) {
          this.child_cat_list = result.data.rows;
        }
      });
    }
  }

  /**
   * Changes chield category and search post by subcategory
   * @param e 
   *
   * @param categoryid 
   */
  changeChieldCategorySearch() {
    this.subcategory_id = [this.subcate_id];
    this.getAllBlogList(this.name, this.parentcategory, this.subcategory_id);
  }

  /**
   * Clears filter
   */
  clearFilter() {
    this.parentcategory = '';
    this.name = '';
    this.subcategory_id = [];
    this.child_cat_list = [];
    this.getAllBlogList(this.name, this.parentcategory, this.subcategory_id);
  }

  /**
   * Gets tranding blog list
   * @param page_numner 
   */
  getTrandingBlogList(page_numner) {
    var csearch = '';
    var pcategory = '';
    var scategory_id = [];
    var trending_t = 1;
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/trending-blogs', data: { page: page_numner, limit: this.limit }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        if (result.data != '') {
          if (result.status == 1) {
            // store the value into array   
            result.data.rows.forEach(resultantdata => {
              this.tranding_list.push(resultantdata);
            });
          }
        }
      }
    });
  }

  /**
   * Go toblog details page
   * @param blog_id 
   */
  goTOBlogDetailsPage(blog_id) {
    let b64 = CryptoJS.AES.encrypt(`${blog_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    // console.log(eHex);
    // this.router.navigate([]).then(result => { window.open(`blog-detail/${eHex}`, '_blank'); });
    this.router.navigate(["/blog-detail", eHex]);
  }

  /**
 * Opens user details
 * @param user_id 
 * @param user_type 
 */
  openUserDetails(user_id: number, user_type: number) {
    console.log(user_id, user_type);
    let b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    let e64 = CryptoJS.enc.Base64.parse(b64);
    let eHex = e64.toString(CryptoJS.enc.Hex);
    if (user_type == 1) {
      this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`pinner/pinner-profile/${eHex}`]);
    } else {
      this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`doer/doer-profile/${eHex}`]);
    }
  }


  /**
   * Blogs right tgl
   * @param clickItem 
   */
  blogRightTgl(clickItem) {
    clickItem.stopPropagation();
    if (this.blogRightBoxOpen === false) {
      this.blogRightBoxOpen = true;
    }
    else {
      this.blogRightBoxOpen = false;
    }
  }

  /**
   * Rights blog over click
   * @param clickItem 
   */
  rightBlogOverClick(clickItem) {
    clickItem.stopPropagation();
    clickItem.preventDefault();
    this.blogRightBoxOpen = false;
  }

  // ----------popup open close function -----------
  toggleParentPopup(profileSlug) {
    if (profileSlug === 'CreateBlogComponent') {
      this.createBlogInfo.togglePopup();
    }
  }

  /**
   * Determines whether scroll on
   */
  onScroll() {
    this.page_number = this.page_number + 1;
    // console.log('page number', this.page_number);
    this.getTrandingBlogList(this.page_number);
  }

}
