
import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../../commonservice';
import { Globalconstant } from '../../../../../global_constant';
import { MatSlideToggleChange } from '@angular/material';

declare var $: any;
declare var Swiper: any;


@Component({
  selector: 'bookmarked-list',
  templateUrl: './bookmarked-list.component.html',
  styleUrls: ['./bookmarked-list.component.scss']
})
export class BookmarkedListComponent implements OnInit {
  selectedall: any;
  selectedtype: any;
  @Input()
  bookmarkdata;
  blog_image_url: any;
  companylogo_url: any;
  image_url: any;
  constructor(
    public dialog: MatDialog, public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant
  ) {
  }

  /**
   * on init
   */
  ngOnInit() {
    console.log('checkbox bookmark/////', this.bookmarkdata);
    this.blog_image_url = this.myGlobals.uploadUrl + '/blog/';
    this.companylogo_url = window.location.protocol + '//' + window.location.hostname + '/pindo-server/uploads/company_logo/Fcu8s9AUTx.jpg';
    this.image_url = this.myGlobals.uploadUrl + '/profile_photo/';
  }

  /**
   * after view init
   */
  ngAfterViewInit() {

  }

}
