import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import {MatSnackBar} from '@angular/material';
import Swal from 'sweetalert2';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-oter-addresses',
  templateUrl: './oter-addresses.component.html',
  styleUrls: ['./oter-addresses.component.scss']
})
export class OterAddressesComponent implements OnInit {
  checked = true;	

  @Input()
  isChildOtherAdressPopulated;

  @ViewChild('popUpVar')
  popupref;

  @ViewChild('updateContInfo')
  updateContInfo;
  

  @Output()	otherAddressListingPopulated = new EventEmitter();

  lat = '';
  lng = '';

  inEditMode = false;
  toEditAddressId:any;
  toEditAddressLat:any;
  toEditAddressLng:any;
  toEditIsPrimary:any;

  contactModel = {
    address: '',
    address2: '',
    addCountry: '',
    addCity: '',
    addState: '',
    addZip: '',
    lat: '',
    lng: ''
  };

  locations = [];	
  options:any = [];
  constructor( public commonservice:CommonService,public renderer: Renderer2, public el: ElementRef, private ref:ChangeDetectorRef, public snackBar: MatSnackBar ) { 
  	this.getLocations();
  }

  ngOnInit() {
  }

  togglePopup() {
  	if (this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement, 'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
  	} else {
  		this.renderer.addClass(this.popupref.nativeElement, 'opened');
  		this.renderer.addClass(document.body, 'popup-open');
  	}
  }

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

        console.log(this.lat,this.lng);


        //this.registerdata['address'] = place.formatted_address;

        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                if(addressType == 'locality'){
                    this.contactModel.addCity = val;
                }

                if(addressType == 'administrative_area_level_1'){
                    this.contactModel.addState = val;
                }

                if(addressType == 'country'){
                    this.contactModel.addCountry = val;
                }

                if(addressType == 'postal_code'){
                    this.contactModel.addZip = val;
                }
            }
        }
        this.contactModel.address = $('input[name="address"]').val();
  }

  getLocations() {
  	this.commonservice.postHttpCall({url:'/pinners/get-all-locations', contenttype:"application/json"}).then(result=>this.getLocationSuccess(result));
  }

  getLocationSuccess(response) {
  	console.log('locations',response);
  	if(response.status == 1) {
  		this.locations = JSON.parse(JSON.stringify(response.data.locations));
  		if(this.locations.length>0){
			this.otherAddressListingPopulated.emit(true); 
		}
		else{
			this.otherAddressListingPopulated.emit(false);
		}
  	}
  }

  updateLocations(setaddressObj,popupState) {
    setaddressObj['location_id'] = this.toEditAddressId;
    setaddressObj['lat'] = this.toEditAddressLat;
    setaddressObj['lng'] = this.toEditAddressLng;
    setaddressObj['is_primary'] = this.toEditIsPrimary;
    console.log(setaddressObj);
    this.commonservice.postHttpCall({url:'/pinners/edit-address', data:setaddressObj, contenttype:"application/json"}).then((result)=>{
      if(result.status==1 && popupState=='closePopup') {        
          this.togglePopup();
      }
      this.updateLocationSuccess(result);
    });    
  }

  updateLocationSuccess(response) {    
    if(response.status == 1) {
      this.getLocations();      
      this.updateContInfo.reset();
      this.updateContInfo.submitted = false;  
      this.inEditMode = false;
      this.toEditAddressId = '';
      this.toEditAddressLat = '';
      this.toEditAddressLng = '';
      this.toEditIsPrimary = '';
    } 
    this.responseMessageSnackBar(response.msg);   
  }

  setLocations(setaddressObj,popupState) {
  	this.commonservice.postHttpCall({url:'/pinners/add-address', data:setaddressObj, contenttype:"application/json"}).then((result)=>{
      if(result.status==1 && popupState=='closePopup') {        
          this.togglePopup();
      }
      this.setLocationSuccess(result);
    });
    
  }

  setLocationSuccess(response) {
    
  	if(response.status == 1) {
  		this.getLocations();      
      this.updateContInfo.reset();
      this.updateContInfo.submitted = false;  
      	
  	}
    this.responseMessageSnackBar(response.msg);
  }

  removeThisAddress(index) {
  	let location_id = this.locations[index].id;
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this address!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.commonservice.postHttpCall({url:'/pinners/remove-address', data : {"location_id":location_id}, contenttype:"application/json"}).then(result=>this.onRemoveSuccess(result));
        } 
    })  	
  }

  editThisAddress(index) {
    console.log(this.locations[index]);
    this.inEditMode = true;
    this.contactModel.address = this.locations[index]['address'] || '';
    this.contactModel.address2 = this.locations[index]['address2'] || '';
    this.contactModel.addCountry = this.locations[index]['country'] || '';
    this.contactModel.addCity = this.locations[index]['city'] || '';
    this.contactModel.addState = this.locations[index]['state'] || '';
    this.contactModel.addZip = this.locations[index]['zipcode'] || '';
    this.toEditAddressId = this.locations[index]['id'] || '';
    this.toEditAddressLng = this.locations[index]['lng'];
    this.toEditAddressLat = this.locations[index]['lat'];
    this.toEditIsPrimary = this.locations[index]['is_primary'];
  }

  onPrimarySelection(index) {
  	let location_id = this.locations[index].id;
  	this.commonservice.postHttpCall({url:'/pinners/mark-as-primary', data : {"location_id":location_id}, contenttype:"application/json"}).then(result=>this.onPrimarySelectionSuccess(result));
  }

  onPrimarySelectionSuccess(response) {
  	this.getLocations();
  	this.responseMessageSnackBar(response.msg);
  }

  onRemoveSuccess(response) {
  	//console.log(response);
  	this.responseMessageSnackBar(response.msg);
  	if(response.status == 1) {
  		this.getLocations();
  		
  	}
  }

  resetForm(frmelm) {
    this.updateContInfo.reset();
    this.updateContInfo.submitted = false;  
    this.inEditMode = false;
    this.toEditAddressId = '';
    this.toEditAddressLat = '';
    this.toEditAddressLng = '';
    this.toEditIsPrimary = '';
    frmelm.submitted = false;
  }

  submitFunction(frmelm,popupState) {
    console.log(popupState);
    frmelm.submitted = true;
    if(frmelm.valid){
      frmelm.value.lat = this.lat.toString();
      frmelm.value.lng = this.lng.toString();	

      console.log(frmelm.value);
      if(!this.inEditMode) {
        this.setLocations(frmelm.value,popupState);
      } else {
        this.updateLocations(frmelm.value,popupState)
      }
      
      //this.commonservice.postHttpCall({url:'/doers/update-contact-details', data:value, contenttype:"application/json"}).then(result=>this.submitSuccess(result));
    }
    
  }

  public responseMessageSnackBar(message,res_class=''){
    this.snackBar.open(message,'', {
        duration: 4000,
        horizontalPosition:'right',       
        panelClass:res_class
    });
  }

}
