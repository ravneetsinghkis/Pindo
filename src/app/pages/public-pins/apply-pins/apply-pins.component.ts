import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { CommonService } from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import { MatSnackBar } from '@angular/material';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-apply-pins',
  templateUrl: './apply-pins.component.html',
  styleUrls: ['./apply-pins.component.scss']
})
export class ApplyPinsComponent implements OnInit {

  show_data = false;
  paymentTypes = [{
    'name': 'Fixed Price',
    'value': 1
  }, {
    'name': 'Hourly Price',
    'value': 2
  }];

  appyPinsModel = {
    'coverLetter': '',
    'selectPaymentType': 1,
    'fixedPrice': {
      'milestoneName': '',
      'milestonePrc': ''
    },
    'hourlyPrice': {
      'milestoneName': '',
      'milestonePrc': '',
      'workingHrs': ''
    },
    'recurringPrice': {
      'milestoneName': '',
      'milestonePrc': '',
      'workingHrs': ''
    },
    'addtnlPayments': {
      'paymentDesc': '',
      'totalPrc': ''
    }
  }

  fixedPriceMilestones = [];
  hourlyPriceMilestones = [];
  addOtherPaymentsCollection = [];
  checkIfInEditModeOtherPayments: boolean = false;
  ifEditOtherPaymentsIndex: any = 'NULL';

  detectFixedPrcAdded: boolean = false;
  detectHourlyPrcAdded: boolean = false;

  detectIfAddOtherPaymentClicked: boolean = false;

  checkIfEditModePaymentSubmission = false;
  ifEditGetFixedPriceMilestonesIndex: any = 'NULL';
  ifEditGetHourlyPriceMilestonesIndex: any = 'NULL';

  requiredtobeAddntlPayments = false;
  requiredtobeFixedPayments = true;
  requiredtobeHourlyPayments = false;

  totalPrice = 0;
  pin_id: number;
  user_id: any;

  fetchedPinDetails = {};
  totalPinData = [];
  baseCompUrl: any;

  userDetails = {}

  constructor(public commonservice: CommonService, private router: Router, private route: ActivatedRoute, public snackBar: MatSnackBar, public gbConstant: Globalconstant) {

    //get activate route
    this.route.params.subscribe(params => {
      this.pin_id = params['pin_ID'];
      //this.user_id = params['user_id'];
      this.userDetails = JSON.parse(atob(params['user_details']));
      console.log('param', this.userDetails);
    });
    this.baseCompUrl = gbConstant.uploadUrl;

    this.getQuotationPageDetails();
    $('body').removeClass('popup-open');
  }

  ngOnInit() {
    $('body').removeClass('popup-open');
  }

  ngAfterViewInit() {
    this.show_data = true;
  }

  getQuotationPageDetails() {
    this.commonservice.postHttpCall({ url: '/quotation-page-details', data: { 'pin_id': this.pin_id, 'userDetails': this.userDetails }, contenttype: "application/json" }).then(result => this.getDetailsSuccess(result));
  }

  getDetailsSuccess(response) {
    console.log(response);
    if (response.status == 1 && response.data != null) {
      this.fetchedPinDetails = response.data.pin_details;
      this.totalPinData = response.data;
      if (response.data.quotation_dtls.length > 0) {
        if ((response.data.quotation_dtls != null && response.data.pin_details.job_type == 0) || (response.data.quotation_dtls != null && response.data.pin_details.is_urgent == 1)) {
          this.appyPinsModel.coverLetter = response.data.quotation_dtls.cover_letter;
          this.appyPinsModel.selectPaymentType = response.data.quotation_dtls.payment_mode;
          if (response.data.quotation_dtls.payment_mode == 1) {
            this.populateFixedPriceOnLoad(response);
            //this.totalPinData = response.data;
          } else {
            this.populateHourlyPriceOnLoad(response);
          }
          this.populateAddntLpaymentsOnLoad(response);
          this.totalPrice = response.data.quotation_dtls.total_quotation_amount;
        } else if (response.data.quotation_dtls != null && response.data.pin_details.job_type == 1) {

          if (response.data.quotation_dtls.payment_mode == 3) {
            console.log(response.data.pin_details.job_type);
            this.appyPinsModel.coverLetter = response.data.quotation_dtls.cover_letter;
            this.appyPinsModel.recurringPrice.milestoneName = response.data.quotation_dtls.normal_milestones["0"].name;
            this.appyPinsModel.recurringPrice.milestonePrc = response.data.quotation_dtls.normal_milestones["0"].price;
            this.appyPinsModel.recurringPrice.workingHrs = response.data.quotation_dtls.normal_milestones["0"].hours;
          }
          this.populateAddntLpaymentsOnLoad(response);
          this.totalPrice = response.data.quotation_dtls.total_quotation_amount;
        }
      }
    }

    //this.responseMessageSnackBar(response.msg);
  }

  /*
   * populate Fixed Price(if Exists) On Component Load/After Data fetch
  */
  populateFixedPriceOnLoad(response) {
    let tempArr = response.data.quotation_dtls.normal_milestones;
    for (let i = 0; i < tempArr.length; i++) {
      let tempObj = {
        'milestoneName': tempArr[i].name,
        'milestonePrc': tempArr[i].price,
        'id': tempArr[i].id
      }
      this.fixedPriceMilestones.push(tempObj);
      if (this.fixedPriceMilestones.length == 0) {
        this.requiredtobeFixedPayments = true;
      }
    }
  }

  /*
   * populate Hourly Price(if Exists) On Component Load/After Data fetch
  */
  populateHourlyPriceOnLoad(response) {
    let tempArr = response.data.quotation_dtls.normal_milestones;
    for (let i = 0; i < tempArr.length; i++) {
      let tempObj = {
        'milestoneName': tempArr[i].name,
        'milestonePrc': tempArr[i].price,
        'workingHrs': tempArr[i].hours,
        'id': tempArr[i].id,
      }
      this.hourlyPriceMilestones.push(tempObj);
      if (this.hourlyPriceMilestones.length == 0) {
        this.requiredtobeHourlyPayments = true;
      }
    }
  }

  /*
   * populate Additional Payment On Component Load/After Data fetch
  */
  populateAddntLpaymentsOnLoad(response) {
    let tempArrAddntAmt = response.data.quotation_dtls.additional_milestones;
    for (let i = 0; i < tempArrAddntAmt.length; i++) {
      let tempObj = {
        'otherPaymentDescription': tempArrAddntAmt[i].name,
        'milestonePrc': tempArrAddntAmt[i].price,
        'id': tempArrAddntAmt[i].id
      }
      this.addOtherPaymentsCollection.push(tempObj);
    }
    if (this.addOtherPaymentsCollection.length == 0) {
      this.requiredtobeAddntlPayments = true;
    }
  }

  /*
	 * submit Price 
	 * @param totalGrp = total form element group belonging to the ngModelGroup
	 * @param selectedPaymentType = selected Payment Type (FixedPrice/Hourly)
  */
  submitPrice(selectedPaymentType, totalGrp) {
    if (selectedPaymentType == 1) {
      this.detectFixedPrcAdded = true;
      if (this.appyPinsModel.fixedPrice.milestoneName == '' || this.appyPinsModel.fixedPrice.milestonePrc == '') {
        this.requiredtobeFixedPayments = true;
      }
      $('input[name="fixedPaymentmilestoneName"]').trigger('focus').trigger('blur');
      $('input[name="fixedPaymentmilestonePrc"]').trigger('focus').trigger('blur');
      setTimeout(() => {
        if (totalGrp.valid) {
          if (this.ifEditGetFixedPriceMilestonesIndex == 'NULL') {
            console.log('asdasd');
            let tempObj = {
              'milestoneName': this.appyPinsModel.fixedPrice.milestoneName,
              'milestonePrc': this.appyPinsModel.fixedPrice.milestonePrc,
              'id': 0
            }
            this.fixedPriceMilestones.push(tempObj);
          } else {
            console.log(this.ifEditGetFixedPriceMilestonesIndex);
            this.fixedPriceMilestones[this.ifEditGetFixedPriceMilestonesIndex].milestoneName = this.appyPinsModel.fixedPrice.milestoneName;
            this.fixedPriceMilestones[this.ifEditGetFixedPriceMilestonesIndex].milestonePrc = this.appyPinsModel.fixedPrice.milestonePrc;
            this.ifEditGetFixedPriceMilestonesIndex = 'NULL';
          }
          this.detectFixedPrcAdded = false;
          this.appyPinsModel.fixedPrice.milestoneName = '';
          this.appyPinsModel.fixedPrice.milestonePrc = '';
          this.requiredtobeFixedPayments = false;
	  			/*this.appyPinsModel.fixedPrice.milestoneName = '';
	  			this.appyPinsModel.fixedPrice.milestonePrc = '';*/
          this.countTotalprc();
        }
      }, 100);
    } else if (selectedPaymentType == 2) {
      this.detectHourlyPrcAdded = true;
      if (this.appyPinsModel.hourlyPrice.milestoneName == '' || this.appyPinsModel.hourlyPrice.milestonePrc == '' || this.appyPinsModel.hourlyPrice.workingHrs == '') {
        this.requiredtobeHourlyPayments = true;
      }
      $('input[name="hourlyPaymentmilestoneName"]').trigger('focus').trigger('blur');
      $('input[name="hourlyRate"]').trigger('focus').trigger('blur');
      $('input[name="hourlyWorkingHours"]').trigger('focus').trigger('blur');

      setTimeout(() => {
        if (totalGrp.valid) {
          if (this.ifEditGetHourlyPriceMilestonesIndex == 'NULL') {
            console.log('asdasd');
            let tempObj = {
              'milestoneName': this.appyPinsModel.hourlyPrice.milestoneName,
              'milestonePrc': this.appyPinsModel.hourlyPrice.milestonePrc,
              'workingHrs': this.appyPinsModel.hourlyPrice.workingHrs,
              'id': 0
            }
            this.hourlyPriceMilestones.push(tempObj);
          } else {
            console.log(this.ifEditGetHourlyPriceMilestonesIndex);
            this.hourlyPriceMilestones[this.ifEditGetHourlyPriceMilestonesIndex].milestoneName = this.appyPinsModel.hourlyPrice.milestoneName;
            this.hourlyPriceMilestones[this.ifEditGetHourlyPriceMilestonesIndex].milestonePrc = this.appyPinsModel.hourlyPrice.milestonePrc;
            this.hourlyPriceMilestones[this.ifEditGetHourlyPriceMilestonesIndex].workingHrs = this.appyPinsModel.hourlyPrice.workingHrs;
            this.ifEditGetHourlyPriceMilestonesIndex = 'NULL';
          }
          this.detectHourlyPrcAdded = false;
          this.appyPinsModel.hourlyPrice.milestoneName = '';
          this.appyPinsModel.hourlyPrice.milestonePrc = '';
          this.appyPinsModel.hourlyPrice.workingHrs = '';
          this.requiredtobeHourlyPayments = false;
	  			/*this.appyPinsModel.fixedPrice.milestoneName = '';
	  			this.appyPinsModel.fixedPrice.milestonePrc = '';*/
        }
        this.countTotalprc();
      }, 100);
    } else {
      this.detectHourlyPrcAdded = true;
    }
  }

  /*
	 * edit Milestone
	 * @param index = index of payement type Array
	 * @param selectedPaymentType = selected Payment Type (FixedPrice/Hourly)
  */
  editThisMilestone(index, selectedPaymentType) {
    if (selectedPaymentType == 1) {
      this.appyPinsModel.fixedPrice.milestoneName = this.fixedPriceMilestones[index].milestoneName;
      this.appyPinsModel.fixedPrice.milestonePrc = this.fixedPriceMilestones[index].milestonePrc;
      this.checkIfEditModePaymentSubmission = true;
      this.ifEditGetFixedPriceMilestonesIndex = index;
    } else {
      this.appyPinsModel.hourlyPrice.milestoneName = this.hourlyPriceMilestones[index].milestoneName;
      this.appyPinsModel.hourlyPrice.milestonePrc = this.hourlyPriceMilestones[index].milestonePrc;
      this.appyPinsModel.hourlyPrice.workingHrs = this.hourlyPriceMilestones[index].workingHrs;
      this.checkIfEditModePaymentSubmission = true;
      this.ifEditGetHourlyPriceMilestonesIndex = index;
    }
  }

  /*
	 * remove Milestone
	 * @param index = index of payement type Array
	 * @param selectedPaymentType = selected Payment Type (FixedPrice/Hourly)
  */
  removeThisMilestone(index, selectedPaymentType) {
    if (selectedPaymentType == 1) {
      this.fixedPriceMilestones.splice(index, 1);
    } else {
      this.hourlyPriceMilestones.splice(index, 1);
    }
    this.countTotalprc();
  }

  /*
	 * add Other Payments Entry
	 *
	 * @param frmGrp = ngform group for adding Other payments entry
  */
  addOtherPayment(frmGrp) {
    this.detectIfAddOtherPaymentClicked = true;
    if (this.appyPinsModel.addtnlPayments.paymentDesc == '' || this.appyPinsModel.addtnlPayments.totalPrc == '') {
      this.requiredtobeAddntlPayments = true;
    }
    $('input[name="otherPaymentDescription"]').trigger('focus').trigger('blur');
    $('input[name="otherPaymentTotalPrc"]').trigger('focus').trigger('blur');
    setTimeout(() => {
      if (frmGrp.valid) {
        if (this.ifEditOtherPaymentsIndex == 'NULL') {
          let tempObj = {
            'otherPaymentDescription': this.appyPinsModel.addtnlPayments.paymentDesc,
            'milestonePrc': this.appyPinsModel.addtnlPayments.totalPrc,
            'id': 0
          }
          this.addOtherPaymentsCollection.push(tempObj);
          this.detectIfAddOtherPaymentClicked = false;
        } else {
          this.addOtherPaymentsCollection[this.ifEditOtherPaymentsIndex].otherPaymentDescription = this.appyPinsModel.addtnlPayments.paymentDesc;
          this.addOtherPaymentsCollection[this.ifEditOtherPaymentsIndex].milestonePrc = this.appyPinsModel.addtnlPayments.totalPrc;
          this.detectIfAddOtherPaymentClicked = false;
          this.ifEditOtherPaymentsIndex = 'NULL';
          this.checkIfInEditModeOtherPayments = false;
        }
        this.appyPinsModel.addtnlPayments.paymentDesc = '';
        this.appyPinsModel.addtnlPayments.totalPrc = '';
        this.requiredtobeAddntlPayments = false;
        this.countTotalprc();
      }
    }, 100)
    //this.detectIfAddOtherPaymentClicked = false;
  }

  /*
	 * edit Other Payments Entry
	 *
	 * @param index = index of Other Payments Object to remove
  */
  editThisOtherPayment(index) {
    this.appyPinsModel.addtnlPayments.paymentDesc = this.addOtherPaymentsCollection[index].otherPaymentDescription;
    this.appyPinsModel.addtnlPayments.totalPrc = this.addOtherPaymentsCollection[index].milestonePrc;
    this.checkIfInEditModeOtherPayments = true;
    this.ifEditOtherPaymentsIndex = index;
  }

  /*
	 * remove Other Payments Entry
	 *
	 * @param index = index of Other Payments Object to remove
  */
  removeOtherPayment(index) {
    this.addOtherPaymentsCollection.splice(index, 1);
    if ((this.appyPinsModel.addtnlPayments.paymentDesc == '' || this.appyPinsModel.addtnlPayments.totalPrc == '') && (this.addOtherPaymentsCollection.length == 0)) {
      this.requiredtobeAddntlPayments = true;
    }
    this.countTotalprc();
  }

  /*
	 * pins apply form submit function
	 *
	 * @param arr = array to calculate price from
  */
  calculateTotalPrc(arr, paymentType = '') {
    let totalPrc: any = 0;
    for (let i in arr) {
      if (arr.hasOwnProperty(i)) {
        let tempPrc: number = parseFloat(arr[i].milestonePrc);
        let tempHrs = 1;
        if (paymentType == 'hourly') {
          tempHrs = parseFloat(arr[i].workingHrs)
          tempPrc = tempPrc * tempHrs;
        }
        totalPrc = parseFloat(totalPrc) + tempPrc;
      }
    }
    return totalPrc;
  }

  /*
	 * count TotalQuotationAmount 
	 *
	 * 
  */
  countTotalprc() {
    let hourlyPrice = 0;
    let fixedPrice = 0;
    let addntlPrc = 0;
    let recurringPrc = 0;
    setTimeout(() => {
      if (this.totalPinData.hasOwnProperty('pin_details')) {
        if (this.totalPinData['pin_details'].job_type == 0 || this.totalPinData['pin_details'].is_urgent == 1) {

          if (this.appyPinsModel.selectPaymentType == 1) {
            fixedPrice = this.calculateTotalPrc(this.fixedPriceMilestones);
          } else {
            console.log('hhh');
            hourlyPrice = this.calculateTotalPrc(this.hourlyPriceMilestones, 'hourly');
          }
        } else {
          let tempHrs: any = 0;
          //console.log(this.appyPinsModel.recurringPrice.workingHrs);
          if (this.appyPinsModel.recurringPrice.workingHrs != null) {
            tempHrs = this.appyPinsModel.recurringPrice.workingHrs;
          } else {
            tempHrs = 0;
          }
          recurringPrc = parseFloat(this.appyPinsModel.recurringPrice.milestonePrc) * parseFloat(tempHrs);
        }
      }

      addntlPrc = this.calculateTotalPrc(this.addOtherPaymentsCollection);
      this.totalPrice = hourlyPrice + fixedPrice + addntlPrc + recurringPrc;
    }, 100);
    //this.totalPrice = this.appyPinsModel.addtnlPayments.totalPrc;
  }

  /*
	 * pins apply form submit function
	 *
	 * @param frmelm = total ngform element
  */
  applyPinsSubmit(frmelm) {
    let finaltoSubmitValues = [];
    if (this.addOtherPaymentsCollection.length > 0) {
      this.requiredtobeAddntlPayments = false;
    }
    if (this.hourlyPriceMilestones.length > 0) {
      this.requiredtobeHourlyPayments = false;
    }
    if (this.fixedPriceMilestones.length > 0) {
      this.requiredtobeFixedPayments = false;
    }
    let errorFlagForfixedPrice = false;
    let errorFlaghourlyPrice = false;
    let errorFlagAddntlMilstns = false;
    let errorFlagRecurringPrc = false;
    setTimeout(() => {
      if (frmelm.valid) {
        console.log(frmelm.value.typeOfPayment);
        finaltoSubmitValues.push({ 'pin_id': this.pin_id });
        finaltoSubmitValues.push({ 'user_id': this.user_id });
        finaltoSubmitValues.push({ 'coverLetter': frmelm.value.coverLetter })
        if (this.totalPinData['pin_details'].job_type == 0 || this.totalPinData['pin_details'].is_urgent == 1) { //if job type is one time / is urgent job
          if (frmelm.value.typeOfPayment == 1) {
            if (this.fixedPriceMilestones.length == 0) {
              errorFlagForfixedPrice = true;
            } else {
              let tempPaymentInfo = {
                'fixedPrice': this.fixedPriceMilestones
              }
              finaltoSubmitValues.push(tempPaymentInfo);
            }
          } else {
            if (this.hourlyPriceMilestones.length == 0) {
              errorFlaghourlyPrice = true;
            } else {
              let tempPaymentInfo = {
                'hourlyPrice': this.hourlyPriceMilestones
              }
              finaltoSubmitValues.push(tempPaymentInfo);
            }
          }
          finaltoSubmitValues.push({ 'paymentType': this.appyPinsModel.selectPaymentType })
        } else { //if job type is recurring
          let temprecurringPaymentInfo = [{
            'milestoneName': this.appyPinsModel.recurringPrice.milestoneName,
            'milestonePrc': this.appyPinsModel.recurringPrice.milestonePrc,
            'workingHrs': this.appyPinsModel.recurringPrice.workingHrs,
            'id': 0
          }]
          finaltoSubmitValues.push({ 'hourlyPrice': temprecurringPaymentInfo });
          finaltoSubmitValues.push({ 'paymentType': 3 })
        }
        finaltoSubmitValues.push({ 'additionalPayments': this.addOtherPaymentsCollection })
        finaltoSubmitValues.push({ 'TotalQuotationAmount': this.totalPrice });
        finaltoSubmitValues.push({ 'userDetails': this.userDetails });

        if (this.appyPinsModel.addtnlPayments.paymentDesc != '') {
          errorFlagAddntlMilstns = true;
        }


        if (errorFlagAddntlMilstns || errorFlagForfixedPrice || errorFlaghourlyPrice) {
          this.responseMessageSnackBar('Please Submit your entered Details individually before submitting the form', 'error', 'top');
        } else {
          console.log(finaltoSubmitValues);
          this.commonservice.postHttpCall({ url: '/submit-quotation', data: finaltoSubmitValues, contenttype: "application/json" }).then(result => this.submitFunSuccess(result));
        }
      } else {
        console.log(frmelm.form.controls);
        let tempErrorFields = this.checkErrorFieldsName(frmelm);
        if (tempErrorFields.length == 1) {
          this.responseMessageSnackBar(`Please Fill up ${tempErrorFields.join(', ')} field`, 'error', 'top');
        } else {
          this.responseMessageSnackBar(`Please Fill up ${tempErrorFields.join(', ')} fields`, 'error', 'top');
        }
      }
    }, 200)

  }

  /**
   * Checks error fields name
   * @param frmelm 
   * @returns  
   */
  checkErrorFieldsName(frmelm) {
    let errorMsg = [];
    let tempFormObj = frmelm.form.controls;
    for (let key in tempFormObj) {
      if (tempFormObj.hasOwnProperty(key)) {
        //console.log(tempFormObj[key].status);
        let tempStatus = tempFormObj[key].status;
        if (tempStatus == 'INVALID') {
          errorMsg.push(key.toString());
        }
      }
    }
    return errorMsg;
  }

  /**
   * Submits fun success
   * @param response 
   */
  submitFunSuccess(response) {
    console.log(response);
    if (response.status == 1) {
      //console.log(response);
      this.router.navigate(['/public-pins']);
    }
    this.responseMessageSnackBar(response.msg);
    //this.getOpeningHours();

  }

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   * @param [verticalPos] 
   */
  public responseMessageSnackBar(message, res_class: any = '', verticalPos: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: verticalPos,
      panelClass: res_class
    });
  }

}
