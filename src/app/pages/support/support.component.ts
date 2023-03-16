import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../commonservice';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  
	//(1) , (2) Profile, (3) My Activity (4) New Pin (5) Existing Pin (6) Public Pin (7) Home Page (8) Payments (9) Dispute (10) Pin Categories (new) (11) Pin Categories (existing) (12) New Communities
  subjects = [];
  userDetails: any = {};
  afterUserDetails = false;

  selectedTab = 0;

  constructor(public commonservice: CommonService, public snackBar: MatSnackBar) { 
  	this.getUserDetails();
  	this.populateSubjects();
  }

  populateSubjects() {
  	this.commonservice.postHttpCall({url: '/support-subjects', data: {}, contenttype: 'application/json'}).then((result) => this.populateSubjectsSuccess(result));
  }

  populateSubjectsSuccess(response) {
  	if (response.status == 1) {
  		this.subjects = response.data;
  	}
  }

  getUserDetails() {
  	this.commonservice.postHttpCall({url: '/get-user-details', data: {}, contenttype: 'application/json'}).then((result) => this.ongetUserDetailsSuccess(result));  	
  }

  ongetUserDetailsSuccess(response) {
  	if (response.status == 1) {
  		this.userDetails = response.data;
  		if (this.userDetails['user_type'] == 1) {
  			this.selectedTab = 0;
  		} else {
  			this.selectedTab = 1;
  		}
  	}
  	this.afterUserDetails = true;
  }

  ngOnInit() {
  	// this.createPinnerForm();
  }
}
