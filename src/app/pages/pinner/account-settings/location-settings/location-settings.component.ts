import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, Renderer2, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Validators, FormGroup } from '@angular/forms';
import { Globalconstant } from 'src/app/global_constant';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'location-settings',
  templateUrl: './location-settings.component.html',
  styleUrls: ['./location-settings.component.scss']
})
export class LocationSettingsComponent implements OnInit {
  @ViewChild('myForm') formValues;
  @ViewChild('popUpVar') popupref;
  @Output() accountSettingDetailsPopulate = new EventEmitter();

  locationChangeOrUpdateForm: FormGroup;
  stateList: any = [];
  locationDetails: any = {};
  updateOrAddBtn: string = 'Save';
  filteredStates: Observable<any[]>;

  mapOptions = {
    componentRestrictions: { country: "us" },
  }

  constructor(private fb: FormBuilder,
    public commonservice: CommonService,
    public renderer: Renderer2,
    private myGlobals: Globalconstant,
    public snackBar: MatSnackBar) {

    this.locationChangeOrUpdateForm = this.fb.group({
      address: ['', [Validators.required]],
      address2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      // country: ['', [Validators.required]],
      is_primary: [''],
    });

  }

  ngOnInit() { }
  ngAfterViewInit() { }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.formValues.resetForm();
      this.getStateList();
      this.locationDetails = {};
      if (localStorage.getItem('updateLocationDetails') != null && localStorage.getItem('updateLocationDetails') != '') {
        this.locationDetails = JSON.parse(localStorage.getItem('updateLocationDetails'));
        localStorage.removeItem('updateLocationDetails');
        setTimeout(() => {
          this.locationChangeOrUpdateForm.patchValue({
            address: this.locationDetails.address,
            address2: this.locationDetails.address2,
            city: this.locationDetails.city,
            state: this.locationDetails.state,
            zipcode: this.locationDetails.zipcode,
            is_primary: this.locationDetails.is_primary,
          });
        }, 500);
        this.updateOrAddBtn = 'Update';
      } else {
        this.updateOrAddBtn = 'Save';
      }
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
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
   * Gets add edit location controller
   */
  get addEditLocationController() { return this.locationChangeOrUpdateForm.controls; }

  /**
   * Gets state list
   */
  getStateList() {
    this.commonservice.postHttpCall({ url: '/get-state-list', data: {}, contenttype: 'application/json' })
      .then(result => {
        if (result.status == 1) {
          this.stateList = result.data;
        }
      });
  }

  /**
   * Adds or edit location
   * @returns  
   */
  addOrEditLocation() {
    if (this.locationChangeOrUpdateForm.invalid) {
      return;
    } else {
      this.locationChangeOrUpdateForm.patchValue({
        address: this.locationChangeOrUpdateForm.get('address').value.trim(),
        city: this.locationChangeOrUpdateForm.get('city').value.trim(),
        zipcode: this.locationChangeOrUpdateForm.get('zipcode').value.trim(),
      });
      if (this.locationChangeOrUpdateForm.get('address').value == '' || this.locationChangeOrUpdateForm.get('city').value == '' || this.locationChangeOrUpdateForm.get('zipcode').value == '') {
        return;
      } else {
        let finalZipCode: any;
        if (this.locationChangeOrUpdateForm.get('zipcode').value.length == 5 && this.locationChangeOrUpdateForm.get('zipcode').value.substring(0, 1) == '0') {
          finalZipCode = this.locationChangeOrUpdateForm.get('zipcode').value.substring(1, this.locationChangeOrUpdateForm.get('zipcode').value.length);
        } else {
          finalZipCode = this.locationChangeOrUpdateForm.get('zipcode').value;
        }

        let str1: any = '';
        const arr1 = this.locationChangeOrUpdateForm.get('address').value.trim().split(' ');
        for (const item of arr1) {
          str1 = str1 + item + '+';
        }

        let str2: any = '';
        const arr2 = this.locationChangeOrUpdateForm.get('city').value.trim().split(' ');
        for (const item of arr2) {
          str2 = str2 + item + '+';
        }

        this.checkValidAddressOrNot(str1 + str2 + this.locationChangeOrUpdateForm.get('state').value.trim() + '+' + finalZipCode);
        // this.checkValidAddressOrNot(this.locationChangeOrUpdateForm.get('state').value.trim() + '+' + this.locationChangeOrUpdateForm.get('zipcode').value.trim());
      }
    }
  }

  /**
   * Checks valid address or not
   * @param search_adddress 
   */
  checkValidAddressOrNot(search_adddress) {
    let that = this;
    $.ajax({
      type: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + search_adddress + '&key=' + this.myGlobals.google_map_api,
      dataType: 'json',
      async: false,
      success: function (response) {
        if (response.results.length > 0) {
          if (response.results[0].hasOwnProperty('partial_match') && response.results[0].partial_match == true) {
            that.responseMessageSnackBar('The address provided is invalid', 'error');
          } else {
            that.addressValidation(response.results[0]);
          }
        } else {
          that.responseMessageSnackBar('The address provided is invalid', 'error');
        }
      }
    });
  }

  /**
   * Address validation
   * @param place 
   * @returns  
   */
  private addressValidation(place) {
    let validated_value: Boolean = true;
    let localityAndNeighborhood = 0;
    let componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      neighborhood: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    // for (let i = 0; i < place.address_components.length; i++) {
    //   let addressType = place.address_components[i].types[0];
    //   if (componentForm[addressType]) {
    //     let val = place.address_components[i][componentForm[addressType]];
    //     let short_val = place.address_components[i]['short_name'];

    //     if (addressType == 'locality') {
    //       if (this.locationChangeOrUpdateForm.get('city').value.trim().toLowerCase() == val.toLowerCase()) {
    //         localityAndNeighborhood = 1;
    //       }
    //     }

    //     if (addressType == 'neighborhood') {
    //       if (this.locationChangeOrUpdateForm.get('city').value.trim().toLowerCase() == val.toLowerCase()) {
    //         localityAndNeighborhood = 1;
    //       }
    //     }

    //     if (addressType == 'administrative_area_level_1') {
    //       if (this.locationChangeOrUpdateForm.get('state').value != val && this.locationChangeOrUpdateForm.get('state').value != short_val) {
    //         this.responseMessageSnackBar('You have provided an invalid state.', 'error');
    //         validated_value = false;
    //       }
    //     }
    //     if (addressType == 'country') {
    //       if ('United States' != val) {
    //         this.responseMessageSnackBar('You have provided an invalid country.', 'error');
    //         validated_value = false;
    //       }
    //     }

    //     if (addressType == 'postal_code') {
    //       if (this.locationChangeOrUpdateForm.get('zipcode').value.trim() != val) {
    //         this.responseMessageSnackBar('You have provided an invalid zip code.', 'error');
    //         validated_value = false;
    //       }
    //     }
    //   }
    // }

    // if (localityAndNeighborhood == 0) {
    //   this.responseMessageSnackBar('You have provided an invalid city.', 'error');
    //   validated_value = false;
    // }

    if (validated_value) {
      let tempLocationDetails = {
        address: this.locationChangeOrUpdateForm.get('address').value.trim(),
        address2: this.locationChangeOrUpdateForm.get('address2').value,
        country: 'United States',
        city: this.locationChangeOrUpdateForm.get('city').value.trim(),
        state: this.locationChangeOrUpdateForm.get('state').value,
        zipcode: this.locationChangeOrUpdateForm.get('zipcode').value.trim(),
        lng: place.geometry.location.lng.toString(),
        lat: place.geometry.location.lat.toString(),
        is_primary: this.locationChangeOrUpdateForm.get('is_primary').value
      }
      this.uploadOrEditLocationDetails(tempLocationDetails);
    }
    return validated_value;

  }

  /**
   * Uploads or edit location details
   * @param locationDetails 
   */
  uploadOrEditLocationDetails(locationDetails) {
    locationDetails.is_primary = locationDetails.is_primary ? 1 : 0;
    let url = this.updateOrAddBtn == 'Update' ? '/pinners/edit-address' : '/pinners/add-address';
    if (this.updateOrAddBtn == 'Update') {
      locationDetails.location_id = this.locationDetails.id;
    }
    this.commonservice.postHttpCall({
      url: url,
      data: locationDetails,
      contenttype: 'application/json'
    })
      .then((result) => {
        if (result.status == 1) {
          this.accountSettingDetailsPopulate.emit(true);
          if (locationDetails.is_primary) {
            let formatted_address = locationDetails.address + ' ' + locationDetails.city + ', ' + locationDetails.state + ' ' + locationDetails.zipcode;
            this.commonservice.setHeaderAddress(formatted_address, locationDetails.lat, locationDetails.lng);
          }
          this.responseMessageSnackBar(result.msg);
          this.togglePopup();
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
 * Closes modal
 */
  closeModal() {
    if (this.checkValueUpdateORNot() && this.updateOrAddBtn == 'Update') {
      Swal({
        title: this.myGlobals.updateDataBackAlertMsg,
        text: '',
        //type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'YES',
        cancelButtonText: 'BACK',
      }).then((resultswal) => {
        if (resultswal.value) {
          this.togglePopup();
        }
      })
    } else {
      this.togglePopup();
    }
  }

  /**
 * Checks value update ornot
 * @returns true if value update ornot 
 */
  checkValueUpdateORNot(): boolean {
    if (this.locationDetails.address != this.locationChangeOrUpdateForm.get('address').value
      || this.locationDetails.address2 != this.locationChangeOrUpdateForm.get('address2').value
      || this.locationDetails.city != this.locationChangeOrUpdateForm.get('city').value
      || this.locationDetails.state != this.locationChangeOrUpdateForm.get('state').value
      || this.locationDetails.zipcode != this.locationChangeOrUpdateForm.get('zipcode').value
      || this.locationDetails.is_primary != this.locationChangeOrUpdateForm.get('is_primary').value) {
      return true;
    }
    else {
      return false;
    }
  }

  handleAddressChange(place) {
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
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

    this.locationChangeOrUpdateForm.patchValue({
      address: googleStreetAddress,
      address2: '',
      city: googleCity,
      state: googleState,
      zipcode: googleZip
    });
  }

}
