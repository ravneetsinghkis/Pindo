import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-doer-contact-information',
  templateUrl: './doer-contact-information.component.html',
  styleUrls: ['./doer-contact-information.component.css']
})
export class DoerContactInformationComponent implements OnInit {
  @Input()
  isContactHidden;

  @ViewChild('popUpVar')
  popupref;


  state_list: any = [];
  contactModel = {
    address: '',
    address2: '',
    addCountry: 'United States',
    addCity: '',
    addState: '',
    addZip: '',
    email: '',
    pnumber: '',
    website: ''
  };

  rad = 300;
  lat: any = 0;
  lng: any = 0;
  sliderValue: any = 0;
  max = 100;
  min = 0;
  step = 1;
  value = 0;
  zoomval = 10;
  newobj: any = {};
  afterView = false;
  options: any = [];
  address_validation_response = true;
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
  public registerdata = {};
  latLngResponse: any;
  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z\]') } };
  private bounds: google.maps.LatLngBounds;
  private map: google.maps.Map;
  //private gcircle: google.maps.Map.Circle;

  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public myGlobals: Globalconstant, private ref: ChangeDetectorRef, public snackBar: MatSnackBar) {
    this.populateListing();
  }

  ngOnInit() {
    this.registerdata = {
      user_type: 1,
      first_name: '',
      last_name: '',
      screen_name: '',
      email: '',
      address: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      password: '',
      con_password: '',
      website: '',
      lat: '',
      lng: '',
    }

    this.getStateList();
  }
  ngAfterViewInit() {
    //this.getLocation();
    this.afterView = true;

    //$('#doer-contact').disableAutoFill();
    $('#doer-contact').disableAutoFill({

      textToPassword: true,

      passwordFiled: ''

    });


  }


  /**
   * Gets state list
   */
  getStateList() {
    this.commonservice.postHttpCall({ url: '/get-state-list', data: {}, contenttype: "application/json" }).then(result => this.stateListSuccess(result));
  }

  /**
   * States list success
   * @param response 
   */
  stateListSuccess(response) {
    console.log('response', response);
    this.state_list = response.data;
  }


  /**
   * Determines whether map ready on
   * @param map 
   */
  onMapReady(map) {
    this.map = map;
    this.bounds = new google.maps.LatLngBounds();
    console.log('asdasdasd', this.map, this.bounds);
  }

  /**
   * Determines whether circle init on
   * @param evt 
   */
  onCircleInit(evt) {
    console.log('circle', evt);
  }

  /**
   * Radius change
   * @param evt 
   */
  radiusChange(evt) {
    let tempCenter = { lat: this.lat, lng: this.lng }
    const radiusVal = evt.target.radius;
    console.log((radiusVal.toFixed(0) / 1609).toFixed(0));
    this.sliderValue = (radiusVal.toFixed(0) / 1609).toFixed(0);

    let myLatLng = new google.maps.LatLng(this.lat, this.lng);
    let circleOptions = {
      center: myLatLng,
      fillOpacity: 0,
      strokeOpacity: 0,
      map: this.map,
      radius: radiusVal
    }
    let myCircle = new google.maps.Circle(circleOptions);
    this.map.fitBounds(myCircle.getBounds());
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
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
   * Getfulladdress using zipcode
   */
  getfulladdressUsingZipcode() {
    console.log('this.contactModel.addZip', this.contactModel.addZip);
    let srch_adddress = this.contactModel.addZip;
    let latLngUsingAddressCompleted = 0;
    let that = this;
    if (srch_adddress.length > 3) {
      $.ajax({
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + srch_adddress + '&key='+this.myGlobals.google_map_api,
        dataType: 'json',
        async: false,
        success: function (response) {
          console.log('response', response);
          that.latLngResponse = response;
          console.log('that.latLngResponse', that.latLngResponse);
          console.log('response', response.results[0].geometry.location.lat);
          latLngUsingAddressCompleted = 1;
          that.address_validation_response = that.AddressValidation(response.results[0]);
        }

      });
    }

  }

  /**
   * Submits function
   * @param { value, valid } 
   */
  submitFunction({ value, valid }: { value: any, valid: boolean }) {
    console.log(valid, value);
    console.log('this.latLngResponse', this.latLngResponse);
    let srch_adddress = value.zipcode;
    let latLngUsingAddressCompleted = 0;
    let that = this;
    $.ajax({
      type: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + srch_adddress + '&key='+this.myGlobals.google_map_api,
      dataType: 'json',
      async: false,
      success: function (response) {
        console.log('response', response);
        that.latLngResponse = response;
        console.log('response', response.results[0].geometry.location.lat);
        latLngUsingAddressCompleted = 1;
        that.address_validation_response = that.AddressValidation(response.results[0]);
      }

    });

    //this.address_validation_response = this.AddressValidation(this.latLngResponse.results[0]);
    value.lat = this.lat;
    value.lng = this.lng;
    value.range_in_miles = this.rad / 1609;
    console.log(valid, value);
    //if(value.lat=="")
    {
      value.lat = this.latLngResponse.results[0].geometry.location.lat.toString();
      //value.lat = this.lat;

    }

    //if(value.lng=="")
    {
      value.lng = this.latLngResponse.results[0].geometry.location.lng.toString();
      //value.lng = this.lng;
    }

    if (valid && this.address_validation_response) {
      this.markAsPrimaryAddress = value;
      this.commonservice.postHttpCall({ url: '/doers/update-contact-details', data: value, contenttype: "application/json" }).then(result => this.submitSuccess(result));
    }

  }

  /**
   * Submits success
   * @param response 
   */
  submitSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      this.populateListing();
      let formatted_address = this.markAsPrimaryAddress.address + ' ' + this.markAsPrimaryAddress.city + ', ' + this.markAsPrimaryAddress.state + ' ' + this.markAsPrimaryAddress.zipcode;
      this.commonservice.setHeaderAddress(formatted_address, this.markAsPrimaryAddress.lat, this.markAsPrimaryAddress.lng);
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }


  /**
   * Populates listing
   */
  populateListing() {
    this.commonservice.postHttpCall({ url: '/doers/get-contact-details', data: {}, contenttype: "application/json" }).then(result => this.populateSuccess(result));
  }

  /**
   * Populates success
   * @param response 
   */
  populateSuccess(response) {
    console.log(response);
    if (response.status == 1) {
      this.newobj = response.data;
      this.contactModel.address = response.data.address;
      this.contactModel.address2 = response.data.address2;
      //this.contactModel.addCountry= response.data.country;
      this.contactModel.addCity = response.data.city;
      this.contactModel.addState = response.data.state;
      this.contactModel.addZip = response.data.zipcode;
      this.contactModel.email = response.data.email;
      this.contactModel.pnumber = response.data.mobile_no;
      this.lat = response.data.lat;
      this.lng = response.data.lng;
      this.rad = (response.data.range_in_miles * 1609) || 0;
      this.sliderValue = response.data.range_in_miles || 0;
      console.log(this.rad);
      this.contactModel.website = response.data.website;

    }
  }

  /**
   * Gets change val
   */
  getChangeVal() {
    //console.log(this.sliderValue);
    this.rad = this.sliderValue * 1609;
    if (this.rad == 60) {
      this.zoomval = 7;
    }
  }

  /**
   * Address validation
   * @param place 
   * @returns  
   */
  public AddressValidation(place) {
    console.log(place);

    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    var location = place['geometry']['location'];



    this.lat = place.geometry.location.lat;
    this.lng = place.geometry.location.lng;

    console.log(this.lat, this.lng);
    let validation_response = true;
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      console.log('addressType', addressType);
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        var short_val = place.address_components[i]['short_name'];
        console.log('val', val);
        console.log('short_val', short_val);
        if (addressType == 'locality') {
          if (this.contactModel.addCity != val) {
            this.responseMessageSnackBar('You have provided an invalid address.', 'error');
            validation_response = false;
            break;
          }
        }

        if (addressType == 'administrative_area_level_1') {
          if (this.contactModel.addState != val && this.contactModel.addState != short_val) {
            this.responseMessageSnackBar('You have provided an invalid address.', 'error');
            validation_response = false;
            break;
          }
        }

        if (addressType == 'country') {
          if (this.contactModel.addCountry != val) {
            this.responseMessageSnackBar('You have provided an invalid address.', 'error');
            validation_response = false;
            break;
          }
        }

        if (addressType == 'postal_code') {
          this.contactModel.addZip = val;
        }
      }
    }
    return validation_response;
  }


  /**
   * Handles address change
   * @param place 
   */
  public handleAddressChange(place) {
    console.log(place);

    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    var location = place['geometry']['location'];



    this.lat = place.geometry.location.lat();
    this.lng = place.geometry.location.lng();

    console.log(this.lat, this.lng);


    this.registerdata['address'] = place.formatted_address;

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      console.log('addressType', addressType);
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        console.log('val', val);
        if (addressType == 'locality') {
          this.contactModel.addCity = val;
        }

        if (addressType == 'administrative_area_level_1') {
          this.contactModel.addState = val;
        }

        if (addressType == 'country') {
          this.contactModel.addCountry = val;
        }

        if (addressType == 'postal_code') {
          this.contactModel.addZip = val;
        }
      }
    }
    this.contactModel.address = $('input[name="address"]').val();
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

}
