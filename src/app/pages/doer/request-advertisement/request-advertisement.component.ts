import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators,EmailValidator} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../../app.component';
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { CourseDialogComponent } from './course-dialog/course-dialog.component';

declare var $: any;
@Component({
	selector: 'Request Advertisement',
	templateUrl: './request-advertisement.component.html',
  	styleUrls: ['./request-advertisement.component.scss']
})



export class AdvertisementComponent  { 
	doer_id:any;

	constructor(
		  public snackBar: MatSnackBar,
		  private route: ActivatedRoute, 
		  private router: Router,
		  private appService: AppComponent, 
		  private titleService: Title,
		  private dialog: MatDialog
		)
	{	
	}
	ngOnInit() {

	}
	/*
	   * open popup
	   * 
	*/
	openDialog() {
		let tempDialogRef = this.dialog.open(CourseDialogComponent, {
			width: '345px',
			disableClose:false,
			data: ''
		});
	}

}

