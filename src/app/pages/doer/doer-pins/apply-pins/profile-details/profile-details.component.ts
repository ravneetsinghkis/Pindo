import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonService } from '../../../../../commonservice';
import { AppComponent } from '../../../../../app.component';
import { Globalconstant } from '../../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
declare var io: any;
declare var jQuery: any;
declare var $: any;
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

  @Input() fetchedPinDetails;
  @Input() totalDataDetails;
  isMsgExists: any;
  isMovingApproved: boolean = false;

  @Output() onJobDeclineRequestSend = new EventEmitter();

  openModalConfirmationData: Subscription;
  @ViewChild('messageBtn') private messageBtn: any;

  constructor(public commonservice: CommonService, private router: Router, private route: ActivatedRoute, public snackBar: MatSnackBar, public gbConstant: Globalconstant, private dialog: MatDialog,
    private appService: AppComponent) {
  }

  ngOnInit() {
    setTimeout(() => {
      // console.log('FETCHED PIIIIIIIIIIIIIIIN', this.fetchedPinDetails);
      this.checkMsg(this.fetchedPinDetails.pinner_details.id, this.fetchedPinDetails.id);
    }, 1500);

    this.openModalConfirmationData = this.commonservice._listnerForMovingMessageModalData.subscribe(option => {
      if (option == 2) {
        this.isMovingApproved = true;

        if (this.fetchedPinDetails) {
          this.messageBtn._elementRef.nativeElement.click();
        }
      }
    });
  }

  checkMsg(pinner_id, pin_id) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-is-message-sent',
      data: {
        'user_id': pinner_id,
        'pin_id': pin_id
      }
    }).then(res => {
      this.isMsgExists = res.data;
    });
  }
  /**
   * Gets add link
   * @param addressLink
   * @returns
   */
  getAddLink(addressLink) {
    if (addressLink != null) {
      let tempaddress = addressLink;
      const address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
      return tempaddress;
    }
  }

  /**
   * Declines the job
   * @param pin_id
   * @param application_id
   */
  public declineTheJob(pin_id, application_id) {
    console.log(pin_id, application_id);
    Swal({
      title: 'Are you sure you want to decline the job?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/decline-job', data: { 'pin_id': pin_id, 'application_id': application_id }, contenttype: 'application/json' }).then(result => this.declineTheJobSuccess(result));
      }
    });
  }

  /**
   * Declines the job success
   * @param response
   */
  declineTheJobSuccess(response) {
    if (response.status == 1) {
      this.onJobDeclineRequestSend.emit(true);

      const postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.fetchedPinDetails['pinner_id'],
        'title': ' has been declined for pin ' + this.fetchedPinDetails['title'],
        'pin_id': this.fetchedPinDetails['id'],
        'link': 'pinner/active-quotations/' + btoa(this.fetchedPinDetails['id']),
        'emailTemplateSlug': 'quotation_declined_by_doer',
        'doer_title': ' your quote request rejection was sent',
        'doerEmailTemplateSlug': 'quotation_declined_sent_by_doer',
        'doer_link': 'doer/my-pins'
      };

      this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postData);

      setTimeout(() => {
        this.gbConstant.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 3000);



      //this.getQuotationPageDetails();
      this.responseMessageSnackBar(response.msg , 'orangeSnackBar');
    } else {
      this.onJobDeclineRequestSend.emit(false);
    }
  }


  /**
   * Go to chat
   * @param pinner_id
   * @param pin_id
   */
  goToChat(pinner_id, pin_id) {

    if (! this.isMovingApproved) {
      this.commonservice.confirmBeforeMovingMessagePage(this.isMovingApproved);
      return false;
    }

    const pub_pinner_id = pinner_id;
    const pub_pin_id = pin_id;
    const pub_doer_id = atob(localStorage.getItem('frontend_user_id'));

    const postData = {
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


  /**
   * Responses message snack bar
   * @param message
   * @param [res_class]
   * @param [verticalPos]
   */
  public responseMessageSnackBar(message, res_class: any = '', verticalPos: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: verticalPos,
      panelClass: res_class
    });
  }


  ngOnDestroy() {
    if (this.openModalConfirmationData) {
      this.openModalConfirmationData.unsubscribe();
    }
  }
}
