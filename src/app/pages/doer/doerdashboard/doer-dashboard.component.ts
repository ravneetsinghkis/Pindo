import { Component, OnInit, OnDestroy } from '@angular/core';
import SweetScroll from 'sweet-scroll';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../global_constant';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { Title } from '@angular/platform-browser';
// import { ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EscapeHtmlPipe } from './keep-html.pipe';

declare var jQuery: any;
declare var $: any;
declare var window: any;
declare var Swiper: any;

@Component({
  selector: 'app-doer-dashboard',
  templateUrl: './doer-dashboard.component.html',
  styleUrls: ['./doer-dashboard.component.scss']
})
export class DoerDashboardComponent implements OnInit {
  locations = [];
  ongoingPinList = [];
  doerrating_review = [];
  endorsmentDetails = [];
  selected = '';
  totalEarnings: any;
  toDoList: any = [];
  pin_details: any;
  interval: any;
  foods = [
    { value: '2017', viewValue: 'Year - 2017' },
    { value: '2016', viewValue: 'Year - 2016' },
    { value: '2015', viewValue: 'Year - 2015' }
  ];
  baseCompUrl: any;
  total_number_activity: any = [];
  address: any;
  lat: any;
  lng: any;
  pageNumber: number = 1;
  toDoLimit: number = 0;
  public windowsize: number = 0;

  constructor(public commonservice: CommonService, public gbConst: Globalconstant, private dialog: MatDialog, private titleService: Title, private router: Router, public snackBar: MatSnackBar) {
    this.baseCompUrl = gbConst.uploadUrl;
    this.activePinListPopulate();
    this.populateDoerReviews();
    this.populateEndorsements();
    this.populateJobStatsgrpah();
    this.populateYearOptions();
    // this.populateToDo();
    this.getCommunityActivity();

    this.interval = setInterval(() => {
      this.toDoList=[];
      this.pageNumber = 1;
      this.populateToDo();
      // console.log('toDo');
    }, 30000);

  }

  ngOnInit() {
    var scroller = new SweetScroll({
      header: '',
    }, '#container');
    this.getLocations();
  }

  getLocations() {
    this.address = localStorage.getItem('pindo_system_current_position_address');
    this.lat = localStorage.getItem('pindo_system_current_position_lat');
    this.lng = localStorage.getItem('pindo_system_current_position_lng');
  }

  // toDoLimit number checking

  ngAfterViewInit() {
    setTimeout(() => {
      this.initReviewSlider();
      $('.total_endorse').mCustomScrollbar();
    }, 500);
    //this.titleService.setTitle('My awesome app'); 

    this.windowsize = $(window).width();

    $(window).resize(function () {
      this.windowsize = $(window).width();
    });

    if (this.windowsize > 767) {
      this.toDoLimit = 10;
    }
    else {
      this.toDoLimit = 5;
    }
    this.populateToDo();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public chartColors: any[] = ['red', 'black']

  /*  barchartdata1 = [65, 59, 80, 81, 56, 55, 40, 20];
    barchartdata2 = [28, 48, 40, 19, 86, 27, 90,34];*/

  public barChartData: any[] = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'Total Earning', backgroundColor: '#50e3c2' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'Total Jobs Done', backgroundColor: '#0569c2' }
  ];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        barThickness: 20,
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        stacked: true,
        barThickness: 20,
        gridLines: {
          color: '#f6fafe',
          drawTicks: false,
          zeroLineColor: '#f6fafe',
          zeroLineWidth: 1
        }
      }]
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#989fa6',
        boxWidth: 12,
        defaultFontFamily: 'Montserrat-SemiBold',
        padding: 20
      }
    }
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public doughnutChartColors: any[] = [{ backgroundColor: ['#67e32f', '#579cee'] }];
  public doughnutChartLabels: string[] = ['Completed Pins', 'Active Pins'];
  public doughnutChartData: number[] = [0, 0];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartOptions: any = {
    cutoutPercentage: 65,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#989fa6',
        boxWidth: 12,
        defaultFontFamily: 'Montserrat-SemiBold',
        padding: 20
      }
    }
  }

  approveRejectEndorsement(indexVal, statusVal, msg) {
    Swal({
      title: msg,
      text: '',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Yes',
      // allowOutsideClick: false,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/respose-to-endorsement', data: { 'linked_id': this.toDoList[indexVal]['linked_id'], 'notification_id': this.toDoList[indexVal]['id'], 'status': statusVal }, contenttype: 'application/json' }).then(result => this.onApproveEndorsement(result, indexVal, statusVal));
      } else { }
    })
  }

  onApproveEndorsement(response, index, statusVal) {
    if (response.status == 1) {
        this.toDoList.splice(index,1);
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
   * Payments confirmation
   * @param index 
   * @param linked_id 
   */
  paymentConfirmation(index,linked_id) {
    Swal({
      title: 'Payment Confirmation',
      text: 'By clicking on "Confirm" your are confirming that you have got the payment.',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Confirm',
      // allowOutsideClick: false,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/doer-confirms-payment-received-via-offline', data: { 'quotation_id': linked_id }, contenttype: 'application/json' }).then(result => this.onPaymentConfirnationSuccess(result,index));
      } else { }
    })
  }

  onPaymentConfirnationSuccess(response,index) {
    if (response.status == 1) {
      this.pin_details = response.data;
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.pin_details['pinner_id'],
        'title': ' has received the payment & completed the pin ' + this.pin_details['title'] + '. Please give you feedback for the pin',
        'pin_id': this.pin_details['id'],
        'link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'doer_title': ' Your payment request has been sent',
        'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',
        'doer_link': 'doer/apply-pins/' + this.pin_details['slug']
      };

      this.gbConst.notificationSocket.emit('post-notification-to-pinner', postData);
      setTimeout(() => {
        this.gbConst.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 5000);
      this.toDoList.splice(index,1);
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
   * Payments rejection
   * @param index 
   * @param linked_id 
   */
  paymentRejection(index,linked_id) {
    Swal({
      title: 'Reject Payment Confirmation',
      text: 'Are you sure?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Reject',
      // allowOutsideClick: false,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/doers/doer-rejects-payment-received-via-offline', data: { 'quotation_id': linked_id }, contenttype: 'application/json' }).then(result => this.onPaymentRejectionSuccess(result,index));
      } else { }
    })
  }

  /**
   * Determines whether payment rejection success on
   * @param response 
   * @param index 
   */
  onPaymentRejectionSuccess(response,index) {
   
    
    if (response.status == 1) {
      this.pin_details = response.data;
      var postData = {
        'sender_id': atob(localStorage.getItem('frontend_user_id')),
        'reciver_id': this.pin_details['pinner_id'],
        'title': ' has reejcted the payment confirmation for the pin ' + this.pin_details['title'],
        'pin_id': this.pin_details['id'],
        'link': 'pinner/active-quotation-details/' + this.pin_details['slug'] + '/' + localStorage.getItem('frontend_user_id'),
        'emailTemplateSlug': 'payment_request_submitted_by_doer',
        'doer_title': ' Your payment request has been sent',
        'doerEmailTemplateSlug': 'payment_request_submitted_send_by_doer',
        'doer_link': 'doer/apply-pins/' + this.pin_details['slug']
      };

      this.gbConst.notificationSocket.emit('post-notification-to-pinner', postData);
      setTimeout(() => {
        this.gbConst.notificationSocket.emit('post-notification-to-doer-himself', postData);
      }, 5000);
      this.toDoList.splice(index,1);
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
   * Removes to do list
   * @param link 
   * @param notification_id 
   */
  removeToDoList(index,link, notification_id) {
    Swal({
      title: 'Are you sure you want to remove this ToDo?',
      text: '',
      // type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'Yes',
      // allowOutsideClick: false,
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonservice.postHttpCall({ url: '/remove-todo', data: { notification_id: notification_id }, contenttype: 'application/json' }).then(result => this.removeToDoSuccess(result,index));
      }
    })

  }

  /**
   * Removes to do success
   * @param response 
   */
  removeToDoSuccess(response,index) {
    // console.log(this.toDoList[index]);
    if (response.status == 1) {
      this.toDoList.splice(index,1);
      this.responseMessageSnackBar(response.msg,'orangeSnackBar');
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
    // console.log(this.toDoList);
  }

  /**
   * Populate Active Pins
  */
  activePinListPopulate() {
    this.commonservice.postHttpCall({ url: '/doers/dasboard-ongoing-pins', contenttype: 'application/json' }).then(result => this.activePinListPopulateSuccess(result));
  }

  /**
  * Success function for active Pin list Service Call
  * @param {response} response from service call
 */
  activePinListPopulateSuccess(response) {
    if (response.status == 1) {
      this.ongoingPinList = response.data;
      //console.log(this.ongoingPinList);
    }
  }

  populateDoerReviews() {
    this.commonservice.postHttpCall({ url: '/doers/dashboard-rating-review', contenttype: 'application/json' }).then(result => this.onpopulateDoerReviews(result));
  }

  onpopulateDoerReviews(response) {
    if (response.status == 1) {
      this.doerrating_review = response.data;
    }
  }

  /*
       * initialise review slider
     * 
  */
  initReviewSlider() {
    var swiper = new Swiper('.total_reviewslider .swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });
  }

  /*
       * return an array to represent review ratings
     * @param ratingVal = rating value
     * 
  */
  countratingArray(ratingVal) {
    let tempArray = [];
    for (let i = 1; i <= ratingVal; i++) {
      tempArray.push(i);
    }
    return tempArray;
  }

  /*
       * populate Endorsements
     * 
     * 
   */
  populateEndorsements() {
    this.commonservice.postHttpCall({ url: '/doers/endorsed-categories', contenttype: 'application/json' }).then(result => this.onpopulateEndorsementsSuccess(result));
  }

  /*
      * on populate Endorsements Success
    * @param response = response from api
    * 
  */
  onpopulateEndorsementsSuccess(response) {
    if (response.status == 1) {
      this.endorsmentDetails = response.data;
    }
  }

  populateJobStatsgrpah() {
    this.commonservice.postHttpCall({ url: '/doers/donut-chart-data', contenttype: 'application/json' }).then(result => this.onpopulateJobStatsgrpahSuccess(result));
  }

  onpopulateJobStatsgrpahSuccess(response) {
    if (response.status == 1) {
      this.doughnutChartData = response.data;
    }
  }

  populateEraningChart() {
    this.commonservice.postHttpCall({ url: '/doers/bar-chart-data', data: { 'year': this.selected }, contenttype: 'application/json' }).then(result => this.onpopulateEraningChartSuccess(result));
  }

  onpopulateEraningChartSuccess(response) {
    if (response.status == 1) {
      this.barChartData = [
        { data: response.data.earning_arr, label: 'Total Earning', backgroundColor: '#50e3c2' },
        { data: response.data.completed_pin_arr, label: 'Total Jobs Done', backgroundColor: '#0569c2' }
      ];
      this.totalEarnings = response.data.yearly_earnings;
    }
  }

  populateYearOptions() {
    this.commonservice.postHttpCall({ url: '/year-dropdown-for-dashboard-graph', contenttype: 'application/json' }).then(result => this.onpopulateYearOptionsSuccess(result));
  }

  onpopulateYearOptionsSuccess(response) {
    if (response.status == 1) {
      this.foods = response.data;
      this.selected = response.data.reverse()[0]['value'];
      this.populateEraningChart();
    }
  }

  onYearSelect() {
    this.populateEraningChart()
  }

  /*
   * open popup
   * 
  */
  openDialog(innIndex = null, OutIndex = null) {
    let popup_width: any = '350px';
    let endorseData = this.endorsmentDetails[OutIndex]['child_categories'][innIndex]['endorsements'];

    let popupDta = {
      'endorsementDetails': endorseData
    }

    this.dialog.open(CourseDialogComponent, {
      width: popup_width,
      disableClose: false,
      data: popupDta
    });
  }


  /**
   * Populates to do
   */
  populateToDo() {
    this.commonservice.postHttpCall({ url: '/doers/dashboard-todo-list', data: { 'page': this.pageNumber, 'limit': this.toDoLimit }, contenttype: 'application/json' }).then(result => this.onpopulateToDoSuccess(result));
  }

  /**
   * Onpopulates to do success
   * @param response 
   */
  onpopulateToDoSuccess(response) {
    if (response.status == 1) {
      if (this.toDoList.length == 0) {
        this.toDoList = response.data;
      } else {
        for (let index in response.data) {
          if (index != 'insert') {
            this.toDoList.push(response.data[index]);
          }
        }
      }

    } else {
      if (this.pageNumber > 1) {
        this.pageNumber--;
      }
    }
  }

  /**
   * Onscrolls todo load
   */
  onscrollTodoLoad(limitItem){
    // console.log("Hello");
    if(this.toDoLimit == limitItem) {
    this.pageNumber++;
    this.populateToDo();
    } else {
      console.log("ITEM NOT MATCH");
    }

  }

  /**
 * Gets All community activity
 */
  getCommunityActivity() {
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/community-activity', data: {}, contenttype: 'application/json' }).then(result => {
      if (result.status == 1) {
        this.total_number_activity = result.data;
      }
    });

  }

  /**
   * Responses message snack bar
   * @param message 
   * @param [res_class] 
   * @param [vertical_position] 
   */
  responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

  /**
 * Goto todo link
 * @param toDetails 
 */
  gotoTodoLink(toDetails) {
    if (toDetails.todo_link == 'doer/chat' || toDetails.todo_link == 'pinner/chat') {
      let user_type = toDetails.todo_link == 'pinner/chat' ? 1 : 2;
      this.commonservice.commonChatRedirectionMethod(toDetails.notification_from, user_type, toDetails.pin_id);
    } else {
      this.router.navigate(['/' + toDetails.todo_link]);
    }
  }


}
