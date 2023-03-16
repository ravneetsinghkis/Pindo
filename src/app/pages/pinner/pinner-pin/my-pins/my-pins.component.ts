import { Component, OnInit, OnDestroy, DoCheck, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import { Globalconstant } from '../../../../global_constant';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import * as _moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
declare var $: any;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-my-pins',
  templateUrl: './my-pins.component.html',
  styleUrls: ['./my-pins.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class MyPinsComponent implements OnInit {
  baseCompUrl: any;
  toggleFilterBool: boolean = false;
  isSmallLoaderEnabled = false;
  countTotalInvitedPin: number = 0;
  countTotalOngoingPin: number = 0;
  countTotalCompletedPin: number = 0;
  countTotalDisputePin: number = 0;
  countTotalBlockedPin: number = 0;
  countTotalDraftPin: number = 0;

  smallloaderVal = false;
  pageCount = 1;
  pinLimit = 10;
  storeSettimeout: any;

  filterPinModel = {
    'searchby': '',
    'start_date': '',
    'end_date': ''
  }

  filterByColName = 'created_at';
  orderBy = 'DESC';

  pinAutocomplete = [];
  activePinData = [];
  ongoingPinList = [];
  draftPinList = [];
  CompletedPinList = [];
  disputePinList = [];
  blockedPinList = [];

  previousUrl: any;
  differ: KeyValueDiffer<string, any>;

  selectedTypeOfPin = 'Draft';
  inMobView = false;
  isFirstTimeCall: Boolean = false;

  constructor(public commonservice: CommonService, public gbConst: Globalconstant,
    private _location: Location, private router: Router, private differs: KeyValueDiffers,
    private deviceService: DeviceDetectorService) {
    this.baseCompUrl = gbConst.uploadUrl;
    const isMobile = this.deviceService.isMobile();

    if (isMobile) {
      this.inMobView = true;
    }

    if (localStorage.getItem('selectedTab')) {
      this.redirectToTab(localStorage.getItem('selectedTab'));
    } else {
      this.callApiDepentOnSelectedTab();
    }

    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
        if (this.previousUrl && this.previousUrl.includes('/pinner/active-quotation-details')) {
          if (localStorage.getItem('selectedTab')) {
            this.redirectToTab(localStorage.getItem('selectedTab'));
          }
        }
        this.previousUrl = e['url'];
      });
  }

  /**
   * on destroy
   */
  ngOnDestroy() {
    if (this.draftPinList.length > 0) {
      this.selectedTypeOfPin = 'Draft';
    }
    localStorage.setItem('selectedTab', this.selectedTypeOfPin);
  }

  /**
   * on init
   */
  ngOnInit() {
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
   * Gets encrypted doer id
   * @param doerId 
   * @returns  
   */
  getEncryptedDoerId(doerId) {
    return btoa(doerId);
  }

  /**
   * Determines whether clicked outside on
   * @param evt 
   */
  onClickedOutside(evt) {
    let tempLengthCheck = $(evt.target).parents('.cdk-overlay-container').length;
    let checkIfautocomplete = $(evt.target).parents('.autocomplete_list').length || evt.target.classList.contains('autocomplete_list');
    if (tempLengthCheck > 0 || checkIfautocomplete || checkIfautocomplete > 0) { } else {
      this.toggleFilterBool = false;
    }
    //this.toggleFilterBool = false;
  }

  /**
   * Toggles filter
   */
  toggleFilter() {
    this.toggleFilterBool = !this.toggleFilterBool;
  }

  /**
   * Filters pin submit
   * @param frmElm 
   */
  filterPinSubmit(frmElm) {
    if (frmElm.valid) {
      console.log(this.filterPinModel);

      this.isSmallLoaderEnabled = false;
      this.filterByColName = 'created_at';
      this.orderBy = 'DESC';
      this.toggleFilterBool = false;
      this.pinAutocomplete = [];
      this.pageCount = 1;
      this.callApiDepentOnSelectedTab();
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
    this.toggleFilterBool = false;
    this.callApiDepentOnSelectedTab();

  }

  /**
   * Selected val
   * @param evt 
   */
  selectedVal(evt) {
    $('#submitAutocomplete').trigger('click');
  }

  /**
   * Searchs pin
   * @param evt 
   */
  searchPin(evt) {
    let searchString = evt;
    if (searchString && searchString != '') {
      searchString = searchString.trim();
      let checkStringLen = searchString.split('');
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

    this.callApiDepentOnSelectedTab();
  }

  /**
   * Determines whether pin selection on
   * @param typeSelected 
   */
  onPinSelection(tabSelected) {
    // this.filterPinModel['searchby'] = '';
    // this.filterPinModel['start_date'] = '';
    // this.filterPinModel['end_date'] = '';
    // this.filterByColName = 'created_at';
    // this.orderBy = 'DESC';
    // this.pageCount = 1;
    this.selectedTypeOfPin = tabSelected;
    this.triggerClear();
    // this.callApiDepentOnSelectedTab();
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
    this.callApiDepentOnSelectedTab();
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
    let tempArray = [];
    for (let initVal = 1; initVal <= checkVal; initVal++) {
      if (checkType == 'filled') {
        let tempObj = {
          'indexVal': initVal - 1
        }
        tempArray.push(tempObj);
      } else {
        let tempObj = {
          'indexVal': num
        }
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }

  /**
   * Determines whether scroll on
   */
  onScroll() {
    if (this.selectedTypeOfPin == 'Active') {
      if (this.activePinData.length < (this.countTotalInvitedPin)) {
        this.callApiDepentOnSelectedTab('isSet');
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Draft') {
      if (this.draftPinList.length < (this.countTotalDraftPin)) {
        this.callApiDepentOnSelectedTab('isSet');
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Ongoing') {
      if (this.ongoingPinList.length < (this.countTotalOngoingPin)) {
        this.callApiDepentOnSelectedTab('isSet');
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Completed') {
      if (this.CompletedPinList.length < (this.countTotalCompletedPin)) {
        this.callApiDepentOnSelectedTab('isSet');
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Dispute') {
      if (this.disputePinList.length < (this.countTotalDisputePin)) {
        this.callApiDepentOnSelectedTab('isSet');
      } else {
        this.smallloaderVal = false;
      }
    } else if (this.selectedTypeOfPin == 'Blocked') {
      if (this.blockedPinList.length < (this.countTotalBlockedPin)) {
        this.callApiDepentOnSelectedTab('isSet');
      } else {
        this.smallloaderVal = false;
      }
    }
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
    this.countTotalBlockedPin = data.count_total_blocked_pin;
    this.countTotalDraftPin = data.count_total_draft_pin;
  }

  /**
   * Calls api depent on selected tab
   */
  callApiDepentOnSelectedTab(setPageCount = '') {
    console.log(setPageCount);
    if (setPageCount != '' && setPageCount == 'isSet') {
      this.pageCount = this.pageCount + 1;
      this.smallloaderVal = true;
    }
    if (this.pageCount == 1) {
      this.clearAllPinArray();
    }
    if (this.selectedTypeOfPin == 'Active') {
      this.activePinListPopulate();
    } else if (this.selectedTypeOfPin == 'Ongoing') {
      this.ongoingPinPopulate();
    } else if (this.selectedTypeOfPin == 'Completed') {
      this.completedPinPopulate();
    } else if (this.selectedTypeOfPin == 'Dispute') {
      this.disputePinPopulate();
    } else if (this.selectedTypeOfPin == 'Blocked') {
      this.blockedPinListPopulate();
    } else if (this.selectedTypeOfPin == 'Draft') {
      this.draftPinListPopulate();
    }
  }

  /**
   * Redirects to tab
   * @param tabName 
   */
  redirectToTab(tabName) {
    this.selectedTypeOfPin = tabName;
    localStorage.removeItem('selectedTab');
    switch (tabName) {
      case 'Active': {
        $('#pin-1').click();
        break;
      }
      case 'Ongoing': {
        $('#pin-2').click();
        break;
      }
      case 'Completed': {
        $('#pin-3').click();
        break;
      }
      case 'Dispute': {
        $('#pin-4').click();
        break;
      }
      case 'Blocked': {
        $('#pin-5').click();
        break;
      }
      case 'Draft': {
        $('#pin-6').click();
        break;
      }
    }

    this.callApiDepentOnSelectedTab();
  }

  /**
   * Clears all pin array
   */
  clearAllPinArray() {
    if (this.selectedTypeOfPin == 'Active') {
      this.activePinData = [];
    } else if (this.selectedTypeOfPin == 'Ongoing') {
      this.ongoingPinList = [];
    } else if (this.selectedTypeOfPin == 'Completed') {
      this.CompletedPinList = [];
    } else if (this.selectedTypeOfPin == 'Dispute') {
      this.disputePinList = [];
    } else if (this.selectedTypeOfPin == 'Blocked') {
      this.blockedPinList = [];
    } else if (this.selectedTypeOfPin == 'Draft') {
      this.draftPinList = [];
    }
  }


  //API SECTION

  /**
	 * Populate Active Pins
  */
  activePinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/active-pin-list',
      data: {
        'page': this.pageCount,
        'limit': this.pinLimit,
        'totalFilters': this.filterPinModel,
        'filterByColName': this.filterByColName,
        'orderBy': this.orderBy
      },
      contenttype: 'application/json'
    },
      this.smallloaderVal)
      .then(result => this.activePinListPoulateSuccess(result));
  }

  /**
   * Success function for active Pin list Service Call
   * @param {response} response from service call
  */
  activePinListPoulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.activePinData = response.data.pin_list;
      } else {
        for (let index in response.data.pin_list) {
          if (index != 'insert') {
            this.activePinData.push(response.data.pin_list[index]);
          }
        }
      }

      this.setPinCountForEveryState(response.data);
    }

  }

  /**
   * Ongoing pin populate
   */
  ongoingPinPopulate() {
    this.commonservice.postHttpCall({ url: '/pinners/ongoing-pin-list', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.isSmallLoaderEnabled).then(result => this.ongoingPinPopulateSuccess(result));
  }

  /**
   * Ongoing pin populate success
   * @param response 
   */
  ongoingPinPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.ongoingPinList = response.data.pin_list;
      } else {
        for (let index in response.data.pin_list) {
          if (index != 'insert') {
            this.ongoingPinList.push(response.data['pin_list'][index]);
          }
        }
      }
      //this.searchVal = $('#searchField').val();
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * Completed pin populate
   */
  completedPinPopulate() {
    this.commonservice.postHttpCall({ url: '/pinners/completed-pin-list', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.isSmallLoaderEnabled).then(result => this.oncompletedPinPopulateSuccess(result));
  }

  /**
   * Oncompleted pin populate success
   * @param response 
   */
  oncompletedPinPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.CompletedPinList = response.data.pin_list;
      } else {
        for (let index in response.data.pin_list) {
          if (index != 'insert') {
            this.CompletedPinList.push(response.data['pin_list'][index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
   * Disputes pin populate
   */
  disputePinPopulate() {
    this.commonservice.postHttpCall({ url: '/pinners/dispute-pin-list', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.isSmallLoaderEnabled).then(result => this.ondisputePinPopulateSuccess(result));
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
        for (let index in response.data.pin_list) {
          if (index != 'insert') {
            this.disputePinList.push(response.data['pin_list'][index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
  }

  /**
  * Populate Blocked Pins
 */
  blockedPinListPopulate() {
    this.commonservice.postHttpCall({ url: '/pinners/blocked-pin-list', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'totalFilters': this.filterPinModel, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: 'application/json' }, this.smallloaderVal).then(result => this.blockedPinListPopulateSuccess(result));
  }

  /**
  * Success function for active Pin list Service Call
  * @param {response} response from service call
  */
  blockedPinListPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.blockedPinList = response.data.pin_list;
      } else {
        for (let index in response.data.pin_list) {
          if (index != 'insert') {
            this.blockedPinList.push(response.data.pin_list[index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }

  }

  /**
  * Drafts pin list populate
  */
  draftPinListPopulate() {
    let data = {
      'page': this.pageCount, 'limit': this.pinLimit,
      'totalFilters': this.filterPinModel,
      'filterByColName': this.filterByColName,
      'orderBy': this.orderBy
    }
    console.log(data);
    this.commonservice.postHttpCall(
      {
        url: '/pinners/draft-pin-list',
        data: {
          'page': this.pageCount, 'limit': this.pinLimit,
          'totalFilters': this.filterPinModel,
          'filterByColName': this.filterByColName,
          'orderBy': this.orderBy
        }, contenttype: 'application/json'
      },
      this.isSmallLoaderEnabled).then(result => this.onDraftPinPopulateSuccess(result));
  }

  /**
  * Determines whether draft pin populate success on
  * @param response 
  */
  onDraftPinPopulateSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.draftPinList = response.data.pin_list;
      } else {
        for (let index in response.data.pin_list) {
          if (index != 'insert') {
            this.draftPinList.push(response.data['pin_list'][index]);
          }
        }
      }
      this.setPinCountForEveryState(response.data);
    }
    if (this.draftPinList.length == 0 && !this.isFirstTimeCall) {
      this.selectedTypeOfPin = 'Active';
      this.callApiDepentOnSelectedTab();
    }
    this.isFirstTimeCall = true;

  }

  /**
  * Populates autocomplete pin
  * @param searchStrng 
  */
  populateAutocompletePin(searchStrng) {
    this.commonservice.postHttpCall({ url: '/pinners/pin-search-autocomplete', data: { 'searchby': searchStrng, 'selectedTypeOfPin': this.selectedTypeOfPin }, contenttype: 'application/json' }, this.isSmallLoaderEnabled).then(result => this.onpopulateAutocompletePinSuccess(result));
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
}
