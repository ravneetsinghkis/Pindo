import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Validators, FormGroup, FormGroupDirective, AbstractControl, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/commonservice';
import { MatInput, MatSnackBar } from '@angular/material';
import { Globalconstant } from 'src/app/global_constant';
import { Location } from '@angular/common';
declare var $: any;
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CustomValidators } from './custom.validators';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'create-pin',
  templateUrl: './create-pin.component.html',
  styleUrls: ['./create-pin.component.scss']
})
export class CreatePinComponent implements OnInit {

  @ViewChild('pin_name') pinNameInput: MatInput;

  parentCategoriesList: any = [];
  subCategoriesList: any = [];

  stateList: any = [];
  pinnerLocationsList: any = [];

  createPinStep1Form: FormGroup;
  createPinStep2Form: FormGroup;
  createPinStep3Form: FormGroup;
  createNewAddressForm: FormGroup;
  createPinStep4Form: FormGroup;
  dynamicForm: FormGroup;

  openBasicPart: Boolean = true;
  pinDetails: any = {};

  step = 0;
  headerState: number = 1;
  currentStep: number = 1;

  basicDetailsComplete: Boolean = false;
  locationDetailsComplete: Boolean = false;
  scheduleDetailsComplete: Boolean = false;
  additionalDetailsComplete: Boolean = false;

  pinCreationOrUpdate: string = 'CREATE A NEW PIN';
  markAsPrimaryAddress: Boolean = false;
  showNewLocation: Boolean = false;
  newLocationSubmitted: Boolean = false;

  indvdaysSelected: Boolean = false;
  makePublic: Boolean = false;

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

  frequencySubmitted: Boolean = false;
  dynamicFormDetailsConfig: any;
  attachedUploadUrl: string;
  attachment: any = [];
  newAddressDetails: any;
  isUpdatePin: number = 0;
  pin_id: number = 0;
  isNewAddressValidated: Boolean = true;  // FOR NEW LOCATION IS VALID OR NOT CHECKING
  slug: string = '';
  buttonName: string = 'POST';
  inviteDoerList: any = null;

  current_step: string = 'intro';
  selected_step: string = 'intro';
  submittedType: string = '';

  mapOptions = {
    componentRestrictions: { country: "us" },
  }

  @ViewChild('step2EditForm') step2EditForm: FormGroupDirective;
  @ViewChild('newAddressEditForm') newAddressEditForm: FormGroupDirective;
  @ViewChild('step4EditForm') step4EditForm: FormGroupDirective;

  constructor(public renderer: Renderer2, public el: ElementRef, public fb: FormBuilder,
    public titleService: Title, public commonservice: CommonService,
    public snackBar: MatSnackBar, public myGlobals: Globalconstant,
    private router: Router, private route: ActivatedRoute,
    private _location: Location) {

    this.createPinStep1FormBuild();
    this.createPinStep2FormBuild();
    this.createFrequencyFormBuild();
    this.createDynamicFormBuild();

    this.pinDetails.address = null;
    this.pinDetails.lat = null;
    this.pinDetails.lng = null;
    this.attachedUploadUrl = this.myGlobals.uploadUrl + '/jobs/';
    this.pinDetails.complete_status = 0;
    if (localStorage.getItem('inviteDoerList')) {
      this.inviteDoerList = JSON.parse(localStorage.getItem('inviteDoerList'));
      localStorage.removeItem('inviteDoerList');
    }
    this.route.params.subscribe(params => {
      this.slug = params['slug'];

    });
  }

  ngOnInit() {
    this.getParentCatList();
    this.getStateList();
    this.getAllLocationsByPinnerToken();

  }
  step1PanelExpanded = true;
  step2PanelExpanded = false;
  step3PanelExpanded = false;
  step4PanelExpanded = false;

  expandPanel(event: any, step: number): void {
    let flag: boolean = false;
    console.log(this.step1PanelExpanded, this.step2PanelExpanded
      , this.step3PanelExpanded, this.step4PanelExpanded);
    if (!this.step1PanelExpanded && !this.step2PanelExpanded && !this.step3PanelExpanded && !this.step4PanelExpanded) {
      flag = true;
    }
    this.submittedType = '';
    switch (step) {
      case 1: {

        this.selected_step = 'basic';
        if (flag || this.step1PanelExpanded) {
          this.current_step = 'basic';
          this.step1PanelExpanded = !this.step1PanelExpanded;
        } else {
          this.gotoStepFunctionAndCheckAllData();
        }
        break;
      }
      case 2: {
        this.selected_step = 'location';

        if (flag || this.step2PanelExpanded) {
          this.current_step = 'location';
          this.step2PanelExpanded = !this.step2PanelExpanded;
        } else {
          this.gotoStepFunctionAndCheckAllData();
        }
        break;

      }
      case 3: {
        this.selected_step = 'scheduling';

        if (flag || this.step3PanelExpanded) {
          this.current_step = 'scheduling';
          this.step3PanelExpanded = !this.step3PanelExpanded;
        } else {
          this.gotoStepFunctionAndCheckAllData();
        }
        break;
      }
      case 4: {
        this.selected_step = 'additional';
        if (flag || this.step4PanelExpanded) {
          this.current_step = 'additional';
          this.step4PanelExpanded = !this.step4PanelExpanded;
        } else {
          this.gotoStepFunctionAndCheckAllData();
        }
        break;
      }

    }
  }

  backClicked() {
    this._location.back();
  }

  previousStep(previous_step) {
    this.submittedType = '';
    this.selected_step = previous_step;
    this.openStepDependOnCurrentStep();
  }

  nextStep(next_step) {
    console.log("next step call",this.current_step,"current = ",this.currentStep);
    this.submittedType = '';
    this.selected_step = next_step;
    this.gotoStepFunctionAndCheckAllData();
  }

  gotoStepFunctionAndCheckAllData() {
    if (this.current_step == 'basic') {
      this.step1PanelExpanded = true;
      this.createPinStep2_OnSubmit();

    } else if (this.current_step == 'location') {
      this.step2PanelExpanded = true;
      this.createPinStep3_OnSubmit();

    } else if (this.current_step == 'scheduling') {
      this.step3PanelExpanded = true;
      this.createPinStep4_OnSubmit();

    } else if (this.current_step == 'additional') {
      console.log(this.dynamicForm);
      if (this.dynamicForm) {
        this.validateAllFormFields(this.dynamicForm);
        this.commonservice.filterDynamicFormSubmit(true);
        if (this.dynamicForm.invalid) {
          this.responseMessageSnackBar('Please complete additional information.', 'error', 'top');
          // this.commonservice.filterDynamicFormSubmit(true);
          // this.validateAllFormFields(this.dynamicForm);
          this.selected_step == 'additional';
          this.step4PanelExpanded = true;
          return;
        } else {
          this.setDataForStepByStepPinCreation(5);
        }

      } else {
        this.setDataForStepByStepPinCreation(5);
      }
    }
  }

  /**
   * Creates pin step1 form build
   */
  createPinStep1FormBuild() {
    this.createPinStep1Form = this.fb.group({
      category_id: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      pin_name: ['', [Validators.required]]
    });
  }

  /**
   * Creates pin step2 form build
   */
  createPinStep2FormBuild() {
    this.createPinStep2Form = this.fb.group({
      descriptiopn: ['', [Validators.required]],
      is_urgent: ['1']
    });
  }

  /**
   * Creates new address form build
   */
  createNewAddressFormBuild() {
    this.createNewAddressForm = this.fb.group({
      addressLine: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      country: ['']
    });
  }

  /**
   * Creates frequency form build
   */
  createFrequencyFormBuild() {
    this.createPinStep4Form = this.fb.group({
      time_of_day: ['3'],
      day_of_week: ['0'],
      indv_days: this.fb.array(this.indvDays.map((value) => this.fb.control(value.val)), CustomValidators.multipleCheckboxRequireOne),
    });
    this.frequencyRefControler['indv_days'].disable();
    this.frequencyRefControler['indv_days'].updateValueAndValidity();
  }

  /**
   * Creates dynamic form build
   */
  createDynamicFormBuild() {
    this.dynamicForm = this.fb.group({});
  }

  /**
   * Gets form new address ref
   */
  get formNewAddressRef() {
    return this.createNewAddressForm.controls;
  }

  /**
   * Gets primary details controller
   */
  get primaryDetailsController() {
    return this.createPinStep1Form.controls;
  }

  /**
   * Gets basic details controller
   */
  get basicDetailsController() {
    return this.createPinStep2Form.controls;
  }

  /**
   * Gets frequency ref controler
   */
  get frequencyRefControler() {
    return this.createPinStep4Form.controls;
  }

  /**
   * Creates pin step1 on submit
   * @param val
   * @returns
   */
  createPinStep1_OnSubmit() {
    if (this.createPinStep1Form.invalid) {
      if (!this.createPinStep1Form.get('category_id').value && !this.createPinStep1Form.get('sub_category').value) {
        this.responseMessageSnackBar('Please select category and subcategory', 'error', 'top');
      } else if (!this.createPinStep1Form.get('sub_category').value) {
        this.responseMessageSnackBar('Please select subcategory', 'error', 'top');
      }
      this.pinNameInput.focus();
      return;
    } else {
      if (this.createPinStep1Form.get('pin_name').value.trim() == '') {
        this.createPinStep1Form.patchValue({
          pin_name: this.createPinStep1Form.get('pin_name').value.trim(),
        });
        this.pinNameInput.focus();
        return;
      } else {
        this.pinDetails.parentCategoryId = this.createPinStep1Form.get('category_id').value;
        this.pinDetails.subCategoryId = this.createPinStep1Form.get('sub_category').value;
        this.pinDetails.pin_name = this.createPinStep1Form.get('pin_name').value;
        this.setDataForStepByStepPinCreation(1);
      }
    }
  }

  /**
   * Creates pin step2 on submit
   * @returns
   */
  createPinStep2_OnSubmit() {
    console.log(this.step2EditForm, this.step1PanelExpanded);
    this.step2EditForm.ngSubmit.emit();
    (this.step2EditForm as any).submitted = true;
    // console.log("call basic pin");
    if (this.createPinStep2Form.invalid) {
      return;
    } else {
      this.setDataForStepByStepPinCreation(2);
    }
  }

  /**
   * Creates pin step3 on submit
   * @returns
   */
  createPinStep3_OnSubmit() {
    console.log('call location pin', this.newAddressEditForm);
    this.newLocationSubmitted = true;
    if (this.pinDetails.address) {
      if (this.pinDetails.address == 0) {
        this.newAddressEditForm.ngSubmit.emit();
        (this.newAddressEditForm as any).submitted = true;
        if (this.createNewAddressForm.invalid) {
          return;
        } else {
          this.createNewAddressForm.patchValue({
            address: this.createNewAddressForm.get('addressLine').value.trim(),
            city: this.createNewAddressForm.get('city').value.trim(),
            zipcode: this.createNewAddressForm.get('zipcode').value.trim(),
          });
          if (this.createNewAddressForm.get('addressLine').value == '' || this.createNewAddressForm.get('city').value == '' || this.createNewAddressForm.get('zipcode').value == '') {
            return;
          } else {
            this.newLocationSubmitted = false;
            this.checkValidAddressOrNot(this.createNewAddressForm.get('zipcode').value);
          }
        }
      } else {
        this.setDataForStepByStepPinCreation(3);
      }
    } else {
      this.responseMessageSnackBar('Please choose a address.', 'error');
    }
  }

  /**
   * Creates pin step4 on submit
   * @returns
   */
  createPinStep4_OnSubmit() {
    console.log('call schedule pin', this.step4EditForm);
    this.frequencySubmitted = true;
    this.step4EditForm.ngSubmit.emit();
    (this.step4EditForm as any).submitted = true;
    if (this.createPinStep4Form.invalid) {
      return;
    } else {
      this.frequencySubmitted = false;
      this.setDataForStepByStepPinCreation(4);
    }
  }

  /**
   * Creates dynamic form details
   * @returns dynamic form details
   */
  createDynamicFormDetails(): any {
    // console.log(this.dynamicFormDetailsConfig);

    if (this.dynamicFormDetailsConfig) {
      let tempObj = [...this.dynamicFormDetailsConfig];
      // console.log(tempObj);
      for (let key in tempObj) {
        // console.log(key);
        for (let forvalKey in this.dynamicForm.value) {
          // console.log(forvalKey);
          if (tempObj[key]['name'] === forvalKey) {
            // console.log(forvalKey);
            if (tempObj[key]['type'] == 'checkbox') {
              const allCheckBoxOprns = this.dynamicForm.value[forvalKey]['options'];
              for (let index in allCheckBoxOprns) {
                if (allCheckBoxOprns[index]) {
                  tempObj[key]['values'][index]['selected'] = allCheckBoxOprns[index];
                } else {
                  if (tempObj[key]['values'][index]['selected']) {
                    delete tempObj[key]['values'][index]['selected'];
                  }
                }
              }
              tempObj[key]['value'] = this.dynamicForm.value[forvalKey]['options'];
            } else if ((tempObj[key]['type'] == 'radiobutton') || (tempObj[key]['type'] == 'select')) {
              tempObj[key]['value'] = this.dynamicForm.value[forvalKey];
              const radioOrSelectValues = tempObj[key]['values'];
              for (let index in radioOrSelectValues) {
                if (radioOrSelectValues[index]['value'] == tempObj[key]['value']) {
                  tempObj[key]['values'][index]['selected'] = true;
                } else {
                  if (radioOrSelectValues[index]['selected']) {
                    delete tempObj[key]['values'][index]['selected'];
                  }
                }
              }
            } else {
              tempObj[key]['value'] = this.dynamicForm.value[forvalKey];
            }
            break;
          }
        }
      }
      return tempObj;
    } else {
      return [];
    }

  }

  /**
   * Validates all form fields
   * @param formGroup
   */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      // console.log(control);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * Updates pin frist step
   */
  updatePinFristStep() {
    this.openBasicPart = true;
    this.headerState = 1;
  }

  /**
   * Handles address selection change
   * @param event
   */
  handleAddressSelectionChange(event) {
    this.showNewLocation = false;
    this.isNewAddressValidated = true;
    this.pinDetails.address = event.value;
    this.pinDetails.lat = null;
    this.pinDetails.lng = null;

    if (event.value == 0) {
      this.showNewLocation = true;
      this.isNewAddressValidated = false;
      this.createNewAddressFormBuild();
    } else {
      if (event.value != 'dl') {
        const chosenLocation = this.pinnerLocationsList.filter((val) => {
          if (val['id'] === event.value) {
            return val;
          }
        });
        this.pinDetails.lat = chosenLocation[0].lat;
        this.pinDetails.lng = chosenLocation[0].lng;
      }
    }
  }

  /**
   * Handles day of week change
   */
  handleDayOfWeekChange() {
    const dayofWeekChosenVal = this.frequencyRefControler['day_of_week']['value'];
    if (dayofWeekChosenVal === '3') {
      this.indvdaysSelected = true;
      this.frequencyRefControler['indv_days'].enable();
    } else {
      this.indvdaysSelected = false;
      this.frequencyRefControler['indv_days'].disable();
    }
    this.frequencyRefControler['indv_days'].updateValueAndValidity();
  }

  /**
   * Checks valid address or not
   * @param zip_code
   */
  checkValidAddressOrNot(zip_code) {
    let that = this;
    $.ajax({
      type: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zip_code + '&key=' + this.myGlobals.google_map_api,
      dataType: 'json',
      async: false,
      success: function (response) {
        // console.log(response);
        if (response.results.length == 0) {
          that.responseMessageSnackBar('You have provided an invalid address.', 'error');
        } else {
          that.addressValidation(response.results[0]);
        }
      }
    });
  }

  /**
   * Binds validations
   * @param validations
   * @returns
   */
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

  /**
   * Address validation
   * @param place
   * @returns
   */
  private addressValidation(place) {
    let isValidAddress: Boolean = true;
    let localityAndNeighborhood = 0;
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      neighborhood: 'long_name',
      administrative_area_level_1: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        var short_val = place.address_components[i]['short_name'];

        if (addressType == 'locality') {
          if (this.createNewAddressForm.get('city').value.trim().toLowerCase() == val.toLowerCase()) {
            localityAndNeighborhood = 1;
          }
        }

        if (addressType == 'neighborhood') {
          if (this.createNewAddressForm.get('city').value.trim().toLowerCase() == val.toLowerCase()) {
            localityAndNeighborhood = 1;
          }
        }
        if (addressType == 'administrative_area_level_1') {
          if (this.createNewAddressForm.get('state').value != val && this.createNewAddressForm.get('state').value != short_val) {
            this.responseMessageSnackBar('You have provided an invalid State.', 'error');
            isValidAddress = false;
          }
        }
        if (addressType == 'country') {
          if ('United States' != val) {
            this.responseMessageSnackBar('You have provided an invalid Country.', 'error');
            isValidAddress = false;
          }
        }

        if (addressType == 'postal_code') {
          if (this.createNewAddressForm.get('zipcode').value != val) {
            this.responseMessageSnackBar('You have provided an invalid Zip-code.', 'error');
            isValidAddress = false;
          }
        }
      }
    }

    if (localityAndNeighborhood == 0) {
      this.responseMessageSnackBar('You have provided an invalid city.', 'error');
      isValidAddress = false;
    }

    if (isValidAddress) {
      this.isNewAddressValidated = true;
      let tempLocationDetails = {
        address: this.createNewAddressForm.get('addressLine').value.trim(),
        address2: this.createNewAddressForm.get('addressLine2').value,
        country: 'United States',
        city: this.createNewAddressForm.get('city').value.trim(),
        state: this.createNewAddressForm.get('state').value,
        zipcode: this.createNewAddressForm.get('zipcode').value.trim(),
        lng: place.geometry.location.lng.toString(),
        lat: place.geometry.location.lat.toString(),
      };
      this.newAddressDetails = tempLocationDetails;
      this.setDataForStepByStepPinCreation(3);
    }

  }

  /**
   * Handles sub category value
   * @param sub_category_id
   */
  handleSubCategoryValue(sub_category_id) {
    let tempDynamicFormDetails = this.subCategoriesList.filter(
      val =>
        val.id == sub_category_id
    );
    if (tempDynamicFormDetails) {
      this.pinDetails.subCategoryName = tempDynamicFormDetails[0].name;
      // this.createDynamicFormBuild();
      if (this.slug && sub_category_id == this.pinDetails.updated_child_category_id && this.pinDetails.updated_dynamic_form_details != 'no data') {
        this.pushtoDataobjOnCreateNewPin(JSON.parse(this.pinDetails.updated_dynamic_form_details));
      } else {
        this.pushtoDataobjOnCreateNewPin(JSON.parse(tempDynamicFormDetails[0].additional_form));
      }
    }
  }

  /**
   * Pushtos dataobj on create new pin
   * @param tempDynamicFormField
   */
  pushtoDataobjOnCreateNewPin(tempDynamicFormField) {
    // console.log(tempDynamicFormField);

    if (tempDynamicFormField && tempDynamicFormField != 'no data') {

      let tempObj = tempDynamicFormField.map((val, arr, index) => {
        // console.log(val);
        if (val['required']) {
          val['validations'] = [
            {
              name: 'required',
              validator: Validators.required,
              message: `${val['label']} is required`
            }
          ];
          delete val['required'];
        } else if (val['validations']) {
          if (val['validations'][0]['name'] == 'required') {
            val['validations'] = [
              {
                name: 'required',
                validator: Validators.required,
                message: `${val['label']} is required`
              }
            ];
            // delete val['required'];
          }
        }
        if (val['type'] === 'text') {
          val['type'] = 'input';
        } else if (val['type'] === 'select') {
          const tempSelectedArr = val['values'].filter(options => options['selected']);
          val['value'] = tempSelectedArr['0']['value'];
        } else if (val['type'] === 'radio-group') {
          val['type'] = 'radiobutton';
          const tempSelectedArr = val['values'].filter(options => options['selected']);
          if (tempSelectedArr.length > 0) {
            val['value'] = tempSelectedArr[0]['value'];
          } else {
            val['value'] = null;
          }
        } else if (val['type'] === 'checkbox-group') {
          val['type'] = 'checkbox';
          val['value'] = val['values'].map(item => (item['selected']) ? true : false);
        }
        val['inputType'] = val['subtype'];
        delete val['subtype'];
        delete val['className'];
        return val;
      });
      // console.log(tempObj);
      this.dynamicFormDetailsConfig = tempObj;
      this.updateDynamicFromGroupValue();
    } else {
      this.dynamicFormDetailsConfig = [];
    }
  }

  /**
   * Updates dynamic from group value
   * @returns
   */
  updateDynamicFromGroupValue() {
    // console.log(this.dynamicFormDetailsConfig);
    // this.dynamicForm = this.fb.group({})
    if (this.dynamicFormDetailsConfig != 'no data') {
      this.dynamicFormDetailsConfig.forEach(field => {
        let control;
        if (field.type === 'button') {
          return;
        } else if (field.type === 'select') {
          // console.log("select validation= ",field.validations);
          control = this.fb.control(
            field.value,
            this.bindValidations(field.validations || [])
          );
        } else if (field.type === 'checkbox') {
          // console.log(field.validations);
          if (field.validations) {
            // console.log(field.validations);
            control = this.fb.group({
              options: this.fb.array(field.value, CustomValidators.multipleCheckboxRequireOne)
            });
          } else {
            control = this.fb.group({
              options: this.fb.array(field.value)
            });
          }
        } else {
          // console.log(field.validations);
          control = this.fb.control(
            field.value,
            this.bindValidations(field.validations || [])
          );
        }
        let tempabsControl: AbstractControl = this.dynamicForm;
        // console.log(tempabsControl instanceof FormGroup);
        if (tempabsControl instanceof FormGroup) {
          (<FormGroup>tempabsControl).addControl(field.name, control);
        }
      });
    }
    // console.log(this.dynamicForm);
    return this.dynamicForm;
  }

  /**
   * Responses message snack bar
   * @param message
   * @param [res_class]
   * @param [vertical_position]
   */
  responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }



  //API SECTION

  /**
  * Gets parent cat list
  */
  getParentCatList() {
    this.commonservice.postHttpCall({ url: '/pinners/category-list', data: {}, contenttype: 'application/json' })
      .then(result => this.parentCategoryResponse(result));
  }

  /**
   * Parents category response
   * @param response
   */
  parentCategoryResponse(response) {
    if (response.status == 1) {
      this.parentCategoriesList = response.data;
      console.log(this.parentCategoriesList);
      if (this.slug != '') {
        this.getPinDetails();
      }
    }
  }

  /**
   * Gets state list
   */
  getStateList() {
    this.commonservice.postHttpCall({ url: '/get-state-list', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.stateList = result.data;
      }
    });
  }

  /**
   * Gets all locations by pinner token
   */
  getAllLocationsByPinnerToken() {
    this.commonservice.postHttpCall({
      url: '/pinners/get-all-locations', contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.pinnerLocationsList = result.data['locations'];
          this.pinnerLocationsList.forEach(element => {
            element.id = element.id.toString();
            if (element.is_primary == 1) {
              this.pinDetails.address = element.id;
              this.pinDetails.lat = element.lat;
              this.pinDetails.lng = element.lng;

            }
          });
        }
      });
  }

  /**
  * Gets sub cat list
  * @param parent_category_id
  */
  getSubCatList(parent_category_id) {
    if (parent_category_id == 3) { // Make pin public for COVID-19
      this.makePublic = true;
    } else {
      this.makePublic = false;
    }


    let tempParentCategoryDetails = this.parentCategoriesList.filter(
      val =>
        val.id == parent_category_id
    );
    this.pinDetails.parentCategoryName = tempParentCategoryDetails[0].name;
    this.createPinStep1Form.get('sub_category').setValue('');
    this.commonservice.postHttpCall({
      url: '/pinners/get-sub-cat-list',
      data: { 'parent_category_id': parent_category_id }, contenttype: 'application/json'
    })
      .then(result => this.subCatListResponse(result));
  }

  /**
   * Subs cat list response
   * @param response
   */
  subCatListResponse(response) {
    if (response.status == 1) {
      this.subCategoriesList = response.data;
      if (this.slug && this.pinDetails.updated_category_id == this.createPinStep1Form.get('category_id').value) {
        this.handleSubCategoryValue(this.pinDetails.updated_child_category_id);
      }
    }
  }

  /**
   * Uploads attachment
   * @param evt
   */
  uploadAttachment(evt) {
    let fd = new FormData();
    fd.append('uploadedAttachment', evt.target.files[0]);
    this.commonservice.postHttpCall({
      url: '/pinners/pin-attachment',
      data: fd, contenttype: 'form-data'
    })
      .then(result => this.uploadAttachmentSuccess(result, evt));
  }

  /**
   * Uploads attachment success
   * @param response
   * @param e
   */
  uploadAttachmentSuccess(response, e) {
    if (response.status == 1) {
      e.target.value = '';
      let tempAtachmentObj = {
        'name': response.data['name'],
        'original_name': response.data['original_name'],
        'file_type': response.data['original_name'].split('.')[response.data['original_name'].split('.').length - 1]
      };

      this.attachment.push(tempAtachmentObj);
    }
  }

  /**
   * Removes attachment
   * @param indexVal
   */
  removeAttachment(indexVal) {
    this.commonservice.postHttpCall({
      url: '/pinners/remove-attachment',
      data: { 'file_name': this.attachment[indexVal]['name'] },
      contenttype: 'form-data'
    })
      .then(result => this.removeAttachmentSuccess(result, indexVal));
  }

  /**
   * Removes attachment success
   * @param response
   * @param indexVal
   */
  removeAttachmentSuccess(response, indexVal) {
    if (response.status == 1) {
      this.attachment.splice(indexVal, 1);
    }
  }

  /**
   * Gets pin details
   */
  getPinDetails() {
    this.commonservice.postHttpCall({ url: '/pinners/pin-details', data: { 'slug': this.slug }, contenttype: 'application/json' })
      .then(result => this.updatePinDetailsSuccess(result));
  }

  /**
   * Updates pin details success
   * @param response
   */
  updatePinDetailsSuccess(response) {
    if (response.status == 1) {
      this.openBasicPart = false;
      this.headerState = 2;

      let updatePinDetails = response.data;
      this.getSubCatList(updatePinDetails.parent_category_id);
      this.pinDetails.updated_category_id = updatePinDetails.parent_category_id;
      this.pinDetails.updated_child_category_id = updatePinDetails.child_category_id;
      this.pinDetails.pin_name = updatePinDetails.title;
      if (updatePinDetails.dynamicForm == '' || updatePinDetails.dynamicForm == '[]') {
        updatePinDetails.dynamicForm = 'no data';
      }
      this.pinDetails.updated_dynamic_form_details = updatePinDetails.dynamicForm;
      this.pinDetails.complete_status = updatePinDetails.complete_status;

      if (updatePinDetails.pin_step3 == 1) {
        this.pinDetails.address = updatePinDetails.location_id.toString();
        this.pinDetails.lat = updatePinDetails.lat;
        this.pinDetails.lng = updatePinDetails.lng;
      }

      this.pinCreationOrUpdate = this.pinDetails.complete_status == 0 ? 'CREATE A NEW PIN' : 'UPDATE PIN';
      this.buttonName = this.pinDetails.complete_status == 0 ? 'POST' : 'UPDATE';
      this.pin_id = updatePinDetails.id;
      this.isUpdatePin = 1;
      this.makePublic = updatePinDetails.make_pin_public == 0 ? false : true;

      this.createPinStep1Form.patchValue({
        category_id: updatePinDetails.parent_category_id.toString(),
        sub_category: updatePinDetails.child_category_id.toString(),
        pin_name: updatePinDetails.title,
      });

      this.createPinStep2Form.patchValue({
        descriptiopn: updatePinDetails.description,
        is_urgent: updatePinDetails.is_urgent ? updatePinDetails.is_urgent : '1',
      });

      this.createPinStep4Form.patchValue({
        time_of_day: updatePinDetails.time_of_day ? updatePinDetails.time_of_day : '3',
        day_of_week: updatePinDetails.day_of_week ? updatePinDetails.day_of_week : '0',
        indv_days: [updatePinDetails.ind_sunday == 1 ? true : false,
        updatePinDetails.ind_monday == 1 ? true : false,
        updatePinDetails.ind_tuesday == 1 ? true : false,
        updatePinDetails.ind_wednesday == 1 ? true : false,
        updatePinDetails.ind_thursday == 1 ? true : false,
        updatePinDetails.ind_friday == 1 ? true : false,
        updatePinDetails.ind_saturday == 1 ? true : false]
      });
      this.handleDayOfWeekChange();
      for (let key in updatePinDetails.attachments) {
        if (key != 'insert') {
          updatePinDetails.attachments[key]['file_type'] = updatePinDetails.attachments[key]['original_name'].split('.')[updatePinDetails.attachments[key]['original_name'].split('.').length - 1];
        }
      }

      if (this.pinDetails.updated_dynamic_form_details != 'no data') {
        this.pushtoDataobjOnCreateNewPin(JSON.parse(this.pinDetails.updated_dynamic_form_details));
      }

      this.attachment = updatePinDetails.attachments;
      this.selected_step = 'additional';
      if (updatePinDetails.pin_step5 == 1) {
        this.additionalDetailsComplete = true;
      } else {
        this.selected_step = 'additional';
      }
      if (updatePinDetails.pin_step4 == 1) {
        this.scheduleDetailsComplete = true;
      } else {
        this.selected_step = 'scheduling';
      }
      if (updatePinDetails.pin_step3 == 1) {
        this.locationDetailsComplete = true;
      } else {
        this.selected_step = 'location';
      }
      if (updatePinDetails.pin_step2 == 1) {
        this.basicDetailsComplete = true;
      } else {
        this.selected_step = 'basic';
      }
      this.openStepDependOnCurrentStep();
    }
  }

  /**
   * Submits pin details
   * @param completed_status
   */
  submitPinDetails(completed_status) {
    this.submittedType = completed_status;
    this.gotoStepFunctionAndCheckAllData();
  }

  /**
   * Sets data for step by step pin creation
   * @param currentStep
   * @returns
   */
  setDataForStepByStepPinCreation(currentStep) {
    console.log(currentStep);
    let tempPinSubmitDetails = {};
    let staticForm: any;

    if (currentStep == 1) {
      this.current_step = 'basic';
      staticForm = {
        'title': this.createPinStep1Form.get('pin_name').value,
        'make_pin_public': this.makePublic,
      };
      tempPinSubmitDetails['dynamicForm'] = this.createDynamicFormDetails();
      // this.current_step == 'basic';
      console.log(this.current_step);

    } else if (currentStep == 2) {
      this.current_step = 'basic';
      if (this.createPinStep2Form.invalid) {
        return;
      } else {
        staticForm = {
          'description': this.createPinStep2Form.get('descriptiopn').value,
          'is_urgent': this.createPinStep2Form.get('is_urgent').value,
          'make_pin_public': this.makePublic,
        };
      }
      // console.log(this.current_step);

    } else if (currentStep == 3) {
      this.current_step = 'location';

      let newAddress: any;
      if (this.pinDetails.address == '0') {
        newAddress = {
          'addressLine': this.newAddressDetails.address,
          'addressLine2': this.newAddressDetails.address2,
          'country': this.newAddressDetails.country,
          'city': this.newAddressDetails.city,
          'state': this.newAddressDetails.state,
          'zipcode': this.newAddressDetails.zipcode,
          'lng': this.newAddressDetails.lng,
          'lat': this.newAddressDetails.lat,
        };
      }
      staticForm = {
        'address': this.pinDetails.address,
        'lat': this.pinDetails.lat,
        'lng': this.pinDetails.lng,
        'newAddress': newAddress,
        'make_pin_public': this.makePublic,
      };

    } else if (currentStep == 4) {
      this.current_step = 'scheduling';
      let frequency: any = {
        'day_of_week': this.frequencyRefControler['day_of_week']['value'],
        'time_of_day': this.frequencyRefControler['time_of_day']['value'],
      };
      if (this.frequencyRefControler['day_of_week']['value'] == 3) {
        frequency = {
          'day_of_week': this.frequencyRefControler['day_of_week']['value'],
          'time_of_day': this.frequencyRefControler['time_of_day']['value'],
          'indv_days': this.frequencyRefControler['indv_days']['value'],
        };
      }

      staticForm = {
        'job_type': 0,
        'frequency': frequency,
        'make_pin_public': this.makePublic,
      };

    } else if (currentStep == 5) {
      this.current_step = 'additional';
      staticForm = {
        'make_pin_public': this.makePublic
      };
      tempPinSubmitDetails['dynamicForm'] = this.createDynamicFormDetails();
      tempPinSubmitDetails['attachments'] = this.attachment;
    }

    if (this.pinDetails.complete_status == 0) {
      if (this.submittedType == 'post' || this.submittedType == 'invite') {
        this.pinDetails.complete_status = 1;
      } else {
        this.pinDetails.complete_status = 0;
      }
    }

    tempPinSubmitDetails['parentcat'] = this.createPinStep1Form.get('category_id').value;
    tempPinSubmitDetails['sub_cat_id'] = this.createPinStep1Form.get('sub_category').value;
    tempPinSubmitDetails['staticForm'] = staticForm;
    tempPinSubmitDetails['update_status'] = this.isUpdatePin;
    tempPinSubmitDetails['markAsPrimaryAddress'] = this.markAsPrimaryAddress;

    tempPinSubmitDetails['id'] = this.pin_id;
    tempPinSubmitDetails['complete_status'] = this.pinDetails.complete_status;
    tempPinSubmitDetails['current_step'] = this.current_step;
    tempPinSubmitDetails['toInviteDoersList'] = this.inviteDoerList;
    console.log(this.current_step);
    this.pinCreationOrUpdateStepByStep(tempPinSubmitDetails);
  }

  /**
   * Pins creation or update step by step
   * @param tempPinSubmitDetails
   */
  pinCreationOrUpdateStepByStep(tempPinSubmitDetails) {
    let url = this.slug ? 'update-new-pin-step' : 'add-new-pin-step';
    this.commonservice.postHttpCall({
      url: '/pinners/' + url,
      data: tempPinSubmitDetails, contenttype: 'application/json'
    })
      .then(result => {
        if (result.status == 1) {
          this.stepByStepPinCreationOrUpdateResponse(result);
        }
      });
  }

  /**
   * Steps by step pin creation or update response
   * @param result
   */
  stepByStepPinCreationOrUpdateResponse(response) {
    this.pin_id = response.data.pin_details.id;
    this.isUpdatePin = 1;

    if (this.submittedType && this.submittedType != 'draftMode') {
      if (response.primary_address) {
        this.commonservice.setHeaderAddress(response.primary_address.address, response.primary_address.lat, response.primary_address.lng);
      }

      this.responseMessageSnackBar(response.msg);
      if (this.inviteDoerList) {
        let tempEncryptedPinId = btoa(response.data.pin_details.id);
        this.router.navigate([`/pinner/active-quotations/${tempEncryptedPinId}`]);
      } else {
        if (this.submittedType == 'post') {
          this.router.navigate(['/pinner/dashboard']);
        } else {

          const primary = localStorage.setItem('primary_name', this.pinDetails.parentCategoryName);
          const secondary = localStorage.setItem('secondary_name', this.pinDetails.subCategoryName);

          localStorage.setItem('emergencyServicyType', this.createPinStep2Form.get('is_urgent').value);
          this.router.navigate(['/pinner/invite-doer/' + response.data.pin_details.slug]);
        }
      }
    } else {
      this.responseMessageSnackBar(response.msg);
      if (this.openBasicPart) {
        this.openBasicPart = false;
        this.headerState = 2;
        if (this.selected_step == 'additionalClose') {
          this.selected_step = 'additional';
        }
        if(this.selected_step!='intro'){
          this.current_step = this.selected_step;
        }
        console.log(this.current_step);
      } else {
        this.setStatusComnpletedFlag(response.data.pin_details); // PASS STEP VALUE FROM RESPONSE
      }
    }
  }

  /**
   * Sets status comnpleted flag
   * @param result
   */
  setStatusComnpletedFlag(result) {
    if (result.pin_step2 == 1) {
      this.basicDetailsComplete = true;
    }
    if (result.pin_step3 == 1) {
      this.locationDetailsComplete = true;
    }
    if (result.pin_step4 == 1) {
      this.scheduleDetailsComplete = true;
    }
    if (result.pin_step5 == 1) {
      this.additionalDetailsComplete = true;
    }
    this.openStepDependOnCurrentStep();
  }

  /**
   * Opens step depend on current step
   */
  openStepDependOnCurrentStep() {
    console.log(this.selected_step);
    this.step1PanelExpanded = false;
    this.step2PanelExpanded = false;
    this.step3PanelExpanded = false;
    this.step4PanelExpanded = false;
    this.current_step = this.selected_step;
    if (this.selected_step == 'basic') {
      this.step1PanelExpanded = true;
    } else if (this.selected_step == 'location') {
      this.step2PanelExpanded = true;
    } else if (this.selected_step == 'scheduling') {
      this.step3PanelExpanded = true;
    } else if (this.selected_step == 'additional') {
      this.step4PanelExpanded = true;
    } else if (this.selected_step == 'additionalClose') {
      this.current_step = 'additional';
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

    this.createNewAddressForm.patchValue({
      addressLine: googleStreetAddress,
      addressLine2: '',
      city: googleCity,
      state: googleState,
      zipcode: googleZip
    });
  }  

}
