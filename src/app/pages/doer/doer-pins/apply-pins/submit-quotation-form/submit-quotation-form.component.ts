import { Component, OnInit, ViewChild, AfterContentInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../../commonservice';
import { AppComponent } from '../../../../../app.component';
import { Globalconstant } from '../../../../../global_constant';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CourseDialogComponent } from './choose-option/choose-optiondialog.component';
declare var $: any;
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { RequestPaymentDialogComponent } from './request-payment-dialog/request-payment-dialog.component';

@Component({
  selector: 'app-submit-quotation-form',
  templateUrl: './submit-quotation-form.component.html',
  styleUrls: ['./submit-quotation-form.component.scss']
})
export class SubmitQuotationFormComponent implements OnInit, OnDestroy {

  quotaionForm: FormGroup;
  items: FormArray;
  submitted: boolean = false;
  toShowHourly: boolean = false;
  attachment = [];
  totalDataToSend: any;
  totalPrice: any = 0;
  save_and_preview: any;
  chosenPaymentOption: any = [];
  selectedPaymentMethod: any = [];
  backUPSelectedPaymentMethod: any = [];
  showQuotationView: boolean = false;
  doer_name: any = '';
  baseCompUrl: string = '';
  backup_amount: any;
  @Input() quotationDetails;
  @Input() paymentOptions;
  @Input() pinSlug;
  @Input() fetchedPinDetails;
  @Input() applicationDetails;
  @Input() adminCommissionDetails;
  
  @ViewChild('quoteFormTemplate') quoteFormTemplate: any;
  
  openModalConfirmationPopup: Subscription;
  openModalConfirmationData: Subscription;
  @ViewChild('saveBtn') private saveBtn: any;
  navigateToMessagePage: boolean = false;
  saveButtonClickedOnModal: boolean = false;
  creditCardCount = 0;

  constructor(private _fb: FormBuilder, public commonservice: CommonService,
    private router: Router, private route: ActivatedRoute,
    public snackBar: MatSnackBar, public gbConstant: Globalconstant,
    private dialog: MatDialog,
    private appService: AppComponent) {
    this.baseCompUrl = this.gbConstant.uploadUrl;
  }

  ngOnInit() {
    this.doer_name = parseInt(atob(localStorage.getItem('profile_type'))) == 2 ? localStorage.getItem('company_name') : localStorage.getItem('name');
    // console.log('quotationDetails', this.quotationDetails);

    //Displaying total amount for edit mode
    if (this.quotationDetails) {
      this.totalPrice = this.quotationDetails.total_quotation_amount;
      if (this.quotationDetails != null && this.quotationDetails.payment_method != '') {
        // this.selectedPaymentMethod = this.quotationDetails.payment_method;
        this.backUPSelectedPaymentMethod = this.quotationDetails.payment_method;
      }

      if (this.quotationDetails.attachments) {
        this.attachment = this.quotationDetails.attachments;
      }
    }


    let tempData = this.paymentOptions;
    if (tempData['accept_payment_by_cards'] == 1) {
      let tempValue = true;
      if (this.quotationDetails) {
        tempValue = this.checkIsPresentOrNot(1);
      }
      if (tempValue) {
        this.selectedPaymentMethod.push('1');
      }
      // console.log('accept_payment_by_cards= ', tempValue);
      this.chosenPaymentOption.push({ 'value': '1', 'text': 'Accept by Credit Card', 'checked': tempValue });
    }

    if (tempData['accept_payment_by_cash'] == 1) {
      let tempValue = true;
      if (this.quotationDetails) {
        tempValue = this.checkIsPresentOrNot(2);
      }
      if (tempValue) {
        this.selectedPaymentMethod.push('2');
      }
      // console.log('accept_payment_by_cash= ', tempValue);
      this.chosenPaymentOption.push({ 'value': '2', 'text': 'Accept in Cash', 'checked': tempValue });
    }

    if (tempData['accept_payment_by_cheque'] == 1) {
      let tempValue = true;
      if (this.quotationDetails) {
        tempValue = this.checkIsPresentOrNot(3);
      }
      if (tempValue) {
        this.selectedPaymentMethod.push('3');
      }
      // console.log('accept_payment_by_cheque= ', tempValue);
      this.chosenPaymentOption.push({ 'value': '3', 'text': 'Accept by Check', 'checked': tempValue });
    }

    if (tempData['accept_payment_by_bank'] == 1) {
      let tempValue = true;
      if (this.quotationDetails) {
        tempValue = this.checkIsPresentOrNot(4);
      }
      if (tempValue) {
        this.selectedPaymentMethod.push('4');
      }
      // console.log('accept_payment_by_bank= ', tempValue);
      this.chosenPaymentOption.push({ 'value': '4', 'text': 'Accept by Bank Account', 'checked': tempValue });

    }

    let calculatedCharge: any;
    let toCompPrice: any;
    calculatedCharge = (parseInt(this.adminCommissionDetails.value) / 100) * this.totalPrice;
    toCompPrice = 250;
    if (parseInt(calculatedCharge) >= toCompPrice) {
      calculatedCharge = 250;
    }
    this.backup_amount = calculatedCharge;

    // console.log('PIIIIIIIIIIIIIIIIIIIIIIN', this.fetchedPinDetails);

    this.openModalConfirmationPopup = this.commonservice._confirmBeforeMovingMessagePage.subscribe(data => {
      this.openDialog('confirm_moving_to_message');
    });

    this.openModalConfirmationData = this.commonservice._listnerForMovingMessageModalData.subscribe(option => {
      if (option == 1) {
        this.navigateToMessagePage = true;
        this.saveBtn._elementRef.nativeElement.click();
      }
    });

    // console.log("this.chosenPaymentOption", this.chosenPaymentOption);
    this.checkDoerHasCreditCard();
  }

  checkIsPresentOrNot(value) {
    var isPresent = this.backUPSelectedPaymentMethod.some((el) => {
      return el == value
    });
    return isPresent;
  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.showQuotationView = true;
    if (localStorage.getItem('request_payment') && localStorage.getItem('request_payment') == 'true') {
      localStorage.removeItem('request_payment');
    }
  }

  /**
   * after content init
   */
  ngAfterContentInit() {
    //Quotaion edit mode form creation
    if (this.quotationDetails) {
      for (let index = 0; index < this.quotationDetails.normal_milestones.length; index++) {
        if (index == 0) {
          this.createQuotationForm(this.quotationDetails.normal_milestones[index]);
        } else {
          this.items = this.quotaionForm.get('items') as FormArray;
          this.items.push(this.createItem(this.quotationDetails.normal_milestones[index]));
        }

      }
    } else {//Quotaion add mode form creation
      this.createQuotationForm(null);
    }
    setTimeout(() => {
      if (this.quotationDetails != null && this.quotationDetails.payment_method != '') {
        this.selectedPaymentMethodByDoer();
      }
    }, 500);

    if (this.fetchedPinDetails.parent_category_id == 3) {
      const quotation = this.quotaionForm.get('items') as FormArray;
      quotation.at(0).patchValue({
        description: 'Volunteer',
        quantity: 1,
        rate: 0,
        amount: 0,
      });
    }
  }


  /**
   * Selected payment method by doer
   */
  selectedPaymentMethodByDoer() {
    for (let index = 0; index < this.chosenPaymentOption.length; index++) {
      this.selectedPaymentMethod.filter((ele, indx) => {
        if (ele == this.chosenPaymentOption[index]['value']) {
          this.chosenPaymentOption[index]['checked'] = true;
        }
      });
    }
  }


  /**
   * Creates item
   * @param item_data
   * @returns item
   */
  createItem(item_data): FormGroup {
    return this._fb.group({
      'description': [(item_data) ? item_data.name : '', Validators.required],
      'quantity': [(item_data) ? item_data.quantity : '', Validators.compose([Validators.required, Validators.pattern('^\\d*(?:[.]\\d*)?$')])],
      'rate': [(item_data) ? item_data.rate : '', Validators.compose([Validators.required, Validators.pattern('^\\d*(?:[.]\\d*)?$')])],
      'amount': [(item_data) ? item_data.price : '', Validators.required]
    });
  }

  /**
   * Adds item
   */
  addItem(): void {
    this.items = this.quotaionForm.get('items') as FormArray;
    this.items.push(this.createItem(null));
  }

  /**
   * Creates quotation form
   * @param item_data
   */
  createQuotationForm(item_data) {
    this.quotaionForm = this._fb.group({
      'cover_letter': [(this.quotationDetails) ? this.quotationDetails.cover_letter : ''],
      'items': this._fb.array([this.createItem(item_data)])
    });

  }

  /**
   * Calculates amount
   * @param i
   */
  calculateAmount(i) {
    let that = this;
    this.quotaionForm.value.items.filter((ele, index) => {
      if (i == index) {
        this.quotaionForm.value.items[i].amount = Number( ele.quantity * ele.rate ).toFixed(2);
        this.quotaionForm.patchValue(this.quotaionForm.value);
      }
    });

    this.totalPrice = 0;
    for (let indx = 0; indx < this.quotaionForm.value.items.length; indx++) {
      this.totalPrice = parseFloat(this.totalPrice) + parseFloat(this.quotaionForm.value.items[indx].amount);
    }
  }

  /**
   * Removes item
   * @param i
   */
  removeItem(i) {
    this.items.removeAt(i);
    this.totalPrice = 0;
    for (let indx = 0; indx < this.quotaionForm.value.items.length; indx++) {
      this.totalPrice = parseFloat(this.totalPrice) + parseFloat(this.quotaionForm.value.items[indx].amount);
    }
  }

  /**
   * Selects payment receive methods
   * @param event
   */
  selectPaymentReceiveMethods(event) {
    // console.log('event', event);
    if (event.checked == true) {
      this.selectedPaymentMethod.push(event.source.value);
    } else {
      let ind = this.selectedPaymentMethod.indexOf(event.source.value);
      this.selectedPaymentMethod.splice(ind, 1);
    }

    this.selectedPaymentMethodByDoer();
  }

  /**
   * Disables hourly price controls
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   */
  disableHourlyPriceControls(hourlyPrcilestoneName, hourlyRate, workingHours) {
    hourlyPrcilestoneName.disable();
    hourlyRate.disable();
    workingHours.disable();
    hourlyRate.patchValue(null);
    hourlyPrcilestoneName.patchValue(null);
    workingHours.patchValue(null);
  }

  /**
   * Ebables hourly price controls
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   */
  ebableHourlyPriceControls(hourlyPrcilestoneName, hourlyRate, workingHours) {
    hourlyPrcilestoneName.enable();
    hourlyRate.enable();
    workingHours.enable();
  }

  /**
   * Enables fixed prc controls
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   */
  enableFixedPrcControls(fxedPrcMilestoneName, fixedmilestonePrc) {
    fxedPrcMilestoneName.enable();
    fixedmilestonePrc.enable();
  }

  /**
   * Disables fixed prc controls
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   */
  disableFixedPrcControls(fxedPrcMilestoneName, fixedmilestonePrc) {
    fxedPrcMilestoneName.disable();
    fixedmilestonePrc.disable();
    fxedPrcMilestoneName.patchValue(null);
    fixedmilestonePrc.patchValue(null);
  }

  /**
   * Determines whether paymentype change on
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   * @param additional_amount
   */
  onPaymentypeChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount) {

    // console.log('additional_amount', additional_amount);
    this.quotaionForm.get('payment_type').valueChanges.subscribe(
      (selectedPaymentType: any) => {
        if (selectedPaymentType == '1') {
          this.calculateTotalQuotationAmount(additional_amount['value'], fixedmilestonePrc['value']);
          this.toShowHourly = false;
          this.disableHourlyPriceControls(hourlyPrcilestoneName, hourlyRate, workingHours);
          this.enableFixedPrcControls(fxedPrcMilestoneName, fixedmilestonePrc);
        } else {
          this.calculateTotalQuotationAmount(additional_amount['value'], hourlyRate['value'], workingHours['value']);
          this.toShowHourly = true;
          this.disableFixedPrcControls(fxedPrcMilestoneName, fixedmilestonePrc);
          this.ebableHourlyPriceControls(hourlyPrcilestoneName, hourlyRate, workingHours);
        }
        fxedPrcMilestoneName.updateValueAndValidity();
        fixedmilestonePrc.updateValueAndValidity();
        hourlyPrcilestoneName.updateValueAndValidity();
        hourlyPrcilestoneName.updateValueAndValidity();
        workingHours.updateValueAndValidity();
      }
    );
  }

  /**
   * Calculates total quotation amount
   * @param additionalAmt
   * @param amt
   */
  calculateTotalQuotationAmount(additionalAmt, ...amt) {
    // console.log('amt', amt);
    let total_amount = 0;
    total_amount = total_amount + additionalAmt;
    if (amt.length > 1) {
      total_amount = total_amount + (amt[0] * amt[1]);
    } else {
      total_amount = total_amount + amt[0];
    }
    this.totalPrice = total_amount;
    // console.log('total_amount', total_amount);
  }

  /**
   * Determines whether hourly price change on
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   * @param additional_amount
   */
  onHourlyPriceChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount) {
    hourlyRate.valueChanges.subscribe(
      (hourlyVal: any) => {
        this.calculateTotalQuotationAmount(additional_amount['value'], hourlyRate['value'], workingHours['value']);
      }
    );
  }

  /**
   * Working hours change
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   * @param additional_amount
   */
  workingHoursChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount) {
    workingHours.valueChanges.subscribe(
      (workingVal: any) => {
        this.calculateTotalQuotationAmount(additional_amount['value'], hourlyRate['value'], workingHours['value']);
      }
    );
  }

  /**
   * Fixed price change
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   * @param additional_amount
   */
  fixedPriceChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount) {
    fixedmilestonePrc.valueChanges.subscribe(
      (fixedmilestoneVal: any) => {
        this.calculateTotalQuotationAmount(additional_amount['value'], fixedmilestonePrc['value']);
      }
    );
  }

  /**
   * Additionals amt change
   * @param fxedPrcMilestoneName
   * @param fixedmilestonePrc
   * @param hourlyPrcilestoneName
   * @param hourlyRate
   * @param workingHours
   * @param additional_amount
   */
  additionalAmtChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount) {
    additional_amount.valueChanges.subscribe(
      (additionalAmtVal: any) => {
        if (this.quotaionForm.get('payment_type').value == 1) {
          this.calculateTotalQuotationAmount(additional_amount['value'], fixedmilestonePrc['value']);
        } else {
          this.calculateTotalQuotationAmount(additional_amount['value'], hourlyRate['value'], workingHours['value']);
        }

      }
    );
  }

  /**
   * Determines whether quote form value change on
   */
  onQuoteFormValueChange() {
    const fxedPrcMilestoneName = this.quotaionForm.get('fixedPrc').get('fixedPrcmilestoneName');
    const fixedmilestonePrc = this.quotaionForm.get('fixedPrc').get('milestonePrc');

    const hourlyPrcilestoneName = this.quotaionForm.get('hourlyPrc').get('hourlyPrcilestoneName');
    const hourlyRate = this.quotaionForm.get('hourlyPrc').get('hourlyRate');
    const workingHours = this.quotaionForm.get('hourlyPrc').get('workingHours');

    const additional_amount = this.quotaionForm.get('additionalPayments').get('otherPaymentTotalPrc');

    this.onPaymentypeChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount);
    this.onHourlyPriceChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount);
    this.workingHoursChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount);
    this.fixedPriceChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount);
    this.additionalAmtChange(fxedPrcMilestoneName, fixedmilestonePrc, hourlyPrcilestoneName, hourlyRate, workingHours, additional_amount);
  }

  /**
   * Resets form
   */
  resetForm() {
    this.quoteFormTemplate.resetForm();
  }

  /**
   * Gets quote form ref
   */
  get quoteFormRef() {
    return this.quotaionForm['controls'];
  }

  /*get quoteFixedPriceRef() {
  	return this.quotaionForm['controls']['fixedPrc']['controls'];
  }*/

  /*get quoteHourlyPriceRef() {
  	return this.quotaionForm['controls']['hourlyPrc']['controls'];
  }*/

  /*get quoteAdditionalFieldRef() {
  	return this.quotaionForm['controls']['additionalPayments'];
  }*/

  /**
   * Saves and preview or submit
   * @param val
   */
  saveAndPreviewOrSubmit(val) {
    // console.log(val);
    // Swal({
    //   title: "If you're happy with your quote, submit it to the Pinner now. If not, select Edit.",
    //   text: '',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#bad141',
    //   confirmButtonText: 'Submit',
    //   cancelButtonText: 'Edit'
    //   }).then((result) => {
    //     console.log(result);
    //     if (result.value) {

    //     }
    // });
    this.save_and_preview = val;

    if (val == 1) {
      localStorage.setItem('show_quotaion_preview', 'true');
    } else {
      localStorage.setItem('show_quotaion_preview', 'false');
    }
  }

  /**
   * Previews quotation only
   * @param val
   */
  previewQuotationOnly(val) {
    this.save_and_preview = val;
    if (val == 1) {
      localStorage.setItem('show_quotaion_preview', 'true');
    } else {
      localStorage.setItem('show_quotaion_preview', 'false');
    }
    this.router.navigate(['/doer/quotation-preview/' + this.pinSlug]);
  }

  /**
   * Determines whether submit on
   * @param validate
   */
  onSubmit(validate) {
    // console.log('applicationDetails', this.applicationDetails);
    this.submitted = true;
    /*if(!validate || this.selectedPaymentMethod.length==0){
      this.responseMessageSnackBar('Please provide all mandatory fields.','error','top');
    }*/
    if (!validate) {
      this.responseMessageSnackBar('Please provide all mandatory fields.', 'error', 'top');
      return;
    }
    if (this.selectedPaymentMethod.length == 0 && this.fetchedPinDetails.parent_category_id != 3) {
      this.responseMessageSnackBar('Please go set up a payment method in Account Settings - How Pinners Pay You', 'error', 'top');
      // this.openDialog('payment_info_required');
      return;
    }


    let requestPaymentDialogRef;

    if (this.applicationDetails != null) {
      if (this.applicationDetails.status == 6) {
        requestPaymentDialogRef = this.dialog.open(RequestPaymentDialogComponent, { disableClose: true });

        requestPaymentDialogRef.componentInstance.onRequestPaymentFromModal.subscribe(($event) => {
          if ($event) {
            localStorage.setItem("request_payment_init", "1");
            // this.router.navigate(["/doer/quotation-preview", this.pinSlug]);   
            this.saveButtonClickedOnModal = true;
            this.processNext(validate);         
          }
        });

        requestPaymentDialogRef.componentInstance.onUpdateQuotationFromModal.subscribe(($event) => {
          if ($event) {
            this.saveButtonClickedOnModal = true;
            this.processNext(validate);
          }
        });
      } else {
        this.processNext(validate);
      }
    } else {
      this.processNext(validate);
    }
  }


  processNext(validate) {
    // console.log(this.quotaionForm.value);
    let formData = {
      'slug': this.pinSlug,
      'cover_letter': this.quotaionForm.value.cover_letter,
      'milestones': this.quotaionForm.value.items,
      'Attachment': this.attachment,
      'total_quotation_amount': this.totalPrice,
      'quotation_id': (this.quotationDetails) ? this.quotationDetails.id : '',
      'save_and_preview': this.save_and_preview,
      'selected_payment_method': this.selectedPaymentMethod,
    };

    if (validate) {
      if (this.save_and_preview == 1) {
        // this.openDialog('Pay charge to Admin', formData);
        this.commonservice.postHttpCall({ url: '/doers/submit-quotation', data: formData, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
      } else {
        if (this.fetchedPinDetails.parent_category_id == 3) {
          this.commonservice.postHttpCall({ url: '/doers/submit-quotation', data: formData, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
        } else {
          if(
            this.creditCardCount == 0
          ) {
            this.openDialog('payment_info_required');
          } else if (
            this.paymentOptions.accept_payment_by_cards == 1 || 
            this.paymentOptions.accept_payment_by_cash == 1 || 
            this.paymentOptions.accept_payment_by_cheque == 1 || 
            this.paymentOptions.accept_payment_by_bank == 1
          ) {
            this.openDialog('Pay charge to Admin', formData);
          } else {
            this.openDialog('no-paymentOption');
          }
        }
      }
    }
  }


  /**
   * Submits fun success
   * @param response
   */
  submitFunSuccess(response) {
    if (response.status == 1) {
      if (this.save_and_preview != 1) {

        let postData = {
          'sender_id': atob(localStorage.getItem('frontend_user_id')),
          'reciver_id': this.fetchedPinDetails['pinner_id'],
          'title': 'Great news! You’ve received a quote from Doer ' + this.doer_name + ' on Pin ' + this.fetchedPinDetails['title'] + '.',
          'PINDETAILSURL': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
          'link': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
          'show_in_todo': 1,
          'HOME_PAGE_LINK': 'community/community-home',
          'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
          'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
          'PIN_A_JOB_PAGE': 'PIN A JOB',
          'MYPINS_PAGE_LINK': 'pinner/my-pins',
          'todo_title': 'You’ve received a quote from Doer ' + this.doer_name + ' on Pin ' + this.fetchedPinDetails['title'] + '. Wait for more or hire now!',
          'todo_link': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
          'pin_id': this.fetchedPinDetails['id'],
          'PIN_UNIQUE_ID': this.fetchedPinDetails['pin_unique_id'],
          'MILESTONES': this.quotaionForm.value.items,
          'emailTemplateSlug': 'quotation_submitted_by_doer',
          'doer_title': 'Looking good – your quote was successfully submitted!',
          'doerEmailTemplateSlug': 'quotation_submitted_sent_by_doer',
          'doer_link': 'doer/apply-pins/' + this.fetchedPinDetails['slug']
        };



        // let postDataDoer = {
        //   'sender_id': atob(localStorage.getItem('frontend_user_id')),
        //   'reciver_id': this.fetchedPinDetails['pinner_id'],
        //   'title': 'Great news! You’ve received a quote from Doer ' + this.doer_name + ' on Pin ' + this.fetchedPinDetails['title'] + '.',
        //   'PINDETAILSURL': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        //   'link': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        //   'show_in_todo': 1,
        //   'HOME_PAGE_LINK': 'doer/community-home',
        //   'ACTIVITY_PAGE_LINK': 'doer/dashboard',
        //   'PIN_A_JOB_PAGE_LINK': 'public-pins',
        //   'PIN_A_JOB_PAGE': 'FIND A JOB',
        //   'MYPINS_PAGE_LINK': 'doer/my-pins',
        //   'todo_title': 'You’ve received a quote from Doer ' + this.doer_name + ' on Pin ' + this.fetchedPinDetails['title'] + '. Wait for more or hire now!',
        //   'todo_link': 'pinner/active-quotation-details/' + this.fetchedPinDetails['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        //   'pin_id': this.fetchedPinDetails['id'],
        //   'PIN_UNIQUE_ID': this.fetchedPinDetails['pin_unique_id'],
        //   'MILESTONES': this.quotaionForm.value.items,
        //   'emailTemplateSlug': 'quotation_submitted_by_doer',
        //   'doer_title': 'Looking good – your quote was successfully submitted!',
        //   'doerEmailTemplateSlug': 'quotation_submitted_sent_by_doer',
        //   'doer_link': 'doer/apply-pins/' + this.fetchedPinDetails['slug']
        // };

        console.log("submitFunSuccess", postData);

        this.gbConstant.notificationSocket.emit('post-notification-to-pinner', postData);
        // setTimeout(() => {
        //   this.gbConstant.notificationSocket.emit('post-notification-to-doer-himself', postDataDoer);
        // }, 3000);
        //console.log(response);
        //this.attachmentbeforeState= this.attachment;
        //this.router.navigate(['/doer/my-pins']);
      }
    }
    if (this.save_and_preview != 1) {
      this.responseMessageSnackBar('Quotation submitted successfully', 'orangeSnackBar');
    } else {
      this.responseMessageSnackBar('Quotation updated successfully', 'orangeSnackBar');
    }
    // if (this.save_and_preview == 1) {
    //   this.router.navigate(['/doer/quotation-preview/' + this.pinSlug]);
    // } else {
    //   this.router.navigate(['/doer/my-pins']);
    // }

    if (this.navigateToMessagePage) {
      this.commonservice.listenBidPageMoveDialogData(2);
    } else {      
      if (this.saveButtonClickedOnModal) {
        this.router.navigate(['/doer/quotation-preview/' + this.pinSlug]);
      } else {
        this.router.navigate(['/doer/dashboard']);
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
    this.commonservice.postHttpCall({ url: '/doers/quotation-attachment', data: fd, contenttype: 'form-data' }).then(result => this.uploadAttachmentSuccess(result, evt));
  }

  /**
   * Uploads attachment success
   * @param response
   * @param e
   */
  uploadAttachmentSuccess(response, e) {
    if (response.status == 1) {
      e.target.value = '';
      this.attachment.push(response.data);
      // console.log('this.attachment', this.attachment);
    }
  }

  /**
   * Removes attachment
   * @param indexVal
   */
  removeAttachment(indexVal) {
    // console.log(this.attachment[indexVal]);
    this.commonservice.postHttpCall({ url: '/doers/remove-attachment', data: { 'file_name': this.attachment[indexVal]['file_name'] }, contenttype: 'form-data' }).then(result => this.removeAttachmentSuccess(result, indexVal));
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
   * Opens dialog
   * @param [forOptn]
   * @param [totalDataToSend]
   */
  openDialog(forOptn = 'choose_payment', totalDataToSend: any = '') {
    // console.log(totalDataToSend);

    let tempData: any;
    let widthOfPopup = '805px';

    if (forOptn == 'choose_payment') {
      tempData = {
        'option': 'choose_payment',
        'totalData': { 'paymentOptions': this.paymentOptions, 'quotation_id': this.quotationDetails.id, 'applicationDetails': this.applicationDetails, 'fetchedPinDetails': this.fetchedPinDetails, 'totalPrice': this.totalPrice }
      };
    } else if (forOptn == 'no-paymentOption') {
      tempData = {
        'option': forOptn
      };
      widthOfPopup = '545px';
    } else if (forOptn == 'Pay charge to Admin') {
      let calculatedCharge: any;
      let toCompPrice: any;
      calculatedCharge = (parseInt(this.adminCommissionDetails.value) / 100) * this.totalPrice;
      toCompPrice = 250;
      if (parseInt(calculatedCharge) >= toCompPrice) {
        calculatedCharge = 250;
      }

      let commission_including_ccard_charges: any = ((this.totalPrice * 2.9) / 100) + 0.30;
      if (commission_including_ccard_charges > 250) {
        commission_including_ccard_charges = 250;
      }
      let commission_including_ach_charges: any = ((this.totalPrice * 0.8) / 100);
      if (commission_including_ach_charges > 5) {
        commission_including_ach_charges = 5;
      }
      tempData = {
        'totalQuationAmount': this.totalPrice,
        'option': forOptn,
        'totalQuotation': calculatedCharge.toFixed(2),
        'admin_commission_percentage': this.adminCommissionDetails.value,
        'commission_including_ccard_charges': parseFloat(commission_including_ccard_charges).toFixed(2),
        'commission_including_ach_charges': parseFloat(commission_including_ach_charges).toFixed(2),
        'save_preview': this.save_and_preview,
        'previous': this.backup_amount.toFixed(2),
      };
      widthOfPopup = '545px';
    } else if (forOptn == 'confirm_moving_to_message') {
      tempData = {
        'option': forOptn
      };
    } else if (forOptn == 'payment_info_required') {
      tempData = {
        'option': forOptn
      };
    }

    // console.log('tempData', tempData);
    let tempdialogRef = this.dialog.open(CourseDialogComponent, {
      width: widthOfPopup,
      disableClose: false,
      data: tempData
    });

    let tempdialogRefconst2 = tempdialogRef.componentInstance.onSendingQuotaionBeforeHire.subscribe(($event) => {
      console.log('totalDataToSend', totalDataToSend);
      if ($event) {
        this.commonservice.postHttpCall({ url: '/doers/submit-quotation', data: totalDataToSend, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
      }
    });

    let tempdialogRefconst3 = tempdialogRef.componentInstance.paymentRequestSend.subscribe(($event) => {
    });

    let tempdialogRefconst4 = tempdialogRef.componentInstance.paymentInfoRequestSend.subscribe(($event) => {
      if ($event) {
        this.goToAccountPaymentSettings();
      }
    });
  }

  onCancel() {
    Swal({
      title: 'Do you want to save your changes?',
      text: '',
      //type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e4864a',
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    }).then(res => {
      if (res.value) {
        if (this.quotationDetails && this.fetchedPinDetails.status != 1) {
          $('#save_only').trigger('click');
        } else {
          $('#save').trigger('click');
        }
      } else {
        this.router.navigate(['/doer/quotation-preview/' + this.pinSlug]);
      }
    });
  }

  /**
   * Requests payment
   */
  requestPayment() {
    this.openDialog();
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

  ngOnDestroy() {
    if (this.openModalConfirmationPopup) {
      this.openModalConfirmationPopup.unsubscribe();
    }

    if (this.openModalConfirmationData) {
      this.openModalConfirmationData.unsubscribe();
    }
  }

  goToAccountPaymentSettings() {
    localStorage.setItem("open_payment_popup", "1");
    this.router.navigate(['/doer/account-settings']);
  }

  checkDoerHasCreditCard() {
    this.commonservice.postHttpCall({ 
      url: '/doers/check-total-credit-cards',
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status) {
        this.creditCardCount = result.card_count;

        if (result.card_count == 0) {
          this.openDialog('payment_info_required');
        }
      }
    });
  }  

}
