import { Component, OnInit, AfterViewInit, Pipe, PipeTransform, ViewEncapsulation, HostListener, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../../commonservice';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ChooseLoginStatus } from './choose-login-status/choose-login-status.component';
import { Globalconstant } from '../../global_constant';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { Subject } from 'rxjs/Subject';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-public-pins',
  templateUrl: './public-pins.component.html',
  styleUrls: ['./public-pins.component.scss']
})
export class PublicPinsComponent implements OnInit {

  pinList = [];
  isMsgExists: any = [];
  pageCount = 1;
  pinLimit = 6;
  totalPinCount: any;
  serviceWaitingResponse: boolean = false;
  footerOffset: any = 0;

  doerAutocomplete = [];
  smallloaderVal: boolean = false;
  mode = 'determinate';
  value = 0;

  selectedPin: any = '';

  populateNewList = true;
  searchText: any = '';
  searchEnabled: boolean = false;

  categoryList = [];
  subCategoryList = [];
  selectedCategoryIds = [];
  selectedCatId: any;

  selectedSubCatsValues = [];

  cityField = '';
  zipField = '';

  sliderValue = 10;
  max = 50;
  min = 0;
  rad = 10;

  currentAddress = false;
  baseUrl: any;
  storeSettimeout: any;
  publicPinTextBox: any = '';

  @ViewChild('pinListElm')
  pinListElm;

  @ViewChild('searchField')
  searchField;

  @ViewChild('pinDetails')
  pinDetails;

  searchTerm$ = new Subject<any>();
  filteredOptions: Object;

  tickOptns: boolean = true;
  stepvalue = 1;
  tickintervelOptns = 10;

  userType: number;

  @HostListener('window:scroll', ['$event'])
  onScrollList(event) {
  	/*const windowHeight = window.outerHeight;
  	let scrollPosition = window.pageYOffset;
  	if (scrollPosition+500 >= this.footerOffset && !this.serviceWaitingResponse) {
  		this.serviceWaitingResponse = true;
  		if(this.pinList.length<this.totalPinCount){
  			this.pageCount = this.pageCount+1;
  			this.smallloaderVal = true;
  	    	this.populatePin();
  	    }
  	    else {
  	    	this.serviceWaitingResponse = false;
  	    	$('#small_loader').hide();
  	    }
  	} else {

  	}	*/
  }

  /*** new search ****/
  displayFn(user?: any): string | undefined {
    return user ? user.text : undefined;
  }
  selectedValSearch(evt) {
    if (this.publicPinTextBox['type'] == 'subcategory') {
      this.selectedSubCatsValues = [];
      this.selectedSubCatsValues.push(this.publicPinTextBox['subcategory']);
    } else if (this.publicPinTextBox['type'] == 'category') {
      this.selectedCategoryIds = [];
      this.selectedCategoryIds.push(this.publicPinTextBox['category']['id']);
    } else { }
    let tosendObj = this.getFilterList();
    // this.searchVal = this.publicPinTextBox['text'];
    let totalSearchVal = this.publicPinTextBox;
    this.pageCount = 1;
    this.smallloaderVal = true;
    this.searchText = totalSearchVal;
    this.populatePin(this.searchText);
  }

  onkeyupSearch(val) {
    $('#mat-spinner').show();
    this.searchTerm$.next(val);
  }
  /*** new search ****/

  getAddLink(addressLink) {
    if (addressLink != null) {
      let tempaddress = addressLink;
      let address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
      return tempaddress;
    }
  }

  /**
   * onScroll of page
   *
  */
  onScroll() {
    if (this.pinList.length < this.totalPinCount) {
      this.pageCount = this.pageCount + 1;
      this.smallloaderVal = true;
      this.populatePin(this.searchText);
    } else {
      this.serviceWaitingResponse = false;
      $('#small_loader').hide();
    }
    //this.populatePin();
  }

  constructor(private router: Router, private route: ActivatedRoute, public commonservice: CommonService, public snackBar: MatSnackBar, public el: ElementRef, private dialog: MatDialog, public globalconstant: Globalconstant) {
    this.baseUrl = globalconstant.uploadUrl;
    this.commonservice.listenDoerSearch().subscribe((m: any) => {
      this.searchText = m.trim();
    });

    this.commonservice.homeSearch(this.searchTerm$, '/autocomplete-for-public-pin-search?search_text=').subscribe((data) => {
      this.filteredOptions = data['data'];
      $('#mat-spinner').hide();
    });

    this.populateCategoryList();
  }

  checkMsg(id) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-is-message-sent',
      data: {
        user_id: id
      }
    }).then(res => {
      this.isMsgExists.push(res.data);
      console.log('********MSGGGGGG***********', this.isMsgExists);
    });
  }

  ngOnInit() {
    // console.log(this.el.nativeElement.querySelector('#small_loader').classList);
    this.userType = +atob(localStorage.getItem('user_type'));

    if (this.searchText != '') {
      console.log(this.searchText);
      this.publicPinTextBox = this.searchText;
      //$(document).find('#searchField').val(this.searchText);
      this.populatePin(this.searchText);
    } else {
      if (this.commonservice.addressHeader != null) {
        localStorage.setItem('pindo_system_current_position_address', this.commonservice.addressHeader['formatted_address']);
        localStorage.setItem('pindo_system_current_position_lat', this.commonservice.headeraddresslat);
        localStorage.setItem('pindo_system_current_position_lng', this.commonservice.headeraddressLng);
        // this.publicPinTextBox = this.commonservice.addressHeader['formatted_address'];
        // this.searchText = this.commonservice.addressHeader['formatted_address'];
        this.currentAddress = true;

      }
      this.populatePin();
    }
    /* this.route.params.subscribe(params => {
      const id = +params['id'];
      console.log(params.pid);
      // this.selectedPin = this.pinList[id].slug;
      this.pinDetails.togglePopup(params.pid);
    }); */
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param searchVal = search by string
   *
  */
  populatePin(searchVal = '') {
    let tosendObj = this.getFilterList();
    if (this.smallloaderVal) {
      $('#small_loader').show();
    }
    this.commonservice.postHttpCall({ url: '/public-pins', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'search_text': searchVal['text'] || '', 'filterList': tosendObj }, contenttype: 'application/json' }, this.smallloaderVal).then((result) => this.populatePinSuccess(result));
  }

  /**
   * populatePin Success function
   *
   * @param response = response from api
   *
  */
  populatePinSuccess(response) {
    if (response.status == 1) {
      //this.pinList.push(response.data.public_pins);
      //this.pinList = response.data.public_pins;
      this.doerAutocomplete = [];
      if (this.pageCount == 1) {
        this.pinList = [];
      }
      this.totalPinCount = response.data.total_items;
      for (let i = 0; i < response.data.public_pins.length; i++) {
        this.pinList.push(response.data.public_pins[i]);
        // this.checkMsg(response.data.public_pins[i].pinner_details.id);
        if (i == response.data.public_pins.length - 1) {
          if (this.smallloaderVal) {
            $('#small_loader').hide();
            this.smallloaderVal = false;
          }
          setTimeout(() => {
            //this.footerOffset = $('footer').offset().top;
            this.serviceWaitingResponse = false;
            //console.log(this.footerOffset);
          }, 1500);
        }
      }
      if (response.data.public_pins.length == 0) {
        $('#small_loader').hide();
      }
      this.route.params.subscribe(params => {
        if (params.pid) {
          this.pinDetails.togglePopup(params.pid);
        } else {
          document.querySelector("body").classList.remove("popup-open");
        }
      });
    }
  }

  /**
   * populateCategoryList (populate pin category list)
   *
  */
  populateCategoryList() {
    this.commonservice.postHttpCall({ url: '/get-categories', data: {}, contenttype: 'application/json' }).then(result => this.onCategoryPopulateSuccess(result));
  }

  /**
   * onCategoryPopulateSuccess (succes function for populateCategoryList())
   *
   * @param response = response from api
  */
  onCategoryPopulateSuccess(response) {
    if (response.status == 1) {
      this.categoryList = response.data;
    }
  }

  /**
   * selectedCategory (on category select)
   *
   * @param indexVal = index of categoryList[]
   * @param evt = event
  */
  selectedCategory(indexVal, evt) {
    this.selectedCatId = this.categoryList[indexVal]['id'];
    this.selectedSubCatsValues = [];
    // this.clearAllSelectedFilters();
    this.populateSubCategory();
    // if(evt.target.checked) {
    //   this.selectedCatId = this.categoryList[indexVal]['id'];
    //   this.populateSubCategory();
    // }
    // else {
    //   let parentCatId = this.categoryList[indexVal]['id'];
    //   let tempIndex:any;
    //   for(let i=0;i<this.selectedCategoryIds.length;i++) {
    //     if(this.selectedCategoryIds[i]==parentCatId) {
    //       tempIndex = i;
    //     }
    //   }
    //   if(this.selectedSubCatsValues.length>0 && this.subCategoryList[tempIndex].length>0) {
    //     console.log('yes');
    //     this.selectedCategoryIds.splice(tempIndex,1);
    //     //this.removeFromarr(parentCatId,this.selectedFiltersTogether);
    //     this.removeFromarr(parentCatId,this.selectedSubCatsValues,'lastArr',tempIndex);
    //   }
    //   else {
    //     this.subCategoryList.splice(tempIndex,1);
    //     this.selectedCategoryIds.splice(tempIndex,1);
    //   }
    // }
  }

  /**
   * removeFromarr (generic method to remove value/values from []'s)
   *
   * @param parentCatId = category Id
   * @param arrName = array names send to remove values from
   * @param arryVal = flag to check if its the last time function is called
   * @param tempIndex = index to remove
  */
  removeFromarr(parentCatId, arrName, arryVal = '', tempIndex: any = '') {
    let tempToremoveIndexes = [];
    let temptotalLength = parseInt(arrName.length) - 1;
    for (let i = 0; i < arrName.length; i++) {
      if (arrName[i]['parent_id'] == parentCatId) {
        let tempSubCatId = arrName[i].id;
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
   * populateSubCategory
   *
  */
  populateSubCategory() {
    this.commonservice.postHttpCall({ url: '/get-sub-categories', data: { 'parent_category_id': this.selectedCatId }, contenttype: 'application/json' }).then(result => this.onSubCategoryPopulateSuccess(result));
  }

  /**
   * Store a newly created resource in storage.
   *
  */
  onSubCategoryPopulateSuccess(response) {
    if (response.status == 1) {
      this.pageCount = 1;
      this.selectedCategoryIds = [];
      this.subCategoryList = [];
      this.subCategoryList.push(response.data);
      this.selectedCategoryIds.push(this.selectedCatId);
      this.selectedCatId = '';
      this.populatePin();
    }
  }

  /**
   * selectedSubCats (on selecting sub categories)
   *
   * @param subcatIndex = subCategoryList[] index to either remove or add
   * @param evt = event
  */
  selectedSubCats(subcatIndex, selectedIndex, evt) {
    //console.log('evt',evt);
    if (evt.target.checked) {
      let tempObj = {
        'subCategoryListIndex': subcatIndex,
        'selectedIndex': selectedIndex,
        'name': this.subCategoryList[subcatIndex][selectedIndex].name,
        'id': this.subCategoryList[subcatIndex][selectedIndex].id,
        'typeofFilter': 'SubCategory',
        'parent_id': this.subCategoryList[subcatIndex][selectedIndex].parent_id
      };
      this.selectedSubCatsValues.push(tempObj);
      //this.selectedFiltersTogether.push(tempObj);
    } else {
      for (let i = 0; i < this.selectedSubCatsValues.length; i++) {
        if (this.selectedSubCatsValues[i]['id'] == this.subCategoryList[subcatIndex][selectedIndex].id) {
          this.selectedSubCatsValues.splice(i, 1);
        }
      }
      /*for(let i=0;i<this.selectedFiltersTogether.length;i++) {
        if(this.selectedFiltersTogether[i]['id'] == this.subCategoryList[subcatIndex][selectedIndex].id) {
          this.selectedFiltersTogether.splice(i,1);
        }
      }*/
    }
  }

  getChangeVal() {
    this.rad = this.sliderValue;
    // console.log(this.rad);
  }

  /**
   * populateString (on click from autocomplete for search by string)
   *
   * @param evt = event
  */
  populateString(evt) {
    $('#searchField').val(evt.target.innerHTML.trim());
    this.doerAutocomplete = [];
    $('.searchIcon').trigger('click');
  }

  /**
   * populateAutocompleteList (on populate autocomplete for string search)
   *
   * @param search_text = search by text value
  */
  populateAutocompleteList(search_text) {
    $('#mat-spinner').show();
    setTimeout(() => {
      this.commonservice.postHttpCall({ url: '/autocomplete-for-public-pin-search', data: { 'search_text': search_text }, contenttype: 'application/json' }, this.smallloaderVal).then((result) => this.populateAutocompletePinSuccess(result));
    }, 500);
  }

  /**
   * populateAutocompletePin Success
   *
   * @param response = response data from api
  */
  populateAutocompletePinSuccess(response) {
    if (response.status == 1) {
      this.doerAutocomplete = response.data;
      $('#mat-spinner').hide();
      this.smallloaderVal = false;
    }
  }

  /**
   * getSearchedPins (keyup event for getting string to search by)
   *
   * @param evt = event
  */
  getSearchedPins(evt) {
    if (evt.key === 'Enter') {
      /*$('#searchField').blur();
      $('.searchIcon').trigger('click');
      this.doerAutocomplete = [];*/
    }
    let total_string = evt.target.value;
    if (total_string.split('').length > 1) {
      console.log('if');
      this.searchEnabled = true;
      this.smallloaderVal = true;
      if (this.storeSettimeout != '') {
        clearTimeout(this.storeSettimeout);
      }

      this.storeSettimeout = setTimeout(() => {
        this.populateAutocompleteList(total_string);
      }, 500);
    } else {
      console.log('else');
      this.searchEnabled = false;
      if (this.storeSettimeout != '') {
        clearTimeout(this.storeSettimeout);
      }
      this.doerAutocomplete = [];
    }
  }

  /**
   * searchPin
   *
  */
  searchPin() {
    let totalSearchVal = this.publicPinTextBox['text'];
    this.pageCount = 1;
    this.smallloaderVal = true;
    this.searchText = totalSearchVal;
    this.populatePin(this.searchText);
  }

  /**
   * openDialog open dialog of angular material
   *
   * @param indexVal = doer Id
   *
  */
  openDialog(indexVal, slug = '') {
    //console.log('asdasd',indexVal);
    if (slug != '') {
      localStorage.setItem('slug', slug);
    }
    this.dialog.open(ChooseLoginStatus, {
      width: '650px',
      disableClose: false,
      data: indexVal
    }).afterClosed().subscribe(res => {
      this.populatePin();
    });
  }

  /**
   * toggleChildPopup open dialog of angular material
   *
   * @param indexVal = index to search by in pinList[]
   *
  */
  toggleChildPopup(indexVal) {
    this.selectedPin = this.pinList[indexVal].slug;
    this.pinDetails.togglePopup(this.selectedPin);
    // console.log(window);
    // localStorage.setItem('X-cord', window.screenX as unknown as string);
    // localStorage.setItem('Y-cord', window.screenY as unknown as string);
  }

  /**
   * clearSearchText clear search field
   *
   * @param elm = search input field reference
   *
  */
  clearSearchText() {
    this.publicPinTextBox = '';
    this.searchEnabled = false;
    this.searchPin();
  }


  clearAuotcomplete() {

  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  /**getLoginStatus
   * formatLabel
   *
   * @param elm = search input field reference
   *
  */
  getLoginStatus() {
    if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '2') {
      //this.router.navigate(['/doer/apply-pins/'+Pin_id_slug]);
      return 2;
    } else if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '1') {
      return 1;
    } else {
      //this.openDialog(Pin_id_slug);
      return 0;
    }
  }

  getFilterList() {
    let finalObjtoSend = {
      'lat': localStorage.getItem('pindo_system_current_position_lat') || 'null',
      'long': localStorage.getItem('pindo_system_current_position_lng') || 'null',
      // 'lat': 'undefined',
      // 'long': 'undefined',
      'city': this.cityField,
      'zipCode': this.zipField,
      'selectedCategoryIds': this.selectedCategoryIds,
      'selectedSubCatsValues': this.selectedSubCatsValues,
      'miles': this.rad
    };
    return finalObjtoSend;
  }

  submitSelectedFilter() {
    let tempsearchVal = this.publicPinTextBox || '';
    this.smallloaderVal = false;
    this.pageCount = 1;
    this.pinList = [];
    this.populatePin(tempsearchVal);
  }

  clearAllSelectedFilters() {
    this.selectedCategoryIds = [];
    this.selectedSubCatsValues = [];
    this.subCategoryList = [];
    this.pageCount = 1;
    this.cityField = '';
    this.zipField = '';
    this.sliderValue = 10;
    this.rad = 10;
    $('#cityName').val('');
    $('#zipCode').val('');
    localStorage.setItem('pindo_system_current_position_address', null);
    localStorage.setItem('pindo_system_current_position_lat', null);
    localStorage.setItem('pindo_system_current_position_lng', null);
    $('.clearSearchText').trigger('click');
    this.currentAddress = false;
    this.populateCategoryList();
    this.populatePin();

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
      localStorage.setItem('pindo_system_current_position_lat', null);
      localStorage.setItem('pindo_system_current_position_lng', null);
      localStorage.setItem('pindo_system_current_position_address', null);
      this.searchEnabled = false;
      $('.clearSearchText').trigger('click');
      //$('.searchIcon').trigger('click');
    }
  }

  goToChat(pinner_id, pin_id) {

    var pub_pinner_id = pinner_id;
    var pub_pin_id = pin_id;
    var pub_doer_id = atob(localStorage.getItem('frontend_user_id'));

    var postData = {
      'pub_pinner_id': pub_pinner_id,
      'pub_doer_id': pub_doer_id,
      'pub_pin_id': pub_pin_id
    };

    this.globalconstant.notificationSocket.emit('save-log-last-message-data', postData);
    this.globalconstant.notificationSocket.on('get-log-last-message-data', (res) => {
      localStorage.setItem('pinner_id_again', btoa(pinner_id));
      this.router.navigate(['/doer/chat']);
    });
  }
}
