import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { CommonService } from '../../../../../commonservice';
import { AppComponent } from '../../../../../app.component';
import { Globalconstant } from '../../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
declare var io: any;

@Component({
  selector: 'app-prepopulated-payment',
  templateUrl: './prepopulated-payment.component.html',
  styleUrls: ['./prepopulated-payment.component.css']
})
export class PrepopulatedPaymentComponent implements OnChanges, OnInit {

  @Input('totalPaymentData')
  totalPaymentData;



  @Output() paymentRequestSend = new EventEmitter();
  @Output() editRequestSend = new EventEmitter();
  @Output() toggleEditMode = new EventEmitter();
  @Output() choosePaymentMode = new EventEmitter();

  @Input('chosenPaymentOptn')
  chosenPaymentOptn;

  selectedMilstone: any = '';

  constructor(public commonservice: CommonService, public snackBar: MatSnackBar, private appService: AppComponent, public gbConstant: Globalconstant, ) {
  }

  ngOnInit() {
    console.log(this.totalPaymentData);
  }

  gettotalHrs() {
    let tempArr = this.totalPaymentData['quotation_dtls'].normal_milestones;
    let totalHrs = 0;
    for (let i = 0; i < tempArr.length; i++) {
      totalHrs = totalHrs + parseInt(tempArr[i].hours);
    }
    return totalHrs;
  }

  getTotalPrice(prc, hrs) {
    let totalPrc = parseFloat(prc) * parseFloat(hrs);
    return totalPrc;
  }

  requestPaymentRelease(mlstnId, pinId) {
    console.log('asdasdasd');
    this.choosePaymentMode.emit(true);
    this.selectedMilstone = mlstnId;
    //this.commonservice.postHttpCall({url:'/doers/request-for-payment', data:{'pin_id':pinId,'milestone_id':mlstnId}, contenttype:"application/json"}).then(result=>this.onRequestPaymentReleaseSuccess(result));
  }

  requestTriggerPaymentRelease(paymentType) {
    this.commonservice.postHttpCall({ url: '/doers/request-for-payment', data: { 'pin_id': this.totalPaymentData['pin_details']['id'], 'milestone_id': this.selectedMilstone, 'paymentType': paymentType }, contenttype: "application/json" }).then(result => this.onRequestPaymentReleaseSuccess(result));
  }

  onRequestPaymentReleaseSuccess(response) {
    if (response.status == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalPaymentData['pin_details']['pinner_id'],
        'title': ' has sent payment request for the pin ' + this.totalPaymentData['pin_details']['title'],
        'pin_id': this.totalPaymentData['pin_details']['id'],
        'link': 'pinner/active-quotation-details/' + this.totalPaymentData['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'doer_title': ' Your payment request has been sent',
        'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',
        'doer_link': 'doer/apply-pins/' + this.totalPaymentData['pin_details']['slug']
      };

      this.gbConstant.notificationSocket.emit("post-notification-to-pinner", postData);
      setTimeout(() => {
        this.gbConstant.notificationSocket.emit("post-notification-to-doer-himself", postData);
      }, 5000);

      this.paymentRequestSend.emit();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.selectedMilstone = '';
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
      this.selectedMilstone = '';
    }
  }

  public responseMessageSnackBar(message, res_class: any = '', verticalPos: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: verticalPos,
      panelClass: res_class
    });
  }

  editMilestoneReqst(mlstnId) {
    this.commonservice.postHttpCall({ url: '/doers/milestone-edit-request', data: { 'milestone_id': mlstnId }, contenttype: "application/json" }).then(result => this.oneditMilestoneReqstSuccess(result));
  }

  oneditMilestoneReqstSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.editRequestSend.emit();
    }
  }

  toggleEdit(qtnId, toUpdateMilestoneType) {
    //this.toggleEditMode.emit(true,qtnId,this.totalPaymentData.quotation_dtls.payment_mode,toUpdateMilestoneType);
    let tempObj = {
      'totoggle': true,
      'qtnId': qtnId,
      'payment_mode': this.totalPaymentData.quotation_dtls.payment_mode,
      'mlstnType': toUpdateMilestoneType
    }
    this.toggleEditMode.emit(tempObj);
  }

  sendRemoveReqst(mlstnId) {
    Swal({
      title: 'Are you sure you want to send remove request for this milestone.Once Send Pinner will remove the milestone.',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Send Request',
      cancelButtonText: 'Cancel Request'
    }).then((result) => {
      if (result.value) {

        this.commonservice.postHttpCall({ url: '/doers/milestone-remove-request', data: { 'milestone_id': mlstnId }, contenttype: "application/json" }).then(result => this.onsendRemoveReqstSuccess(result));
      }
    })
  }

  onsendRemoveReqstSuccess(response) {

    if (response.status == '1') {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.totalPaymentData['pin_details']['pinner_id'],
        'title': ' has been removed milestone request for the pin ' + this.totalPaymentData['pin_details']['title'],
        'pin_id': this.totalPaymentData['pin_details']['id'],
        'link': 'pinner/active-quotation-details/' + this.totalPaymentData['pin_details']['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'milestone_remove_submitted_by_doer',
        'doer_title': ' your remove milestone request has been sent',
        'doerEmailTemplateSlug': 'milestone_remove_submitted_send_by_doer',
        'doer_link': 'doer/apply-pins/' + this.totalPaymentData['pin_details']['slug']
      };

      this.gbConstant.notificationSocket.emit("post-notification-to-pinner", postData);
      setTimeout(() => {
        this.gbConstant.notificationSocket.emit("post-notification-to-doer-himself", postData);
      }, 5000);
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.editRequestSend.emit(true);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const name: SimpleChange = changes['chosenPaymentOptn'];
    console.log('got name: ', name.currentValue);
    if (name.currentValue != '' && this.selectedMilstone != '')
      this.requestTriggerPaymentRelease(name.currentValue);
  }

}
