import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';
declare var $: any;


@Component({
  selector: 'account-setting-contact-information',
  templateUrl: './account-setting-contact-information.component.html',
  styleUrls: ['./account-setting-contact-information.component.css']
})
export class AccountSettingContactInformationComponent implements OnInit {
  @Input() isContactHidden;

  @ViewChild('popUpVar') popupref;
  @ViewChild('formDirective') myNgForm;
  @Output() profileContactDetails = new EventEmitter();

  oldConactModal: any = {};
  newcontactModel: any = {};
  contactModel: any = {};

  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z\]') } };

  constructor(public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) {
    this.populateListing();
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Params account setting contact information component
   * @param formDetails 
   * @returns  
   */
  submitContactDetails(formDetails) {
    if (formDetails.invalid) {
      return;
    }
    formDetails.value.section_type = 'contact';
    this.commonservice.postHttpCall({
      url: '/doers/update-contact-details',
      data: formDetails.value,
      contenttype: 'application/json'
    })
      .then(result => this.submitSuccess(result));
  }

  /**
   * Submits success
   * @param response 
   */
  submitSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg , 'orangeSnackBar');
      this.populateListing();
      this.togglePopup();
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
   * Populates listing
   */
  populateListing() {
    this.commonservice.postHttpCall({
      url: '/doers/get-contact-details',
      data: {},
      contenttype: 'application/json'
    })
      .then(result => this.populateSuccess(result));
  }

  /**
   * Populates success
   * @param response 
   */
  populateSuccess(response) {
    if (response.status == 1) {

      this.newcontactModel = { ...response.data };

      if (response.data.email) {
        this.contactModel.email = response.data.email;
        this.oldConactModal.email = response.data.email;
      } else {
        this.contactModel.email = '';
        this.oldConactModal.email = '';
      }
      if (response.data.mobile_no) {
        this.contactModel.mobile_no = response.data.mobile_no;
        this.oldConactModal.mobile_no = response.data.mobile_no;
      } else {
        this.contactModel.mobile_no = '';
        this.oldConactModal.mobile_no = '';
      }
      if (response.data.phone) {
        this.contactModel.phone = response.data.phone;
        this.oldConactModal.phone = response.data.phone;
      } else {
        this.contactModel.phone = '';
        this.oldConactModal.phone = '';
      }
      if (response.data.website) {
        this.contactModel.website = response.data.website;
        this.oldConactModal.website = response.data.website;
      } else {
        this.contactModel.website = '';
        this.oldConactModal.website = '';
      }

      /* this.oldConactModal.email = response.data.email;
      this.oldConactModal.pnumber = response.data.mobile_no;
      this.oldConactModal.snumber = response.data.phone;
      this.oldConactModal.website = response.data.website; */
      this.profileContactDetails.emit(response.data);
    }
  }

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   */
  public responseMessageSnackBar(message, res_class = '') {
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
        title: 'Do you want to save your activity?',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#E6854A',
        confirmButtonText: 'SAVE',
        cancelButtonText: 'CANCEL',
      }).then((resultswal) => {
        if (resultswal.value) {
          $('#submit-button').trigger('click');
        } else {
          this.setPreviousDataWithOutSavingBackTime();
        }
      });
    } else {
      this.setPreviousDataWithOutSavingBackTime();
    }
  }

  /**
   * Sets previous data with out saving back time
   */
  setPreviousDataWithOutSavingBackTime() {
    this.contactModel.email = this.oldConactModal.email;
    this.contactModel.mobile_no = this.oldConactModal.mobile_no;
    this.contactModel.phone = this.oldConactModal.phone;
    this.contactModel.website = this.oldConactModal.website;

    this.togglePopup();
  }

  /**
   * Checks value update ornot
   * @returns true if value update ornot 
   */
  checkValueUpdateORNot(): boolean {
    console.log(this.oldConactModal, this.contactModel);

    if (this.oldConactModal.email != this.contactModel.email
      || this.oldConactModal.mobile_no != this.contactModel.mobile_no
      || this.oldConactModal.website != this.contactModel.website
      || this.oldConactModal.phone != this.contactModel.phone
    ) {
      console.log(this.oldConactModal);
      console.log(this.contactModel);
      return true;
    } else {
      return false;
    }
  }

}
