import { Component, OnInit, Input, Output, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';
declare var jQuery: any;
declare var $: any;

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'account-setting-location-information',
  templateUrl: './account-setting-location-information.component.html',
  styleUrls: ['./account-setting-location-information.component.scss']
})
export class AccountSettingLocatioInformationComponent implements OnInit {
  @Input() isContactHidden;
  @ViewChild('popUpVar') popupref;
  @Output() profileLocationDetails = new EventEmitter();

  oldContactModel: any = {};
  defaultCountry = 'United States';
  contactModel = {
    address: '',
    address2: '',
    addCountry: 'United States',
    addCity: '',
    addState: '',
    addZip: '',
    range_in_miles: '',
    email: '',
    pnumber: '',
    website: ''
  };

  mapBackup = {
    lat: '',
    lon: '',
    rad: 0,
    slider: 0,
  };

  mapOptions = {
    componentRestrictions: { country: "us" },
  }

  rad = 300;
  lat: any = 0;
  lng: any = 0;
  sliderValue: any = 30;
  max = 100;
  min = 0;
  step = 1;
  value = 0;
  zoomval = 10;
  newobj: any = {};
  afterView = false;
  options: any = [];
  state_list = [];
  initMapCall: boolean = true;

  // address_validation_response = true;
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  markAsPrimaryAddress: any = {};
  latLngResponse: any;
  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z\]') } };
  private bounds: google.maps.LatLngBounds;
  private map: google.maps.Map;

  constructor(public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    private ref: ChangeDetectorRef,
    public myGlobals: Globalconstant,
    public snackBar: MatSnackBar) {
    this.populateListing();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.afterView = true;
    $('#doer-contact').disableAutoFill({
      textToPassword: true,
      passwordFiled: ''
    });
  }

  /**
   * Determines whether map ready on
   * @param map 
   */
  onMapReady(map) {
    this.map = map;
    this.bounds = new google.maps.LatLngBounds();
  }

  onCircleInit(evt) {
  }

  /**
   * Radius change
   * @param evt 
   */
  radiusChange(evt, defaultRadious: any = 0) {

    let radiusVal: any;
    if (defaultRadious) {
      radiusVal = defaultRadious.toFixed(0) * 1609;
    } else {
      radiusVal = evt.target.radius;
      this.sliderValue = (radiusVal.toFixed(0) / 1609).toFixed(0);
    }
    // console.log(this.lat,this.lng,radiusVal);
    // const tempCenter = { lat: this.lat, lng: this.lng };

    const myLatLng = new google.maps.LatLng(this.lat, this.lng);
    const circleOptions = {
      center: myLatLng,
      fillOpacity: 0,
      strokeOpacity: 0,
      map: this.map,
      radius: radiusVal
    };
    // console.log(circleOptions);
    const myCircle = new google.maps.Circle(circleOptions);
    // console.log(myCircle);
    this.map.fitBounds(myCircle.getBounds());

    if (!this.initMapCall) {
      this.increaseMapZoom();      
    }
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.getStateList();
      this.populateListing();
      // console.log(this.lat,"LNG= ", this.lng,this.sliderValue,this.mapBackup.slider);
      this.sliderValue = this.mapBackup.slider;
      if (this.sliderValue) {
        this.radiusChange(this.sliderValue, this.sliderValue);
        this.getChangeVal();
      }
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * Resets function
   * @param frmElm 
   */
  resetFunction(frmElm) {
    frmElm.reset();
    frmElm.submitted = false;
  }

  /**
   * Gets state list
   */
  getStateList() {
    this.commonservice.postHttpCall({ url: '/get-state-list', data: {}, contenttype: 'application/json' }).then(result => this.stateListSuccess(result));
  }

  stateListSuccess(response) {
    this.state_list = response.data;
  }

  /**
   * Submits function
   * @param { value, valid } 
   */
  submitFunction({ value, valid }: { value: any, valid: boolean }) {
    console.log(value);
    // console.log(valid);

    if (valid) {
      value.address = value.address.trim();
      value.address2 = value.address2 ? value.address2.trim() : value.address2;
      value.city = value.city.trim();
      value.zipcode = value.zipcode.trim();

      let finalZipCode: any;
      if (value.zipcode.length == 5 && value.zipcode.substring(0, 1) == '0') {
        finalZipCode = value.zipcode.substring(1, value.zipcode.length);
      } else {
        finalZipCode = value.zipcode;
      }

      let str1: any = '';
      const arr1 = value.address.split(' ');
      for (const item of arr1) {
        str1 = str1 + item + '+';
      }

      let str2: any = '';
      const arr2 = value.city.split(' ');
      for (const item of arr2) {
        str2 = str2 + item + '+';
      }

      const state = this.state_list.find(item => item.state == value.state).state_code + '+';

      const that = this;
      $.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + str1 + str2 + state + finalZipCode + '&key=' + this.myGlobals.google_map_api,
        dataType: 'json',
        async: false,
        success: function (response) {
          if (response.results.length > 0) {
            that.latLngResponse = response;
            if (response.results[0].hasOwnProperty('partial_match') && response.results[0].partial_match == true) {
              that.responseMessageSnackBar('The address provided is invalid', 'error');
            } else {
              that.AddressValidation(response.results[0], valid, value);
            }
          } else {
            that.responseMessageSnackBar('You have provided an invalid address.', 'error');
          }
        }
      });
    }
  }

  /**
   * Submits success
   * @param response 
   */
  submitSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.populateListing();
      let formatted_address = this.markAsPrimaryAddress.address + ' ' + this.markAsPrimaryAddress.city + ', ' + this.markAsPrimaryAddress.state + ' ' + this.markAsPrimaryAddress.zipcode;
      this.commonservice.setHeaderAddress(formatted_address, this.markAsPrimaryAddress.lat, this.markAsPrimaryAddress.lng);
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
      data: {}, contenttype: 'application/json'
    })
      .then(result => this.populateSuccess(result));
  }

  /**
   * Populates success
   * @param response 
   */
  populateSuccess(response) {
    if (response.status == 1) {
      this.newobj = response.data;
      this.contactModel.address = response.data.address;
      this.contactModel.address2 = response.data.address2;
      this.contactModel.addCountry = this.defaultCountry;
      this.contactModel.addCity = response.data.city;
      this.contactModel.addState = response.data.state;
      this.contactModel.addZip = response.data.zipcode;
      this.contactModel.range_in_miles = response.data.range_in_miles;
      this.contactModel.email = response.data.email;
      this.contactModel.pnumber = response.data.mobile_no;
      this.contactModel.website = response.data.website;

      this.lat = response.data.lat;
      this.lng = response.data.lng;
      this.rad = (response.data.range_in_miles * 1609) || 300;
      this.sliderValue = response.data.range_in_miles || 30;

      const tempObj = {
        lat: this.lat,
        lon: this.lng,
        rad: this.rad,
        slider: this.sliderValue
      };
      this.mapBackup = tempObj;
      // $scope.user = angular.copy($scope.leader);
      // this.oldContactModel = angular.copy(this.contactModel);
      this.oldContactModel = Object.assign({}, this.contactModel)
      if (response.data.address && response.data.range_in_miles) {
        this.profileLocationDetails.emit(true);
      } else {
        this.profileLocationDetails.emit(false);
      }

      // this.profileLocationDetails.emit(response.data);
    }
  }

  checkValueUpdateORNot(): boolean {

    if (this.oldContactModel.address != this.contactModel.address
      || this.oldContactModel.address2 != this.contactModel.address2
      || this.oldContactModel.addCountry != this.contactModel.addCountry
      || this.oldContactModel.addCity != this.contactModel.addCity
      || this.oldContactModel.addState != this.contactModel.addState
      || this.oldContactModel.addZip != this.contactModel.addZip
      || this.mapBackup.lat != this.lat
      || this.mapBackup.lon != this.lng
      || this.mapBackup.rad != this.rad
      || this.mapBackup.slider != this.sliderValue
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets change val
   */
  getChangeVal() {
    this.rad = this.sliderValue * 1609;
    if (this.rad == 60) {
      this.zoomval = 7;
    }

    if (this.initMapCall) {
      this.increaseMapZoom();
      this.initMapCall = false;
    }
  }

  /**
   * Address validation
   * @param place 
   * @returns  
   */
  public AddressValidation(place, valid, value) {
    let localityAndNeighborhood = 0;
    const componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      neighborhood: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };
    // const location = place['geometry']['location'];
    this.lat = place.geometry.location.lat;
    this.lng = place.geometry.location.lng;
    let validation_response = true;
    // for (let i = 0; i < place.address_components.length; i++) {
    //   const addressType = place.address_components[i].types[0];
    //   if (componentForm[addressType]) {
    //     const val = place.address_components[i][componentForm[addressType]];
    //     const short_val = place.address_components[i]['short_name'];

    //     if (addressType == 'postal_code') {
    //       if (value.zipcode != val) {
    //         this.responseMessageSnackBar('You have provided an invalid Zip.', 'error');
    //         validation_response = false;
    //         break;
    //       }
    //     }

    //     if (addressType == 'locality') {
    //       if (value.city.toLowerCase() == val.toLowerCase()) {
    //         localityAndNeighborhood = 1;
    //       }
    //     }

    //     if (addressType == 'neighborhood') {
    //       if (value.city.toLowerCase() == val.toLowerCase()) {
    //         localityAndNeighborhood = 1;
    //       }
    //     }

    //     if (addressType == 'administrative_area_level_1') {
    //       if (this.contactModel.addState != val && this.contactModel.addState != short_val) {
    //         this.responseMessageSnackBar('You have provided an invalid state.', 'error');
    //         validation_response = false;
    //         break;
    //       }
    //     }

    //     if (addressType == 'country') {
    //       if (this.defaultCountry != val) {
    //         this.responseMessageSnackBar('You have provided an invalid country.', 'error');
    //         validation_response = false;
    //         break;
    //       }
    //     }

    //   }
    // }

    // if (localityAndNeighborhood == 0) {
    //   this.responseMessageSnackBar('You have provided an invalid city.', 'error');
    //   validation_response = false;
    // }

    if (validation_response) {
      if (valid) {
        value.range_in_miles = this.rad / 1609;
        value.lat = this.latLngResponse.results[0].geometry.location.lat.toString();
        value.lng = this.latLngResponse.results[0].geometry.location.lng.toString();
        value.country = this.defaultCountry;
        value.section_type = 'address';

        this.markAsPrimaryAddress = value;
        this.commonservice.postHttpCall({
          url: '/doers/update-contact-details',
          data: value,
          contenttype: 'application/json'
        })
          .then(result => this.submitSuccess(result));
      }
    }
    return validation_response;
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
          $('#new').trigger('click');
          // this.togglePopup();
        } else {
          // console.log("this.contactModel= ", this.contactModel);
          // console.log("this.oldContactModel= ", this.oldContactModel);
          this.contactModel = this.oldContactModel;
          this.lat = this.mapBackup.lat;
          this.lng = this.mapBackup.lon;
          this.rad = this.mapBackup.rad;
          this.sliderValue = this.mapBackup.slider;
          this.togglePopup();
        }
      });
    } else {
      // console.log("this.contactModel= ", this.contactModel);
      // console.log("this.oldContactModel= ", this.oldContactModel);
      this.contactModel = this.oldContactModel;
      this.lat = this.mapBackup.lat;
      this.lng = this.mapBackup.lon;
      this.rad = this.mapBackup.rad;
      this.sliderValue = this.mapBackup.slider;
      this.togglePopup();
    }
  }

  /**
   * Sets previous data with out saving back time
   */
  // setPreviousDataWithOutSavingBackTime(){
  //   this.contactModel.email= this.oldConactModal.email;
  //   this.contactModel.pnumber= this.oldConactModal.pnumber;
  //   this.contactModel.website = this.oldConactModal.website;
  //   this.togglePopup();
  // }

  /**
   * Checks value update ornot
   * @returns true if value update ornot 
   */

  increaseMapZoom(zoomLevel = 0.5) {
    this.map.setZoom(this.map.getZoom() + zoomLevel);
  }

  handleAddressChange(place) {
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      postal_code: 'short_name'
    };

    let googleStreetAddress = '';
    let googleCity = '';
    let googleState = '';
    let googleZip = '';

    // console.log('place.address_components', place.address_components, place);

    for (var i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];

      if (componentForm[addressType]) {
        let val = place.address_components[i][componentForm[addressType]];

        if (addressType == 'street_number') {
          googleStreetAddress += val + ' ';
        }

        if (addressType == 'route') {
          googleStreetAddress += val;
        }

        if (addressType == 'locality') {
          googleCity = val;
        }

        if (addressType == 'administrative_area_level_1') {
          googleState = val;
        }

        if (addressType == 'postal_code') {
          googleZip = val;
        }
      }
    }

    this.contactModel.address = googleStreetAddress;
    this.contactModel.address2 = '';
    this.contactModel.addCountry = this.defaultCountry;
    this.contactModel.addCity = googleCity;
    this.contactModel.addState = googleState;
    this.contactModel.addZip = googleZip;

    $('#addressLine').val(googleStreetAddress);
  }

}
