import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { CommonService } from '../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { EscapeHtmlPipe } from './keep-html.pipe';

declare var $;

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  providers:[EscapeHtmlPipe],
  styleUrls: ['./covid19.component.scss']
})
export class Covid19Component implements OnInit {
 
  public current_url_end_element:any;
  showView:boolean = false;
  constructor(public commonservice:CommonService, public snackBar: MatSnackBar, private router: Router,
  			  private sanitizer: DomSanitizer,) { 
    let current_url = window.location.href;
    let url_array   = current_url.split('/');
    this.current_url_end_element = url_array[url_array.length-1];
    console.log(this.current_url_end_element); 
  	
  }

  ngOnInit() {

  }

  ngAfterViewInit(){

  }

  goToRegister(type){
		localStorage.setItem('preselectedType', type);
		this.router.navigate(['register/']);
	}

 

}
