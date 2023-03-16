import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../global_constant';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;
declare var window: any;

@Component({
  selector: 'app-pinner-dashboard',
  templateUrl: './pinner-dashboard.component.html',
  styleUrls: ['./pinner-dashboard.component.scss']
})
export class PinnerDashboardComponent implements OnInit {

  ongoingPinList = [];
  quotaionList = [];
  favDoerList = [];
  newDoerList = [];
  baseCompUrl: any;
  interval: any;
  toDoList = [];
  locations = [];

  total_pindo_dollars: Number;

  selected: any;
  months = [
    { value: 1, viewValue: 'Month - Jan' },
    { value: 2, viewValue: 'Month - Feb' },
    { value: 3, viewValue: 'Month - Mar' },
    { value: 4, viewValue: 'Month - Apr' },
    { value: 5, viewValue: 'Month - May' },
    { value: 6, viewValue: 'Month - Jun' },
    { value: 7, viewValue: 'Month - Jul' },
    { value: 8, viewValue: 'Month - Aug' },
    { value: 9, viewValue: 'Month - Sep' },
    { value: 10, viewValue: 'Month - Oct' },
    { value: 11, viewValue: 'Month - Nov' },
    { value: 12, viewValue: 'Month - Dec' }
  ];

  selectedOption = 'Weekly';
  chosseweeklyordaily = ['Weekly', 'Daily'];
  currntDate: any;
  total_number_activity: any = [];
  address: any;
  lat: any;
  lng: any;

  pageNumber:number=1;
  toDoLimit:number = 0;
  windowsize:number = 0;

  constructor(public titleService: Title, public commonservice: CommonService, public gbConst: Globalconstant, private router: Router, public snackBar: MatSnackBar) {
    this.titleService.setTitle('My Profile');
    this.baseCompUrl = gbConst.uploadUrl;
    this.populateOngoingPins();
    this.populateSubmittedQuotations();
    this.populateFavDoer();
    this.populateNewDoers();
    this.populateJobStatsgrpah();
    this.currntDate = new Date();
    this.currntDate = this.currntDate.getMonth() + 1;
    this.selected = this.currntDate;
    this.populateDollarChart();
    this.getCommunityActivity();
    this.interval = setInterval(() => {
      this.toDoList=[];
      this.pageNumber=1;
      this.populateToDo();
    }, 30000);
  }

  getEncryptedDoerId(doerId) {
    return btoa(doerId);
  }

  ngOnInit() {
    this.address = localStorage.getItem('pindo_system_current_position_address');
    this.lat = localStorage.getItem('pindo_system_current_position_lat');
    this.lng = localStorage.getItem('pindo_system_current_position_lng');
   
    this.fetchLatLngUsingAddress();
    this.getLocations();
  }

  ngAfterViewInit() {
    this.windowsize = $(window).width();
    $(window).resize(function() {
      this.windowsize = $(window).width();
    });
    if  (this.windowsize > 767) {
      this.toDoLimit = 10;
    }
    else{
      this.toDoLimit = 5;
    }
    this.populateToDo();
  }


  getLocations() {
    this.commonservice.postHttpCall({ url: '/pinners/get-all-locations', contenttype: 'application/json' }).then(result => this.getLocationSuccess(result));
  }

  getLocationSuccess(response) {
    if (response.status == 1) {
      this.locations = JSON.parse(JSON.stringify(response.data.locations));
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  fetchLatLngUsingAddress() {
    $.ajax({
      type: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key='+this.gbConst.google_map_api,
      dataType: 'json',
      async: false,
      success: function (response) {
      }

    });
  }

  

  // lineChart
  // tslint:disable-next-line: member-ordering
  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0, 0] }
  ];
  public lineChartLabels: Array<any> = ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Week 05'];
  public lineChartOptions: any = {
    scaleOverride: true,
    scaleSteps: 1000,
    scaleStepWidth: 10,
    scaleStartValue: 0,
    legend: {
      display: false
    },
    responsive: true,
    options: {
      maintainAspectRatio: false,
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          color: '#f6fafe',
          lineWidth: 1,
          zeroLineColor: '#f6fafe'
        }
      }]
    }
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: '#50e3c2',
      pointBackgroundColor: '#50e3c2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



  public doughnutChartColors: any[] = [{ backgroundColor: ['#67e32f', '#579cee'] }];
  public doughnutChartLabels: string[] = ['Completed Pins', 'Ongoing Pins'];
  public doughnutChartData: number[] = [0, 0];
  public doughnutChartType: string = 'doughnut';
  private doughnutChartOptions: any = {
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


  populateOngoingPins() {
    this.commonservice.postHttpCall({ url: '/pinners/dashboard-ongoing-pins', contenttype: 'application/json' }).then(result => this.onpopulateOngoingPinsSuccess(result));
  }

  onpopulateOngoingPinsSuccess(response) {
    if (response.status == 1) {
      this.ongoingPinList = response.data;
    }
  }

  populateSubmittedQuotations() {
    this.commonservice.postHttpCall({ url: '/pinners/submitted-quotations', contenttype: 'application/json' }).then(result => this.onpopulateSubmittedQuotationsSuccess(result));
  }

  onpopulateSubmittedQuotationsSuccess(response) {
    if (response.status == 1) {
      this.quotaionList = response.data;
    }
  }

  populateFavDoer() {
    this.commonservice.postHttpCall({ url: '/pinners/fauourite-doers', contenttype: 'application/json' }).then(result => this.onpopulateFavDoerSuccess(result));
  }

  onpopulateFavDoerSuccess(response) {
    if (response.status == 1) {
      this.favDoerList = response.data;
    }
  }

  populateNewDoers() {
    this.commonservice.postHttpCall({ url: '/pinners/new-doers', contenttype: 'application/json' }).then(result => this.onpopulateNewDoersSuccess(result));
  }

  onpopulateNewDoersSuccess(response) {
    if (response.status == 1) {
      this.newDoerList = response.data;
    }
  }

  populateJobStatsgrpah() {
    this.commonservice.postHttpCall({ url: '/pinners/donut-chart-data', contenttype: 'application/json' }).then(result => this.onpopulateJobStatsgrpahSuccess(result));
  }

  onpopulateJobStatsgrpahSuccess(response) {
    if (response.status == 1) {
      this.doughnutChartData = response.data;
    }
  }

  populateDollarChart() {
    this.commonservice.postHttpCall({ url: '/pinners/dollar-chart-data', data: { 'month': this.selected, 'chartOption': this.selectedOption }, contenttype: 'application/json' }).then(result => this.onpopulateDollarChartSuccess(result));
  }

  onpopulateDollarChartSuccess(response) {
    if (response.status == 1) {
      this.lineChartData = [
        { data: response['data']['data'] }
      ];
      this.lineChartLabels = response['data']['lables'];
      this.total_pindo_dollars = response['data']['total_pindo_dollars'];
    }
  }

  onYearSelect() {
    this.populateDollarChart();
  }

  onweekordailySelect() {
    this.populateDollarChart();
  }

  convertToarray(ratingCount) {
    let tempratingArray = [];
    return tempratingArray;
  }

  populateToDo() {
    this.commonservice.postHttpCall({ url: '/pinners/dashboard-todo-list',data: { 'page': this.pageNumber,'limit':this.toDoLimit }, contenttype: 'application/json' }).then(result => this.onpopulateToDoSuccess(result));
  }

  onpopulateToDoSuccess(response) {

    if (response.status == 1) {
      if(this.toDoList.length==0) {
        this.toDoList = response.data;
      } else {
        for (let index in response.data) {
          if (index != 'insert') {
            this.toDoList.push(response.data[index]);
          }
        }
      }
      // console.log( this.toDoList);
    } else{
      if(this.pageNumber>1){
        this.pageNumber--;
      }
    }
  }

   /**
   * Onscrolls todo load
   */
  onscrollTodoLoad(limitPage){
    // console.log("Hello scroll");
    if(this.toDoLimit == limitPage) {
    this.pageNumber++;
    this.populateToDo();
    } else {
      console.log("NOT MATCH PAGE");
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
   * Removes to do list
   * @param link 
   * @param notification_id 
   */
  removeToDoList(index,link, notification_id) {
    Swal({
      title: 'Are you sure you want to remove this To-Do?',
      text: '',
      // type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#bad141',
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
    if (response.status == 1) {
      this.toDoList.splice(index,1);
      // this.populateToDo();
      this.responseMessageSnackBar(response.msg);
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  /**
   * Goto todo link
   * @param toDetails 
   */
  gotoTodoLink(toDetails) {
    if (toDetails.todo_link == 'doer/chat' || toDetails.todo_link == 'pinner/chat') {
      let user_type = toDetails.todo_link=='pinner/chat'?1:2; 
      this.commonservice.commonChatRedirectionMethod(toDetails.notification_from, user_type, toDetails.pin_id);
    } else {
      this.router.navigate(['/'+toDetails.todo_link]);
    }
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

}