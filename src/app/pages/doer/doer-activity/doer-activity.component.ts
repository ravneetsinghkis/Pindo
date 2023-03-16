import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { InviteGuestComponent } from './components/invite-guest/invite-guest.component';
import { ArchiveConfirmationComponent } from './components/archive-confirmation/archive-confirmation.component';


declare var jQuery: any;
declare var $: any;
declare var window: any;
declare var Swiper: any;

@Component({
  selector: 'doer-activity',
  templateUrl: './doer-activity.component.html',
  styleUrls: ['./doer-activity.component.scss']
})
export class DoerActivityComponent implements OnInit {

  doerrating_review = [];
  endorsmentDetails = [];
  selected: number;
  totalEarnings: any;
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



  public windowsize: number = 0;
  pin_details: any;
  currentYear: number;
  downloadKitUrl: string = '#';

  // Todo
  toDoList: any = [];
  toDoLimit: number = 5;
  pageNumber: number = 1;
  toDoCount: number = 0;
  toDoPageTotal = 0;

  // Pins Tab
  pageCount = 1;
  pinLimit = 5;
  filterPinModel = {
    'searchby': '',
    'start_date': '',
    'end_date': ''
  };
  filterByColName = 'created_at';
  orderBy = 'DESC';

  // invited tab
  invitedPins      = [];
  invitedPinsCount = 0;
  invitedPageCount = 1;
  invitedPageTotal = 0;
  isInvitedMsgExists: any = [];
  invitedSortColumn = "created_at";
  invitedSortBy = "DESC";

  // hired tab
  hiredPins      = [];
  hiredPinsCount = 0;
  hiredPageCount = 1;
  hiredPageTotal = 0;
  isHiredMsgExists: any = [];
  hiredSortColumn = "created_at";
  hiredSortBy = "DESC";

  // completed tab
  completedPins      = [];
  completedPinsCount = 0;
  completedPageCount = 1;
  completedPageTotal = 0;
  isCompletedMsgExists: any = [];
  completedSortColumn = "created_at";
  completedSortBy = "DESC";

  // disputed tab
  disputedPins      = [];
  disputedPinsCount = 0;
  disputedPageCount = 1;
  disputedPageTotal = 0;
  isDisputedMsgExists: any = [];
  disputedSortColumn = "created_at";
  disputedSortBy = "DESC";

  // archived tab
  archivedPins      = [];
  archivedPinsCount = 0;
  archivedPageCount = 1;
  archivedPageTotal = 0;
  isArchivedMsgExists: any = [];
  archivedSortColumn = "created_at";
  archivedSortBy = "DESC";

  selectedTypeOfPin = 'Invites';

  // Crew Members
  crewMemberDetails: any;

  // invitations
  selectedInvitationTab: string = 'invited';
  invitationLimit: number = 5;
  invitations = [];
  invitationSortColumn = "first_name";
  invitationSortBy = "ASC";
  invitationPageCount = 1;
  invitationPageTotal = 0;
  lastComment: string = "";

  // sent invitation tab
  sentInvitations = [];
  sentInvitationsCount = 0;

  // accpeted invitation tab
  acceptedInvitations = [];
  acceptedInvitationsCount = 0;

  // archived invitation tab
  archivedInvitations = [];
  archivedInvitationsCount = 0;

  // Crew Earnings
  crewEarningList: any = [];
  crewEarningLimit: number = 5;
  crewEarningPageNumber: number = 1;
  crewEarningPageTotal = 0;
  crewEarningSortColumn = "created_at";
  crewEarningSortBy = "DESC";

  // Transactions
  transactionList: any = [];
  transactionLimit: number = 5;
  transactionPageNumber: number = 1;
  transactionPageTotal = 0;
  transactionSortColumn = "created_at";
  transactionSortBy = "DESC";

  constructor(
    public commonservice: CommonService,
    public gbConst: Globalconstant,
    private dialog: MatDialog,
    private titleService: Title,
    private router: Router,
    public snackBar: MatSnackBar,
  ) {
    this.baseCompUrl = gbConst.uploadUrl;
    this.populateDoerReviews();
    this.populateEndorsements();
    this.populateJobStatsgrpah();
    this.populateYearOptions();
  }

  ngOnInit() {
    var scroller = new SweetScroll({
      header: '',
    }, '#container');
    this.currentYear = (new Date).getFullYear();
    this.getLocations();
    this.getCommunityActivity();
    this.getPinsSummary();
    this.getCrewMemberDetails();
    this.getTransactions();
    this.getDownloadRecrewmentKitUrl();
  }

  getLocations() {
    this.address = localStorage.getItem('pindo_system_current_position_address');
    this.lat = localStorage.getItem('pindo_system_current_position_lat');
    this.lng = localStorage.getItem('pindo_system_current_position_lng');
  }



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

    this.populateToDo();

  }

  ngOnDestroy() {

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
      this.toDoList = response.data;
      this.toDoCount = response.todo_list_total;
      this.toDoPageTotal = Math.ceil(this.toDoCount / this.toDoLimit);
    }
  }

  /**
   * Load previous todos
   * @param elem HTMLElement
   */
  loadPrevToDos(elem) {
    let previousPage = Math.max((this.pageNumber - 1), 1);
    this.pageNumber = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.populateToDo();
    }
  }

  /**
   * Load next todos
   * @param elem HTMLElement
   */
  loadNextToDos(elem) {
    let nextPage = Math.min((this.pageNumber + 1), this.toDoPageTotal);
    this.pageNumber = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.populateToDo();
    }
  }

  /**
   * Toggle the boxes
   * @param elem HTMLElement
   * @param item string
   */
  toggleBox(elem, item) {
    if (elem.classList.contains("comn-expanded")) {
      elem.classList.remove("comn-expanded");
    } else {
      elem.classList.add("comn-expanded");
    }

    if (item.classList.contains("d-none")) {
      item.classList.remove("d-none");
    } else {
      item.classList.add("d-none");
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
   * Get Pins Summary
   */
  getPinsSummary() {
    this.commonservice.postHttpCall({
      url: '/doers/get-pins-summary',
      data: {
        'page'           : this.pageCount,
        'limit'          : this.pinLimit,
        'filterByColName': this.filterByColName,
        'orderBy'        : 'DESC'
      },
      contenttype: 'application/json'
    }).then( async (result) => {
      if (result.status == 1) {
        this.invitePinListPopulateSuccess(result.data.invited_pins);
        this.invitedPinsCount = result.data.invited_pins_count;
        this.invitedPageTotal = Math.ceil(this.invitedPinsCount / this.pinLimit);

        this.hirePinListPopulateSuccess(result.data.hired_pins);
        this.hiredPinsCount = result.data.hired_pins_count;
        this.hiredPageTotal = Math.ceil(this.hiredPinsCount / this.pinLimit);

        this.completePinListPopulateSuccess(result.data.completed_pins);
        this.completedPinsCount = result.data.completed_pins_count;
        this.completedPageTotal = Math.ceil(this.completedPinsCount / this.pinLimit);

        this.disputePinListPopulateSuccess(result.data.disputed_pins);
        this.disputedPinsCount  = result.data.disputed_pins_count;
        this.disputedPageTotal = Math.ceil(this.disputedPinsCount / this.pinLimit);

        this.archivePinListPopulateSuccess(result.data.archived_pins);
        this.archivedPinsCount  = result.data.archived_pins_count;
        this.archivedPageTotal = Math.ceil(this.archivedPinsCount / this.pinLimit);
      }
    });
  }

  /**
   * Filters by column
   * @param clmnName
   * @param evt
   */
  filterByColumn(clmnName, evt, tabName) {
    if (tabName == 'Invites') {
      this.invitedPageCount = 1;
      this.invitedSortBy = (clmnName == this.invitedSortColumn) && (this.invitedSortBy == "DESC") ? "ASC" : "DESC";
      this.invitedSortColumn = clmnName;
      this.invitePinListPopulate();
    } else if (tabName == 'Active') {
      this.hiredPageCount = 1;
      this.hiredSortBy = (clmnName == this.hiredSortColumn) && (this.hiredSortBy == "DESC") ? "ASC" : "DESC";
      this.hiredSortColumn = clmnName;
      this.hiredPinListPopulate();
    } else if (tabName == 'Completed') {
      this.completedPageCount = 1;
      this.completedSortBy = (clmnName == this.completedSortColumn) && (this.completedSortBy == "DESC") ? "ASC" : "DESC";
      this.completedSortColumn = clmnName;
      this.completedPinListPopulate();
    } else if (tabName == 'Dispute') {
      this.disputedPageCount = 1;
      this.disputedSortBy = (clmnName == this.disputedSortColumn) && (this.disputedSortBy == "DESC") ? "ASC" : "DESC";
      this.disputedSortColumn = clmnName;
      this.disputedPinListPopulate();
    } else if (tabName == 'Archive') {
      this.archivedPageCount = 1;
      this.archivedSortBy = (clmnName == this.archivedSortColumn) && (this.archivedSortBy == "DESC") ? "ASC" : "DESC";
      this.archivedSortColumn = clmnName;
      this.archivedPinListPopulate();
    }
  }

  /**
	 * Populate Invite Pins
  */
  invitePinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/doers/fetch-invited-pins',
      data: {
        'page'           : this.invitedPageCount,
        'limit'          : this.pinLimit,
        'totalFilters'   : this.filterPinModel,
        'filterByColName': this.invitedSortColumn,
        'orderBy'        : this.invitedSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.invitePinListPopulateSuccess(response.data);
      }
    })
    .catch(error => console.log(error));
  }

  /**
 	* Success function for invite Pin list Service Call
 	* @param {response} response from service call
  */
  async invitePinListPopulateSuccess(pin_list) {
    this.isInvitedMsgExists = [];

    for (let i = 0; i < pin_list.length; i++) {
      await this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/get-is-message-sent',
        data: {
          'user_id': pin_list[i].pinner_details.id,
          'pin_id': pin_list[i].pin_details.id,
        }
      }).then(res => {
        this.isInvitedMsgExists.push(res.data);
      });
    }

    this.invitedPins = pin_list;
  }

  /**
   * Load previous invited pins
   * @param elem HTMLElement
   */
  loadPrevInvites(elem) {
    let previousPage = Math.max((this.invitedPageCount - 1), 1);
    this.invitedPageCount = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.invitePinListPopulate();
    }
  }

  /**
   * Load next invited pins
   * @param elem HTMLElement
   */
  loadNextInvites(elem) {
    let nextPage = Math.min((this.invitedPageCount + 1), this.invitedPageTotal);
    this.invitedPageCount = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.invitePinListPopulate();
    }
  }

  /**
   * Populate Hire Pins
  */
  hiredPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/doers/fetch-ongoing-pins',
      data: {
        'page'           : this.hiredPageCount,
        'limit'          : this.pinLimit,
        'totalFilters'   : this.filterPinModel,
        'filterByColName': this.hiredSortColumn,
        'orderBy'        : this.hiredSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.hirePinListPopulateSuccess(response.data);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Success function for hire Pin list Service Call
   * @param {response} response from service call
  */
  async hirePinListPopulateSuccess(pin_list) {
    // this.isHiredMsgExists = [];

    // for (let i = 0; i < pin_list.length; i++) {
    //   await this.commonservice.postCommunityHttpCall({
    //     url: '/api/pinner/get-is-message-sent',
    //     data: {
    //       'user_id': pin_list[i].pinner_details.id,
    //       'pin_id': pin_list[i].id,
    //     }
    //   }).then(res => {
    //     this.isHiredMsgExists.push(res.data);
    //   });
    // }

    this.hiredPins = pin_list;
  }

  /**
   * Load previous hired pins
   * @param elem HTMLElement
   */
  loadPrevHires(elem) {
    let previousPage = Math.max((this.hiredPageCount - 1), 1);
    this.hiredPageCount = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.hiredPinListPopulate();
    }
  }

  /**
   * Load next hired pins
   * @param elem HTMLElement
   */
  loadNextHires(elem) {
    let nextPage = Math.min((this.hiredPageCount + 1), this.hiredPageTotal);
    this.hiredPageCount = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.hiredPinListPopulate();
    }
  }

  /**
     * Populate Completed Pins
    */
  completedPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/doers/fetch-completed-pins',
      data: {
        'page'           : this.completedPageCount,
        'limit'          : this.pinLimit,
        'totalFilters'   : this.filterPinModel,
        'filterByColName': this.completedSortColumn,
        'orderBy'        : this.completedSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.completePinListPopulateSuccess(response.data);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Success function for complete Pin list Service Call
   * @param {response} response from service call
  */
  async completePinListPopulateSuccess(pin_list) {
    // this.isCompletedMsgExists = [];

    // for (let i = 0; i < pin_list.length; i++) {
    //   await this.commonservice.postCommunityHttpCall({
    //     url: '/api/pinner/get-is-message-sent',
    //     data: {
    //       'user_id': pin_list[i].pinner_details.id,
    //       'pin_id': pin_list[i].id,
    //     }
    //   }).then(res => {
    //     this.isCompletedMsgExists.push(res.data);
    //   });
    // }

    this.completedPins = pin_list;
  }

  /**
   * Load previous completed pins
   * @param elem HTMLElement
   */
  loadPrevCompletes(elem) {
    let previousPage = Math.max((this.completedPageCount - 1), 1);
    this.completedPageCount = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.completedPinListPopulate();
    }
  }

  /**
   * Load next completed pins
   * @param elem HTMLElement
   */
  loadNextCompletes(elem) {
    let nextPage = Math.min((this.completedPageCount + 1), this.completedPageTotal);
    this.completedPageCount = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.completedPinListPopulate();
    }
  }

  /**
     * Populate Disputed Pins
    */
   disputedPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/doers/fetch-disputed-pins',
      data: {
        'page'           : this.disputedPageCount,
        'limit'          : this.pinLimit,
        'totalFilters'   : this.filterPinModel,
        'filterByColName': this.disputedSortColumn,
        'orderBy'        : this.disputedSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.disputePinListPopulateSuccess(response.data);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Success function for dispute Pin list Service Call
   * @param {response} response from service call
  */
  async disputePinListPopulateSuccess(pin_list) {
    // this.isDisputedMsgExists = [];

    // for (let i = 0; i < pin_list.length; i++) {
    //   await this.commonservice.postCommunityHttpCall({
    //     url: '/api/pinner/get-is-message-sent',
    //     data: {
    //       'user_id': pin_list[i].pinner_details.id,
    //       'pin_id': pin_list[i].id,
    //     }
    //   }).then(res => {
    //     this.isDisputedMsgExists.push(res.data);
    //   });
    // }

    this.disputedPins = pin_list;
  }

  /**
   * Load previous disputed pins
   * @param elem HTMLElement
   */
  loadPrevDisputes(elem) {
    let previousPage = Math.max((this.disputedPageCount - 1), 1);
    this.disputedPageCount = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.disputedPinListPopulate();
    }
  }

  /**
   * Load next disputed pins
   * @param elem HTMLElement
   */
  loadNextDisputes(elem) {
    let nextPage = Math.min((this.disputedPageCount + 1), this.disputedPageTotal);
    this.disputedPageCount = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.disputedPinListPopulate();
    }
  }

  /**
     * Populate Archived Pins
    */
   archivedPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/doers/fetch-archived-pins',
      data: {
        'page'           : this.archivedPageCount,
        'limit'          : this.pinLimit,
        'totalFilters'   : this.filterPinModel,
        'filterByColName': this.archivedSortColumn,
        'orderBy'        : this.archivedSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.archivePinListPopulateSuccess(response.data);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Success function for archive Pin list Service Call
   * @param {response} response from service call
  */
  async archivePinListPopulateSuccess(pin_list) {
    this.isArchivedMsgExists = [];

    for (let i = 0; i < pin_list.length; i++) {
      await this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/get-is-message-sent',
        data: {
          'user_id': pin_list[i].pinner_details.id,
          'pin_id': pin_list[i].id,
        }
      }).then(res => {
        this.isArchivedMsgExists.push(res.data);
      });
    }

    this.archivedPins = pin_list;
  }

  /**
   * Load previous archived pins
   * @param elem HTMLElement
   */
  loadPrevArchives(elem) {
    let previousPage = Math.max((this.archivedPageCount - 1), 1);
    this.archivedPageCount = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.archivedPinListPopulate();
    }
  }

  /**
   * Load next archived pins
   * @param elem HTMLElement
   */
  loadNextArchives(elem) {
    let nextPage = Math.min((this.archivedPageCount + 1), this.archivedPageTotal);
    this.archivedPageCount = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.archivedPinListPopulate();
    }
  }

  /**
   * Converts toarray
   * @param num
   * @param checkType
   * @returns
   */
  convertToarray(num, checkType) {
    let checkVal;
    if (checkType == 'filled') {
      checkVal = num;
    } else {
      checkVal = 5 - num;
    }
    const tempArray = [];
    for (let initVal = 1; initVal <= checkVal; initVal++) {
      if (checkType == 'filled') {
        const tempObj = {
          'indexVal': initVal - 1
        };
        tempArray.push(tempObj);
      } else {
        const tempObj = {
          'indexVal': num
        };
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
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

    /**
   * Get Crew Member Details
   */
  getCrewMemberDetails() {
    this.commonservice.postHttpCall({
      url: '/crew-member-details',
      data: {
        user_id: localStorage.getItem('frontend_user_id')
      },
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.crewMemberDetails = result.data;
        this.getInvitationsSummary();
        this.getCrewEarnings();
      }
    })
    .catch(error => console.log(error));;
  }

  /**
   * Get Pins Summary
   */
  getInvitationsSummary() {
    this.commonservice.getHttpCall({
      url: '/get-invitations-summary',
      contenttype: 'application/json'
    }).then( async (result) => {
      if (result.status == 1) {
        this.invitations              = result.data.sent_invitations;
        this.sentInvitationsCount     = result.data.sent_invitations_count;
        this.invitationPageTotal      = Math.ceil(this.sentInvitationsCount / this.invitationLimit);
        this.acceptedInvitationsCount = result.data.accepted_invitations_count;
        this.archivedInvitationsCount = result.data.archived_invitations_count;
      }
    });
  }

  /**
   * Filters by column
   * @param clmnName
   * @param evt
   */
  filterByColumnInvitation(clmnName, evt) {
    this.invitationPageCount = 1;
    this.invitationSortBy = (clmnName == this.invitationSortColumn) && (this.invitationSortBy == "DESC") ? "ASC" : "DESC";
    this.invitationSortColumn = clmnName;

    if (this.selectedInvitationTab == 'invited') {
      this.getSentInvites();
    } else if (this.selectedInvitationTab == 'accepted') {
      this.getAcceptedInvites();
    } else if (this.selectedInvitationTab == 'archived') {
      this.getArchivedInvites();
    }
  }

  /**
   * Copy text from referral input box
   * @param inputElement HTMLElement
   */
  copyReferralCode(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.responseMessageSnackBar("Your Referral Code has been successfully copied to the clipboard.", "orangeSnackBar");
  }

  /**
   * Open Invitation popup
   */
  openInvitation(invitationData = {}) {
    let dialogRef = this.dialog.open(InviteGuestComponent, {
      width: '500px',
			panelClass: 'comnDialog-panel',
      data: {
        crewMemberDetails: this.crewMemberDetails,
        invitationData: invitationData
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let resp = result.data;

        if (resp.status == 1) {
          this.sentInvitationsCount = resp.data.sent_invitations_count;

          if (this.selectedInvitationTab == "invited") {
            this.selectInvitationTab("invited");
          }
        }
      }
		});
  }

  /**
   * Select Invitation Tab
   */
  selectInvitationTab(tabName: string) {
    this.selectedInvitationTab = tabName;
    this.invitationPageCount = 1;
    this.invitationSortColumn = "first_name";
    this.invitationSortBy = "ASC";
    this.populateInvitationsList();
  }

  /**
   * Populate Invitations List
   */
  populateInvitationsList() {
    switch (this.selectedInvitationTab) {
      case 'invited':
          this.getSentInvites();
        break;

      case 'accepted':
          this.getAcceptedInvites();
        break;

      case 'archived':
          this.getArchivedInvites();
        break;
    }
  }

  /**
   * Get Sent Invites
   */
  getSentInvites() {
    this.commonservice.postHttpCall({
      url: '/get-sent-invites',
      data: {
        'page'           : this.invitationPageCount,
        'limit'          : this.invitationLimit,
        'filterByColName': this.invitationSortColumn,
        'orderBy'        : this.invitationSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.invitations          = response.data.invitations;
        this.sentInvitationsCount = response.data.sent_invitations_count;
        this.invitationPageTotal  = Math.ceil(this.sentInvitationsCount / this.invitationLimit);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Get Accepted Invites
   */
  getAcceptedInvites() {
    this.commonservice.postHttpCall({
      url: '/get-accepted-invites',
      data: {
        'page'           : this.invitationPageCount,
        'limit'          : this.invitationLimit,
        'filterByColName': this.invitationSortColumn,
        'orderBy'        : this.invitationSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.invitations              = response.data.invitations;
        this.acceptedInvitationsCount = response.data.accepted_invitations_count;
        this.invitationPageTotal      = Math.ceil(this.acceptedInvitationsCount / this.invitationLimit);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Get Archived Invites
   */
  getArchivedInvites() {
    this.commonservice.postHttpCall({
      url: '/get-archived-invites',
      data: {
        'page'           : this.invitationPageCount,
        'limit'          : this.invitationLimit,
        'filterByColName': this.invitationSortColumn,
        'orderBy'        : this.invitationSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.invitations              = response.data.invitations;
        this.archivedInvitationsCount = response.data.archived_invitations_count;
        this.invitationPageTotal      = Math.ceil(this.archivedInvitationsCount / this.invitationLimit);
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Archive Invitation
   *
   * @param invitationId string
   */
  archiveInvitation(invitationId: string) {
    let dialogRef = this.dialog.open(ArchiveConfirmationComponent, {
      // width: '400px',
			panelClass: 'comnDialog-panel',
      data: {
        id: invitationId
      },
    });

		dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sentInvitationsCount = result.sent_invitations_count;
        this.acceptedInvitationsCount = result.accepted_invitations_count;
        this.archivedInvitationsCount = result.archived_invitations_count;
        this.invitationPageCount = 1;
        this.populateInvitationsList();
      }
		});
  }

  /**
   * Load previous invitations
   * @param elem HTMLElement
   */
  loadPrevInvitations(elem) {
    let previousPage = Math.max((this.invitationPageCount - 1), 1);
    this.invitationPageCount = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.populateInvitationsList();
    }
  }

  /**
   * Load next invitations
   * @param elem HTMLElement
   */
  loadNextInvitations(elem) {
    let nextPage = Math.min((this.invitationPageCount + 1), this.invitationPageTotal);
    this.invitationPageCount = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.populateInvitationsList();
    }
  }

  /**
   * Open invitation comment
   * @param elem HTMLElement
   */
  openComment(elem) {
    // console.log("openComment", elem);
    this.lastComment = $(elem).text();
    $(elem).attr("contenteditable", true).focus();
  }

  /**
   * Close & save invitation comment
   * @param elem HTMLElement
   */
  closeComment(elem, invitation_id) {
    // console.log("closeComment", elem);
    $(elem).attr("contenteditable", false);
    let currentComment = $(elem).text();

    if (this.lastComment != currentComment) {
      this.commonservice.postHttpCall({
        url: '/save-invitation-comment',
        data: {
          id: invitation_id,
          comments: currentComment
        },
        contenttype: 'application/json'
      })
      .then((response) => {
        if (response.status == 1) {
          this.responseMessageSnackBar(response.message, "orangeSnackBar");
        } else {
          this.responseMessageSnackBar(response.message, "error");
        }
      })
      .catch(error => console.log(error));
    }
  }

  /**
   * Get previous year earnings
   * @param elem HTMLElement
   */
  getPreviousYearEarning(elem) {
    this.selected = Math.max((this.selected - 1), 2019);

    if (elem.classList.contains("cursorPointer")) {
      this.populateEraningChart();
    }
  }

  /**
   * Get next year earnings
   * @param elem HTMLElement
   */
  getNextYearEarning(elem) {
    this.selected = Math.min((this.selected + 1), this.currentYear);

    if (elem.classList.contains("cursorPointer")) {
      this.populateEraningChart();
    }
  }

  /**
   * Get Crew Earnings
   */
  getCrewEarnings() {
    this.commonservice.postHttpCall({
      url: '/crew-earnings',
      data: {
        page: this.crewEarningPageNumber,
        limit: this.crewEarningLimit,
        sortBy: this.crewEarningSortColumn,
        orderBy: this.crewEarningSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.crewEarningList = response.data.earnings;

        if (this.crewEarningPageNumber == 1) {
          this.crewEarningPageTotal = Math.ceil( response.data.total_items / this.crewEarningLimit );
        }
      } else {
        this.responseMessageSnackBar(response.message, "error");
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Filters by column
   * @param clmnName
   * @param evt
   */
  filterByColumnEarnings(clmnName, evt) {
    this.crewEarningSortColumn = clmnName;
    this.crewEarningPageNumber = 1;
    this.crewEarningSortBy = (clmnName == this.crewEarningSortColumn) && (this.crewEarningSortBy == "DESC") ? "ASC" : "DESC";
    this.getCrewEarnings();
  }

  /**
   * Load previous invitations
   * @param elem HTMLElement
   */
  loadPrevEarnings(elem) {
    let previousPage = Math.max((this.crewEarningPageNumber - 1), 1);
    this.crewEarningPageNumber = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.getCrewEarnings();
    }
  }

  /**
   * Load next invitations
   * @param elem HTMLElement
   */
  loadNextEarnings(elem) {
    let nextPage = Math.min((this.crewEarningPageNumber + 1), this.crewEarningPageTotal);
    this.crewEarningPageNumber = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.getCrewEarnings();
    }
  }

  /**
   * View public pins
   * @param slug string
   */
  viewPublicPin(slug: string) {
    this.router.navigate(["/public-pins", slug]);
  }

  getTransactions() {
    this.commonservice.postHttpCall({
      url: '/doers/transactions-list',
      data: {
        page   : this.transactionPageNumber,
        limit  : this.transactionLimit,
        sortBy : this.transactionSortColumn,
        orderBy: this.transactionSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.transactionList = response.data.transactions;

        if (this.transactionPageNumber == 1) {
          this.transactionPageTotal = Math.ceil( response.data.total_transactions_count / this.transactionLimit );
        }
      } else {
        this.responseMessageSnackBar(response.message, "error");
      }
    })
    .catch(error => console.log(error));
  }

  /**
   * Filters by column
   * @param clmnName
   * @param evt
   */
  filterByColumnTransactions(clmnName, evt) {
    this.transactionSortBy = (clmnName == this.transactionSortColumn) && (this.transactionSortBy == "DESC") ? "ASC" : "DESC";
    this.transactionPageNumber = 1;
    this.transactionSortColumn = clmnName;
    this.getTransactions();
  }

  /**
   * Load previous invitations
   * @param elem HTMLElement
   */
  loadPrevTransactions(elem) {
    let previousPage = Math.max((this.transactionPageNumber - 1), 1);
    this.transactionPageNumber = previousPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.getTransactions();
    }
  }

  /**
   * Load next invitations
   * @param elem HTMLElement
   */
  loadNextTransactions(elem) {
    let nextPage = Math.min((this.transactionPageNumber + 1), this.transactionPageTotal);
    this.transactionPageNumber = nextPage;

    if (elem.classList.contains("color-themeOrange")) {
      this.getTransactions();
    }
  }


  /**
   * Get Download Recrewment Kit Url
   */
  getDownloadRecrewmentKitUrl() {
    this.commonservice.getHttpCall({
      url: '/get-recrewment-kit',
      contenttype: 'application/json'
    }).then(result => {
      if (result.status == 1) {
        this.downloadKitUrl = result.path;
      }
    });
  }

  openInvitationPopup(invitation) {
    this.openInvitation(invitation);
  }  

}