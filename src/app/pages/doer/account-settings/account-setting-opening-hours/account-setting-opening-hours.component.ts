import { Component, OnInit, Output, Input, ViewChild, Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'account-setting-opening-hours',
  templateUrl: './account-setting-opening-hours.component.html',
  styleUrls: ['./account-setting-opening-hours.component.scss']
})
export class AccountSettingOpeningHoursComponent implements OnInit {

  @Input() isOpeningHours = false;
  @Output() listingPopulated = new EventEmitter();
  @ViewChild('popUpVar') popupref;

  public sundclose = false;
  public sundFrm = '';
  public sundTo = '';
  public sundclose2 = false;
  public sundFrm2 = '';
  public sundTo2 = '';

  public mondclose = false;
  public mundTo = '';
  public mundFrm = '';
  public mondclose2 = false;
  public mundTo2 = '';
  public mundFrm2 = '';

  public tuesClosed = false;
  public tuesTo = '';
  public tuesFrm = '';
  public tuesClosed2 = false;
  public tuesTo2 = '';
  public tuesFrm2 = '';

  public wedClosed = false;
  public wedTo = '';
  public wedFrm = '';
  public wedClosed2 = false;
  public wedTo2 = '';
  public wedFrm2 = '';

  public thursClosed = false;
  public thursTo = '';
  public thursFrm = '';
  public thursClosed2 = false;
  public thursTo2 = '';
  public thursFrm2 = '';

  public friClosed = false;
  public friTo = '';
  public friFrm = '';
  public friClosed2 = false;
  public friTo2 = '';
  public friFrm2 = '';

  public satClosed = false;
  public satTo = '';
  public satFrm = '';
  public satClosed2 = false;
  public satTo2 = '';
  public satFrm2 = '';

  public showData = false;

  /*new*/
  amppm = ['AM', 'PM'];
  hours = ['12:00', '12:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '11:59'];
  sunday_start_timeampm: any;
  sunday_end_timeampm: any;
  sunday_start_timeampm2: any;
  sunday_end_timeampm2: any;

  monday_start_timeampm: any;
  monday_end_timeampm: any;
  monday_start_timeampm2: any;
  monday_end_timeampm2: any;

  tuesday_start_timeampm: any;
  tuesday_end_timeampm: any;
  tuesday_start_timeampm2: any;
  tuesday_end_timeampm2: any;

  wednesday_start_timeampm: any;
  wednesday_end_timeampm: any;
  wednesday_start_timeampm2: any;
  wednesday_end_timeampm2: any;

  thursday_start_timeampm: any;
  thursday_end_timeampm: any;
  thursday_start_timeampm2: any;
  thursday_end_timeampm2: any;

  friday_start_timeampm: any;
  friday_end_timeampm: any;
  friday_start_timeampm2: any;
  friday_end_timeampm2: any;

  saturday_start_timeampm: any;
  saturday_end_timeampm: any;
  saturday_start_timeampm2: any;
  saturday_end_timeampm2: any;

  twentyfoursevenchecked = false;

  greenColor = 'green';
  formValChanged = false;
  backbtnPressed = false;

  doerProfileHoursOfOperationDetails: any = [];
  doer_id: string;
  twentyfoursevenchecked2 = false;


  constructor(
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar) {
    this.doer_id = atob(localStorage.getItem('frontend_user_id'));
    this.sundFrm = this.hours[18];
    this.sundTo = this.hours[10];
    this.sunday_start_timeampm = this.amppm[0];
    this.sunday_end_timeampm = this.amppm[1];
    this.mundTo = this.hours[10];
    this.mundFrm = this.hours[18];
    this.monday_start_timeampm = this.amppm[0];
    this.monday_end_timeampm = this.amppm[1];
    this.tuesTo = this.hours[10];
    this.tuesFrm = this.hours[18];
    this.tuesday_start_timeampm = this.amppm[0];
    this.tuesday_end_timeampm = this.amppm[1];
    this.wedTo = this.hours[10];
    this.wedFrm = this.hours[18];
    this.wednesday_start_timeampm = this.amppm[0];
    this.wednesday_end_timeampm = this.amppm[1];
    this.thursTo = this.hours[10];
    this.thursFrm = this.hours[18];
    this.thursday_start_timeampm = this.amppm[0];
    this.thursday_end_timeampm = this.amppm[1];
    this.friTo = this.hours[10];
    this.friFrm = this.hours[18];
    this.friday_start_timeampm = this.amppm[0];
    this.friday_end_timeampm = this.amppm[1];
    this.satTo = this.hours[10];
    this.satFrm = this.hours[18];
    this.saturday_start_timeampm = this.amppm[0];
    this.saturday_end_timeampm = this.amppm[1];
    this.getOpeningHours();
  }

  ngOnInit() { }

  /**
   * Toggles popup
   * @param [defaultOptn] 
   */
  togglePopup(defaultOptn = 'open') {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      if (defaultOptn == 'back' && this.formValChanged) {
        this.backbtnPressed = true;
        Swal({
          title: 'Do you want to save unsaved information before closing?',
          text: '',
          type: 'warning',
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: '#E6854A',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            $('#submit-opening').trigger('click');
          } else {
            this.setPreviousValues();
            this.renderer.removeClass(this.popupref.nativeElement, 'opened');
            this.renderer.removeClass(document.body, 'popup-open');
          }
        });
      } else {
        this.setPreviousValues();
        this.renderer.removeClass(this.popupref.nativeElement, 'opened');
        this.renderer.removeClass(document.body, 'popup-open');
      }
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  setPreviousValues() {
    this.formValChanged = false;
    this.twentyfoursevenchecked = this.twentyfoursevenchecked2;

    this.sundclose = this.sundclose2;
    this.mondclose = this.mondclose2;
    this.tuesClosed = this.tuesClosed2;
    this.wedClosed = this.wedClosed2;
    this.thursClosed = this.thursClosed2;
    this.friClosed = this.friClosed2;
    this.satClosed = this.satClosed2;

    this.sundTo = this.sundTo2;
    this.sundFrm = this.sundFrm2;
    this.sunday_start_timeampm = this.sunday_start_timeampm2;
    this.sunday_end_timeampm = this.sunday_end_timeampm2;

    this.mundTo = this.mundTo2;
    this.mundFrm = this.mundFrm2;
    this.monday_start_timeampm = this.monday_start_timeampm2;
    this.monday_end_timeampm = this.monday_end_timeampm2;

    this.tuesTo = this.tuesTo2;
    this.tuesFrm = this.tuesFrm2;
    this.tuesday_start_timeampm = this.tuesday_start_timeampm2;
    this.tuesday_end_timeampm = this.tuesday_end_timeampm2;

    this.wedTo = this.wedTo2;
    this.wedFrm = this.wedFrm2;
    this.wednesday_start_timeampm = this.wednesday_start_timeampm2;
    this.wednesday_end_timeampm = this.wednesday_end_timeampm2;

    this.thursTo = this.thursTo2;
    this.thursFrm = this.thursFrm2;
    this.thursday_start_timeampm = this.thursday_start_timeampm2;
    this.thursday_end_timeampm = this.thursday_end_timeampm2;

    this.friTo = this.friTo2;
    this.friFrm = this.friFrm2;
    this.friday_start_timeampm = this.friday_start_timeampm2;
    this.friday_end_timeampm = this.friday_end_timeampm2;

    this.satTo = this.satTo2;
    this.satFrm = this.satFrm2;
    this.saturday_start_timeampm = this.saturday_start_timeampm2;
    this.saturday_end_timeampm = this.saturday_end_timeampm2;
  }

  mainObj = {};

  /**
   * Creates obj
   * @param obj 
   * @returns  
   */
  createObj(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof (obj[prop]) === 'object') {
          this.createObj(obj[prop]);
        } else {
          this.mainObj[prop] = obj[prop];
        }
      }
    }
    return this.mainObj;
  }

  getDoerProfileHoursOfOperation() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-profile-hours-of-operation',
        data: { user_id: this.doer_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          const doerProfileHoursOfOperationDetails = result.data.rows[0];

          this.doerProfileHoursOfOperationDetails.sundayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.sunday_end_time, doerProfileHoursOfOperationDetails.sunday_start_time);
          this.doerProfileHoursOfOperationDetails.sunday = doerProfileHoursOfOperationDetails.sunday;
          this.doerProfileHoursOfOperationDetails.sunday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.sunday_start_time);
          this.doerProfileHoursOfOperationDetails.sunday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.sunday_end_time);

          this.doerProfileHoursOfOperationDetails.mondayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.monday_end_time, doerProfileHoursOfOperationDetails.monday_start_time);
          this.doerProfileHoursOfOperationDetails.monday = doerProfileHoursOfOperationDetails.monday;
          this.doerProfileHoursOfOperationDetails.monday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.monday_start_time);
          this.doerProfileHoursOfOperationDetails.monday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.monday_end_time);

          this.doerProfileHoursOfOperationDetails.tuesdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.tuesday_end_time, doerProfileHoursOfOperationDetails.tuesday_start_time);
          this.doerProfileHoursOfOperationDetails.tuesday = doerProfileHoursOfOperationDetails.tuesday;
          this.doerProfileHoursOfOperationDetails.tuesday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.tuesday_start_time);
          this.doerProfileHoursOfOperationDetails.tuesday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.tuesday_end_time);

          this.doerProfileHoursOfOperationDetails.wednesdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.wednesday_end_time, doerProfileHoursOfOperationDetails.wednesday_start_time);
          this.doerProfileHoursOfOperationDetails.wednesday = doerProfileHoursOfOperationDetails.wednesday;
          this.doerProfileHoursOfOperationDetails.wednesday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.wednesday_start_time);
          this.doerProfileHoursOfOperationDetails.wednesday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.wednesday_end_time);

          this.doerProfileHoursOfOperationDetails.thursdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.thursday_end_time, doerProfileHoursOfOperationDetails.thursday_start_time);
          this.doerProfileHoursOfOperationDetails.thursday = doerProfileHoursOfOperationDetails.thursday;
          this.doerProfileHoursOfOperationDetails.thursday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.thursday_start_time);
          this.doerProfileHoursOfOperationDetails.thursday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.thursday_end_time);

          this.doerProfileHoursOfOperationDetails.fridayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.friday_end_time, doerProfileHoursOfOperationDetails.friday_start_time);
          this.doerProfileHoursOfOperationDetails.friday = doerProfileHoursOfOperationDetails.friday;
          this.doerProfileHoursOfOperationDetails.friday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.friday_start_time);
          this.doerProfileHoursOfOperationDetails.friday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.friday_end_time);

          this.doerProfileHoursOfOperationDetails.saturdayDiffer = this.timeDifferBetweenTwoTime(doerProfileHoursOfOperationDetails.saturday_end_time, doerProfileHoursOfOperationDetails.saturday_start_time);
          this.doerProfileHoursOfOperationDetails.saturday = doerProfileHoursOfOperationDetails.saturday;
          this.doerProfileHoursOfOperationDetails.saturday_start_time = this.tConvert(doerProfileHoursOfOperationDetails.saturday_start_time);
          this.doerProfileHoursOfOperationDetails.saturday_end_time = this.tConvert(doerProfileHoursOfOperationDetails.saturday_end_time);
        }
      });
  }

  tConvert(time) {
    if (time) {
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      const newTime = time[0] + time[1] + time[2] + ' ' + time[5];
      return newTime;
    }
  }

  timeDifferBetweenTwoTime(endTime, startTime) {
    // if (startTime == '00:00:00') {
    //   startTime = '24:00:00';
    // }
    // if (endTime == '00:00:00') {
    //   endTime = '24:00:00';
    // }

    let formatedDifferent = '';
    const startDate: any = new Date('January 1, 1970 ' + startTime);
    const endDate: any = new Date('January 1, 1970 ' + endTime);

    let timeDiff = Math.abs(startDate - endDate);

    let hh: any = Math.floor(timeDiff / 1000 / 60 / 60);
    if (hh < 10) {
      hh = '0' + hh;
    }
    formatedDifferent = hh + 'H ';
    timeDiff -= hh * 1000 * 60 * 60;
    let mm: any = Math.floor(timeDiff / 1000 / 60);
    if (mm != 0) {
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (mm == 59 || mm == 30) {
        mm = 0;
        hh++;
        formatedDifferent = hh + 'H ';
      }
      timeDiff -= mm * 1000 * 60;
      if (mm != 0) {
        formatedDifferent = formatedDifferent + mm + 'M ';
      }
    }

    return formatedDifferent;
  }

  /**
   * Sets default hrs
   * @param day 
   */
  setDefaultHrs(day) {
    if (!this.formValChanged) {
      this.formValChanged = true;
    }
    if (day == 'sunday' && !this.sundclose) {
      this.sundFrm = this.hours[18];
      this.sundTo = this.hours[10];
      this.sunday_start_timeampm = this.amppm[0];
      this.sunday_end_timeampm = this.amppm[1];
    } else if (day == 'monday' && !this.mondclose) {
      this.mundTo = this.hours[10];
      this.mundFrm = this.hours[18];
      this.monday_start_timeampm = this.amppm[0];
      this.monday_end_timeampm = this.amppm[1];
    } else if (day == 'tuesday' && !this.tuesClosed) {
      this.tuesTo = this.hours[10];
      this.tuesFrm = this.hours[18];
      this.tuesday_start_timeampm = this.amppm[0];
      this.tuesday_end_timeampm = this.amppm[1];
    } else if (day == 'wednesday' && !this.wedClosed) {
      this.wedTo = this.hours[10];
      this.wedFrm = this.hours[18];
      this.wednesday_start_timeampm = this.amppm[0];
      this.wednesday_end_timeampm = this.amppm[1];
    } else if (day == 'thursday' && !this.thursClosed) {
      this.thursTo = this.hours[10];
      this.thursFrm = this.hours[18];
      this.thursday_start_timeampm = this.amppm[0];
      this.thursday_end_timeampm = this.amppm[1];
    } else if (day == 'friday' && !this.friClosed) {
      this.friTo = this.hours[10];
      this.friFrm = this.hours[18];
      this.friday_start_timeampm = this.amppm[0];
      this.friday_end_timeampm = this.amppm[1];
    } else if (day == 'saturday' && !this.satClosed) {
      this.satTo = this.hours[10];
      this.satFrm = this.hours[18];
      this.saturday_start_timeampm = this.amppm[0];
      this.saturday_end_timeampm = this.amppm[1];
    }
  }

  /**
   * Changedtwentyfoursevens account setting opening hours component
   * @param evt 
   */
  changedtwentyfourseven(evt) {
    this.twentyfoursevenchecked = evt.checked;
    this.formValChanged = true;
    //console.log(this.twentyfoursevenchecked);
    if (this.twentyfoursevenchecked) {
      this.sundclose = false;
      this.mondclose = false;
      this.tuesClosed = false;
      this.wedClosed = false;
      this.thursClosed = false;
      this.friClosed = false;
      this.satClosed = false;
      /*this.setfromTime(this.sundFrm,this.sunday_start_timeampm);*/
      this.sundFrm = this.hours[0];
      this.sundTo = this.hours[this.hours.length - 1];
      this.sunday_start_timeampm = this.amppm[0];
      this.sunday_end_timeampm = this.amppm[1];
      this.mundTo = this.hours[this.hours.length - 1];
      this.mundFrm = this.hours[0];
      this.monday_start_timeampm = this.amppm[0];
      this.monday_end_timeampm = this.amppm[1];
      this.tuesTo = this.hours[this.hours.length - 1];
      this.tuesFrm = this.hours[0];
      this.tuesday_start_timeampm = this.amppm[0];
      this.tuesday_end_timeampm = this.amppm[1];
      this.wedTo = this.hours[this.hours.length - 1];
      this.wedFrm = this.hours[0];
      this.wednesday_start_timeampm = this.amppm[0];
      this.wednesday_end_timeampm = this.amppm[1];
      this.thursTo = this.hours[this.hours.length - 1];
      this.thursFrm = this.hours[0];
      this.thursday_start_timeampm = this.amppm[0];
      this.thursday_end_timeampm = this.amppm[1];
      this.friTo = this.hours[this.hours.length - 1];
      this.friFrm = this.hours[0];
      this.friday_start_timeampm = this.amppm[0];
      this.friday_end_timeampm = this.amppm[1];
      this.satTo = this.hours[this.hours.length - 1];
      this.satFrm = this.hours[0];
      this.saturday_start_timeampm = this.amppm[0];
      this.saturday_end_timeampm = this.amppm[1];
    } else {
      this.sundclose = false;
      this.mondclose = false;
      this.tuesClosed = false;
      this.wedClosed = false;
      this.thursClosed = false;
      this.friClosed = false;
      this.satClosed = false;
      this.sundFrm = this.hours[18];
      this.sundTo = this.hours[10];
      this.sunday_start_timeampm = this.amppm[0];
      this.sunday_end_timeampm = this.amppm[1];
      this.mundTo = this.hours[10];
      this.mundFrm = this.hours[18];
      this.monday_start_timeampm = this.amppm[0];
      this.monday_end_timeampm = this.amppm[1];
      this.tuesTo = this.hours[10];
      this.tuesFrm = this.hours[18];
      this.tuesday_start_timeampm = this.amppm[0];
      this.tuesday_end_timeampm = this.amppm[1];
      this.wedTo = this.hours[10];
      this.wedFrm = this.hours[18];
      this.wednesday_start_timeampm = this.amppm[0];
      this.wednesday_end_timeampm = this.amppm[1];
      this.thursTo = this.hours[10];
      this.thursFrm = this.hours[18];
      this.thursday_start_timeampm = this.amppm[0];
      this.thursday_end_timeampm = this.amppm[1];
      this.friTo = this.hours[10];
      this.friFrm = this.hours[18];
      this.friday_start_timeampm = this.amppm[0];
      this.friday_end_timeampm = this.amppm[1];
      this.satTo = this.hours[10];
      this.satFrm = this.hours[18];
      this.saturday_start_timeampm = this.amppm[0];
      this.saturday_end_timeampm = this.amppm[1];
    }
  }

  /**
   * Submits function
   * @param values 
   * @param validcheck 
   * @param totForm 
   */
  submitFunction(values, validcheck, totForm) {
    if (validcheck) {
      this.mainObj = {};
      const wholeObj = this.createObj(values);
      this.commonservice.postHttpCall({ url: '/doers/update-opening-hrs', data: wholeObj, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
    }
  }

  /**
   * Submits fun success
   * @param response 
   */
  submitFunSuccess(response) {
    if (response.status == 1) {
      this.getOpeningHours();
      this.responseMessageSnackBar(response.msg , 'orangeSnackBar');
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      this.formValChanged = false;
    }
  }

  openingHrsData = {};
  /**
   * Gets opening hours
   */
  getOpeningHours() {
    this.commonservice.postHttpCall({ url: '/doers/get-opening-hrs', data: {}, contenttype: 'application/json' }).then(result => this.openingHrsSuccess(result));
  }

  /**
   * Opening hrs success
   * @param response 
   */
  openingHrsSuccess(response) {
    if (response.status == 1) {
      if (response.data != null) {
        this.openingHrsData = response.data;
        this.showData = true;
        if (response.data) {
          this.listingPopulated.emit(true);
        } else {
          this.listingPopulated.emit(false);
        }
        this.sundclose = JSON.parse(response.data.sunday);
        this.mondclose = JSON.parse(response.data.monday);
        this.tuesClosed = JSON.parse(response.data.tuesday);
        this.wedClosed = JSON.parse(response.data.wednesday);
        this.thursClosed = JSON.parse(response.data.thursday);
        this.friClosed = JSON.parse(response.data.friday);
        this.satClosed = JSON.parse(response.data.saturday);
        this.twentyfoursevenchecked = JSON.parse(response.data.twentyfoursevenselection);

        this.sundclose2 = this.sundclose;
        this.mondclose2 = this.mondclose;
        this.tuesClosed2 = this.tuesClosed;
        this.wedClosed2 = this.wedClosed;
        this.thursClosed2 = this.thursClosed;
        this.friClosed2 = this.friClosed;
        this.satClosed2 = this.satClosed;
        this.twentyfoursevenchecked2 = this.twentyfoursevenchecked;
      }

      //console.log('sunday',(JSON.parse(response.data.sunday)));
      if (response.data != null && !(JSON.parse(response.data.sunday))) {
        this.sundFrm = response.data.sunday_start_time.split(' ')[0];
        this.sundTo = response.data.sunday_end_time.split(' ')[0];
        this.sunday_start_timeampm = response.data.sunday_start_time.split(' ')[1].toUpperCase();
        this.sunday_end_timeampm = response.data.sunday_end_time.split(' ')[1].toUpperCase();

        this.sundTo2 = this.sundTo;
        this.sundFrm2 = this.sundFrm;
        this.sunday_start_timeampm2 = this.sunday_start_timeampm;
        this.sunday_end_timeampm2 = this.sunday_end_timeampm;
      }

      //this.mondclose    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.monday))) {
        this.mundTo = response.data.monday_end_time.split(' ')[0];
        this.mundFrm = response.data.monday_start_time.split(' ')[0];
        this.monday_start_timeampm = response.data.monday_start_time.split(' ')[1].toUpperCase();
        this.monday_end_timeampm = response.data.monday_end_time.split(' ')[1].toUpperCase();

        this.mundTo2 = this.mundTo;
        this.mundFrm2 = this.mundFrm;
        this.monday_start_timeampm2 = this.monday_start_timeampm;
        this.monday_end_timeampm2 = this.monday_end_timeampm;
      }

      //this.tuesClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.tuesday))) {
        this.tuesTo = response.data.tuesday_end_time.split(' ')[0];
        this.tuesFrm = response.data.tuesday_start_time.split(' ')[0];
        this.tuesday_start_timeampm = response.data.tuesday_start_time.split(' ')[1].toUpperCase();
        this.tuesday_end_timeampm = response.data.tuesday_end_time.split(' ')[1].toUpperCase();

        this.tuesTo2 = this.tuesTo;
        this.tuesFrm2 = this.tuesFrm;
        this.tuesday_start_timeampm2 = this.tuesday_start_timeampm;
        this.tuesday_end_timeampm2 = this.tuesday_end_timeampm;
      }

      //this.wedClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.wednesday))) {
        this.wedTo = response.data.wednesday_end_time.split(' ')[0];
        this.wedFrm = response.data.wednesday_start_time.split(' ')[0];
        this.wednesday_start_timeampm = response.data.wednesday_start_time.split(' ')[1].toUpperCase();
        this.wednesday_end_timeampm = response.data.wednesday_end_time.split(' ')[1].toUpperCase();

        this.wedTo2 = this.wedTo;
        this.wedFrm2 = this.wedFrm;
        this.wednesday_start_timeampm2 = this.wednesday_start_timeampm;
        this.wednesday_end_timeampm2 = this.wednesday_end_timeampm;
      }

      //this.thursClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.thursday))) {
        this.thursTo = response.data.thursday_end_time.split(' ')[0];
        this.thursFrm = response.data.thursday_start_time.split(' ')[0];
        this.thursday_start_timeampm = response.data.thursday_start_time.split(' ')[1].toUpperCase();
        this.thursday_end_timeampm = response.data.thursday_end_time.split(' ')[1].toUpperCase();

        this.thursTo2 = this.thursTo;
        this.thursFrm2 = this.thursFrm;
        this.thursday_start_timeampm2 = this.thursday_start_timeampm;
        this.thursday_end_timeampm2 = this.thursday_end_timeampm;
      }

      //this.friClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.friday))) {
        this.friTo = response.data.friday_end_time.split(' ')[0];
        this.friFrm = response.data.friday_start_time.split(' ')[0];
        this.friday_start_timeampm = response.data.friday_start_time.split(' ')[1].toUpperCase();
        this.friday_end_timeampm = response.data.friday_end_time.split(' ')[1].toUpperCase();

        this.friTo2 = this.friTo;
        this.friFrm2 = this.friFrm;
        this.friday_start_timeampm2 = this.friday_start_timeampm;
        this.friday_end_timeampm2 = this.friday_end_timeampm;
      }

      //this.satClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.saturday))) {
        this.satTo = response.data.saturday_end_time.split(' ')[0];
        this.satFrm = response.data.saturday_start_time.split(' ')[0];
        this.saturday_start_timeampm = response.data.saturday_start_time.split(' ')[1].toUpperCase();
        this.saturday_end_timeampm = response.data.saturday_end_time.split(' ')[1].toUpperCase();

        this.satTo2 = this.satTo;
        this.satFrm2 = this.satFrm;
        this.saturday_start_timeampm2 = this.saturday_start_timeampm;
        this.saturday_end_timeampm2 = this.saturday_end_timeampm;
      }

      this.getDoerProfileHoursOfOperation();
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
}
