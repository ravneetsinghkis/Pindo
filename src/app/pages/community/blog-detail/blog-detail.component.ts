import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AppComponent } from 'src/app/app.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { Meta } from "@angular/platform-browser";

declare var $: any;
declare var Swiper: any;
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  providers:[EscapeHtmlPipe],
})
export class BlogDetailComponent implements OnInit, AfterViewInit {
  id: any;
  blog_id: any;
  blog_data: any;
  profile_url: any;
  user_image: any;
  blog_image_url: any;
  blog_image: any;
  blog_category: any;
  blog_subcategory: any;
  suggested_blog_data_array: any;
  companylogo_url: any;
  pindologo: any;
  textSize = 0;
  continueStory: boolean = false;

  constructor(
    public dialog: MatDialog,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    private ref: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant,
    private route: ActivatedRoute,
    public appService: AppComponent,
    private sanitizer: DomSanitizer,
    private router: Router,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.getDetailsOfBlog();
    this.profile_url = this.myGlobals.uploadUrl + '/profile_photo/';
    this.blog_image_url = this.myGlobals.uploadUrl + '/blog/';
    this.companylogo_url = this.myGlobals.uploadUrl + '/company_logo/';
    this.pindologo = this.myGlobals.uploadUrl + '/company_logo/pinner_beta_logo.svg';

		// SEO Tags
		this.meta.updateTag({name: "description", content: "Read full article on PinDo - Your one-stop shop to get stuff done."});
		this.meta.updateTag({property: "og:description", content: "Read full article on PinDo - Your one-stop shop to get stuff done."});
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const text = document.getElementById('desc').innerText;
      this.textSize = text.split(' ').length;
      console.log('TEXT', this.textSize);
    }, 1000);
  }

  getDetailsOfBlog() {
    this.route.paramMap.subscribe(parameters => {
      const reb64 = CryptoJS.enc.Hex.parse(parameters['params']['id']);
      const bytes = reb64.toString(CryptoJS.enc.Base64);
      const decrypt = CryptoJS.AES.decrypt(bytes, 'Secret Key');
      const plain = decrypt.toString(CryptoJS.enc.Utf8);
      this.blog_id = plain.split('-')[0];
      this.getPostData();
    });
  }

  getPostData() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/single-blog-info', data: { id: this.blog_id }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.blog_data = result.data.rows[0];
        this.blog_category = result.data.rows[0].category ? result.data.rows[0].category.id : 0;
        this.blog_subcategory = result.data.rows[0].subcategory ? result.data.rows[0].subcategory.id : 0;
        this.suggestedBlog(this.blog_category, this.blog_subcategory);

        // SEO Tags
        this.meta.updateTag({property: "og:title", content: this.blog_data.name});
        if (this.blog_data.image) { console.log("image", this.blog_data.image);
          this.meta.updateTag({property: "og:image", content: this.blog_image_url + this.blog_data.image});
        } else {
          this.meta.updateTag({property: "og:image", content: 'assets/images/recent2.jpg'});
        }
      }
    });
  }

  openUserDetails(user_id: number, user_type: number) {
    const b64 = CryptoJS.AES.encrypt(`${user_id}`, 'Secret Key').toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const eHex = e64.toString(CryptoJS.enc.Hex);
    if (user_type == 1) {
      this.router.navigate([]).then(result => { window.open(`public/pinner-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`pinner/pinner-profile/${eHex}`]);
    } else {
      this.router.navigate([]).then(result => { window.open(`doer/doer-profile/${eHex}`, '_blank'); });
      // this.router.navigate([`doer/doer-profile/${eHex}`]);
    }
  }

  goTOBlogDetailsPage(blog_id) {
    const b64 = CryptoJS.AES.encrypt(`${blog_id}`, 'Secret Key').toString();
    const e64 = CryptoJS.enc.Base64.parse(b64);
    const eHex = e64.toString(CryptoJS.enc.Hex);
    // console.log(eHex);
    // this.router.navigate([]).then(result => { window.open(`blog-detail/${eHex}`, '_blank'); });
    this.router.navigate(["/blog-detail", eHex]);
  }

  suggestedBlog(category, subcategory) {

    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/sujjested-posts', data: { id: this.blog_id, category_id: category, subcategory_id: subcategory }, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.suggested_blog_data_array = result.data.rows;
      }
    });
  }

}
