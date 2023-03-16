import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Globalconstant } from '../../../../../global_constant';
import { AppComponent } from '../../../../../app.component';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-filter-doer',
  templateUrl: './filter-doer.component.html',
  styleUrls: ['./filter-doer.component.scss']
})
export class FilterDoerComponent implements OnInit {

  showingAdvanceFilter: boolean = false;
  doerListing = [];
  selected = [];
  disableSubcategory = false;
  // @ViewChild('doerDetails')
  // doerDetails;

  // @ViewChild('city')
  // city;

  // @ViewChild('zipCode')
  // zipCode;

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
  pinLimit = 9;
  searchVal = '';
  totalDoerCount: any;
  index: any;

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
  @Input() slug;
  @Output() filterData = new EventEmitter();
  toFireOnceCounter = 0;
  pinDetails = {};
  showSubCategories = false;

  constructor(public commonservice: CommonService,
    public snackBar: MatSnackBar, private router: Router,
    public globalconstant: Globalconstant, private _location: Location) {
    this.populateCategoryList();
    this.populateBadges();
    const tempuserType = localStorage.getItem('user_type');
    if (tempuserType) {
      this.ifloggedIn = true;
    } else {
      this.ifloggedIn = false;
    }
    this.componentapiUrl = globalconstant['uploadUrl'];
  }

  ngOnInit() {
    // localStorage.setItem('pindo_system_current_position_address', null);
    // localStorage.setItem('pindo_system_current_position_lat', null);
    // localStorage.setItem('pindo_system_current_position_lng', null);
    $('#searchFieldUnique').val(this.searchVal);
    this.searchfieldVal = this.searchVal;
    //this.populateDoer();    
    this.filterData.emit({ 'search_text': this.searchVal, 'filterList': this.getFilterList(), 'sortBy': this.selectedSortFilter, 'showFavSoer': this.showFavDoerData, 'slug': this.slug });
  }

  getPinDetails() {
    this.commonservice.postHttpCall({ url: '/pinners/pin-details-to-invite', data: { 'slug': this.slug }, contenttype: 'application/json' })
      .then(result => this.onGetPinDetailsSuccess(result));
  }

  onGetPinDetailsSuccess(response) {
    if (response.status == 1) {
      //this.toFireOnceCounter++;
      this.pinDetails = response.data;
      console.log("hddjfklsdlfj", this.pinDetails);
      //this.populateCategoryList();
      //console.log($(`#checkCat-${this.pinDetails['parent_category_id']}`).length);      

      const tempParentArra = this.categoryList.reduce((acc, curr, index) => {
        if (curr['id'] == this.pinDetails['parent_category_id']) {
          acc.push(index);
        }
        return acc;
      }, []);

      // this.cityField = this.pinDetails['city'] || '';
      // this.zipField = this.pinDetails['zipcode'] || '';

      // localStorage.setItem('pindo_system_current_position_address', this.pinDetails['address']);
      // localStorage.setItem('pindo_system_current_position_lat', this.pinDetails['lat']);
      // localStorage.setItem('pindo_system_current_position_lng', this.pinDetails['lng']);

      localStorage.setItem('pinID', response.data.id);
      localStorage.setItem('pinnerID', response.data.pinner_id);
      localStorage.setItem('pinName', response.data.title);
      localStorage.setItem('pinUniqueID', response.data.pin_unique_id);

      // if(this.zipField!='') {
      //   this.searchfieldVal = this.zipField;
      // }
      // else if(this.cityField!='') {
      //   this.searchfieldVal = this.cityField;
      // }

      $(`#checkCat-${tempParentArra[0]}`).trigger('click');
      this.toFireOnceCounter++;
    }
  }

  getAddLink(addressLink) {
    let tempaddress = addressLink;
    const address = tempaddress.replace(/\,/g, '');
    tempaddress = address.replace(/\ /g, '%20');
    tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
    return tempaddress;
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
          this.commonservice.setCurrentLocation(result)
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
 * toggle advanced filter section
  */
  toggleAdvanceFilterView() {
    this.showingAdvanceFilter = !this.showingAdvanceFilter;
    $('.advance_filter').slideToggle();
  }


  /**
   * Populates sub category
   */
  populateSubCategory() {
    this.commonservice.postHttpCall({
      url: '/get-sub-categories',
      data: { 'parent_category_id': this.selectedCatId },
      contenttype: 'application/json'
    })
      .then(result => this.onSubCategoryPopulateSuccess(result));
  }

  /**
   * Determines whether sub category populate success on
   * @param response 
   */
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
      this.selectedCategoryIds.push(this.selectedCatId);
      this.selectedCatId = '';
      setTimeout(() => {
        // console.log(this.toFireOnceCounter,$(`#subCat-${this.pinDetails['child_category_id']}`).length,this.pinDetails['child_category_id']);
        if (this.toFireOnceCounter == 1) {
          $(`#subCat-${this.pinDetails['child_category_id']}`).trigger('click');

          this.toFireOnceCounter++;
        } else {
          this.submitSelectedFilter();
        }
      }, 0);
    }
  }

  /**
   * Populates auto complete pinner
   * @param searchStrng 
   */
  populateAutoCompletePinner(searchStrng) {
    $('#mat-spinner').show();
    setTimeout(() => {
      this.commonservice.postHttpCall({ url: '/pinners/doer-search-list-autocomplete', data: { 'search_text': searchStrng, 'slug': this.slug }, contenttype: 'application/json' }, this.smallloaderVal)
        .then(result => this.onpopulateAutoCompletePinnerSuccess(result));
    }, 500);
  }

  /**
   * Onpopulates auto complete pinner success
   * @param response 
   */
  onpopulateAutoCompletePinnerSuccess(response) {
    if (response.status == 1) {
      this.pinnerAutocomplete = response.data;
      if (this.searchfieldVal.trim() == this.searchVal.trim() && this.searchfieldVal.trim() != '') {
        this.pinnerAutocomplete = [];
      }
    }
    $('#mat-spinner').hide();
  }

  /**
   * Searchs pin
   * @param evt 
   */
  searchPin(evt) {
    if (evt.keyCode == 13) {
      if (this.pinnerAutocomplete.length > 0) {
        this.searchfieldVal = this.pinnerAutocomplete[0];
      }
      this.submitSelectedFilter();
      setTimeout(() => {
        this.pinnerAutocomplete = [];
      }, 0);
    } else {
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

  /**
   * Populates string
   * @param evt 
   */
  populateString(evt) {
    $('#searchFieldUnique').val(evt.target.innerHTML);
    this.pinnerAutocomplete = [];
    $('.searchIcon').trigger('click');
  }

  /**
   * Removes fromarr
   * @param parentCatId 
   * @param arrName 
   * @param [arryVal] 
   * @param [tempIndex] 
   */
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

  /**
   * Selected category
   * @param indexVal 
   * @param evt 
   */
  selectedCategory(indexVal, evt) {
    if (evt.target.checked) {
      this.selectedCatId = this.categoryList[indexVal]['id'];
      for (let ele of this.selectedFiltersTogether) {

      }
      this.selectedSubCatsValues = [];
      this.selected = [];
      this.populateSubCategory();
    } else {
      // let parentCatId = this.categoryList[indexVal]['id'];
      // let tempIndex:any;
      // for(let i=0;i<this.selectedCategoryIds.length;i++) {
      // 	if(this.selectedCategoryIds[i]==parentCatId) {
      // 		tempIndex = i;
      // 	}
      // }  		
      //   if(this.selectedSubCatsValues.length>0 && this.subCategoryList[tempIndex].length>0) {
      //     //console.log('yes');
      //     this.selectedCategoryIds.splice(tempIndex,1);
      //     this.removeFromarr(parentCatId,this.selectedFiltersTogether);
      //     this.removeFromarr(parentCatId,this.selectedSubCatsValues,'lastArr',tempIndex);
      //   }
      //   else {        
      //     this.subCategoryList.splice(tempIndex,1);
      //     this.selectedCategoryIds.splice(tempIndex,1);
      //   }
    }
  }

  /**
   * Selected sub cats
   * @param subcatIndex 
   * @param selectedIndex 
   * @param evt 
   */
  selectedSubCats(subcatIndex, selectedIndex, evt) {
    if (evt.target.checked) {
      // for(let i=0;i<this.selectedFiltersTogether.length;i++) {
      /*if(this.selectedFiltersTogether[i]['typeofFilter'] == 'SubCategory') {
        this.selectedFiltersTogether.splice(i,1);
      }*/
      // } 
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
    // console.log(subcatIndex,selectedIndex,this.selectedFiltersTogether);
    setTimeout(() => {
      if (this.toFireOnceCounter == 2) {
        $('#searchFieldUnique').val();
        this.submitSelectedFilter();
        this.toFireOnceCounter++;
      }
    }, 0);

    setTimeout(() => {
      // this.disableSubcategory = true;
    }, 0);
  }

  /**
   * Deselects filter
   * @param indexVal 
   */
  deselectFilter(indexVal) {
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

  /**
   * Deselects min pins selected
   */
  deselectMinPinsSelected() {
    for (const index in this.selectedFiltersTogether) {
      if (this.selectedFiltersTogether[index]['typeofFilter'] == 'minpinscompleted') {
        this.selectedFiltersTogether.splice(parseInt(index), 1);
      }
    }
    $('#minpins-0').trigger('click');
  }

  /**
   * Deselects rating
   * @param indexVal 
   */
  deselectRating(indexVal) {
    this.selectedFiltersTogether.splice(indexVal, 1);
    this.rateOptnSelectVal = null;
  }

  /**
   * Deselects sub cat
   * @param i 
   * @param arr 
   */
  deselectSubCat(i, arr) {
    const tempIndexVal = arr[i]['id'];
    //$('#subCat-'+tempIndexVal).attr('checked',false);
    $('#subCat-' + tempIndexVal).trigger('click');
    for (let i = 0; i < this.selectedFiltersTogether.length; i++) {
      if (this.selectedFiltersTogether[i]['typeofFilter'] == 'SubCategory') {
        if (this.selectedFiltersTogether[i]['id'] == tempIndexVal) {
          this.selectedFiltersTogether.splice(i, 1);
          this.selectedSubCatsValues.splice(i, 1);
        }

      }
    }
    this.selectedSubCatsValues = [];
  }

  /**
   * Selected badges
   * @param indexVal 
   * @param evt 
   */
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

  /**
   * Deselects badge
   * @param i 
   * @param arr 
   */
  deselectBadge(i, arr) {
    const tempIndexVal = arr[i]['selectedBadgeIndex'];
    $('#badgesearned-' + tempIndexVal).trigger('click');
  }

  /**
   * Gets filter list
   * @returns  
   */
  getFilterList() {
    const finalObjtoSend = {
      'lat': localStorage.getItem('pindo_system_current_position_lat'),
      'long': localStorage.getItem('pindo_system_current_position_lng'),
      // 'lat': 'null',
      // 'long': 'null',
      // 'lat': '41.1401164',
      // 'long': '-73.28243309999999',
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
    this.searchVal = this.searchfieldVal;
    this.smallloaderVal = false;
    this.pageCount = 1;
    this.doerListing = [];
    this.populateDoer(this.pageCount);
  }

  /**
   * Populates category list
   */
  populateCategoryList() {
    this.commonservice.postHttpCall({ url: '/get-categories', data: {}, contenttype: 'application/json' }).then(result => {
      this.onCategoryPopulateSuccess(result);
    });
  }

  /**
   * Determines whether category populate success on
   * @param response 
   */
  onCategoryPopulateSuccess(response) {
    if (response.status == 1) {
      this.categoryList = response.data;
      if (this.toFireOnceCounter == 0) {
        this.getPinDetails();
      }
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
   * Populates doer
   */
  populateDoer(page) {
    const tosendObj = this.getFilterList();
    // console.log('populate',this.searchVal);
    this.searchVal = $('#searchFieldUnique').val();
    if (this.smallloaderVal) {
      $('#small_loader').show();
    }
    const tempData = { 'page': page, 'limit': this.globalconstant.paginateCount, 'search_text': this.searchVal, 'filterList': tosendObj, 'sortBy': this.selectedSortFilter, 'showFavSoer': this.showFavDoerData, 'slug': this.slug };

    this.filterData.emit({ 'search_text': this.searchVal, 'filterList': this.getFilterList(), 'sortBy': this.selectedSortFilter, 'showFavSoer': this.showFavDoerData, 'slug': this.slug });

    // console.log(JSON.stringify(tempData));
    this.commonservice.filterPopulateDoer(JSON.stringify(tempData));
  }

  /**
   * Clears search text
   * @param elm 
   */
  clearSearchText(elm) {
    elm.value = '';
    $('#searchFieldUnique').val('');
    this.searchfieldVal = '';
    this.searchVal = '';
    this.searchEnabled = false;
    this.cityField = '';
    this.zipField = '';
    // localStorage.setItem('pindo_system_current_position_address', null);
    // localStorage.setItem('pindo_system_current_position_lat', null);
    // localStorage.setItem('pindo_system_current_position_lng', null);
    if (this.currentAddress) {
      $('.getCurrentLocation').trigger('click');
    } else {
      this.submitSelectedFilter();
    }
  }

  /**
   * Clears all selected ADVANCED filters
   */
  async clearAllSelectedFilters() {
    // this.selectedFiltersTogether = [];
    // this.selectedCategoryIds = [];
    // this.selected = [];
    // this.selected.length = 0;
    // this.selectedSubCatsValues = [];

    // this.subCategoryList = [];

    this.pageCount = 1;
    this.cityField = '';
    this.zipField = '';
    $('#cityName').val('');
    $('#zipCode').val('');
    this.currentAddress = false;
    this.showFavDoerData = false;
    // if (this.rateOptnSelectVal) {
    //   this.rateOptnSelectVal = null; // advanced
    //   this.index = '';
    //   this.selectOrDeselectRating(this.index); // advanced
    // }
    // this.deselectEmergency(); // advanced
    // this.deselectMinPinsSelected(); // advanced
    console.log(this.selectedFiltersTogether);

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

    this.populateDoer(1);
    this.populateBadges();
    $('.clearSearchText').trigger('click');
  }

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
    this.index = indexVal;
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
   * Backs clicked
   */
  backClicked() {
    this._location.back();
  }

  /**
   * Shows fav doer
   */
  showFavDoer() {
    this.showFavDoerData = !this.showFavDoerData;
    this.pageCount = 1;
    this.populateDoer(this.pageCount);
  }

  toggleSubCategories() {
    this.showSubCategories = !this.showSubCategories;
  }

}
