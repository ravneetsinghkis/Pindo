import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-apply-pins',
  templateUrl: './apply-pins.component.html',
  styleUrls: ['./apply-pins.component.scss']
})
export class ApplyPinsComponent implements OnInit {

  pin_id: number;
  toshowQuotation: boolean = false;
  attachment = [];
  baseCompUrl: any;

  totalDataToPrepoluate = {};
  PinDetails = {};
  showView: boolean = false;
  doerCreditCount = 0;
  @ViewChild('popUpRaiseDispute') popUpRaiseDispute;


  constructor(
    public commonservice: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public gbConstant: Globalconstant,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe(params => {
      this.pin_id = params['pin_ID'];
    });

    this.baseCompUrl = gbConstant.uploadUrl;
    this.getQuotationPageDetails();
    this.commonservice.paymentRequestValue.subscribe(value => {
      // console.log('payment_request', value);
      if (value) {
        this.getQuotationPageDetails();
      }
    });
  }

  ngOnInit() {

  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.showView = true;
  }

  /**
   * Toggles child popup
   */
  toggleChildPopup() {
    this.popUpRaiseDispute.togglePopup(this.PinDetails);
  }


  /**
   * Gets quotation page details
   */
  getQuotationPageDetails() {
    this.commonservice.postHttpCall({ url: '/doers/quotation-page-details',
     data: { slug: this.pin_id }, contenttype: 'application/json' })
     .then(result => this.getDetailsSuccess(result));
  }

  /**
   * Gets details success
   * @param response
   */
  getDetailsSuccess(response) {
    if (response.status == 1) {
      this.totalDataToPrepoluate = response.data;
      this.PinDetails = response.data.pin_details;
      if (response.data['quotation_dtls']) {
        this.attachment = response.data['quotation_dtls']['attachments'];
      }
    }
  }

  /**
   * Uploads attachment
   * @param evt
   */
  uploadAttachment(evt) {
    let fd = new FormData();
    fd.append('uploadedAttachment', evt.target.files[0]);
    this.commonservice.postHttpCall({ url: '/doers/quotation-attachment', data: fd, contenttype: 'form-data' }).then(result => this.uploadAttachmentSuccess(result, evt));
  }

  /**
   * Uploads attachment success
   * @param response
   * @param e
   */
  uploadAttachmentSuccess(response, e) {
    if (response.status == 1) {
      e.target.value = '';
      this.attachment.push(response.data)
    }
  }

  /**
   * Removes attachment
   * @param indexVal
   */
  removeAttachment(indexVal) {
    // console.log(this.attachment[indexVal]);
    this.commonservice.postHttpCall({ url: '/doers/remove-attachment', data: { 'file_name': this.attachment[indexVal]['file_name'] }, contenttype: 'form-data' }).then(result => this.removeAttachmentSuccess(result, indexVal));
  }

  /**
   * Removes attachment success
   * @param response
   * @param indexVal
   */
  removeAttachmentSuccess(response, indexVal) {
    if (response.status == 1) {
      this.attachment.splice(indexVal, 1);
    }
  }

  /**
   * Declines job response
   * @param event
   */
  declineJobResponse(event) {
    // console.log('declineJobResponse', event);
    if (event) {
      this.getQuotationPageDetails();
    }
  }

  /**
   * Go to chat
   * @param pinner_id
   * @param pin_id
   */
  goToChat(pinner_id, pin_id) {

    let pub_pinner_id = pinner_id;
    let pub_pin_id = pin_id;
    let pub_doer_id = atob(localStorage.getItem('frontend_user_id'));

    let postData = {
      'pub_pinner_id': pub_pinner_id,
      'pub_doer_id': pub_doer_id,
      'pub_pin_id': pub_pin_id
    };

    this.gbConstant.notificationSocket.emit('save-log-last-message-data', postData);
    this.gbConstant.notificationSocket.on('get-log-last-message-data', (res) => {
      localStorage.setItem('pinner_id_again', btoa(pinner_id));
      this.router.navigate(['/doer/chat']);
    });
  }

}
