import { Component, OnInit, OnDestroy, DoCheck, KeyValueDiffers, KeyValueDiffer, AfterViewInit } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
declare var $: any;
import Swal from 'sweetalert2';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-my-pins',
  templateUrl: './my-pins.component.html',
  styleUrls: ['./my-pins.component.scss']
})
export class MyPinsComponent implements OnInit {

  baseCompUrl: any;
  isMsgExists: any = [];
  activePinData = [];
  ongoingPinList = [];

  toggleFilterBool: boolean = false;
  filterPinModel = {
    'searchby': '',
    'start_date': '',
    'end_date': ''
  };
  filterByColName = 'created_at';
  orderBy = 'DESC';

  isSmallLoaderEnabled = false;
  pinAutocomplete = [];
  CompletedPinList = [];
  disputePinList = [];


  smallloaderVal = false;
  pageCount = 1;
  pinLimit = 10;
  previousUrl: any;
  storeSettimeout: any;

  selectedTypeOfPin = 'Invites';
  formsubmitted = false;
  differ: KeyValueDiffer<string, any>;

  archivedPinData = [];
  refferedPinData = [];
  afterInit = false;

  selected = 'Invites';
  inMobView = false;
  frontend_user_id: any;

  countTotalInvitedPin: number = 0;
  countTotalOngoingPin: number = 0;
  countTotalCompletedPin: number = 0;
  countTotalDisputePin: number = 0;
  countTotalBlockedPin: number = 0;
  countTotalDraftPin: number = 0;
  countTotalRefferedPin: number = 0;

  constructor(public commonservice: CommonService, public gbConst: Globalconstant, public snackBar: MatSnackBar, private router: Router, private differs: KeyValueDiffers, private deviceService: DeviceDetectorService) {
    this.baseCompUrl = gbConst.uploadUrl;
    this.invitePinListPopulate();

    const isMobile = this.deviceService.isMobile();

    if (isMobile) {
      this.inMobView = true;
    }
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
        if (this.previousUrl && this.previousUrl.includes('/doer/apply-pins/')) {
          if (localStorage.getItem('selectedTab') == 'Active') {
            $('#pin-2').click();
            localStorage.removeItem('selectedTab');
          }
          if (localStorage.getItem('selectedTab') == 'Completed') {
            $('#pin-3').click();
            localStorage.removeItem('selectedTab');
          }
          if (localStorage.getItem('selectedTab') == 'Dispute') {
            $('#pin-4').click();
            localStorage.removeItem('selectedTab');
          }
          if (localStorage.getItem('selectedTab') == 'Archive') {
            $('#pin-5').click();
            localStorage.removeItem('selectedTab');
          }
          if (localStorage.getItem('selectedTab') == 'Reffered') {
            $('#pin-6').click();
            localStorage.removeItem('selectedTab');
          }
        } else {
          //this.activePinListPopulate();
        }
        this.previousUrl = e['url'];
      });
    this.differ = this.differs.find({}).create();
  }

  /**
   * on init
   */
  ngOnInit() {
    this.frontend_user_id = atob(localStorage.getItem('frontend_user_id'));
  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.afterInit = true;
  }

  /**
   * do check
   */
  ngDoCheck() {
    if (this.differ) {
      const change = this.differ.diff(this);
      if (change) {
        change.forEachChangedItem(item => {
          if (item['key'] == 'toggleFilterBool' && item['previousValue'] && !item['currentValue']) {
            this.pinAutocomplete = [];
          }
        });
      }
    }
  }

  /**
   * on destroy
   */
  ngOnDestroy() {
    localStorage.setItem('selectedTab', this.selectedTypeOfPin);
  }

  /**
   * Converts toarray
   * @param num 
   * @param checkType 
   * @returns  
   */
  convertToarray(num, checkType) {
    let checkVal;
    if (checkType == 'filled') {
      checkVal = num;
    } else {
      checkVal = 5 - num;
    }
    const tempArray = [];
    for (let initVal = 1; initVal <= checkVal; initVal++) {
      if (checkType == 'filled') {
        const tempObj = {
          'indexVal': initVal - 1
        };
        tempArray.push(tempObj);
      } else {
        const tempObj = {
          'indexVal': num
        };
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }


  /**
	 * Populate Invite Pins
  */
  invitePinListPopulate() {
    this.commonservice.postHttpCall({ url: '/doers/get-invited-pins', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.smallloaderVal).then((data) => this.invitePinListPopulateSuccess(data));
  }

  /**
 	* Success function for invite Pin list Service Call
 	* @param {response} response from service call
 */
  async invitePinListPopulateSuccess(response) {
    if (response.status == 1) {
      for (let i = 0; i < response.data.pin_list.length; i++) {
        await this.commonservice.postCommunityHttpCall({
          url: '/api/pinner/get-is-message-sent',
          data: {
            'user_id': response.data.pin_list[i].pinner_details.id,
            'pin_id': response.data.pin_list[i].pin_details.id,
          }
        }).then(res => {
          this.isMsgExists.push(res.data);
        });
      }
      if (this.pageCount == 1) {
        this.activePinData = response.data.pin_list;
      } else {
        for (const index in response.data.pin_list) {
          if (index != 'insert') {
            this.activePinData.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * archive Invite Pins
  */
  archivePinPopulate() {
    this.commonservice.postHttpCall({ url: '/doers/archived-pins-new', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.smallloaderVal).then((data) => this.archivePinPopulateSuccess(data));
  }

  /**
  * Success function for invite Pin list Service Call
  * @param {response} response from service call
 */
  archivePinPopulateSuccess(response) {
    if (response.status == 1) {
      // console.log(response);
      if (this.pageCount == 1) {
        this.archivedPinData = response.data.pin_list;
      } else {
        for (const index in response.data.pin_list) {
          // console.log("index = ", index)
          if (index != 'insert') {
            this.archivedPinData.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * reffered Pins
  */
  refferedPinPopulate() {
    this.commonservice.postHttpCall({ url: '/doers/referred-pins', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.smallloaderVal).then((data) => this.refferedPinPopulateSuccess(data));
  }

  /**
  * Success function for invite Pin list Service Call
  * @param {response} response from service call
 */
  refferedPinPopulateSuccess(response) {
    if (response.status == 1) {
      // console.log(response);
      if (this.pageCount == 1) {
        this.refferedPinData = response.data.pin_list;
      } else {
        for (const index in response.data.pin_list) {
          if (index != 'insert') {
            this.refferedPinData.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * Populate Active Pins
  */
  activePinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/doers/ongoing-jobs',
      data: {
        'page': this.pageCount,
        'limit': this.pinLimit,
        'totalFilters': this.filterPinModel,
        'filterByColName': this.filterByColName,
        'orderBy': this.orderBy
      }, contenttype: 'application/json'
    })
      .then(result => this.activePinListPopulateSuccess(result));
  }

  /**
  * Success function for active Pin list Service Call
  * @param {response} response from service call
 */
  activePinListPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.ongoingPinList = response.data.pin_list;
      } else {
        for (const index in response.data.pin_list) {
          if (index != 'insert') {
            this.ongoingPinList.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * Completed Pin list
  */
  completedPinPopulate() {
    this.commonservice.postHttpCall({ url: '/doers/get-completed-pins', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }).then(result => this.completedPinListPopulateSuccess(result));
  }

  /**
   * Completed pin list populate success
   * @param response 
   */
  completedPinListPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.CompletedPinList = response.data.pin_list;
      } else {
        for (const index in response.data.pin_list) {
          if (index != 'insert') {
            this.CompletedPinList.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * Dispute Pin list
  */
  disputePinPopulate() {
    this.commonservice.postHttpCall({ url: '/doers/dispute-pins', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.isSmallLoaderEnabled).then(result => this.ondisputePinPopulateSuccess(result));
  }

  /**
   * Ondisputes pin populate success
   * @param response 
   */
  ondisputePinPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.disputePinList = response.data.pin_list;
      } else {
        for (const index in response.data.pin_list) {
          if (index != 'insert') {
            this.disputePinList.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * Clears form
   * @param frmElm 
   */
  clearForm(frmElm) {
    frmElm.reset();
    frmElm.submitted = false;
    this.filterPinModel['searchby'] = '';
    this.filterPinModel['start_date'] = '';
    this.filterPinModel['end_date'] = '';
    this.pageCount = 1;
    if (this.selectedTypeOfPin == 'Invites') {
      this.invitePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Active') {
      this.activePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Completed') {
      this.completedPinPopulate();
    } else if (this.selectedTypeOfPin == 'Dispute') {
      this.disputePinPopulate();
    } else if (this.selectedTypeOfPin == 'Archive') {
      this.archivePinPopulate();
    } else if (this.selectedTypeOfPin == 'Reffered') {
      this.refferedPinPopulate();
    }
    this.toggleFilterBool = false;
  }

  /**
   * Filters pin submit
   * @param frmElm 
   */
  filterPinSubmit(frmElm) {
    if (frmElm.valid) {
      this.pageCount = 1;
      this.isSmallLoaderEnabled = false;
      this.filterByColName = 'created_at';
      this.orderBy = 'DESC';
      if (this.selectedTypeOfPin == 'Invites') {
        this.invitePinListPopulate();
      } else if (this.selectedTypeOfPin == 'Active') {
        this.activePinListPopulate();
      } else if (this.selectedTypeOfPin == 'Completed') {
        this.completedPinPopulate();
      } else if (this.selectedTypeOfPin == 'Dispute') {
        this.disputePinPopulate();
      } else if (this.selectedTypeOfPin == 'Archive') {
        this.archivePinPopulate();
      } else if (this.selectedTypeOfPin == 'Reffered') {
        this.refferedPinPopulate();
      }
      this.toggleFilterBool = false;
    }
  }

  /**
   * Populates autocomplete pin
   * @param searchStrng 
   */
  populateAutocompletePin(searchStrng) {
    this.commonservice.postHttpCall({ url: '/doers/pin-search-autocomplete', data: { 'searchby': searchStrng, 'selectedTypeOfPin': this.selectedTypeOfPin }, contenttype: 'application/json' }, this.isSmallLoaderEnabled).then(result => this.onpopulateAutocompletePinSuccess(result));
  }

  /**
   * Onpopulates autocomplete pin success
   * @param response 
   */
  onpopulateAutocompletePinSuccess(response) {
    if (response.status == 1) {
      this.pinAutocomplete = response.data;
      if (!this.toggleFilterBool) {
        this.pinAutocomplete = [];
      }
      $('#mat-spinner').hide();
    }
  }

  /**
   * Searchs pin
   * @param evt 
   */
  searchPin(evt) {
    let searchString = evt;
    if (searchString && searchString != '') {
      searchString = searchString.trim();
      const checkStringLen = searchString.split('');
      this.isSmallLoaderEnabled = true;
      $('#mat-spinner').show();
      if (this.storeSettimeout != '') {
        clearTimeout(this.storeSettimeout);
      }

      this.storeSettimeout = setTimeout(() => {
        this.populateAutocompletePin(searchString);
      }, 500);
    } else {
      this.pinAutocomplete = [];
    }
  }

  /**
   * Selected val
   * @param evt 
   */
  selectedVal(evt) {
    $('#submitAutocomplete').trigger('click');
  }


  /**
   * Determines whether clicked outside on
   * @param evt 
   */
  onClickedOutside(evt) {
    const tempLengthCheck = $(evt.target).parents('.cdk-overlay-container').length;
    const checkIfautocomplete = $(evt.target).parents('.autocomplete_list').length || evt.target.classList.contains('autocomplete_list');
    if (tempLengthCheck > 0 || checkIfautocomplete || checkIfautocomplete > 0) { } else {
      this.toggleFilterBool = false;
    }
    //this.toggleFilterBool = false;
  }

  /**
   * Toggles filter
   */
  toggleFilter() {
    // console.log('asdasdasd');
    this.toggleFilterBool = !this.toggleFilterBool;
  }

  /**
   * Determines whether pin selection on
   * @param typeSelected 
   */
  onPinSelection(typeSelected) {
    this.filterPinModel['searchby'] = '';
    this.filterPinModel['start_date'] = '';
    this.filterPinModel['end_date'] = '';
    this.filterByColName = 'created_at';
    this.orderBy = 'DESC';
    this.pageCount = 1;
    if (typeSelected == 'Invites') {
      this.selectedTypeOfPin = 'Invites';
      this.invitePinListPopulate();
    } else if (typeSelected == 'Active') {
      this.selectedTypeOfPin = 'Active';
      this.activePinListPopulate();
    } else if (typeSelected == 'Completed') {
      this.selectedTypeOfPin = 'Completed';
      this.completedPinPopulate();
    } else if (typeSelected == 'Dispute') {
      this.selectedTypeOfPin = 'Dispute';
      this.disputePinPopulate();
    } else if (typeSelected == 'Archive') {
      this.selectedTypeOfPin = 'Archive';
      this.archivePinPopulate();
    } else if (typeSelected == 'Reffered') {
      this.selectedTypeOfPin = 'Reffered';
      this.refferedPinPopulate();
    }
  }

  /**
   * Populates string
   * @param strngVal 
   */
  populateString(strngVal) {
    this.filterPinModel['searchby'] = strngVal.trim();
    this.pinAutocomplete = [];
  }

  /**
   * Filters by column
   * @param clmnName 
   * @param evt 
   */
  filterByColumn(clmnName, evt) {
    this.filterByColName = clmnName;
    this.pageCount = 1;
    if ($(evt.target).hasClass('hasDesc')) {
      this.orderBy = 'ASC';
      $(evt.target).removeClass('hasDesc').addClass('hasAsc');
    } else if ($(evt.target).hasClass('hasAsc')) {
      this.orderBy = 'DESC';
      $(evt.target).removeClass('hasAsc').addClass('hasDesc');
    } else {
      $('.filterasc_desc.sortAppl').removeClass('hasDesc hasAsc sortAppl');
      this.orderBy = 'DESC';
      $(evt.target).toggleClass('sortAppl').addClass('hasDesc');
    }
    if (this.selectedTypeOfPin == 'Invites') {
      this.invitePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Active') {
      this.activePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Completed') {
      this.completedPinPopulate();
    } else if (this.selectedTypeOfPin == 'Dispute') {
      this.disputePinPopulate();
    } else if (this.selectedTypeOfPin == 'Archive') {
      this.archivePinPopulate();
    } else if (this.selectedTypeOfPin == 'Reffered') {
      this.refferedPinPopulate();
    }
  }

  /**
   * Triggers clear
   */
  triggerClear() {
    this.filterPinModel['searchby'] = '';
    this.filterPinModel['start_date'] = '';
    this.filterPinModel['end_date'] = '';
    this.filterByColName = 'created_at';
    this.orderBy = 'DESC';
    this.pageCount = 1;
    if (this.selectedTypeOfPin == 'Invites') {
      this.invitePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Active') {
      this.activePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Completed') {
      this.completedPinPopulate();
    } else if (this.selectedTypeOfPin == 'Dispute') {
      this.disputePinPopulate();
    } else if (this.selectedTypeOfPin == 'Archive') {
      this.archivePinPopulate();
    } else if (this.selectedTypeOfPin == 'Reffered') {
      this.refferedPinPopulate();
    }
  }

  /**
   * Declines the job
   * @param pin_id 
   * @param application_id 
   * @param pinner_id 
   * @param pin_title 
   */
  declineTheJob(pin_id, application_id, pinner_id, pin_title) {
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
        this.commonservice.postHttpCall({ url: '/doers/decline-job', data: { 'pin_id': pin_id, 'application_id': application_id }, contenttype: 'application/json' }).then(result => this.declineTheJobSuccess(result, pin_id, pinner_id, pin_title));
      }
    });
  }

  /**
   * Declines the job success
   * @param response 
   * @param pin_id 
   * @param pinner_id 
   * @param pin_title 
   */
  declineTheJobSuccess(response, pin_id, pinner_id, pin_title) {
    if (response.status == 1) {
      //this.getQuotationPageDetails();
      let postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': pinner_id,
        'title': ' has been declined for pin ' + pin_title,
        'pin_id': pin_id,
        'link': 'pinner/active-quotations/' + btoa(pin_id),
        'emailTemplateSlug': 'quotation_declined_by_doer',
        'doer_title': ' your quote request rejection was sent',
        'doerEmailTemplateSlug': 'quotation_declined_sent_by_doer',
        'doer_link': 'doer/my-pins'
      };

      this.gbConst.notificationSocket.emit('post-notification-to-pinner', postData);

      setTimeout(() => {
        this.gbConst.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 3000);

      this.invitePinListPopulate();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
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

  /**
   * Determines whether scroll on
   */
  onScroll() {
    // console.log('yes',this.totalDoerCount);
    if (this.selectedTypeOfPin == 'Invites') {
      if (this.activePinData.length < (this.countTotalInvitedPin - 1)) {
        this.pageCount = this.pageCount + 1;
        // console.log(this.pageCount);
        this.smallloaderVal = true;
        this.invitePinListPopulate();
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Active') {
      if (this.ongoingPinList.length < (this.countTotalOngoingPin - 1)) {
        this.pageCount = this.pageCount + 1;
        // console.log(this.pageCount);
        this.smallloaderVal = true;
        this.activePinListPopulate();
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Completed') {
      if (this.CompletedPinList.length <= (this.countTotalCompletedPin - 1)) {
        this.pageCount = this.pageCount + 1;
        // console.log(this.pageCount);
        this.smallloaderVal = true;
        this.completedPinPopulate();
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Dispute') {
      if (this.disputePinList.length <= (this.countTotalDisputePin - 1)) {
        this.pageCount = this.pageCount + 1;
        // console.log(this.pageCount);
        this.smallloaderVal = true;
        this.disputePinPopulate();
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Archive') {
      if (this.archivedPinData.length <= (this.countTotalBlockedPin - 1)) {
        this.pageCount = this.pageCount + 1;
        // console.log(this.pageCount);
        this.smallloaderVal = true;
        this.archivePinPopulate();
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Reffered') {
      if (this.refferedPinData.length <= (this.countTotalRefferedPin - 1)) {
        this.pageCount = this.pageCount + 1;
        // console.log(this.pageCount);
        this.smallloaderVal = true;
        this.refferedPinPopulate();
      } else {
        this.smallloaderVal = false;
      }
    }
    //this.populatePin();
  }


  /**
   * Go to chat
   * @param pinner_id 
   * @param pin_id 
   */
  goToChat(pinner_id, pin_id) {
    localStorage.removeItem('pinner_id');
    localStorage.removeItem('pin_id');

    localStorage.setItem('pinner_id', btoa(pinner_id));
    localStorage.setItem('pin_id', btoa(pin_id));
    this.router.navigate(['/doer/chat']);
  }

  /**
 * Sets pin count for every state
 * @param data 
 */
  setPinCountForEveryState(data) {
    this.countTotalInvitedPin = data.count_total_invited_pin;
    this.countTotalOngoingPin = data.count_total_ongoing_pin;
    this.countTotalCompletedPin = data.count_total_completed_pin
      ;
    this.countTotalDisputePin = data.count_total_dispute_pin;
    this.countTotalBlockedPin = data.count_total_archived_pin;
    this.countTotalDraftPin = data.count_total_draft_pin;
    this.countTotalRefferedPin = 0;
  }
}
