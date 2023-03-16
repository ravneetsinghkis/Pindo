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
  selector: 'pinner-activity',
  templateUrl: './pinner-activity.component.html',
  styleUrls: ['./pinner-activity.component.scss']
})
export class PinnerActivityComponent implements OnInit {
  @ViewChild('commentBox') commentBox: ElementRef;

  address: any;
  lat: any;
  lng: any;
  total_number_activity: any = [];
  baseCompUrl: string;
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

  orderBy = 'DESC';

  // draft tab
  draftPins      = [];
  draftPinsCount = 0;
  draftPageCount = 1;
  draftPageTotal = 0;
  draftSortColumn = "created_at";
  draftSortBy = "DESC";

  // invited tab
  invitedPins      = [];
  invitedPinsCount = 0;
  invitedPageCount = 1;
  invitedPageTotal = 0;
  invitedSortColumn = "created_at";
  invitedSortBy = "DESC";

  // hired tab
  hiredPins      = [];
  hiredPinsCount = 0;
  hiredPageCount = 1;
  hiredPageTotal = 0;
  hiredSortColumn = "created_at";
  hiredSortBy = "DESC";

  // completed tab
  completedPins      = [];
  completedPinsCount = 0;
  completedPageCount = 1;
  completedPageTotal = 0;
  completedSortColumn = "created_at";
  completedSortBy = "DESC";

  // disputed tab
  disputedPins      = [];
  disputedPinsCount = 0;
  disputedPageCount = 1;
  disputedPageTotal = 0;
  disputedSortColumn = "created_at";
  disputedSortBy = "DESC";

  // archived tab
  archivedPins      = [];
  archivedPinsCount = 0;
  archivedPageCount = 1;
  archivedPageTotal = 0;
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
  crewEarningCount: number = 0;
  crewEarningPageTotal = 0;
  crewEarningSortColumn = "created_at";
  crewEarningSortBy = "ASC";

  constructor(
    public commonservice: CommonService,
    public gbConst: Globalconstant,
    private dialog: MatDialog,
    private titleService: Title,
    private router: Router,
    public snackBar: MatSnackBar,
  ) {
    this.baseCompUrl = gbConst.uploadUrl;
  }

  ngOnInit() {
    this.getLocations();
    this.getCommunityActivity();
    this.getPinsSummary();
    this.getCrewMemberDetails();
    this.getDownloadRecrewmentKitUrl();
  }

  ngAfterViewInit() {
    this.populateToDo();
  }

  getLocations() {
    this.address = localStorage.getItem('pindo_system_current_position_address');
    this.lat = localStorage.getItem('pindo_system_current_position_lat');
    this.lng = localStorage.getItem('pindo_system_current_position_lng');
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

  populateToDo() {
    this.commonservice.postHttpCall({
      url: '/pinners/dashboard-todo-list',
      data: {
        'page': this.pageNumber,
        'limit':this.toDoLimit
      },
      contenttype: 'application/json'
    })
    .then(result => this.onpopulateToDoSuccess(result));
  }

  /**
   * Output the To Do
   * @param response object
   */
  onpopulateToDoSuccess(response) {
    if (response.status == 1) {
      this.toDoList = response.data;
      this.toDoCount = response.todo_list_total;
      this.toDoPageTotal = Math.ceil(this.toDoCount / this.toDoLimit);
    }
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
   * Load previous todos
   * @param elem HTMLElement
   */
  loadPrevToDos(elem) {
    let previousPage = Math.max((this.pageNumber - 1), 1);
    this.pageNumber = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
      this.populateToDo();
    }
  }

  /**
   * Get Pins Summary
   */
  getPinsSummary() {
    this.commonservice.postHttpCall({
      url: '/pinners/get-pins-summary',
      data: {
        'page'           : this.pageCount,
        'limit'          : this.pinLimit,
        'filterByColName': 'created_at',
        'orderBy'        : 'DESC'
      },
      contenttype: 'application/json'
    }).then( async (result) => {
      if (result.status == 1) {
        this.draftPinListPopulateSuccess(result.data.draft_pins);
        this.draftPinsCount = result.data.draft_pins_count;
        this.draftPageTotal = Math.ceil(this.draftPinsCount / this.pinLimit);

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
    if (tabName == 'Draft') {
      this.draftPageCount = 1;
      this.draftSortBy = clmnName == this.draftSortColumn && this.draftSortBy == "DESC" ? "ASC" : "DESC";
      this.draftSortColumn = clmnName;
      this.draftPinListPopulate();
    } else if (tabName == 'Invites') {
      this.invitedPageCount = 1;
      this.invitedSortBy = clmnName == this.invitedSortColumn && this.invitedSortBy == "DESC" ? "ASC" : "DESC";
      this.invitedSortColumn = clmnName;
      this.invitePinListPopulate();
    } else if (tabName == 'Active') {
      this.hiredPageCount = 1;
      this.hiredSortBy = clmnName == this.hiredSortColumn && this.hiredSortBy == "DESC" ? "ASC" : "DESC";
      this.hiredSortColumn = clmnName;
      this.hiredPinListPopulate();
    } else if (tabName == 'Completed') {
      this.completedPageCount = 1;
      this.completedSortBy = clmnName == this.completedSortColumn && this.completedSortBy == "DESC" ? "ASC" : "DESC";
      this.completedSortColumn = clmnName;
      this.completedPinListPopulate();
    } else if (tabName == 'Dispute') {
      this.disputedPageCount = 1;
      this.disputedSortBy = clmnName == this.disputedSortColumn && this.disputedSortBy == "DESC" ? "ASC" : "DESC";
      this.disputedSortColumn = clmnName;
      this.disputedPinListPopulate();
    } else if (tabName == 'Archive') {
      this.archivedPageCount = 1;
      this.archivedSortBy = clmnName == this.archivedSortColumn && this.archivedSortBy == "DESC" ? "ASC" : "DESC";
      this.archivedSortColumn = clmnName;
      this.archivedPinListPopulate();
    }
  }

  /**
	 * Populate Invite Pins
   */
  draftPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/fetch-draft-pins',
      data: {
        'page'           : this.draftPageCount,
        'limit'          : this.pinLimit,
        'totalFilters'   : this.filterPinModel,
        'filterByColName': this.draftSortColumn,
        'orderBy'        : this.draftSortBy
      },
      contenttype: 'application/json'
    })
    .then((response) => {
      if (response.status == 1) {
        this.draftPinListPopulateSuccess(response.data);
      }
    })
    .catch(error => console.log(error));
  }

  /**
 	* Success function for draft Pin list Service Call
 	* @param {response} response from service call
  */
  async draftPinListPopulateSuccess(pin_list) {
    this.draftPins = pin_list;
  }

  /**
   * Load previous draft pins
   * @param elem HTMLElement
   */
  loadPrevDrafts(elem) {
    let previousPage = Math.max((this.draftPageCount - 1), 1);
    this.draftPageCount = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
      this.draftPinListPopulate();
    }
  }

  /**
   * Load next draft pins
   * @param elem HTMLElement
   */
  loadNextDrafts(elem) {
    let nextPage = Math.min((this.draftPageCount + 1), this.draftPageTotal);
    this.draftPageCount = nextPage;

    if (elem.classList.contains("color-themeGreen")) {
      this.draftPinListPopulate();
    }
  }

  /**
	 * Populate Invite Pins
   */
  invitePinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/fetch-invited-pins',
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
    this.invitedPins = pin_list;
  }

  /**
   * Load previous invited pins
   * @param elem HTMLElement
   */
  loadPrevInvites(elem) {
    let previousPage = Math.max((this.invitedPageCount - 1), 1);
    this.invitedPageCount = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
      this.invitePinListPopulate();
    }
  }

  /**
   * Populate Hire Pins
   */
  hiredPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/fetch-ongoing-pins',
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
    this.hiredPins = pin_list;
  }

  /**
   * Load previous hired pins
   * @param elem HTMLElement
   */
  loadPrevHires(elem) {
    let previousPage = Math.max((this.hiredPageCount - 1), 1);
    this.hiredPageCount = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
      this.hiredPinListPopulate();
    }
  }

  /**
   * Populate Completed Pins
   */
  completedPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/fetch-completed-pins',
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
    this.completedPins = pin_list;
  }

  /**
   * Load previous completed pins
   * @param elem HTMLElement
   */
  loadPrevCompletes(elem) {
    let previousPage = Math.max((this.completedPageCount - 1), 1);
    this.completedPageCount = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
      this.completedPinListPopulate();
    }
  }

  /**
   * Populate Disputed Pins
   */
  disputedPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/fetch-disputed-pins',
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
    this.disputedPins = pin_list;
  }

  /**
   * Load previous disputed pins
   * @param elem HTMLElement
   */
  loadPrevDisputes(elem) {
    let previousPage = Math.max((this.disputedPageCount - 1), 1);
    this.disputedPageCount = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
      this.disputedPinListPopulate();
    }
  }

  /**
   * Populate Archived Pins
   */
  archivedPinListPopulate() {
    this.commonservice.postHttpCall({
      url: '/pinners/fetch-archived-pins',
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
    this.archivedPins = pin_list;
  }

  /**
   * Load previous archived pins
   * @param elem HTMLElement
   */
  loadPrevArchives(elem) {
    let previousPage = Math.max((this.archivedPageCount - 1), 1);
    this.archivedPageCount = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
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
   * Gets encrypted doer id
   * @param doerId
   * @returns
   */
  getEncryptedDoerId(doerId) {
    return btoa(doerId);
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
    this.invitationSortColumn = clmnName;
    this.invitationSortBy = clmnName == this.invitationSortColumn && this.invitationSortBy == "DESC" ? "ASC" : "DESC";

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
    this.responseMessageSnackBar("Your Referral Code has been successfully copied to the clipboard.");
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
   * Go to Create Pin page
   */
  gotoCreatePin() {
    this.router.navigate(["/pinner/create-new-pin"]);
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

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
      this.populateInvitationsList();
    }
  }

  /**
   * Open invitation comment
   * @param elem HTMLElement
   */
  openComment(elem) {
    this.lastComment = $(elem).text();
    $(elem).attr("contenteditable", true).focus();
  }

  /**
   * Close & save invitation comment
   * @param elem HTMLElement
   */
  closeComment(elem, invitation_id) {
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
          this.responseMessageSnackBar(response.message);
        } else {
          this.responseMessageSnackBar(response.message, "error");
        }
      })
      .catch(error => console.log(error));
    }
  }

  checkMessage(e) {
    if (e.target.innerText == "") {
      e.target.classList.add("emptyCommentBox");
    } else {
      e.target.classList.remove("emptyCommentBox");
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
    this.crewEarningSortBy = clmnName == this.crewEarningSortColumn && this.crewEarningSortBy == "DESC" ? "ASC" : "DESC";
    this.getCrewEarnings();
  }

  /**
   * Load previous invitations
   * @param elem HTMLElement
   */
  loadPrevEarnings(elem) {
    let previousPage = Math.max((this.crewEarningPageNumber - 1), 1);
    this.crewEarningPageNumber = previousPage;

    if (elem.classList.contains("color-themeGreen")) {
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

    if (elem.classList.contains("color-themeGreen")) {
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