import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import {MatSnackBar} from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'update-contact',
  templateUrl: './update-contact.component.html',
  styleUrls: ['./update-contact.component.scss']
})
export class UpdateContactComponent implements OnInit {
  @ViewChild('popUpVar')  popupref;	
  @Input() contactDetails;
  @Output()	accountSettingDetailsPopulate = new EventEmitter();

  contactModel: any = {};

  constructor( public commonservice: CommonService, public renderer: Renderer2, 
    public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar,
    public myGlobals: Globalconstant ) { 
  }

  ngOnInit() {}

  togglePopup() {
  	if (this.popupref.nativeElement.classList.contains('opened')) {
  		this.renderer.removeClass(this.popupref.nativeElement, 'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
  	} else {
      // console.log(this.contactDetails);
      if (this.contactDetails.email == null) {
        this.contactDetails.email = '';
      }
      if (this.contactDetails.phone == null) {
        this.contactDetails.phone = '';
      }
      if (this.contactDetails.mobile_no == null) {
        this.contactDetails.mobile_no = '';
      }
      this.contactModel = this.contactDetails;
      this.contactDetails = {...this.contactModel};
      console.log(this.contactDetails);
  		this.renderer.addClass(this.popupref.nativeElement, 'opened');
  		this.renderer.addClass(document.body, 'popup-open');
  	}
  }

  setContactDetails(tosubmitData) {
  	this.commonservice.postHttpCall({
      url: '/pinners/update-contact-info',
       data: tosubmitData , contenttype: 'application/json'})
       .then(result => this.setContactSuccess(result));
  }

  setContactSuccess(response) {
  	console.log(response);
  	if (response.status == 1) {
      this.accountSettingDetailsPopulate.emit(true);
  		this.responseMessageSnackBar(response.msg);
  	} else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    this.togglePopup();
  }


  submitFunction(frmElm) {
  	if (frmElm.valid) {
  		this.setContactDetails(frmElm.value);
  	}
  }

  public responseMessageSnackBar(message, res_class= '') {
    this.snackBar.open(message, '', {
        duration: 4000,
        horizontalPosition: 'right',       
        panelClass: res_class
    });
  }

  /**
   * Closes modal
   */
  closeModal() {
    if (this.checkValueUpdateORNot()) {
      Swal({
        title: this.myGlobals.updateDataBackAlertMsg,
        text: '',
        //type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'YES',
        cancelButtonText: 'BACK',
      }).then((resultswal) => {
        if (resultswal.value) {
           this.togglePopup();
        }
      });
    } else {
      this.togglePopup();
    }
  }

  /**
   * Checks value update ornot
   * @returns true if value update ornot 
   */
  checkValueUpdateORNot(): boolean {
    if (this.contactDetails.email != this.contactModel.email 
      || this.contactDetails.phone != this.contactModel.phone
      || this.contactDetails.mobile_no != this.contactModel.mobile_no) {
        return true;
      } else {
        return false;
      }
  }

}
