import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import {MatSnackBar} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pinner-contact',
  templateUrl: './pinner-contact.component.html',
  styleUrls: ['./pinner-contact.component.scss']
})
export class PinnerContactComponent implements OnInit {
  @Input()
  isContactHidden;

  @ViewChild('popUpVar')
  popupref;	

  @Output()	contactPopulated = new EventEmitter();

  contactModel = {
    email:'',
    mobile_no:'',
    phone:''
  }

  contactInformation:any = {};

  constructor( public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private ref:ChangeDetectorRef,public snackBar: MatSnackBar ) { 
  	this.getContact();
  }

  ngOnInit() {
  	
  }

  getContact() {
  	this.commonservice.postHttpCall({url:'/pinners/get-contact-info', contenttype:"application/json"}).then(result=>this.getContactSuccess(result));
  }

  getContactSuccess(response) {
  	console.log('contact',response);
  	if(response.status == 1) {
      let tempData = response.data;
      if(tempData['phone'] && tempData['phone']!='') {
        tempData['phone'] = tempData['phone'].split('');
        tempData['phone'].splice(6,0,'-');
        tempData['phone'].splice(3,0,') ');
        tempData['phone'].splice(0,0,'+1 (');
        this.contactInformation['phone'] = tempData['phone'].join('');
      } else {
        this.contactInformation['phone'] = tempData['phone'];
      }
      if(tempData['mobile_no']) {
        tempData['mobile_no'] = tempData['mobile_no'].split('');
        tempData['mobile_no'].splice(6,0,'-');
        tempData['mobile_no'].splice(3,0,') ');
        tempData['mobile_no'].splice(0,0,'+1 (');
      }

      
      if(tempData['mobile_no']) {
        this.contactInformation['mobile_no'] = tempData['mobile_no'].join('');
      } else {
        this.contactInformation['mobile_no'] = null
      }

      this.contactInformation['email'] = tempData['email'];
      this.contactInformation['id'] = tempData['id'];
  		// this.contactInformation = response.data;
      if(this.contactInformation.phone!=null && this.contactInformation.phone!=null){
        this.contactPopulated.emit(true);
      }
      else{
        this.contactPopulated.emit('partial');
      }
      console.log(this.contactInformation);
  		
  	}
  	else {
  		this.contactPopulated.emit(false);
  	}
  }

  setContactDetails(tosubmitData,frmElm) {
  	this.commonservice.postHttpCall({url:'/pinners/update-contact-info', data:tosubmitData , contenttype:"application/json"}).then(result=>this.setContactSuccess(result,frmElm));
  }

  setContactSuccess(response,frmElm) {
  	console.log(response);
  	if(response.status == 1) {
  		this.getContact();
  		//this.resetFunction(frmElm);
  		this.responseMessageSnackBar(response.msg);
      this.getContact();
  	} else if(response.status == 0) {
      this.responseMessageSnackBar(response.msg,'error');
    }
  }


  togglePopup() {
  	if (this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement, 'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
  	} else {
  		this.renderer.addClass(this.popupref.nativeElement, 'opened');
  		this.renderer.addClass(document.body, 'popup-open');
      if(typeof(this.contactInformation.email)!='undefined')
  		  this.contactModel.email = this.contactInformation.email;
  		if(this.contactInformation.mobile_no!=null)
  			this.contactModel.mobile_no = this.contactInformation.mobile_no;
  		if(this.contactInformation.phone!=null)
  			this.contactModel.phone = this.contactInformation.phone;
  	}
  }

  resetFunction(frmElm) {
  	frmElm.reset();
  	frmElm.submitted = false;
  }

  submitFunction(frmElm) {
  	if(frmElm.valid) {
  		this.setContactDetails(frmElm.value,frmElm);
  	}
  }

  public responseMessageSnackBar(message,res_class=''){
    this.snackBar.open(message,'', {
        duration: 4000,
        horizontalPosition:'right',       
        panelClass:res_class
    });
  }

}
