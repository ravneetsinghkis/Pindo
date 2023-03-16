import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { EscapeHtmlPipe } from './keep-html.pipe';

declare var $;

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  providers:[EscapeHtmlPipe],
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  public privacyData = {};
  public current_url_end_element:any;
  constructor(public commonservice:CommonService, public snackBar: MatSnackBar, private router: Router,
  			  private sanitizer: DomSanitizer,) { 

    let current_url = window.location.href;
    let url_array   = current_url.split('/');
    this.current_url_end_element = url_array[url_array.length-1];
    console.log(this.current_url_end_element); 
  	this.getPrivacyPolicy()
  }

  ngOnInit() {

  }

  getPrivacyPolicy() {
    this.commonservice.postHttpCall({url:'/get-cms-details', data:{'slug':this.current_url_end_element}, contenttype:"application/json"}).then(result=>this.privacyPolicySuccess(result));
  }

  privacyPolicySuccess(response){
   
    if(response.status == 1){     
        this.privacyData = response.data;
        window.scrollTo(500, 0);
    }
  }

}
