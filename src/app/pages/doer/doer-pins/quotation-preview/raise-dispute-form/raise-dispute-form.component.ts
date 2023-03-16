import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { CommonService } from '../../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globalconstant } from '../../../../../global_constant';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
declare var jQuery: any;
declare var $: any;
declare var io: any;

@Component({
  selector: 'app-raise-dispute-form',
  templateUrl: './raise-dispute-form.component.html',
  styleUrls: ['./raise-dispute-form.component.scss']
})
export class RaiseDisputeFormComponent implements OnInit {

  @Input('isHiddenPinId') isHiddenPinId;

  @ViewChild('popUpVar') popupref;

  dispute_pin_form: FormGroup;
  types: any = [
    { value: 'Scam/Fraud', viewValue: 'Scam/Fraud' },
    { value: 'Prohibited Pin', viewValue: 'Prohibited Pin' },
    { value: 'Inappropriate Content', viewValue: 'Inappropriate Content' },
    { value: 'Duplicate Listing', viewValue: 'Duplicate Listing' },
    { value: 'Copyright', viewValue: 'Copyright' },
    { value: 'Rendering Service', viewValue: 'Rendering Service' },
    { value: 'Payment Related', viewValue: 'Payment Related' },
    { value: 'Others', viewValue: 'Others' },
  ];

  pin_milestones: any = [
    { value: '', viewValue: 'All' },
  ];

  imgUrl = '';
  imageObj: any;
  uploadedFileName: any = '';
  pin_id_title: any = '';
  pinDetails: any;


  constructor(public gbConstant: Globalconstant, public commonservice: CommonService,
    public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, private _fb: FormBuilder, private router: Router) {

  }

  /**
   * on init
   */
  ngOnInit() {
    this.dispute_pin_form = this._fb.group({
      dispute_pin_id: [this.isHiddenPinId, Validators.required],
      dispute_reason_type: ['', Validators.required],
      dispute_reason_desc: ['', Validators.required],
      imgUrl: ['']
    });
  }

  get f() { return this.dispute_pin_form.controls; }

  /**
   * Toggles popup
   */
  togglePopup(pinDetails = null) {
    this.dispute_pin_form.patchValue({
      dispute_pin_id: this.isHiddenPinId,
    });
    this.getpinMilestone(this.isHiddenPinId);
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }

    this.pinDetails = pinDetails;
  }


  /**
   * Getpins milestone
   * @param val
   */
  getpinMilestone(val) {
    this.commonservice.postHttpCall({ url: '/doers/pin-milestone', data: { pin_id: val }, contenttype: "application/json" }).then(result => this.getpinMilestoneSuccess(result));
  }

  /**
   * Getpins milestone success
   * @param response
   */
  getpinMilestoneSuccess(response) {
    if (response.status == 1) {
      for (var i = response.data.length - 1; i >= 0; i--) {
        this.pin_milestones.push(response.data[i]);
        this.pin_id_title = response.pin_data.title + ' , ' + response.pin_data.pin_unique_id;
      }
      console.table(this.pin_milestones);
    }
  }

  /**
   * Determines whether delete on
   * @param e
   */
  onDelete(e) {
    this.imageObj = '';
  }

  /**
   * Accpts file
   * @param e
   */
  accptFile(e) {
    this.imageObj = e.target.files[0];
    this.imgUrl = '';
    console.table(this.imageObj);
    this.uploadedFileName = this.imageObj.name;
  }

  /**
   * Disputes pinadd
   * @param form
   */
  disputePinadd(form) {
    if (form.valid) {
      let fd = new FormData();
      let values = form.value;
      Object.keys(values).forEach(function (key) {
        if (key == 'pImg') {
          fd.append(key, values[key].formatted);
        } else {
          fd.append(key, values[key]);
        }
      });
      if (this.imageObj) {
        fd.append('dispute_file', this.imageObj);
      }
      this.commonservice.postHttpCall({ url: '/doers/dispute-pin-by-doer', data: fd, contenttype: "form-data" }).then(result => this.disputeSuccess(result));
    } else {
      //this.isformSubmitted = false;
      console.log('required field');
    }
  }

  /**
   * Disputes success
   * @param response
   */
  disputeSuccess(response) { console.log("disputeSuccess: ", response);
    if (response.status == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': atob(localStorage.getItem('frontend_user_id')),
        'pin_id': this.isHiddenPinId,
        'doer_title': 'Your claim has been received and you will receive a response shortly.',
        'doerEmailTemplateSlug': 'dispute_claim_send_by_doer',
        'doer_link': 'dispute',

        'PIN_UNIQUE_ID': this.pinDetails['pin_unique_id'],
        'PINDETAILSURL': 'doer/quotation-preview/' + this.pinDetails['slug'],
        'HOME_PAGE_LINK': 'doer/community-home',
        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        'MYPINS_PAGE_LINK': 'doer/my-pins',
        'PIN_A_JOB_PAGE': 'FIND A JOB',
        'PIN_A_JOB_PAGE_LINK': 'public-pins'
      };

      var pinnerPostData = {
        'sender_id': this.pinDetails['pinner_details']['id'],
        'reciver_id': this.pinDetails['pinner_details']['id'],
        'pin_id': this.isHiddenPinId,
        'doer_title': 'Your claim has been received and you will receive a response shortly.',
        'doerEmailTemplateSlug': 'dispute_claim',
        'doer_link': 'dispute',

        'PIN_UNIQUE_ID': this.pinDetails['pin_unique_id'],
        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.pinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'HOME_PAGE_LINK': 'community/community-home',
        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
        'MYPINS_PAGE_LINK': 'pinner/my-pins',
        'PIN_A_JOB_PAGE': 'PIN A JOB',
        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
      };

      // this.gbConstant.notificationSocket.emit("post-dispute-notification-email", response.dataEmail);
      this.gbConstant.notificationSocket.emit("post-notification-to-doer-himself", pinnerPostData);

      setTimeout(() => {
        this.gbConstant.notificationSocket.emit("post-notification-to-doer-himself", postData);
      }, 3000)

      this.togglePopup();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');

    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    this.router.navigate(['/doer/my-pins']);
  }

  /**
   * Responses message snack bar
   * @param message
   * @param [res_class]
   * @param [vertical_position]
   */
  public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 6000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

}
