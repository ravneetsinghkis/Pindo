import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../../commonservice';
import { AppComponent } from '../../../../app.component';
import { Globalconstant } from '../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
import { Location } from '@angular/common';
declare var io: any;
declare var jQuery: any;
declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apply-pins',
  templateUrl: './apply-pins.component.html',
  styleUrls: ['./apply-pins.component.scss']
})
export class ApplyPinsComponent implements OnInit, AfterViewInit {

  @ViewChild('popUpRaiseDispute')
  popUpRaiseDispute;

  show_data = false;
  paymentTypes = [{
    'name': 'Fixed Price',
    'value': 1
  }, {
    'name': 'Hourly Price',
    'value': 2
  }];

  attachment = [];

  paymentOptnChosen: any;

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
  quotation_id: any;
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

  fetchedPinDetails = {};
  application_details = {};
  totalPinData = [];
  baseCompUrl: any;

  editModeCoverLetter: any;
  totalDataToPrepoluate = {};

  toshowQuotation: boolean = false;
  toShowCoverLetter: boolean = true;
  toShowPaymentTerms: boolean = true;
  addNewMilestoneType: any = '';

  countnumberOfClicks = 0;

  foreditOnly = {
    'qtnId': '',
    'payment_mode': '',
    'mlstnType': ''
  }

  ifInOngoingModeAddNewMilestone = false;

  recurring_edit_request = 0;
  recurringQtnId: any = 0;

  tempEditModeStoreData = [];

  addressLink: any;

  public acceptCheck = 0;

  afterInit = false;

  constructor(
    public commonservice: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    public gbConstant: Globalconstant,
    private dialog: MatDialog,
    private _location: Location,
    private appService: AppComponent,
    private titleService: Title
  ) {
    console.log(this.fetchedPinDetails);
    //get activate route
    this.route.params.subscribe(params => {
      this.pin_id = params['pin_ID'];
      console.log('param', params['pin_ID']);
    });
    this.baseCompUrl = gbConstant.uploadUrl;

    this.getQuotationPageDetails();
  }

  ngOnInit() {

  }

  backClicked() {
    this._location.back();
  }

  ngAfterViewInit() {
    this.show_data = true;
    this.afterInit = true;
  }

  getQuotationPageDetails() {
    this.commonservice.postHttpCall({ url: '/doers/quotation-page-details', data: { slug: this.pin_id }, contenttype: 'application/json' }).then(result => this.getDetailsSuccess(result));
  }

  getDetailsSuccess(response) {
    if (response.status == 1 && response.data != null) {
      this.totalDataToPrepoluate = response.data;
      if (this.totalDataToPrepoluate['pin_details']['is_blocked'] == 1) {
        this.router.navigate(['/errors']);
      }
      if (typeof (this.totalDataToPrepoluate['pin_details']['status']) != 'undefined') {
        if (this.totalDataToPrepoluate['pin_details']['status'] == 1) {
          this.titleService.setTitle('PinDo | Invited Pin');
        } else if (this.totalDataToPrepoluate['pin_details']['status'] == 2) {
          this.titleService.setTitle('PinDo | Ongoing Pin');
        } else if (this.totalDataToPrepoluate['pin_details']['status'] == 3) {
          this.titleService.setTitle('PinDo | Completed Pin');
        } else if (this.totalDataToPrepoluate['pin_details']['status'] == 4) {
          this.titleService.setTitle('PinDo | Dispute Pin');
        } else { }
      }
      //this.application_details = response.data.application_dtls;   
      this.fetchedPinDetails = response.data.pin_details;
      this.totalPinData = response.data;
      console.table(response.data)
      if (response.data.quotation_dtls != null) {
        this.acceptCheck = 0;
        this.quotation_id = response.data.quotation_dtls.id;
      } else {
        this.acceptCheck = 1;
      }
      if ((response.data.quotation_dtls != null && response.data.pin_details.job_type == 0) || (response.data.quotation_dtls != null && response.data.pin_details.is_urgent == 1)) {
        this.appyPinsModel.coverLetter = response.data.quotation_dtls.cover_letter;
        this.editModeCoverLetter = response.data.quotation_dtls.cover_letter;
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
          this.editModeCoverLetter = response.data.quotation_dtls.cover_letter;
          this.appyPinsModel.recurringPrice.milestoneName = response.data.quotation_dtls.normal_milestones['0'].name;
          this.appyPinsModel.recurringPrice.milestonePrc = response.data.quotation_dtls.normal_milestones['0'].price;
          this.appyPinsModel.recurringPrice.workingHrs = response.data.quotation_dtls.normal_milestones['0'].hours;
          this.recurring_edit_request = response.data.quotation_dtls.normal_milestones['0'].edit_request;
          this.recurringQtnId = response.data.quotation_dtls.normal_milestones['0'].id;
        }
        this.populateAddntLpaymentsOnLoad(response);
        this.totalPrice = response.data.quotation_dtls.total_quotation_amount;
      }
      if (this.totalDataToPrepoluate['pin_details'].status == 2 || this.totalDataToPrepoluate['pin_details'].status == 3) {
        this.toshowQuotation = true;
        this.toShowCoverLetter = false;
        this.toShowPaymentTerms = false;
      } else {
        this.toshowQuotation = false;
        this.toShowCoverLetter = true;
        this.toShowPaymentTerms = true;
      }
      if (response.data['quotation_dtls'] != null) {
        this.attachment = response.data['quotation_dtls']['attachments'];
      }
    }
    this.addressLink = this.fetchedPinDetails['address'];
    let address = this.addressLink.replace(/\,/g, '');
    this.addressLink = address.replace(/\ /g, '%20');
    this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
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
        'id': tempArr[i]['id'],
        'edit_request': tempArr[i]['edit_request']
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
        'edit_request': tempArr[i]['edit_request']
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
        'id': tempArrAddntAmt[i].id,
        'edit_request': tempArrAddntAmt[i]['edit_request']
      }
      this.addOtherPaymentsCollection.push(tempObj);
    }
    if (this.addOtherPaymentsCollection.length == 0) {
      //this.requiredtobeAddntlPayments = true;
    }
  }

  countClick() {
    this.countnumberOfClicks++;
  }

  /*
	 * submit Price 
	 * @param totalGrp = total form element group belonging to the ngModelGroup
	 * @param selectedPaymentType = selected Payment Type (FixedPrice/Hourly)
  */
  submitPrice(selectedPaymentType, totalGrp, toCountClick) {
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
          if (toCountClick == 'Yes') {
            this.countClick();
          }
        }
        console.log(this.fixedPriceMilestones);
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
          this.countTotalprc();
          if (toCountClick == 'Yes') {
            this.countClick();
          }
        }
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
    if (this.ifInOngoingModeAddNewMilestone) {
      this.countnumberOfClicks = 0;
    }
  }

  /*
	 * remove Milestone
	 * @param index = index of payement type Array
	 * @param selectedPaymentType = selected Payment Type (FixedPrice/Hourly)
  */
  removeThisMilestone(index, selectedPaymentType, ifSingleMode = '') {
    if (ifSingleMode == 'customremoval') {
      console.log('asdasdasd');
      this.countnumberOfClicks = 0;
      //this.clearAllData();
      this.ifEditGetHourlyPriceMilestonesIndex = 'NULL';
    }
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
  addOtherPayment(frmGrp, toCountClick) {
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
        console.log(this.appyPinsModel.addtnlPayments.paymentDesc, this.appyPinsModel.addtnlPayments.totalPrc)
        this.requiredtobeAddntlPayments = false;
        this.countTotalprc();
        if (toCountClick == 'Yes') {
          this.countClick();
        }
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
    if (this.ifInOngoingModeAddNewMilestone) {
      this.countnumberOfClicks = 0;
    }
  }

  /*
	 * remove Other Payments Entry
	 *
	 * @param index = index of Other Payments Object to remove
  */
  removeOtherPayment(index, ifSingleMode = '') {
    if (ifSingleMode == 'customremoval') {
      console.log('asdasdasd');
      this.countnumberOfClicks = 0;
      //this.clearAllData();
      //this.ifEditGetHourlyPriceMilestonesIndex = 'NULL';      
    }
    this.addOtherPaymentsCollection.splice(index, 1);
    if ((this.appyPinsModel.addtnlPayments.paymentDesc == '' || this.appyPinsModel.addtnlPayments.totalPrc == '') && (this.addOtherPaymentsCollection.length == 0)) {
      //this.requiredtobeAddntlPayments = true;
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
        let typeOfPay: any;
        if (this.totalDataToPrepoluate['quotation_dtls'] != null) {
          if (typeof (frmelm.value.typeOfPayment) == 'undefined') {
            typeOfPay = this.totalDataToPrepoluate['quotation_dtls']['payment_mode'];
          } else {
            typeOfPay = frmelm.value.typeOfPayment;
          }
        } else {
          typeOfPay = this.appyPinsModel.selectPaymentType;
        }
        finaltoSubmitValues.push({ 'slug': this.pin_id })
        finaltoSubmitValues.push({ 'coverLetter': frmelm.value.coverLetter })
        if (this.totalPinData['pin_details'].job_type == 0 || this.totalPinData['pin_details'].is_urgent == 1) { //if job type is one time / is urgent job
          if (typeOfPay == 1) {
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
            'id': this.recurringQtnId,
            'edit_request': this.recurring_edit_request
          }]
          finaltoSubmitValues.push({ 'hourlyPrice': temprecurringPaymentInfo });
          finaltoSubmitValues.push({ 'paymentType': 3 })
        }

        if (this.appyPinsModel.addtnlPayments.paymentDesc != '') {
          console.log('asdasd');
          errorFlagAddntlMilstns = true;
        }

        finaltoSubmitValues.push({ 'additionalPayments': this.addOtherPaymentsCollection })
        finaltoSubmitValues.push({ 'TotalQuotationAmount': this.totalPrice });
        if (this.quotation_id) {
          finaltoSubmitValues.push({ 'quotation_id': this.quotation_id })
        } else {
          finaltoSubmitValues.push({ 'quotation_id': '' })
        }
        finaltoSubmitValues.push({ 'Attachment': this.attachment });


        if (errorFlagAddntlMilstns || errorFlagForfixedPrice || errorFlaghourlyPrice) {
          console.log(errorFlagAddntlMilstns, errorFlagForfixedPrice, errorFlaghourlyPrice, this.appyPinsModel.addtnlPayments.paymentDesc);
          this.responseMessageSnackBar('Please Submit your entered Details individually before submitting the form', 'error', 'top');
        } else {
          console.log(this.totalDataToPrepoluate);
          let checkPaymentOptions = (this.totalDataToPrepoluate['doer_payment_options']['accept_payment_by_cards'] == 0 && this.totalDataToPrepoluate['doer_payment_options']['accept_payment_by_cash'] == 0 && this.totalDataToPrepoluate['doer_payment_options']['accept_payment_by_cheque'] == 0) ? 'No payment Options' : '';
          if (checkPaymentOptions != '') {
            this.openDialog('noPaymentOption');
          } else if (checkPaymentOptions == '' && this.totalDataToPrepoluate['pin_details']['status'] == 1) {
            this.openDialog('for charging quotaion fee to Admin', finaltoSubmitValues);
          } else {
            this.commonservice.postHttpCall({ url: '/doers/submit-quotation', data: finaltoSubmitValues, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
          }
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

  submitFunSuccess(response) {
    if (response.status == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.fetchedPinDetails['pinner_id'],
        'title': ' has updated for the pin ' + this.fetchedPinDetails['title'],
        'pin_id': this.fetchedPinDetails['id'],
        'link': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'quotation_submitted_by_doer',
        'doer_title': ' your quote request has been sent',
        'doerEmailTemplateSlug': 'quotation_submitted_sent_by_doer',
        'doer_link': 'doer/apply-pins/' + this.fetchedPinDetails['slug']
      };

      this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postData);
      setTimeout(() => {
        this.gbConstant.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 3000)
      //console.log(response);
      //this.attachmentbeforeState= this.attachment;
      this.router.navigate(['/doer/my-pins']);

      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');

    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }

    //this.getOpeningHours();

  }

  acceptTheJob(pin_id, application_id) {
    if (this.acceptCheck == 1) {
      //Swal("Please submit the quotation first then only you can accept the job.")
      Swal({
        title: 'Please submit the quotation first then only you can accept the job.',
        text: '',
        type: 'warning',
      });
    } else {
      this.commonservice.postHttpCall({ url: '/doers/accept-job-by-doer', data: { 'pin_id': pin_id, 'application_id': application_id }, contenttype: 'application/json' }).then(result => this.acceptPinSuccess(result));
    }
  }

  acceptPinSuccess(response) {
    if (response.status == 1) {
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.fetchedPinDetails['pinner_id'],
        'title': ' has accepted for the pin ' + this.fetchedPinDetails['title'],
        'pin_id': this.fetchedPinDetails['id'],
        'link': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'accept_job_by_doer',
        'doer_title': ' your accepted request has been sent',
        'doerEmailTemplateSlug': '',
        'doer_link': 'doer/apply-pins/' + this.fetchedPinDetails['slug']
      };

      this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postData);

      setTimeout(() => {
        this.gbConstant.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 3000);

      this.fetchedPinDetails['status'] = 2;
      this.application_details['status'] = 6;
      this.getQuotationPageDetails();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.router.navigate(['/doer/my-pins']);
    } else if (response.status == 'PAYMENT_NOT_SET') {
      this.openDialog('noPaymentOption');
    }
  }

  public declineTheJob(pin_id, application_id) {
    console.log(pin_id, application_id);
    Swal({
      title: 'Are you sure you want to decline the job?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/decline-job', data: { 'pin_id': pin_id, 'application_id': application_id }, contenttype: 'application/json' }).then(result => this.declineTheJobSuccess(result));
      }
    });
  }

  declineTheJobSuccess(response) {
    if (response.status == 1) {

      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.fetchedPinDetails['pinner_id'],
        'title': ' has been declined for pin ' + this.fetchedPinDetails['title'],
        'pin_id': this.fetchedPinDetails['id'],
        'link': 'pinner/active-quotations/' + btoa(this.fetchedPinDetails['id']),
        'emailTemplateSlug': 'quotation_declined_by_doer',
        'doer_title': ' your quote request rejection was sent',
        'doerEmailTemplateSlug': 'quotation_declined_sent_by_doer',
        'doer_link': 'doer/my-pins'
      };

      this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postData);

      setTimeout(() => {
        this.gbConstant.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 3000);



      this.getQuotationPageDetails();
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
    }
  }


  public responseMessageSnackBar(message, res_class: any = '', verticalPos: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: verticalPos,
      panelClass: res_class
    });
  }

  toseeData(evt) {
    console.log(evt);
    this.toShowPaymentTerms = evt.totoggle;
    /*let qtnId = evt.qtnId;
    let payment_mode = evt.payment_mode;
    let mlstnType = evt.mlstnType;*/
    this.foreditOnly = {
      'qtnId': evt.qtnId,
      'payment_mode': evt.payment_mode,
      'mlstnType': evt.mlstnType
    }
    if (this.foreditOnly['mlstnType'] == 'normal_milestones' && this.foreditOnly['payment_mode'] == '1') { //for fixed price    
      for (let i in this.fixedPriceMilestones) {
        if (this.fixedPriceMilestones[i]['id'] == this.foreditOnly['qtnId']) {
          let tempObj = {
            'milestoneName': this.fixedPriceMilestones[i]['milestoneName'],
            'milestonePrc': this.fixedPriceMilestones[i]['milestonePrc']
          }
          this.tempEditModeStoreData.push(tempObj);
          this.fixedPriceMilestones[i]['edit_request'] = 1;
        }
      }
    } else if (this.foreditOnly['mlstnType'] == 'normal_milestones' && this.foreditOnly['payment_mode'] == '2') { //for hourly price    
      for (let i in this.hourlyPriceMilestones) {
        if (this.hourlyPriceMilestones[i]['id'] == this.foreditOnly['qtnId']) {
          let tempObj = {
            'milestoneName': this.hourlyPriceMilestones[i]['milestoneName'],
            'milestonePrc': this.hourlyPriceMilestones[i]['milestonePrc'],
            'workingHrs': this.hourlyPriceMilestones[i]['workingHrs']
          }
          this.tempEditModeStoreData.push(tempObj);
          this.hourlyPriceMilestones[i]['edit_request'] = 1;
        }
      }
    } else if (this.foreditOnly['mlstnType'] == 'normal_milestones' && this.foreditOnly['payment_mode'] == '3') {
      let tempObj = {
        'milestonePrc': this.appyPinsModel.recurringPrice.milestonePrc,
        'milestoneName': this.appyPinsModel.recurringPrice.milestoneName,
        'workingHrs': this.appyPinsModel.recurringPrice.workingHrs
      }
      this.tempEditModeStoreData.push(tempObj);
      this.recurring_edit_request = 1;
    } else if (this.foreditOnly['mlstnType'] == 'additional_milestones') { //for additional milestone    
      for (let i in this.addOtherPaymentsCollection) {
        if (this.addOtherPaymentsCollection[i]['id'] == this.foreditOnly['qtnId']) {
          console.log(this.addOtherPaymentsCollection[i]);
          let tempObj = {
            'otherPaymentDescription': this.addOtherPaymentsCollection[i]['otherPaymentDescription'],
            'milestonePrc': this.addOtherPaymentsCollection[i]['milestonePrc']
          }
          this.tempEditModeStoreData.push(tempObj);
          this.addOtherPaymentsCollection[i]['edit_request'] = 1;
        }
      }
    }
    //this.toShowPaymentTerms = evt;
    //console.log(this.totalDataToPrepoluate);
  }

  unsetEdit() {
    if (this.ifInOngoingModeAddNewMilestone && (this.countnumberOfClicks > 0 || this.ifEditGetFixedPriceMilestonesIndex != 'NULL' || this.ifEditGetHourlyPriceMilestonesIndex != 'NULL')) {
      Swal({
        title: 'You Will loose the New Milestone Data. Do you want to proceed.',
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'Accept',
        cancelButtonText: 'Reject'
      }).then((result) => {
        if (result.value) {
          this.ifEditGetFixedPriceMilestonesIndex = 'NULL';
          setTimeout(() => {
            $('.removethisPayment').trigger('click');
            this.countnumberOfClicks = 0;
            this.clearAllData();
          }, 100)

        }
      })
    } else {
      if (this.foreditOnly['mlstnType'] == 'normal_milestones' && this.foreditOnly['payment_mode'] == '1') { //for fixed price    
        for (let i in this.fixedPriceMilestones) {
          if (this.fixedPriceMilestones[i]['id'] == this.foreditOnly['qtnId']) {
            this.fixedPriceMilestones[i]['milestoneName'] = this.tempEditModeStoreData['0']['milestoneName'];
            this.fixedPriceMilestones[i]['milestonePrc'] = this.tempEditModeStoreData['0']['milestonePrc'];
            this.tempEditModeStoreData = [];
            this.fixedPriceMilestones[i]['edit_request'] = 0;
          }
        }
      } else if (this.foreditOnly['mlstnType'] == 'normal_milestones' && this.foreditOnly['payment_mode'] == '2') { //for hourly price    
        for (let i in this.hourlyPriceMilestones) {
          if (this.hourlyPriceMilestones[i]['id'] == this.foreditOnly['qtnId']) {
            this.hourlyPriceMilestones[i]['milestoneName'] = this.tempEditModeStoreData['0']['milestoneName'];
            this.hourlyPriceMilestones[i]['milestonePrc'] = this.tempEditModeStoreData['0']['milestonePrc'];
            this.hourlyPriceMilestones[i]['workingHrs'] = this.tempEditModeStoreData['0']['workingHrs'];
            this.tempEditModeStoreData = [];
            this.hourlyPriceMilestones[i]['edit_request'] = 0;
          }
        }
      } else if (this.foreditOnly['mlstnType'] == 'normal_milestones' && this.foreditOnly['payment_mode'] == '3') {
        this.appyPinsModel.recurringPrice.milestonePrc = this.tempEditModeStoreData['0']['milestonePrc'];
        this.appyPinsModel.recurringPrice.milestoneName = this.tempEditModeStoreData['0']['milestoneName'];
        this.appyPinsModel.recurringPrice.workingHrs = this.tempEditModeStoreData['0']['workingHrs'];
        this.tempEditModeStoreData = [];
        this.recurring_edit_request = 0;
      } else if (this.foreditOnly['mlstnType'] == 'additional_milestones') { //for additional milestone  
        for (let i in this.addOtherPaymentsCollection) {
          if (this.addOtherPaymentsCollection[i]['id'] == this.foreditOnly['qtnId']) {
            this.addOtherPaymentsCollection[i]['otherPaymentDescription'] = this.tempEditModeStoreData['0']['otherPaymentDescription'];
            this.addOtherPaymentsCollection[i]['milestonePrc'] = this.tempEditModeStoreData['0']['milestonePrc'];
            this.addOtherPaymentsCollection[i]['edit_request'] = 0;
            this.tempEditModeStoreData = [];
          }
        }
      }
      this.clearAllData();
      this.countTotalprc();
    }
  }

  clearAllData() {
    this.addNewMilestoneType = '';
    this.foreditOnly = {
      'qtnId': '',
      'payment_mode': '',
      'mlstnType': ''
    }
    this.appyPinsModel.fixedPrice.milestoneName = '';
    this.appyPinsModel.fixedPrice.milestonePrc = '';
    this.appyPinsModel.hourlyPrice.milestoneName = '';
    this.appyPinsModel.hourlyPrice.milestonePrc = '';
    this.appyPinsModel.hourlyPrice.workingHrs = '';
    this.appyPinsModel.addtnlPayments.paymentDesc = '';
    this.appyPinsModel.addtnlPayments.totalPrc = '';
    this.toShowPaymentTerms = false;
    this.ifEditGetFixedPriceMilestonesIndex = 'NULL';
    this.ifEditGetHourlyPriceMilestonesIndex = 'NULL';
    this.ifInOngoingModeAddNewMilestone = false;
  }

  openDialog(forOptn = 'choose_payment', totalDataToSend: any = '') {
    let tempData: any;
    let widthOfPopup = '805px';
    if (forOptn == 'forchoosingMilestone') {
      //tempData = this.totalDataToPrepoluate['quotation_dtls']['id']
      tempData = {
        'option': 'forchoosingMilestone',
        'totalData': this.totalDataToPrepoluate['quotation_dtls']['id'],
        'payment_method': this.totalDataToPrepoluate['quotation_dtls']['payment_mode']
      }
    } else if (forOptn == 'noPaymentOption') {
      //tempData = 'no-paymentOption';
      tempData = {
        'option': 'no-paymentOption'
      }
      widthOfPopup = '545px';
    } else if (forOptn == 'for charging quotaion fee to Admin') {
      let calculatedCharge: any;
      let toCompPrice: any;
      calculatedCharge = (6 / 100) * this.totalPrice;
      toCompPrice = 250;
      if (parseInt(calculatedCharge) >= toCompPrice) {
        calculatedCharge = 250;
      }
      tempData = {
        'option': 'Pay charge to Admin',
        'totalQuotation': calculatedCharge.toFixed(2)
      }
      widthOfPopup = '545px';
    } else {
      //tempData = 'choose_payment';
      tempData = {
        'option': 'choose_payment',
        'totalData': this.totalDataToPrepoluate['doer_payment_options']
      }
    }
    let tempdialogRef = this.dialog.open(CourseDialogComponent, {
      width: widthOfPopup,
      disableClose: false,
      data: tempData
    });

    let tempdialogRefconst = tempdialogRef.componentInstance.onAddNewMilestoneReqstSend.subscribe((evt) => {
      //this.getQuotationPageDetails();
      console.log(this.foreditOnly['mlstnType']);
      this.addNewMilestoneType = evt;
      if (this.addNewMilestoneType != '') {
        this.addNewMilestone();
      }
    });

    let tempdialogRefconst1 = tempdialogRef.componentInstance.onChoosePaymentMethod.subscribe(($event) => {
      //this.getQuotationPageDetails();
      console.log($event);
      this.paymentOptnChosen = $event['PaymentVal'];
    });

    let tempdialogRefconst2 = tempdialogRef.componentInstance.onSendingQuotaionBeforeHire.subscribe(($event) => {
      //console.log($event);
      if ($event) {
        this.commonservice.postHttpCall({ url: '/doers/submit-quotation', data: totalDataToSend, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
      } else {

      }
      //this.commonservice.postHttpCall({url:'/doers/submit-quotation', data:finaltoSubmitValues, contenttype:"application/json"}).then(result=>this.submitFunSuccess(result));
      //this.paymentOptnChosen = $event['PaymentVal'];
    });
  }

  addNewMilestone() {
    this.ifInOngoingModeAddNewMilestone = true;
    this.toShowPaymentTerms = true;
  }

  /*undoCoverLetter() {
    this.appyPinsModel.coverLetter = this.editModeCoverLetter;
    this.attachment = this.attachmentbeforeState;
    toShowCoverLetter=!toShowCoverLetter;
  }*/

  toggleChildPopup() {
    this.popUpRaiseDispute.togglePopup();
  }

  uploadAttachment(evt) {
    let fd = new FormData();
    fd.append('uploadedAttachment', evt.target.files[0]);
    this.commonservice.postHttpCall({ url: '/doers/quotation-attachment', data: fd, contenttype: 'form-data' }).then(result => this.uploadAttachmentSuccess(result, evt));
  }

  uploadAttachmentSuccess(response, e) {
    if (response.status == 1) {
      e.target.value = '';
      this.attachment.push(response.data)
    }
  }

  removeAttachment(indexVal) {
    console.log(this.attachment[indexVal]);
    this.commonservice.postHttpCall({ url: '/doers/remove-attachment', data: { 'file_name': this.attachment[indexVal]['file_name'] }, contenttype: 'form-data' }).then(result => this.removeAttachmentSuccess(result, indexVal));
  }

  removeAttachmentSuccess(response, indexVal) {
    if (response.status == 1) {
      this.attachment.splice(indexVal, 1);
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

    this.gbConstant.notificationSocket.emit('save-log-last-message-data', postData);
    this.gbConstant.notificationSocket.on('get-log-last-message-data', (res) => {
      localStorage.setItem('pinner_id_again', btoa(pinner_id));
      this.router.navigate(['/doer/chat']);
    });
  }

}
