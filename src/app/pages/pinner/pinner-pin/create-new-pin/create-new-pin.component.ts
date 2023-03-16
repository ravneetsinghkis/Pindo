import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Validators } from "@angular/forms";
import { FieldConfig } from "../../../../field.interface";
import { DynamicFormComponent } from "./components/dynamic-form/dynamic-form.component";
import { CommonService }      from '../../../../commonservice';
import { MatSnackBar} from "@angular/material";
import { Globalconstant } from "src/app/global_constant";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-new-pin',
  templateUrl: './create-new-pin.component.html',
  styleUrls: ['./create-new-pin.component.scss']
})
export class CreateNewPinComponent implements OnInit {

  @ViewChild(DynamicFormComponent) form: any;
  regConfig: any = [];

  staticData = [];
  subcatid:any;
  parent_cat_id:any;

  inEditMode = false;

  parent_categories = [];
  sub_categories = [];
  selectCatModel:any = null;
  selectSubcatModel:any = null;

  tempcount = 0;
  slug:any = '';
  paymentsettingsStatus:any;
  toInviteDoersList:any = null;
  address_validation_response:any = true;
  latLngResponse:any;
  address_to_validate:any = {};
  lat:any;
  lng:any;
  //regConfig: FieldConfig[] = [];

  constructor(public commonservice:CommonService,public snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute, public myGlobals: Globalconstant) {
    this.route.params.subscribe(params => {
      this.slug = params['slug'];
      console.log('slug',params['slug']);
      
    });
  }

  ngOnInit() {
    this.getParentCatList();
    console.log('loaded');
    if(this.slug!='') {
      //this.form = DynamicFormComponent;
      this.getPinDetails();      
    }    

    //this.getFormFields();
    
    //this.editFormFields();
  }

  ngOnDestroy() {
    if(localStorage.getItem('inviteDoerList')) {
      localStorage.removeItem('inviteDoerList');
    }
    if(localStorage.getItem('selectedCategoryFilter')) {
      localStorage.removeItem('selectedCategoryFilter');
    }
    if(localStorage.getItem('selectedSubCategoryFilter')) {
      localStorage.removeItem('selectedSubCategoryFilter');
    }
  }

  getPinDetails() {
    this.commonservice.postHttpCall({url:'/pinners/pin-details', data:{'slug':this.slug}, contenttype:"application/json"})
    .then(result=>this.detailsSuccess(result));
  }

  detailsSuccess(response){
    if(response.status == 1) {
      this.getParentCatList();
      this.subcatid = response.data['child_category_id'];
      this.parent_cat_id = response.data['parent_category_id'];
      this.inEditMode = true;
      this.staticData = response.data;
      this.regConfig = [];
      this.form = DynamicFormComponent;
      this.regConfig = JSON.parse(response.data['dynamicForm']);      
      // this.regConfig = temparr;
    }
  }

  /* Get parent category list service */
  getParentCatList() {
    this.commonservice.postHttpCall({url:'/pinners/category-list', data:{}, contenttype:"application/json"})
    .then(result=>this.parentCategorySuccess(result));
  }

  parentCategorySuccess(response){
    if(response.status == 1){
      this.parent_categories = response.data;
      this.paymentsettingsStatus = response.added_card_for_payment;
      this.selectCatModel = (this.commonservice.selectedCategoryFromHomepage) ? this.commonservice.selectedCategoryFromHomepage : null;
      if(localStorage.getItem('selectedCategoryFilter')) {
        let tempCat = JSON.parse(localStorage.getItem('selectedCategoryFilter'));        
        this.selectCatModel = tempCat[0];
      }      
      if(this.selectCatModel) {
        this.getSubCatList(); 
      }
      this.commonservice.selectedCategoryFromHomepage = null;
      if(this.parent_cat_id!=undefined) {
        //this.form.controls['parentcat'].patchValue(this.parent_cat_id);
        this.selectCatModel = this.parent_cat_id;
        this.getSubCatList();     
      }     
    }
  }

  getSubCatList() {  
    if(!this.inEditMode) {
      this.regConfig = [];      
      this.form = DynamicFormComponent;
    }
    this.commonservice.postHttpCall({url:'/pinners/get-sub-cat-list', data:{'parent_category_id':this.selectCatModel}, 
    contenttype:"application/json"})
    .then(result=>this.subCatListSuccess(result));
  }

  subCatListSuccess(response){
    if(response.status == 1){     
      this.sub_categories = response.data; 
      //console.log(this.seletedSubCatId);
      if(localStorage.getItem('selectedSubCategoryFilter')) {
        let tempSubCat = JSON.parse(localStorage.getItem('selectedSubCategoryFilter'));        
        this.selectSubcatModel = tempSubCat[0]['id'];
        this.getFormFields();
      }
      if(this.subcatid!=undefined) {
        //this.form.controls['sub_cat_id'].setValue(this.subcatid)    
        this.selectSubcatModel = this.subcatid;
      }      
    }
  }

  submit(value: any) {
    console.log(value['dynamicForm']);    
    let tempObj = [...this.regConfig]; 
    for(let key in tempObj) {
      console.log(key);
      for(let forvalKey in value['dynamicForm']) {
        console.log(forvalKey);
        if(tempObj[key]['name'] === forvalKey) {
          if(tempObj[key]['type'] == 'checkbox') {
            const allCheckBoxOprns = value['dynamicForm'][forvalKey]['options'];
            for(let index in allCheckBoxOprns) {
              if(allCheckBoxOprns[index]) {
                tempObj[key]['values'][index]['selected'] = allCheckBoxOprns[index];
              } else {
                if(tempObj[key]['values'][index]['selected']) {
                  delete tempObj[key]['values'][index]['selected'];
                }
              }
            }
            tempObj[key]['value'] = value['dynamicForm'][forvalKey]['options'];
          } else if((tempObj[key]['type'] == 'radiobutton') || (tempObj[key]['type'] == 'select')) {
            tempObj[key]['value'] = value['dynamicForm'][forvalKey];
            const radioOrSelectValues = tempObj[key]['values'];
            for(let index in radioOrSelectValues) {
              if(radioOrSelectValues[index]['value'] == tempObj[key]['value']) {
                tempObj[key]['values'][index]['selected'] = true;
              } else {
                if(radioOrSelectValues[index]['selected']) {
                  delete tempObj[key]['values'][index]['selected'];
                }
              }
            }
          } else {
            tempObj[key]['value'] = value['dynamicForm'][forvalKey];
          }
          break;          
        }
      }
    }
    //console.log(tempObj);
    value['dynamicForm'] = tempObj;
    value['parentcat'] = this.selectCatModel;
    value['sub_cat_id'] = this.selectSubcatModel;
    console.log(value);
    if(value.staticForm.hasOwnProperty("newAddress")){
      this.address_to_validate = value.staticForm.newAddress;
      let srch_adddress = value.staticForm.newAddress.zipcode;
      let latLngUsingAddressCompleted = 0;
      let that = this;
      $.ajax({
        type:'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+srch_adddress+'&key='+this.myGlobals.google_map_api,
        dataType:'json',
        async:false,
        success:function(response){
          console.log('response',response);
          that.latLngResponse = response;
          console.log('response',response.results[0].geometry.location.lat);
          latLngUsingAddressCompleted = 1;
          that.address_validation_response = that.AddressValidation(response.results[0]);
        }

      });
    }
    
    console.log('this.address_validation_response',this.address_validation_response);
    if(this.address_validation_response){
      if(!this.inEditMode) {
        this.toInviteDoersList = JSON.parse(localStorage.getItem('inviteDoerList')) || null;
        value['toInviteDoersList'] = this.toInviteDoersList;      
        this.createNewPin(value);
      } else {
        this.updateNewPin(value);
      }
    }
    
  }  

  createNewPin(dataToSend) { 
       
    this.commonservice.postHttpCall({url:'/pinners/add-new-pin',data: dataToSend, contenttype:"application/json"}).then(result=>this.createNewPinSuccess(result));
  }

  createNewPinSuccess(response) {
    if(response.status == 1) {
      if(response.primary_address){
        this.commonservice.setHeaderAddress(response.primary_address.address,response.primary_address.lat,response.primary_address.lng);
      }
      
      this.responseMessageSnackBar(response.msg); 
      // this.router.navigate(['/pinner/invite-doer/'+response.pin_id]);
      if(localStorage.getItem('inviteDoerList')) {
        localStorage.removeItem('inviteDoerList');
        let tempEncryptedPinId = btoa(response.pin_no);
        this.router.navigate([`/pinner/active-quotations/${tempEncryptedPinId}`]);        
        // this.router.navigate(['/pinner/dashboard']);
      } else {
        this.router.navigate(['/pinner/invite-doer/'+response.pin_id]);
      }
    }
  }

  updateNewPin(dataToSend) { 
    console.log(dataToSend);
    // dataToSend['pin_id'] = 7; 
    this.commonservice.postHttpCall({url:'/pinners/update-new-pin',data: dataToSend, contenttype:"application/json"}).then(result=>this.updateNewPinSuccess(result));
  }

  updateNewPinSuccess(response) {
    if(response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      this.router.navigate(['/pinner/invite-doer/'+response.pin_id]);
    }
  }

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

    console.log(this.lat,this.lng);
    let validation_response = true;
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        console.log('addressType',addressType);
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            var short_val = place.address_components[i]['short_name'];
            console.log('val',val);
            console.log('short_val',short_val);
            if(addressType == 'locality'){
              if(this.address_to_validate.city != val){
                this.responseMessageSnackBar('You have provided an invalid address.','error');
                validation_response = false;
                break;
              }   
            }

            if(addressType == 'administrative_area_level_1'){
              if(this.address_to_validate.state != val && this.address_to_validate.state != short_val){
                this.responseMessageSnackBar('You have provided an invalid address.','error');
                validation_response = false;
                break;
              }
            }

            if(addressType == 'country'){
              if(this.address_to_validate.country != val){
                this.responseMessageSnackBar('You have provided an invalid address.','error');
                validation_response = false;
                break;
              }
            }

            if(addressType == 'postal_code'){
                this.address_to_validate.zipcode = val;
            }
        }
    }
    return validation_response;
  }
  // editFormFields() {    
  //   this.commonservice.postHttpCall({url:'/pinners/edit-new-pin',data: {'pin_id':7}, contenttype:"application/json"}).then(result=>this.editFormFieldsSuccess(result));
  // }

  // editFormFieldsSuccess(response) {
  //   if(response.status == 1) {
  //     const temparr = JSON.parse(response.data['dynamicForm']);      
  //     this.regConfig = temparr;
  //     this.staticData = JSON.parse(response.data['staticForm']);
  //     this.subcatid = response.data['sub_cat_id'];
  //     this.parent_cat_id = response.data['parent_cat_id'];
  //     this.inEditMode = true;
  //   }
  // }

  getFormFields() {
    this.regConfig = [];
    // let tempsubcatid = 24
    // if(this.tempcount>0) {
    //   tempsubcatid = 22;
    // }    
    this.form = DynamicFormComponent;
    this.commonservice.postHttpCall({url:'/pinners/sub-category-form-fields',data: {'sub_cat_id':this.selectSubcatModel}, contenttype:"application/json"})
    .then(result=>this.getFormFieldsSuccess(result));
  }

  getFormFieldsSuccess(response) {
    if(response.status==1) {
      
      const temparr = JSON.parse(response.data.additional_form);      
      if(temparr) {             
        this.pushtoDataobjOnCreateNewPin(temparr);
      } else {
        console.log('yes'); 
        this.regConfig = ['no data'];
        this.form = DynamicFormComponent;  
      }
      this.tempcount++;
      //console.log(this.regConfig);      
    }
  }

  checkIfDone(arrTofilter) {
    let arrToReturn = arrTofilter.filter((val)=>{
      if(val) {
        return val;
      }
    });
    if(arrToReturn.length>0) {
      return true;
    } else {
      return false;
    }
  }

  // pushtoDataobjOnEditPin(temparr) {

  // }

  pushtoDataobjOnCreateNewPin(temparr) {
    let tempObj = temparr.map((val,arr,index) => {        
        if(val['required']) {
          val['validations'] = [
            {
              name: "required",
              validator: Validators.required,
              message: `${val['label']} is required`
            }
          ]
          delete val['required'];
        } 
        if(val['type'] === 'text') {
          val['type'] = 'input';
        } else if(val['type'] === 'select') {
          const tempSelectedArr = val['values'].filter(options => options['selected']);          
          val['value'] = tempSelectedArr['0']['value'];
        } else if(val['type'] === 'radio-group') {
          val['type'] = 'radiobutton';
          const tempSelectedArr = val['values'].filter(options => options['selected']);
          if(tempSelectedArr.length>0) {
            val['value'] =  tempSelectedArr[0]['value']; 
          } else {
            val['value'] = null
          }
        } else if(val['type'] === 'checkbox-group') {
          val['type'] = 'checkbox';
          val['value'] = val['values'].map(item => (item['selected']) ? true : false);
        }
        val['inputType'] = val['subtype'];
        delete val['subtype'];
        delete val['className'];
        return val;              
      });
      this.regConfig = tempObj;
      this.form = DynamicFormComponent;
      
    }

    responseMessageSnackBar(message,res_class:any='',vertical_position:any='bottom'){
        this.snackBar.open(message,'', {
            duration: 4000,
            horizontalPosition:'right',
            verticalPosition:vertical_position,       
            panelClass:res_class
        });
    }
}
