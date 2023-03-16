import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonService } from '../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { EscapeHtmlPipe } from './keep-html.pipe';

declare var $;

@Component({
  selector: 'app-customer-info',
  templateUrl: './cms-info.component.html',
  providers: [EscapeHtmlPipe],
  styleUrls: ['./cms-info.component.scss']
})
export class CmsInfoComponent implements OnInit, AfterViewInit {
  public cmsData = {};
  public current_url_end_element: any;
  afterInit = false;

  constructor(public commonservice: CommonService,
    public snackBar: MatSnackBar,
    private router: Router,
    private sanitizer: DomSanitizer, ) {


    let current_url = window.location.href;
    let url_array = current_url.split('/');
    this.current_url_end_element = url_array[url_array.length - 1];
    console.log(this.current_url_end_element);
    this.getCmsDetails();
  }

  /**
   * on init
   */
  ngOnInit() {

  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.afterInit = true;
  }

  /**
   * Gets cms details
   */
  getCmsDetails() {
    var data = {};
    this.commonservice.postHttpCall({ url: '/get-cms-details', data: { 'slug': this.current_url_end_element }, contenttype: "application/json" })
      .then(result => this.cmsDetailsSuccess(result));
  }

  /**
   * Cms details success
   * @param response 
   */
  cmsDetailsSuccess(response) {

    if (response.status == 1) {
      console.log(response);
      if (response.data != null) {
        this.cmsData = response.data;
        window.scrollTo(500, 0);
      } else {
        this.cmsData = { 'content': 'No data found' };
      }
    }
  }

}
