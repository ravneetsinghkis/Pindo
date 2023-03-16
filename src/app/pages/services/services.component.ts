import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../commonservice';
import { Globalconstant } from '../../global_constant';
import { MatSnackBar } from '@angular/material';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
// import { ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../../app.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { Subject } from 'rxjs/Subject';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import { InviteDialog } from './invite-dialog/invite-dialog.component';
import { PostSocialDialog } from './post-social-dialog/post-social-dialog.component';
import { PublicPinDialog } from './public-pin-dialog/public-pin-dialog.component';
import { ExcessCategoriesComponent } from './excess-categories-c/excess-categories.component';
import { AllCategoriesDialogComponent } from './all-categories-dialog/all-categories-dialog.component';

declare var jQuery: any;
declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  showingAdvanceFilter: boolean = false;
  doerListing = [];

  @ViewChild('doerDetails')
  doerDetails;

  @ViewChild('city')
  city;

  @ViewChild('zipCode')
  zipCode;

  @ViewChild("doerWrapper") doerWrapper: ElementRef;

  cityField = '';
  zipField = '';

  categoryList = [];
  subCategoryList = [];
  selectedCategoryIds = [];
  selectedCatId: any;
  badgesList = [];

  selectedSubCatsValues = [];
  selectedBadgeList = [];

  selectedFiltersTogether = [];
  smallloaderVal = false;

  pinnerAutocomplete = [];
  searchEnabled = false;

  pageCount = 1;
  pinLimit = 0;
  searchVal = '';
  totalDoerCount: any;

  currentAddress = false;

  emergencySelectVal: any = null;
  emergencyVals = ['Yes', 'No'];

  selectedSortFilter = 'all';
  availableRatings = [1, 2, 3, 4];
  ifloggedIn = false;
  rateOptnSelectVal = '';
  componentapiUrl: any;
  showFavDoerData = false;
  minPinsCompleted = ['0', '10', '50', '100'];
  minPinscompletedselection = '0';
  searchfieldVal = '';
  storeSettimeout: any;

  selectedDoers = [];
  inviteDoerModel = {};
  totalDoerSelected = 0;

  searchTerm$ = new Subject<any>();
  filteredOptions: Object;
  countTotal: any;
  p: any;


  constructor(public commonservice: CommonService, public snackBar: MatSnackBar, private router: Router, public globalconstant: Globalconstant, public appServices: AppComponent, private dialog: MatDialog) {
    this.pinLimit = globalconstant.paginateCount;
    this.populateCategoryList();
    this.populateBadges();
    const tempuserType = localStorage.getItem('user_type');
    if (tempuserType) {
      this.ifloggedIn = true;
    } else {
      this.ifloggedIn = false;
    }
    this.componentapiUrl = globalconstant['uploadUrl'];
    this.commonservice.listenPinnerSearch().subscribe((m: any) => {
      this.searchfieldVal = m.trim();
      this.searchVal = m.trim();
    });

    this.commonservice.homeSearch(this.searchTerm$, '/service-list-search-auotcomplete?search_text=').subscribe((data) => {
      this.filteredOptions = data['data'];
      $('#mat-spinner').hide();
    });

    this.commonservice.listnerHeaderAddressChange().subscribe((m: any) => {
      // console.log(m);
      this.clearAllSelectedFilters();
      this.onChangePage(1);
    });
  }

  ngOnInit() {
    if (this.commonservice.addressHeader != null && localStorage.getItem('homesearch') == null) {
      localStorage.setItem('pindo_system_current_position_address', this.commonservice.addressHeader['formatted_address']);
      localStorage.setItem('pindo_system_current_position_lat', this.commonservice.headeraddresslat);
      localStorage.setItem('pindo_system_current_position_lng', this.commonservice.headeraddressLng);
      this.currentAddress = true;
      this.clearAllSelectedFilters();
      this.onChangePage(1);
    } else if (localStorage.getItem('homesearch')) {
      const tempSearchBy = JSON.parse(localStorage.getItem('homesearch'));
      if (tempSearchBy['category'] == null && tempSearchBy['subcategory'] == null) {
        this.searchfieldVal = tempSearchBy;
        this.searchVal = tempSearchBy['text'];
        this.clearAllSelectedFilters();
        this.onChangePage(1);
      }
    } else {
      this.clearAllSelectedFilters();
      this.onChangePage(1);
    }

  }

  /*
   * open popup
   * 
  */
  openPinnerListPopup(list) {
    const popup_width: any = '615px';

    const tempDialogRef = this.dialog.open(PinnerListDialogComponent, {
      width: popup_width,
      disableClose: false,
      data: {
        'hired_list': list,
      }
    });
  }

  goToPublicProfile(id) {
    // console.log(id);
  }

  /*** new search ****/
  // onSelectedVal(evt:MatAutocompleteSelectedEvent) {
  //   console.log(evt,evt['option']['viewValue'])
  //   this.searchfieldVal = evt['option']['viewValue']; 
  //   console.log(this.searchfieldVal);
  // }

  displayFn(user?: any): string | undefined {
    return user ? user.text : undefined;
  }

  selectedValSearch(evt) {
    if (this.searchfieldVal['type'] == 'subcategory') {
      this.selectedSubCatsValues = [];
      this.selectedSubCatsValues.push(this.searchfieldVal['subcategory']);
    } else if (this.searchfieldVal['type'] == 'category') {
      this.selectedCategoryIds = [];
      this.selectedCategoryIds.push(this.searchfieldVal['category']['id']);
    } else { }
    const tosendObj = this.getFilterList();
    this.searchVal = this.searchfieldVal['text'];
    this.smallloaderVal = false;
    this.pageCount = 1;
    this.doerListing = [];
    this.onChangePage(1);
  }

  onkeyupSearch(val) {
    $('#mat-spinner').show();
    this.searchTerm$.next(val);
  }
  /*** new search ****/

  getToInvitePins(doer_id) {
    localStorage.setItem('doerID', btoa(doer_id));
    const tempdoerIdUrl = btoa(doer_id);
    this.router.navigate(['/doer-details/' + tempdoerIdUrl + '/invite-to-pin']);
  }

  goToPins(typeOfPin, doerId) {
    if (typeOfPin == 'Ongoing') {
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Ongoing`), 'Secret Key').toString();
      const b64 = CryptoJS.AES.encrypt(`${doerId}-Ongoing`, 'Secret Key').toString();
      const e64 = CryptoJS.enc.Base64.parse(b64);
      const eHex = e64.toString(CryptoJS.enc.Hex);
      console.log(eHex);
      this.router.navigate([]).then(result => { window.open(`/pin-listing/${eHex}`, '_blank'); });
      //this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
    } else {
      //let encryptedDoerId = CryptoJS.AES.encrypt(JSON.stringify(`${doerId}-Completed`), 'Secret Key').toString();
      const b64 = CryptoJS.AES.encrypt(`${doerId}-Completed`, 'Secret Key').toString();
      const e64 = CryptoJS.enc.Base64.parse(b64);
      const eHex = e64.toString(CryptoJS.enc.Hex);
      this.router.navigate([]).then(result => { window.open(`/pin-listing/${eHex}`, '_blank'); });
    }
  }

  /**
   * Gets add link
   * @param type 
   * @param fullAddressOrState 
   * @param city 
   * @returns  
   */
  getAddLink(type, fullAddressOrState, city) {
    let tempaddress = fullAddressOrState;
    if (type == 'fullAddress') {
      const address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
    } else {
      let address = city ? city : '';
      address += fullAddressOrState ? ',' + fullAddressOrState : '';
      tempaddress = `https://maps.google.com/maps?q=${address}`;
    }
    return tempaddress;
  }

  encode(doer_id) {
    return btoa(doer_id);
  }

  selectSort(selectedFilter) {
    this.selectedSortFilter = selectedFilter;
  }


  getCurrentAddress() {
    this.currentAddress = (this.currentAddress) ? false : true;
    if (this.currentAddress) {
      this.cityField = '';
      this.zipField = '';
      $('#cityName').val('');
      $('#zipCode').val('');
      if (navigator.geolocation) {
        // navigator.geolocation.getCurrentPosition(this.commonservice.showPosition);
        navigator.geolocation.getCurrentPosition((result) => {
          this.commonservice.setCurrentLocation(result);
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
      this.searchEnabled = true;
    } else {

      this.cityField = '';
      this.zipField = '';
      $('#cityName').val('');
      $('#zipCode').val('');
      //$('#searchField').val('');
      // localStorage.setItem('pindo_system_current_position_lat', null);
      // localStorage.setItem('pindo_system_current_position_lng', null);
      // localStorage.setItem('pindo_system_current_position_address', null);
      this.searchEnabled = false;
      $('.clearSearchText').trigger('click');
      //$('.searchIcon').trigger('click');
    }
  }

  selectedDoer(index) {
    const tempName = this.doerListing[index].id;
    this.totalDoerSelected = (this.inviteDoerModel[tempName] == true) ? this.totalDoerSelected + 1 : this.totalDoerSelected - 1;
    //this.selectedDoers.push(tempName);
    const flagALreadyHas = false;
    if (this.inviteDoerModel[tempName] == true) {
      this.selectedDoers.push(this.doerListing[index]);
    } else {
      for (let x = 0; x < this.selectedDoers.length; x++) {
        if (this.selectedDoers[x].id == tempName) {
          this.selectedDoers.splice(x, 1);
        }
      }

    }
  }

  addDoerListToLocalstorage() {
    if (this.selectedSubCatsValues.length > 0) {
      localStorage.setItem('selectedSubCategoryFilter', JSON.stringify(this.selectedSubCatsValues));
    }
    if (this.selectedCategoryIds.length > 0) {
      localStorage.setItem('selectedCategoryFilter', JSON.stringify(this.selectedCategoryIds));
    }
    if (localStorage.getItem('inviteDoerList')) {
      localStorage.removeItem('inviteDoerList');
    }
    localStorage.setItem('inviteDoerList', JSON.stringify(this.selectedDoers));
  }

  inviteDoerToPin() {
    this.addDoerListToLocalstorage();
    this.router.navigate(['/doer-details/multiple-doer/invite-to-pin']);
  }

  inviteToCreateNewPin() {
    this.addDoerListToLocalstorage();
    this.router.navigate(['/pinner/create-new-pin']);
  }

  /**
    * toggle advanced filter section
  **/
  toggleAdvanceFilterView() {
    this.showingAdvanceFilter = !this.showingAdvanceFilter;
    $('.advance_filter').slideToggle();
  }

  /**
   * like Doer
   *
   * @param evt = event
   * 
  **/
  likeDoer(evt, doerId) {
    //console.log(doerId);
    if (evt.target.classList.contains('liked')) {
      evt.target.classList.remove('liked');
    } else {
      evt.target.classList.add('liked');
    }
    this.commonservice.postHttpCall({ url: '/pinners/mark-and-unmark-as-favourite-doer', data: { 'doer_id': doerId }, contenttype: 'application/json' }).then(result => this.onlikeDoerSuccess(result));

  }

  onlikeDoerSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
    }
  }

  showFavDoer() {
    this.showFavDoerData = !this.showFavDoerData;
    this.pageCount = 1;
    this.onChangePage(1);
  }

  /**
 * toggleMenuIcon for dropdown
 *
 * @param evt = event
 * @param state ('open'/'remove')
 */
  toggleMenuIcon(evt, state) {
    if (evt._elementRef.nativeElement.classList.contains('opened') && state == 'remove') {
      evt._elementRef.nativeElement.classList.remove('opened');
    }
    if (!evt._elementRef.nativeElement.classList.contains('opened') && state == 'open') {
      evt._elementRef.nativeElement.classList.add('opened');
    }
  }
  /**
	 * trigger togglePopup of child component
	 *
	 * 
	 * 
  */
  viewDoerDetails() {
    this.doerDetails.togglePopup();
  }

  onpopulateDoerSuccess(response) {
    if (response.status == 1) {
      if (this.pageCount == 1) {
        this.doerListing = response.data;
        this.countTotal = response.count_doer;
        console.log('TOTAL DATA', response);
      } else {
        // tslint:disable-next-line: forin
        for (const index in response.data) {
          this.doerListing.push(response.data[index]);
        }
      }
      if (localStorage.getItem('homesearch')) {
        localStorage.removeItem('homesearch');
      }
      this.searchVal = this.searchfieldVal['text'] || '';
      this.totalDoerCount = response.count_doer;
    }
    this.pinnerAutocomplete = [];

  }

  populateDoer() {
    const tosendObj = this.getFilterList();
    if (this.smallloaderVal) {
      $('#small_loader').show();
    }
    this.commonservice.postHttpCall({
      url: '/get-doer-list',
      data: {
        'page': this.pageCount,
        'limit': this.pinLimit,
        'search_text': this.searchVal,
        'filterList': tosendObj,
        'sortBy': this.selectedSortFilter,
        'showFavSoer': this.showFavDoerData
      },
      contenttype: 'application/json'
    }, this.smallloaderVal)
      .then(result => this.onpopulateDoerSuccess(result));
  }

  onChangePage(event) {
    // window.scroll({
    //   top: 630,
    //   left: 0,
    //   behavior: 'smooth'
    // });
    const tosendObj = this.getFilterList();
    this.commonservice.postHttpCall({
      url: '/get-doer-list',
      data: {
        'page': event,
        'limit': this.pinLimit,
        'search_text': this.searchVal,
        'filterList': tosendObj,
        'sortBy': this.selectedSortFilter,
        'showFavSoer': this.showFavDoerData
      },
      contenttype: 'application/json'
    }, this.smallloaderVal)
      .then(response => {
        this.doerListing = response.data;
        this.countTotal = response.count_doer;
        // console.log(this.doerListing);
        setTimeout(() => {
          this.commonservice.initBadgeSlider();
          this.doerWrapper.nativeElement.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          });
        }, 1000);
      });
  }

  populateSubCategory() {
    this.commonservice.postHttpCall({ url: '/get-sub-categories', data: { 'parent_category_id': this.selectedCatId }, contenttype: 'application/json' }).then(result => this.onSubCategoryPopulateSuccess(result));
  }

  onpopulateAutoCompletePinnerSuccess(response) {
    if (response.status == 1) {
      this.pinnerAutocomplete = response.data;
      if (this.searchfieldVal.trim() == this.searchVal.trim() && this.searchfieldVal.trim() != '') {
        this.pinnerAutocomplete = [];
      }
    }
    $('#mat-spinner').hide();
  }

  populateAutoCompletePinner(searchStrng) {
    $('#mat-spinner').show();
    setTimeout(() => {
      this.commonservice.postHttpCall({ url: '/service-list-search-auotcomplete', data: { 'search_text': searchStrng }, contenttype: 'application/json' }, this.smallloaderVal).then(result => this.onpopulateAutoCompletePinnerSuccess(result));
    }, 500);
  }

  searchPin(evt) {
    console.log(evt.keyCode);
    if (evt.keyCode == 13) {
      if (this.pinnerAutocomplete.length > 0) {
        this.searchfieldVal = this.pinnerAutocomplete[0];
      }
      this.submitSelectedFilter();
      setTimeout(() => {
        this.pinnerAutocomplete = [];
      }, 0);
    } else {
      console.log('else');
      const searchString = evt.target.value;
      const checkStringLen = searchString.split('');
      //if(checkStringLen.length>2) {
      this.smallloaderVal = true;
      this.searchEnabled = true;

      if (this.storeSettimeout != '') {
        clearTimeout(this.storeSettimeout);
      }

      this.storeSettimeout = setTimeout(() => {
        this.populateAutoCompletePinner(searchString);
      }, 500);
    }

    //}
    /*else {
      this.smallloaderVal = false;
      this.searchEnabled = false;
      $('#mat-spinner').hide();
      this.pinnerAutocomplete = [];
    }*/
  }

  populateString(evt) {
    $('#searchFieldUnique').val(evt.target.innerHTML);
    this.pinnerAutocomplete = [];
    $('.searchIcon').trigger('click');
  }

  onSubCategoryPopulateSuccess(response) {
    if (response.status == 1) {
      this.subCategoryList = [];

      let i = 0;
      while (true) {
        if (!this.selectedFiltersTogether[i]) {
          break;
        }
        if (this.selectedFiltersTogether[i]['typeofFilter'] == 'SubCategory') {
          this.selectedFiltersTogether.splice(i, 1);
          i = 0;
        } else {
          i++;
        }
      }

      this.pageCount = 1;
      // this.selectedFiltersTogether = []; 			  		
      this.subCategoryList.push(response.data);
      this.selectedCategoryIds = [];
      //this.selectedCategoryIds = this.selectedCatId;
      this.selectedCategoryIds.push(this.selectedCatId);
      this.selectedCatId = '';
      setTimeout(() => {
        if (localStorage.getItem('homesearch')) {
          const tempSearchByObj = JSON.parse(localStorage.getItem('homesearch'));
          if (tempSearchByObj['subcategory'] !== null) {
            $(document).find('#subCat-' + tempSearchByObj['subcategory']).trigger('click');
          }
          this.onChangePage(1);
        } else {
          this.onChangePage(1);
        }
      }, 0);
    }
  }

  removeFromarr(parentCatId, arrName, arryVal = '', tempIndex: any = '') {
    const tempToremoveIndexes = [];
    const temptotalLength = parseInt(arrName.length) - 1;
    for (let i = 0; i < arrName.length; i++) {
      if (arrName[i]['parent_id'] == parentCatId) {
        const tempSubCatId = arrName[i].id;
        tempToremoveIndexes.push(i);
      }
    }
    for (let i = tempToremoveIndexes.length - 1; i >= 0; i--) {
      arrName.splice(tempToremoveIndexes[i], 1);
      if (i == 0 && (arryVal == 'lastArr')) {
        this.subCategoryList.splice(tempIndex, 1);
      }
    }
    if (tempToremoveIndexes.length == 0 && (arryVal == 'lastArr')) {
      this.subCategoryList.splice(tempIndex, 1);
    }
  }

  selectedCategory(indexVal, evt) {
    this.selectedCatId = this.categoryList[indexVal]['id'];
    this.selectedSubCatsValues = [];
    this.selectedDoers = [];
    this.totalDoerSelected = 0;
    // tslint:disable-next-line: forin
    for (const eachInvitedDoer in this.inviteDoerModel) {
      this.inviteDoerModel[eachInvitedDoer] = false;
    }
    this.populateSubCategory();
  }

  selectedSubCats(subcatIndex, selectedIndex, evt) {
    if (evt.target.checked) {
      for (let i = 0; i < this.selectedFiltersTogether.length; i++) {
        /*if(this.selectedFiltersTogether[i]['typeofFilter'] == 'SubCategory') {
          this.selectedFiltersTogether.splice(i,1);
        }*/
      }
      //this.selectedSubCatsValues = [];    
      const tempObj = {
        'subCategoryListIndex': subcatIndex,
        'selectedIndex': selectedIndex,
        'name': this.subCategoryList[subcatIndex][selectedIndex].name,
        'id': this.subCategoryList[subcatIndex][selectedIndex].id,
        'typeofFilter': 'SubCategory',
        'parent_id': this.subCategoryList[subcatIndex][selectedIndex].parent_id
      };
      this.selectedSubCatsValues.push(tempObj);
      this.selectedFiltersTogether.push(tempObj);
    } else {
      for (let i = 0; i < this.selectedFiltersTogether.length; i++) {
        if (this.selectedFiltersTogether[i]['typeofFilter'] == 'SubCategory') {
          if (this.selectedFiltersTogether[i]['selectedIndex'] == selectedIndex) {
            this.selectedFiltersTogether.splice(i, 1);
            this.selectedSubCatsValues.splice(i, 1);
          }

        }
      }
    }

  }

  deselectFilter(indexVal) {
    console.log('serv');
    const tempFilterName = this.selectedFiltersTogether[indexVal]['typeofFilter'];
    if (tempFilterName == 'SubCategory') {
      this.deselectSubCat(indexVal, this.selectedFiltersTogether);
    } else if (tempFilterName == 'badges') {
      this.deselectBadge(indexVal, this.selectedFiltersTogether);
    } else if (tempFilterName == 'emergency') {
      this.deselectEmergency();
    } else if (tempFilterName == 'rating') {
      this.deselectRating(indexVal);
    } else if (tempFilterName == 'minpinscompleted') {
      this.deselectMinPinsSelected();
    }
  }

  deselectMinPinsSelected() {
    for (const index in this.selectedFiltersTogether) {
      if (this.selectedFiltersTogether[index]['typeofFilter'] == 'minpinscompleted') {
        this.selectedFiltersTogether.splice(parseInt(index), 1);
      }
    }
    $('#minpins-0').trigger('click');
  }

  deselectRating(indexVal) {
    this.selectedFiltersTogether.splice(indexVal, 1);
    this.rateOptnSelectVal = null;
  }

  deselectSubCat(i, arr) {
    const tempIndexVal = arr[i]['id'];
    $('#subCat-' + tempIndexVal).attr('checked', false);
    if (this.selectedFiltersTogether[i]['typeofFilter'] == 'SubCategory') {
      if (this.selectedFiltersTogether[i]['id'] == tempIndexVal) {
        this.selectedFiltersTogether.splice(i, 1);
        this.selectedSubCatsValues.splice(i, 1);
      }

    }
    this.selectedSubCatsValues = [];
  }

  selectedBadges(indexVal, evt) {
    if (evt.target.checked) {
      const tempObj = {
        'id': this.badgesList[indexVal]['id'],
        'selectedBadgeIndex': indexVal,
        'name': this.badgesList[indexVal]['name'],
        'typeofFilter': 'badges'
      };
      this.selectedBadgeList.push(tempObj);
      this.selectedFiltersTogether.push(tempObj);
    } else {
      for (let i = 0; i < this.selectedBadgeList.length; i++) {
        if (this.selectedBadgeList[i]['id'] == this.badgesList[indexVal]['id']) {
          this.selectedBadgeList.splice(i, 1);
        }
      }
      for (let i = 0; i < this.selectedFiltersTogether.length; i++) {
        if (this.selectedFiltersTogether[i]['id'] == this.badgesList[indexVal]['id']) {
          this.selectedFiltersTogether.splice(i, 1);
        }
      }
    }
  }

  deselectBadge(i, arr) {
    const tempIndexVal = arr[i]['selectedBadgeIndex'];
    $('#badgesearned-' + tempIndexVal).trigger('click');
  }

  getFilterList() {
    const finalObjtoSend = {
      'lat': localStorage.getItem('pindo_system_current_position_lat'),
      'long': localStorage.getItem('pindo_system_current_position_lng'),
      // 'lat': 'null',
      // 'long': 'null',
      'city': this.cityField,
      'zipCode': this.zipField,
      'selectedCategoryIds': this.selectedCategoryIds,
      'selectedSubCatsValues': this.selectedSubCatsValues,
      'emergency': this.emergencySelectVal,
      'selectedRating': this.rateOptnSelectVal,
      'selectedminpinscompletedselect': this.minPinscompletedselection,
      'selectedBadges': this.selectedBadgeList
    };
    return finalObjtoSend;
  }

  /**
   * Submits selected filter
   */
  submitSelectedFilter() {
    const tosendObj = this.getFilterList();
    this.searchVal = this.searchfieldVal['text'] || '';
    this.smallloaderVal = false;
    this.pageCount = 1;
    this.doerListing = [];
    this.selectedDoers = [];
    this.totalDoerSelected = 0;
    // tslint:disable-next-line: forin
    for (const eachInvitedDoer in this.inviteDoerModel) {
      this.inviteDoerModel[eachInvitedDoer] = false;
    }
    this.onChangePage(1);
  }

  /**
   * Populates category list
   */
  populateCategoryList() {
    this.commonservice.postHttpCall({ url: '/get-categories', data: {}, contenttype: 'application/json' }).then(result => this.onCategoryPopulateSuccess(result));
  }

  /**
   * Determines whether category populate success on
   * @param response 
   */
  onCategoryPopulateSuccess(response) {
    if (response.status == 1) {
      this.categoryList = response.data;
      console.log(this.categoryList);
      setTimeout(() => {
        if (localStorage.getItem('homesearch')) {
          const tempSearchByObj = JSON.parse(localStorage.getItem('homesearch'));
          if (tempSearchByObj['category'] !== null) {
            for (const index in this.categoryList) {
              if (this.categoryList[index]['id'] == tempSearchByObj['category']['id']) {
                console.log($(document).find('#checkCat-' + index).length);
                $(document).find('#checkCat-' + index).trigger('click');
              }
            }
          }
        }
      }, 0);
    }
  }

  /**
   * Populates badges
   */
  populateBadges() {
    this.commonservice.postHttpCall({ url: '/get-badge-list', data: {}, contenttype: 'application/json' }).then(result => this.onBadgePopulateSuccess(result));
  }

  /**
   * Determines whether badge populate success on
   * @param response 
   */
  onBadgePopulateSuccess(response) {
    //console.log(response);
    if (response.status == 1) {
      this.badgesList = response.data;
    }
  }

  /**
   * Clears search text
   */
  clearSearchText() {
    this.searchfieldVal = '';
    this.submitSelectedFilter();
  }

  /**
   * Clears all selected filters
   */

  // async clearAllSelectedFilters() {
  //   this.pageCount = 1;
  //   this.cityField = '';
  //   this.zipField = '';
  //   $('#cityName').val('');
  //   $('#zipCode').val('');
  //   this.currentAddress = false;
  //   this.showFavDoerData = false;

  //   let temp_array = [];
  //   for (let ele of this.selectedFiltersTogether) {
  //     if (ele['typeofFilter'] == 'SubCategory') {
  //       await temp_array.push(ele);
  //     }
  //   }
  //   this.selectedFiltersTogether = [];
  //   this.rateOptnSelectVal = null;
  //   this.emergencySelectVal = null;
  //   this.minPinscompletedselection = '0';
  //   this.selectedBadgeList = [];
  //   for (let ele of temp_array) {
  //     await this.selectedFiltersTogether.push(ele);
  //   }

  //   this.populateDoer(1);
  //   this.populateBadges();
  //   $('.clearSearchText').trigger('click');
  // }

  async clearAllSelectedFilters() {
    this.pageCount = 1;
    this.cityField = '';
    this.zipField = '';
    $('#cityName').val('');
    $('#zipCode').val('');
    this.currentAddress = false;

    let temp_array = [];
    for (let ele of this.selectedFiltersTogether) {
      if (ele['typeofFilter'] == 'SubCategory') {
        await temp_array.push(ele);
      }
    }
    this.selectedFiltersTogether = [];
    this.rateOptnSelectVal = null;
    this.emergencySelectVal = null;
    this.minPinscompletedselection = '0';
    this.selectedBadgeList = [];
    for (let ele of temp_array) {
      await this.selectedFiltersTogether.push(ele);
    }

    this.showFavDoerData = false;
    this.onChangePage(1);
    this.populateBadges();
    $('.clearSearchText').trigger('click');
  }

  /* onScroll() {
    //console.log('yes',this.totalDoerCount);
    if (this.doerListing.length < (this.totalDoerCount - 1)) {
      this.pageCount = this.pageCount + 1;
      //console.log(this.pageCount);
      this.smallloaderVal = true;
      this.populateDoer();
    } else {
      this.smallloaderVal = false;
      $('#small_loader').hide();
    }
    //this.populatePin();
  } */

  /**
   * Selects emergengy filter
   * @param value 
   * @param indexVal 
   */
  selectEmergengyFilter(value, indexVal) {
    let emrgency_name = '';
    if (value == 'Yes') {
      emrgency_name = 'Emergency Pins Only';
    } else if (value == 'No') {
      emrgency_name = 'No Emergency Pins';
    }
    this.deselectEmergency();
    this.emergencySelectVal = value;
    const tempObj = {
      'typeofFilter': 'emergency',
      'selectedVal': this.emergencySelectVal,
      'id': `emergency-${indexVal}`,
      'name': emrgency_name,
    };
    this.selectedFiltersTogether.push(tempObj);
  }

  /**
   * Deselects emergency
   */
  deselectEmergency() {
    let hasEmergencyFlag = false;
    let tempIndexVal: any;
    for (let i = 0; i < this.selectedFiltersTogether.length; i++) {
      if (this.selectedFiltersTogether[i]['typeofFilter'] == 'emergency') {
        hasEmergencyFlag = true;
        tempIndexVal = i;
      }
    }
    if (hasEmergencyFlag) {
      this.selectedFiltersTogether.splice(tempIndexVal);
    }
    this.emergencySelectVal = null;
  }


  /**
   * Go to chat
   * @param doer_id 
   */
  goToChat(doer_id) {
    localStorage.removeItem('doer_id');
    localStorage.removeItem('pin_id');
    var pin_id = '0';

    localStorage.setItem('doer_id', btoa(doer_id));
    localStorage.setItem('pin_id', btoa(pin_id));
    this.router.navigate(['/pinner/chat']);
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
   * Getstars count array
   * @param eachRatingOptn 
   * @returns  
   */
  getstarCountArray(eachRatingOptn) {
    const tempArr = [];
    for (let i = 1; i <= eachRatingOptn; i++) {
      tempArr.push(i);
    }
    return tempArr;
  }

  /**
   * Selects or deselect rating
   * @param indexVal 
   */
  selectOrDeselectRating(indexVal) {
    const tempIndexToremove = [];
    const tempObj = {
      'typeofFilter': 'rating',
      'selectedVal': indexVal,
      'id': `rating`,
      'name': `${indexVal} Star Rating`
    };
    for (const index in this.selectedFiltersTogether) {
      if (this.selectedFiltersTogether[index]['typeofFilter'] == 'rating') {
        tempIndexToremove.push(index);
      }
    }
    if (tempIndexToremove.length == 0) {
      this.selectedFiltersTogether.push(tempObj);
    } else {
      for (let i = 0; i < tempIndexToremove.length; i++) {
        this.selectedFiltersTogether.splice(parseInt(tempIndexToremove[i]), 1);
        if (i == (tempIndexToremove.length - 1)) {
          this.selectedFiltersTogether.push(tempObj);
        }
      }
    }
  }

  /**
   * Selects or deselect min pins completed
   * @param indexVal 
   */
  selectOrDeselectMinPinsCompleted(indexVal) {
    const tempIndexToremove = [];
    const tempName = '';
    if (indexVal != 0) {
      const tempObj = {
        'typeofFilter': 'minpinscompleted',
        'selectedVal': indexVal,
        'id': `minpinscompleted`,
        'name': `${indexVal}+ Pins`
      };
      for (const index in this.selectedFiltersTogether) {
        if (this.selectedFiltersTogether[index]['typeofFilter'] == 'minpinscompleted') {
          tempIndexToremove.push(index);
        }
      }
      if (tempIndexToremove.length == 0) {
        this.selectedFiltersTogether.push(tempObj);
      } else {
        for (let i = 0; i < tempIndexToremove.length; i++) {
          this.selectedFiltersTogether.splice(parseInt(tempIndexToremove[i]), 1);
          if (i == (tempIndexToremove.length - 1)) {
            this.selectedFiltersTogether.push(tempObj);
          }
        }
      }
    } else {
      this.deselectMinPinsSelected();
    }
  }

  /*
   * snackbar message populate
   * @param res_class = where to show snackbar
   * @param message = message to show
  */
  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

  /**
 * Invite dialog open
 */
  inviteOpenDialog(): void {
    const dialogRef = this.dialog.open(InviteDialog, {
      width: '550px',
      panelClass: 'comnDialog-panel',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
 * post social dialog open
 */
  postSocialOpenDialog(): void {
    const dialogRef = this.dialog.open(PostSocialDialog, {
      width: '740px',
      panelClass: 'comnDialog-panel',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
 * post social dialog open
 */
  PublicPinnOpenDialog(): void {
    const dialogRef = this.dialog.open(PublicPinDialog, {
      width: '550px',
      panelClass: 'comnDialog-panel',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
   * Open Extra Categories
   * @param rem string
   * @param item string
   */
	openExtraCategories(rem, item) {
		const dialogRef = this.dialog.open(ExcessCategoriesComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { list: rem, cat_name: item }
		});
		dialogRef.afterClosed().subscribe(result => {
		});
  }

  /**
   * Show remaining categories
   * @param categories object
   */
  showMoreCats(categories: any) {
    this.dialog.open(AllCategoriesDialogComponent, {
			width: '350',
			panelClass: 'comnDialog-panel',
			data: { categories: categories }
		});    
  }

}
