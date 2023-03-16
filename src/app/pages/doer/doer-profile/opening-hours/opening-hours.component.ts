import { Component, OnInit, Output, Input, ViewChild, Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.scss']
})
export class OpeningHoursComponent implements OnInit {

  @Input()
  isOpeningHours = false;

  @Output() listingPopulated = new EventEmitter();

  @ViewChild('popUpVar')
  popupref;

  public sundclose = false;
  public sundFrm = '';
  public sundTo = '';

  public mondclose = false;
  public mundTo = '';
  public mundFrm = '';

  public tuesClosed = false;
  public tuesTo = '';
  public tuesFrm = '';

  public wedClosed = false;
  public wedTo = '';
  public wedFrm = '';

  public thursClosed = false;
  public thursTo = '';
  public thursFrm = '';

  public friClosed = false;
  public friTo = '';
  public friFrm = '';

  public satClosed = false;
  public satTo = '';
  public satFrm = '';

  public showData = false;

  /*new*/
  amppm = ['AM', 'PM'];
  hours = ['12:00', '12:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '11:59'];
  sunday_start_timeampm: any;
  sunday_end_timeampm: any;

  monday_start_timeampm: any;
  monday_end_timeampm: any;

  tuesday_start_timeampm: any;
  tuesday_end_timeampm: any;

  wednesday_start_timeampm: any;
  wednesday_end_timeampm: any;

  thursday_start_timeampm: any;
  thursday_end_timeampm: any;

  friday_start_timeampm: any;
  friday_end_timeampm: any;

  saturday_start_timeampm: any;
  saturday_end_timeampm: any;

  twentyfoursevenchecked = false;

  greenColor = 'green';
  formValChanged = false;
  backbtnPressed = false;

  constructor(
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    public snackBar: MatSnackBar) {
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

  ngOnInit() {
  }

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
          confirmButtonColor: '#bad141',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            console.log('done');
            $('#submit-opening').trigger('click');
            // this.renderer.removeClass(this.popupref.nativeElement, 'opened');
            // this.renderer.removeClass(document.body, 'popup-open');
            //this.commonservice.postHttpCall({url:'/pinners/reject-doer-application', data:{'application_id':applnId}, contenttype:"application/json"}).then(result=>this.onRejectSuccess(result));
          } else {
            this.renderer.removeClass(this.popupref.nativeElement, 'opened');
            this.renderer.removeClass(document.body, 'popup-open');
          }
        })
      } else {
        this.renderer.removeClass(this.popupref.nativeElement, 'opened');
        this.renderer.removeClass(document.body, 'popup-open');
      }
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  mainObj = {};

  /**
   * Creates obj
   * @param obj 
   * @returns  
   */
  createObj(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        console.log(typeof (obj[prop]));
        if (typeof (obj[prop]) === 'object') {
          this.createObj(obj[prop]);
        } else {
          this.mainObj[prop] = obj[prop];
        }
      }
    }
    return this.mainObj;
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
   * Changedtwentyfoursevens opening hours component
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
    console.log(validcheck);
    if (validcheck) {
      this.mainObj = {};
      let wholeObj = this.createObj(values);
      console.log(wholeObj);
      this.commonservice.postHttpCall({ url: '/doers/update-opening-hrs', data: wholeObj, contenttype: 'application/json' }).then(result => this.submitFunSuccess(result));
    }
  }

  /**
   * Submits fun success
   * @param response 
   */
  submitFunSuccess(response) {
    console.log(response);
    if (response.status == 1) {
      this.getOpeningHours();
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
      if (this.backbtnPressed) {
        console.log('ayan', this.backbtnPressed);
        this.renderer.removeClass(this.popupref.nativeElement, 'opened');
        this.renderer.removeClass(document.body, 'popup-open');
        this.backbtnPressed = false;
      }
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
    console.log(response);
    if (response.status == 1) {

      if (response.data != null) {
        this.openingHrsData = response.data;
        this.showData = true;
        this.listingPopulated.emit(true);
        this.sundclose = JSON.parse(response.data.sunday);
        this.mondclose = JSON.parse(response.data.monday);
        this.tuesClosed = JSON.parse(response.data.tuesday);
        this.wedClosed = JSON.parse(response.data.wednesday);
        this.thursClosed = JSON.parse(response.data.thursday);
        this.friClosed = JSON.parse(response.data.friday);
        this.satClosed = JSON.parse(response.data.saturday);
        this.twentyfoursevenchecked = JSON.parse(response.data.twentyfoursevenselection);
      }

      //this.sundclose    = true;//Closed for the day
      //console.log('sunday',(JSON.parse(response.data.sunday)));
      if (response.data != null && !(JSON.parse(response.data.sunday))) {
        this.sundFrm = response.data.sunday_start_time.split(' ')[0];
        this.sundTo = response.data.sunday_end_time.split(' ')[0];
        this.sunday_start_timeampm = response.data.sunday_start_time.split(' ')[1].toUpperCase();
        this.sunday_end_timeampm = response.data.sunday_end_time.split(' ')[1].toUpperCase();
      }

      //this.mondclose    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.monday))) {
        this.mundTo = response.data.monday_end_time.split(' ')[0];
        this.mundFrm = response.data.monday_start_time.split(' ')[0];
        this.monday_start_timeampm = response.data.monday_start_time.split(' ')[1].toUpperCase();
        this.monday_end_timeampm = response.data.monday_end_time.split(' ')[1].toUpperCase();
      }

      //this.tuesClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.tuesday))) {
        this.tuesTo = response.data.tuesday_end_time.split(' ')[0];
        this.tuesFrm = response.data.tuesday_start_time.split(' ')[0];
        this.tuesday_start_timeampm = response.data.tuesday_start_time.split(' ')[1].toUpperCase();
        this.tuesday_end_timeampm = response.data.tuesday_end_time.split(' ')[1].toUpperCase();
      }

      //this.wedClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.wednesday))) {
        this.wedTo = response.data.wednesday_end_time.split(' ')[0];
        this.wedFrm = response.data.wednesday_start_time.split(' ')[0];
        this.wednesday_start_timeampm = response.data.wednesday_start_time.split(' ')[1].toUpperCase();
        this.wednesday_end_timeampm = response.data.wednesday_end_time.split(' ')[1].toUpperCase();
      }

      //this.thursClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.thursday))) {
        this.thursTo = response.data.thursday_end_time.split(' ')[0];
        this.thursFrm = response.data.thursday_start_time.split(' ')[0];
        this.thursday_start_timeampm = response.data.thursday_start_time.split(' ')[1].toUpperCase();
        this.thursday_end_timeampm = response.data.thursday_end_time.split(' ')[1].toUpperCase();
      }

      //this.friClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.friday))) {
        this.friTo = response.data.friday_end_time.split(' ')[0];
        this.friFrm = response.data.friday_start_time.split(' ')[0];
        this.friday_start_timeampm = response.data.friday_start_time.split(' ')[1].toUpperCase();
        this.friday_end_timeampm = response.data.friday_end_time.split(' ')[1].toUpperCase();
      }

      //this.satClosed    = true;//Closed for the day
      if (response.data != null && !(JSON.parse(response.data.saturday))) {
        this.satTo = response.data.saturday_end_time.split(' ')[0];
        this.satFrm = response.data.saturday_start_time.split(' ')[0];
        this.saturday_start_timeampm = response.data.saturday_start_time.split(' ')[1].toUpperCase();
        this.saturday_end_timeampm = response.data.saturday_end_time.split(' ')[1].toUpperCase();
      }
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
