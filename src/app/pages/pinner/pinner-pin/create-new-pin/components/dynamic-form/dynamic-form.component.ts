import { Component, EventEmitter, Input, OnChanges, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { FieldConfig, Validator } from '../../../../../../field.interface';
import { CommonService } from '../../../../../../commonservice';
import { CustomValidators } from '../../custom.validators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CourseDialogComponent } from '../../course-dialog/course-dialog.component';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';
declare var jQuery: any;
declare var $: any;

@Component({
  exportAs: 'dynamicForm',
  selector: "dynamic-form",
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  @Input() fields: any = [];
  @Input() staticFieldInfo: any;
  @Input() seletedSubCatId: any;
  @Input() selectedparent_cat_id: any;
  @Input() ifEditMode: any;

  // indvDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  indvDays = [
    {
      'name': 'Sun',
      'val': false
    },
    {
      'name': 'Mon',
      'val': false
    },
    {
      'name': 'Tue',
      'val': false
    },
    {
      'name': 'Wed',
      'val': false
    },
    {
      'name': 'Thu',
      'val': false
    },
    {
      'name': 'Fri',
      'val': false
    },
    {
      'name': 'Sat',
      'val': false
    }
  ];

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  parent_categories = [];
  sub_categories = [];

  pinnerLocations = [];

  formsubmitted = false;
  indvdaysSelected = true;
  showHowOften = true;
  showtimeofDay = true;
  showdayOfWeek = true;
  showNewLocation = false;
  markAsPrimaryAddress = false;
  attachment = [];
  state_list: any = [];
  uploadUrl: string = '';
  get value() {
    return this.form.value;
  }

  constructor(private fb: FormBuilder, public commonservice: CommonService,
    private dialog: MatDialog, public snackBar: MatSnackBar,
    public myGlobalsQuot: Globalconstant) {
    this.uploadUrl = myGlobalsQuot.uploadUrl;
  }

  ngOnInit() {
    this.getAllLocations();
    console.log(this.staticFieldInfo);
    //this.getParentCatList(); 

    if (!this.ifEditMode) {
      this.form = this.createControl();
      this.indvdaysSelected = false;
      this.frequencyRef['indv_days'].disable();
      this.frequencyRef['indv_days'].updateValueAndValidity();
      this.showHowOften = false;
      this.frequencyRef['how_often'].disable();
      this.frequencyRef['how_often'].updateValueAndValidity();
    } else {
      this.populateIndvDays();
      this.form = this.createControl();
      if (this.staticFieldInfo['is_urgent'] === '0') {
        this.indvdaysSelected = false;
        this.showHowOften = false;
        this.showtimeofDay = false;
        this.showdayOfWeek = false;
        this.formRef['frequency'].disable();
      } else {
        if (this.staticFieldInfo['day_of_week'] !== '3') {
          this.indvdaysSelected = false;
          this.frequencyRef['indv_days'].disable();
          this.frequencyRef['indv_days'].updateValueAndValidity();
        }
        if (this.staticFieldInfo['day_of_week'] === '0') {
          this.showHowOften = false;
          this.frequencyRef['how_often'].disable();
          this.frequencyRef['how_often'].updateValueAndValidity();
        }
      }
      this.attachment = this.staticFieldInfo['attachments'];
      this.handleJobTypeChange();
    }
    //this.tocompareval = this.fields;
    // if(this.ifEditMode) {
    // 	this.patchStaticFieldValues();
    // }    
    this.getStateList();
  }

  populateIndvDays() {
    for (let index of this.indvDays) {
      let tempDay = index['name'];
      let tempVal: any = '';
      switch (tempDay) {
        case 'Sun':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_sunday']);
          this.assignValToIndvDays(index, tempVal);
          break;
        case 'Mon':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_monday']);
          this.assignValToIndvDays(index, tempVal);
          break;
        case 'Tue':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_tuesday']);
          this.assignValToIndvDays(index, tempVal);
          break;
        case 'Wed':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_wednesday']);
          this.assignValToIndvDays(index, tempVal);
          break;
        case 'Thu':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_thursday']);
          this.assignValToIndvDays(index, tempVal);
          break;
        case 'Fri':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_friday']);
          this.assignValToIndvDays(index, tempVal);
          break;
        case 'Sat':
          tempVal = this.getTrueOrFalse(this.staticFieldInfo['ind_saturday']);
          this.assignValToIndvDays(index, tempVal);
          break;
      }
    }
    console.log(this.indvDays);
  }

  getTrueOrFalse(val) {
    if (val == 0) {
      return false;
    } else {
      return true;
    }
  }

  assignValToIndvDays(index, tempVal) {
    index['val'] = tempVal;
  }

  getStateList() {
    this.commonservice.postHttpCall({ url: '/get-state-list', data: {}, contenttype: 'application/json' }).then(result => this.stateListSuccess(result));
  }

  stateListSuccess(response) {
    console.log('response', response);
    this.state_list = response.data;
  }

  getAllLocations() {
    this.commonservice.postHttpCall({ url: '/pinners/get-all-locations', contenttype: 'application/json' }).then(result => this.getAllLocationsSuccess(result));
  }

  getAllLocationsSuccess(response) {
    if (response.status == 1) {
      this.pinnerLocations = response.data['locations'];
      setTimeout(() => {
        if (!this.ifEditMode) {
          const PrmAddress = this.pinnerLocations.filter((val) => {
            if (val['is_primary'] == 1) {
              this.disableNewAddressField();
              return val;
            }
          });
          console.log(PrmAddress);
          if (PrmAddress.length > 0) {
            this.patchAddressField(PrmAddress[0]['id']);
            this.patchLatLng(PrmAddress[0]['lat'], PrmAddress[0]['lng']);
          } else {
            this.showNewLocation = true;
            this.formRef['newAddress'].enable();
            this.patchLatLng(null, null);
          }

        } else {
          const selectedAddresId = this.staticFieldInfo['location_id'];
          console.log(selectedAddresId);
          if (this.staticFieldInfo['location_id'] == '0' || this.staticFieldInfo['location_id'] == 'dl') {
            this.patchAddressField(selectedAddresId);
          } else {
            this.patchAddressField(parseInt(selectedAddresId));
          }
          // $('#'+parseInt(selectedAddresId)+' > label').trigger('click');
          setTimeout(() => {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
          }, 1000);

          // this.patchAddressField(selectedAddresId);

          if (selectedAddresId != '0') {
            this.disableNewAddressField();
            if (selectedAddresId != 'dl') {
              this.patchLatLng(this.staticFieldInfo['lat'], this.staticFieldInfo['lat']);
            }
          } else {
            this.showNewLocation = true;
          }
        }
      }, 0);
    }
  }

  patchAddressField(val) {
    this.formRef['address'].patchValue(val);
  }

  patchLatLng(latVal, lngVal) {
    this.formRef['lat'].patchValue(latVal);
    this.formRef['lng'].patchValue(lngVal);
  }

  disableNewAddressField() {
    this.showNewLocation = false;
    this.formRef['newAddress'].disable();
    this.formRef['newAddress'].updateValueAndValidity();
  }

  handleDayOfWeekChange(evt) {
    const dayofWeekChosenVal = this.frequencyRef['day_of_week']['value'];
    if (dayofWeekChosenVal === '3') {
      this.indvdaysSelected = true;
      this.frequencyRef['indv_days'].enable();
    } else {
      this.indvdaysSelected = false;
      this.frequencyRef['indv_days'].disable();
    }
    this.frequencyRef['indv_days'].updateValueAndValidity();
  }

  handleJobTypeChange() {
    const dayofWeekChosenVal = this.formRef['job_type']['value'];
    const chosenPinUrgentType = this.formRef['is_urgent']['value'];
    if (chosenPinUrgentType == '1') {
      if (dayofWeekChosenVal === '1') {
        this.showHowOften = true;
        this.frequencyRef['how_often'].enable();
      } else {
        this.showHowOften = false;
        this.frequencyRef['how_often'].disable();
      }
    }
    this.frequencyRef['how_often'].updateValueAndValidity();
  }

  handleIsUrgent() {
    const isUrgentValue = this.formRef['is_urgent']['value'];
    if (isUrgentValue === '0') {
      this.indvdaysSelected = false;
      this.showHowOften = false;
      this.showtimeofDay = false;
      this.showdayOfWeek = false;
      this.formRef['frequency'].disable();
      // this.openDialog('emergency_pin');     
    } else {
      this.showHowOften = true;
      this.showtimeofDay = true;
      this.showdayOfWeek = true;
      this.formRef['frequency'].enable();
      // this.frequencyRef['how_often'].enable();
      // this.frequencyRef['time_of_day'].enable();
      // this.frequencyRef['day_of_week'].enable();
      if (this.frequencyRef['day_of_week']['value'] !== '3') {
        this.indvdaysSelected = false;
        this.frequencyRef['indv_days'].disable();
        //this.frequencyRef['indv_days'].enable();
      } else {
        this.indvdaysSelected = true;
        this.frequencyRef['indv_days'].enable();
      }
    }
    this.formRef['frequency'].updateValueAndValidity();
    this.handleJobTypeChange();
  }

  handleAddressSelectionChange(event) {
    console.log('value', event);
    console.log('value.MatRadioChange', event.value);
    if (event.value != 'dl' && event.value != 0) {
      if (!localStorage.getItem('show_create_pin_dafault_address_popup')) {
        Swal({
          //title: '',
          text: 'Would you like this address saved as your default address for future Pins?',
          //type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#bad141',
          confirmButtonText: 'Save As My Default Address',
          cancelButtonText: 'Don’t show this popup again'
        }).then((result) => {
          console.log('result', result);
          if (result.value) {
            this.markAsPrimaryAddress = true;
            //this.commonservice.postHttpCall({url:'/pinners/reject-doer-application', data:{'application_id':applnId}, contenttype:"application/json"}).then(result=>this.onRejectSuccess(result));
          } else {
            this.markAsPrimaryAddress = false;
            let show_create_pin_dafault_address_popup: any = false;
            localStorage.setItem('show_create_pin_dafault_address_popup', show_create_pin_dafault_address_popup);
          }
        });
      }
    }

    const chosenAddressVal = this.formRef['address']['value'];
    if (chosenAddressVal == '0') {
      this.showNewLocation = true;
      this.formRef['newAddress'].enable();
      this.patchLatLng(null, null);
    } else {
      this.showNewLocation = false;
      this.formRef['newAddress'].disable();
      if (chosenAddressVal != 'dl') {
        const chosenLocation = this.pinnerLocations.filter((val) => {
          if (val['id'] === parseInt(chosenAddressVal)) {
            return val;
          }
        });
        this.patchLatLng(chosenLocation[0]['lat'], chosenLocation[0]['lng']);
      } else {
        this.patchLatLng(null, null);
      }
    }
    this.formRef['newAddress'].updateValueAndValidity();
  }

  uploadAttachment(evt) {
    console.log(evt.target.files[0].type.split('/')[0]);
    if (evt.target.files[0].type.split('/')[0] != 'image' && evt.target.files[0].type != 'application/pdf') {
      console.log(evt.target.files[0].type.split('/')[0] != 'image', evt.target.files[0].type != 'application/pdf');
      
      this.responseMessageSnackBar('Only Images and PDF files supported!', 'error');
      return;
    }

    let fd = new FormData();
    fd.append('uploadedAttachment', evt.target.files[0]);
    this.commonservice.postHttpCall({ url: '/pinners/pin-attachment', data: fd, contenttype: 'form-data' }).then(result => this.uploadAttachmentSuccess(result, evt));
  }

  uploadAttachmentSuccess(response, e) {
    if (response.status == 1) {
      e.target.value = '';
      let tempAtachmentObj = {
        'name': response.data['name'],
        'original_name': response.data['original_name'],
      };
      this.attachment.push(tempAtachmentObj);
    }
  }

  removeAttachment(indexVal) {
    console.log(indexVal);
    this.commonservice.postHttpCall({ url: '/pinners/remove-attachment', data: { 'file_name': this.attachment[indexVal]['name'] }, contenttype: 'form-data' }).then(result => this.removeAttachmentSuccess(result, indexVal));
  }

  removeAttachmentSuccess(response, indexVal) {
    if (response.status == 1) {
      this.attachment.splice(indexVal, 1);
    }
  }

  removePrevControls() {
    this.form.removeControl('dynamicForm');
    this.form.removeControl('staticForm');
    // this.form.updateValueAndValidity();
    // this.form.reset();    
    // console.log(this.form);
    // this.form = this.createControl();
    // console.log(this.form);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.formsubmitted = true;
    this.validateAllFormFields(this.form);
    console.log(this.form.valid);
    console.log(this.form);
    this.commonservice.filterDynamicFormSubmit(this.formsubmitted);
    if (this.form.valid) {
      this.form.value['attachments'] = this.attachment;
      this.form.value['markAsPrimaryAddress'] = this.markAsPrimaryAddress;
      if (this.ifEditMode) {
        this.form.value['pin_id'] = this.staticFieldInfo['id'];
        this.form.value['slug'] = this.staticFieldInfo['slug'];
      }
      this.submit.emit(this.form.value);
    } else {
      this.responseMessageSnackBar('Please Fill in the required Fields', 'error', 'top');
      this.validateAllFormFields(this.form);
    }
  }

  ngOnDestroy() {
    console.log('destroyed');
    this.removePrevControls();
  }

  /* Get parent category list service */
  // getParentCatList() {
  //   this.commonservice.postHttpCall({url:'/pinners/category-list', data:{}, contenttype:"application/json"}).then(result=>this.parentCategorySuccess(result));
  // }

  // parentCategorySuccess(response){
  //   if(response.status == 1){
  //     this.parent_categories = response.data;
  //      if(this.selectedparent_cat_id!=undefined) {
  //     	this.form.controls['parentcat'].patchValue(this.selectedparent_cat_id);
  //     	this.getSubCatList();     
  //     }     
  //   }
  // }

  /*Get child category according to parent catgeory*/
  // getSubCatList() {

  //     this.commonservice.postHttpCall({url:'/pinners/get-sub-cat-list', data:{'parent_category_id':this.mainformRef['parentcat']['value']}, contenttype:"application/json"}).then(result=>this.subCatListSuccess(result));



  // }

  // subCatListSuccess(response){
  //   if(response.status == 1){     
  //     this.sub_categories = response.data; 
  //     console.log(this.seletedSubCatId);
  //     if(this.seletedSubCatId!=undefined) {
  //     	this.form.controls['sub_cat_id'].setValue(this.seletedSubCatId)     
  //     }
  //   }
  // }

  patchStaticFieldValues() {
    // this.form.controls['staticForm']['controls']['firstName'].patchValue(this.staticFieldInfo['firstName']);
  }

  createControl() {
    console.log(this.fields, this.ifEditMode);
    const spcdaysValues = [true, false, true, true, false, true, false];
    const group = this.fb.group({
      // parentcat: [null,Validators.required],
      // sub_cat_id:[null,Validators.required],
      staticForm: this.fb.group({
        is_urgent: [(this.ifEditMode && this.staticFieldInfo['is_urgent'] != null) ? this.staticFieldInfo['is_urgent'] : '1'],
        job_type: [(this.ifEditMode && this.staticFieldInfo['job_type'] != null) ? this.staticFieldInfo['job_type'] : '0'],
        title: [(this.ifEditMode && this.staticFieldInfo['title'] != null) ? this.staticFieldInfo['title'] : '', Validators.required],
        description: [(this.ifEditMode && this.staticFieldInfo['description'] != null) ? this.staticFieldInfo['description'] : ''],
        frequency: this.fb.group({
          how_often: [(this.ifEditMode && this.staticFieldInfo['how_often'] != null) ? this.staticFieldInfo['how_often'] : '0'],
          time_of_day: [(this.ifEditMode && this.staticFieldInfo['time_of_day'] != null) ? this.staticFieldInfo['time_of_day'] : '3'],
          day_of_week: [(this.ifEditMode && this.staticFieldInfo['day_of_week'] != null) ? this.staticFieldInfo['day_of_week'] : '0'],
          indv_days: this.fb.array(this.indvDays.map((value) => this.fb.control(value.val)), CustomValidators.multipleCheckboxRequireOne),
        }),
        address: ['0'],
        lat: [(this.ifEditMode) ? this.staticFieldInfo['lat'] : null],
        lng: [(this.ifEditMode) ? this.staticFieldInfo['lng'] : null],
        newAddress: this.fb.group({
          addressLine: [(this.ifEditMode && this.staticFieldInfo['location_id'] == 0) ? this.staticFieldInfo['address'] : null, Validators.required],
          country: [(this.ifEditMode && this.staticFieldInfo['location_id'] == 0) ? this.staticFieldInfo['country'] : 'United States', Validators.required],
          city: [(this.ifEditMode && this.staticFieldInfo['location_id'] == 0) ? this.staticFieldInfo['city'] : null, Validators.required],
          state: [(this.ifEditMode && this.staticFieldInfo['location_id'] == 0) ? this.staticFieldInfo['state'] : null, Validators.required],
          zipcode: [(this.ifEditMode && this.staticFieldInfo['location_id'] == 0) ? this.staticFieldInfo['zipcode'] : null, Validators.required]
        }),
        make_pin_public: [(this.ifEditMode && this.staticFieldInfo['make_pin_public'] != null) ? this.staticFieldInfo['make_pin_public'] : '0']
      }),
      dynamicForm: this.fb.group({})
    });
    console.log(group);
    if (this.fields[0] != 'no data') {
      console.log('asdasdasd');
      this.fields.forEach(field => {
        let control;
        if (field.type === 'button') {
          return;
        } else if (field.type === 'select') {
          control = this.fb.control(
            field.value,
            this.bindValidations(field.validations || [])
          );
        } else if (field.type === 'checkbox') {
          console.log(field.value);
          if (field.validations) {
            control = this.fb.group({
              options: this.fb.array(field.value, CustomValidators.multipleCheckboxRequireOne)
            });
          } else {
            control = this.fb.group({
              options: this.fb.array(field.value)
            });
          }
        } else {
          control = this.fb.control(
            field.value,
            this.bindValidations(field.validations || [])
          );
        }
        let tempabsControl: AbstractControl = group.get('dynamicForm');
        console.log(tempabsControl instanceof FormGroup);
        if (tempabsControl instanceof FormGroup) {
          (<FormGroup>tempabsControl).addControl(field.name, control);
        }
        //tempabsControl.addControl(field.name, control); 
      });
    }
    console.log(group.get('dynamicForm'));
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public handleAddressChange(place) {

    this.formnewAddressRef['city'].patchValue(null);
    this.formnewAddressRef['state'].patchValue(null);
    this.formnewAddressRef['country'].patchValue(null);
    this.formnewAddressRef['zipcode'].patchValue(null);

    setTimeout(() => {
      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
      };

      var location = place['geometry']['location'];

      this.patchLatLng(place.geometry.location.lat(), place.geometry.location.lng());

      for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = place.address_components[i][componentForm[addressType]];
          if (addressType == 'locality') {
            this.formnewAddressRef['city'].patchValue(val);
          }

          if (addressType == 'administrative_area_level_1') {
            this.formnewAddressRef['state'].patchValue(val);
          }

          if (addressType == 'country') {
            this.formnewAddressRef['country'].patchValue(val);
          }

          if (addressType == 'postal_code') {
            console.log('zip', val);
            this.formnewAddressRef['zipcode'].patchValue(val);
          }
        }
      }

      this.formnewAddressRef['addressLine'].patchValue($('input[formControlName="addressLine"]').val());

      // this.createNewpinModel.contactModel.address = $('input[name="address"]').val();
      if (!localStorage.getItem('show_create_pin_dafault_address_popup')) {
        Swal({
          //title: '',
          text: 'Would you like this address saved as your default address for future Pins?',
          //type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#bad141',
          confirmButtonText: 'Save As My Default Address',
          cancelButtonText: 'Don’t show this popup again'
        }).then((result) => {
          console.log('result', result);
          if (result.value) {
            this.markAsPrimaryAddress = true;
            //this.commonservice.postHttpCall({url:'/pinners/reject-doer-application', data:{'application_id':applnId}, contenttype:"application/json"}).then(result=>this.onRejectSuccess(result));
          } else {
            this.markAsPrimaryAddress = false;
            let show_create_pin_dafault_address_popup: any = false;
            localStorage.setItem('show_create_pin_dafault_address_popup', show_create_pin_dafault_address_popup);
          }
        });
      }

    }, 500);
    console.log(place);


  }

  /**
   * formRef getter method
  */
  get mainformRef() {
    return this.form.controls;
  }
  get formRef() {
    //console.log(this.form)
    return this.form.controls['staticForm']['controls'];
  }
  get formnewAddressRef() {
    return this.form.controls['staticForm']['controls']['newAddress']['controls'];
  }
  get frequencyRef() {
    return this.form.controls['staticForm']['controls']['frequency']['controls'];
  }

  publicPinDialog() {
    setTimeout(() => {
      if (this.formRef['make_pin_public']['value'] == '1') {
        this.openDialog('normal_pin');
      }
    }, 100);
  }

  openDialog(pin_type) {
    let popup_width: any = '545px';
    console.log('pin_type', pin_type);

    var display_data = { title: '', content: '', pin_type: pin_type };
    if (pin_type == 'save_pin') {
      display_data.title = 'Success';
      display_data.content = 'Pin has been posted successfully.';

    } else if (pin_type == 'update_pin') {
      display_data.title = 'Success';
      display_data.content = 'Pin has been updated successfully.';
    } else if (pin_type == 'normal_pin') {
      display_data.title = 'Public Pin';
      display_data.content = 'Making your Pin public gives Service Providers outside of PinDo the opportunity to bid on your job.  They will not see your personal information.  Would you like to make your Pin public?';

    } else if (pin_type == 'private_pin') {
      popup_width = '640px';
      display_data.title = 'Private Pin';
      display_data.content = 'This is a private pin and you have not invite any doer. Please any one option.';
    } else {
      display_data.title = 'Emergency Pin';
      display_data.content = 'This job is an emergency and I acknowledge that the doer may charge more for emergency service provided within 4 hours..';
    }
    console.log('display_data', display_data);
    let templateRef = this.dialog.open(CourseDialogComponent, {
      width: popup_width,
      disableClose: false,
      data: display_data
    });

    let tempdialogRefconst = templateRef.componentInstance.publicPinMarker.subscribe((evt) => {
      console.log(evt);
      if (!evt) {
        console.log('asdasdas');
        this.formRef['make_pin_public'].patchValue('0');
      } else {
        this.formRef['make_pin_public'].patchValue('1');
      }
    });

    let tempdialogRefconstEmergency = templateRef.componentInstance.emergencyPinMarker.subscribe((evt) => {
      if (!evt) {
        this.formRef['is_urgent'].patchValue('1');
      } else {
        this.formRef['is_urgent'].patchValue('0');
      }
    });


  }

  responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

}
