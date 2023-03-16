import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { CommonService }      from '../../commonservice';
import { Globalconstant }  from '../../global_constant';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { PinnerListDialogComponent } from './pinner-list-dialog/pinner-list-dialog.component';
import { DatePipe } from '@angular/common';
import {Location} from '@angular/common';
import { Meta } from '@angular/platform-browser';
// import { ViewEncapsulation } from '@angular/core';
import { AppComponent } from '../../app.component';
import * as _moment from 'moment';
import Swal from 'sweetalert2';

declare var jQuery: any;
declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'app-doer-public-profile',
  templateUrl: './doer-public-profile.component.html',  
  styleUrls: ['./doer-public-profile.component.scss'],
  providers: [DatePipe]
})
export class DoerPublicProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  doer_id:any;
  doerBasicDetails = [];
  doerrating_review = [];
  doerservices = [];
  endorsmentDetails = [];
  openingHrsData = {};
  doeravailability = {};
  todaysDate:any;
  dayofweek:any;
  user_type:any;
  addressLink:any;
  showAvailabilityBar:any = 0;
  baseUrl:any;
  currentUrl:any;
  private subscription: ISubscription;
  availibilityStartDate: any;
  availibilityEndDate: any;
  badgespopulated = false;

  userBadges = [];

  afterInit = false;

  loginUserId:any;

  hiredByFriendList:any = [];

  constructor(
  	public renderer: Renderer2, 
    public appService:AppComponent,
  	private router: Router, 
    private route: ActivatedRoute, 
  	public el: ElementRef,   	
  	public commonservice:CommonService, 
  	public snackBar: MatSnackBar,
  	public globalconstant:Globalconstant,
  	private datePipe: DatePipe,
  	private _location: Location,
  	private meta: Meta,
  	private dialog: MatDialog) { 
  		window.scrollTo(0,0);
      this.currentUrl = window.location.href;
      this.user_type = parseInt(atob(localStorage.getItem('user_type')));
      this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));

      console.log('asdasd',this.loginUserId);

  		//get activate route
	    this.route.params.subscribe(params => {
	      this.doer_id = window.atob(params['doer_id']);      
	    });
	    let tempwindowlocation = window.location.href;
	    this.populateDoerDetails();
	    this.populateEndorsements();
	    this.baseUrl = 	globalconstant.uploadUrl;
	    this.todaysDate = new Date();
	    this.dayofweek = this.transformDate(this.todaysDate);

		  this.meta.addTag({ itemprop: 'name', content: 'summary_large_image' });
	    this.meta.addTag({ itemprop: 'description', content: '@alligatorio' });
	    this.meta.addTag({ itemprop: 'image', content: 'https://pindo.exploratorstaging.com/assets/images/PinDoLogin_Final.png' });

	    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
	    this.meta.addTag({ name: 'twitter:site', content: '@alligatorio' });
	    this.meta.addTag({ name: 'twitter:title', content: 'Front-end Web Development, Chewed Up' });
	    this.meta.addTag({ name: 'twitter:description', content: 'Learn frontend web development...' });
	    this.meta.addTag({ name: 'twitter:image', content: 'https://pindo.exploratorstaging.com/assets/images/PinDoLogin_Final.png' });

	    this.meta.addTag({ property: 'og:title', content: 'Doer Profile' });
	    this.meta.addTag({ property: 'og:type', content: 'article' });
	    this.meta.addTag({ property: 'og:url', content: `https://www.npmjs.com/package/ngx-sharebuttons` });
	    this.meta.addTag({ property: 'og:description', content: `This a Doer Profile` });
	    this.meta.addTag({ property: 'og:site_name', content: `Pindo` });
	    this.meta.addTag({ property: 'og:image', content: `Pindo` });	   

      this.subscription = this.commonservice.listenEndorsement().subscribe((m:any) => {
          console.log(m);
          //this.populateUserData();
          this.populateEndorsements();
      }); 
	    
  	}

    gethiredVal(valuetosubFrom,valtosub) {
      return valuetosubFrom - valtosub;
    }

    checkInavailibilityRange() {
      if(this.doeravailability!=null) {
        let momentA = _moment(this.doeravailability['start_date'],"YYYY-MM-DD");
        let momentB = _moment(this.doeravailability['end_date'],"YYYY-MM-DD");
        let todaysMomentDate = _moment();
        //console.log(todaysMomentDate==momentA);
        if((todaysMomentDate>momentA && todaysMomentDate<momentB) || (todaysMomentDate).isSame(momentA) || (todaysMomentDate).isSame(momentB)) {
          return false;
        }
        else {
          return true;
        }
      } else {
        return true;
      }
    }

  	transformDate(date) {
  	    return this.datePipe.transform(date, 'EEEE').toLowerCase();
  	}

  	backClicked() {
        this._location.back();
    }

  	ngOnInit() {
      
    }

   checkifStartandenddateequal() {
      if(this.doeravailability['start_date'] == this.doeravailability['end_date']) {
        return false;
      } else {
        return true;
      }
   } 

  initCirclifulSliders() {
    let tempTotalPins,tempongoingPinsPercent,tempPinsCompleted;
    /*tempTotalPins = this.doerBasicDetails['ongoing_pins'] + this.doerBasicDetails['pins_completed'];
    if(tempTotalPins == 0) {
      tempongoingPinsPercent = 0;
      tempPinsCompleted = 0;
    }
    else {
      tempongoingPinsPercent = (this.doerBasicDetails['ongoing_pins']/tempTotalPins)*100;
      tempPinsCompleted = 100 - tempongoingPinsPercent;
    }*/
    tempongoingPinsPercent = 100;
    console.log(tempTotalPins)
    $("#test-circle").circliful({
      animation: 1,
      animationStep: 6,
      foregroundBorderWidth: 4,
      backgroundBorderWidth: 4,
      percent: 100,
      textSize: 14,
      textStyle: 'font-size: 30px;',
      textColor: '#1e1e1e',
      multiPercentage: 1,
      backgroundColor: '#e3ecf3',
      percentages: [10, 20, 30],
      showPercent:false,
      fontColor:'#fff'
    });
    $("#test-circle1").circliful({
      animation: 1,
      animationStep: 5,
      foregroundBorderWidth: 4,
      backgroundBorderWidth: 4,
      percent: 100,
      textSize: 14,
      textStyle: 'font-size: 30px;',
      textColor: '#1e1e1e', 
      multiPercentage: 1,
      backgroundColor: '#e3ecf3',
      foregroundColor:'#5ae11c',
      percentages: [10, 20, 30],
      showPercent:false,
      fontColor:'#fff'
    });
    // $("#test-circle2").circliful({
    //   animation: 1,
    //   animationStep: 5,
    //   foregroundBorderWidth: 4,
    //   backgroundBorderWidth: 4,
    //   percent: 74,
    //   textSize: 14,
    //   textStyle: 'font-size: 30px;',
    //   textColor: '#1e1e1e',
    //   multiPercentage: 1,
    //   backgroundColor: '#e3ecf3',
    //   foregroundColor:'#ffc528',
    //   percentages: [10, 20, 30]
    // });
  }

  ngAfterViewInit() {  	
  	setTimeout(()=>{
  		//this.initReviewSlider();
  		//this.initBadgeSlider();
  		$(".total_endorse").mCustomScrollbar();
  	},1000);
    this.afterInit = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /*
   * populate Doer 
  */
  populateDoerDetails() {
  	this.commonservice.postHttpCall({url:'/get-doer-public-profile', data:{'doer_id':this.doer_id}, contenttype:"application/json"}).then(result=>this.onpopulateDoerDetailsSuccess(result));
  }

  /*
   * on populate Doer Success function
   * @param response = response from api
  */
  onpopulateDoerDetailsSuccess(response) {
  	if(response.status==1) {
      //this.userBadges        = response.data['basic_details']['user_badges'];      
  		this.doerBasicDetails  = response.data.basic_details;
      this.hiredByFriendList = response.data.hiredByFriendList;
      console.log(this.doerBasicDetails);
  		this.doerrating_review = response.data.rating_review;
  		this.doerservices 	   = response.data.services;
  		this.doeravailability  = response.data.availability;
  		this.openingHrsData    = response.data.basic_details.business_hours[0];
      // let tempData = this.checkInavailibilityRange();
      // console.log(tempData);
      this.addressLink = this.doerBasicDetails['address'];
      if(this.addressLink!=null){
        let address = this.addressLink.replace(/\,/g, '');
        this.addressLink = address.replace(/\ /g, '%20');
        this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
      }
      this.showAvailabilityBar = 1;
      this.initCirclifulSliders();  
      setTimeout(()=>{        
        this.initReviewSlider();
        this.initBadgeSlider();        
      },0);  
  	}
  }

  /*
   	   * initialise review slider
	   * 
  */ 
  initReviewSlider() {
  	var swiper = new Swiper('.total_reviewslider .swiper-container', {
      navigation: {
        nextEl: '.total_reviewslider .swiper-button-next',
        prevEl: '.total_reviewslider .swiper-button-prev',
      }
    });
  }

  /*
   	   * initialise badge slider
	   * 
  */ 
  initBadgeSlider() {
  	var swiper = new Swiper('.badge-slider .swiper-container', {
      slidesPerView: 3,
      spaceBetween: 10,
      navigation: {
        nextEl: '.badge-slider .swiper-button-next',
        prevEl: '.badge-slider .swiper-button-prev',
      }
    });
  }

  /*
   * open popup
   * 
  */
  openDialog(popupType='Give-endorsement',innIndex=null,OutIndex=null) {
      let popup_width:any = '615px';
      let endorseData;  
      if(popupType=='Give-endorsement') {
        popup_width = '615px';
      }
      else {
        popup_width = '350px';
      }
      if(innIndex!=null && OutIndex!=null) {
        endorseData = this.endorsmentDetails[OutIndex]['child_categories'][innIndex]['endorsements'];
      }
      else {
        endorseData = null;
      }
      let popupDta= {
        'popType': popupType,
        'doerID': this.doer_id,
        'endorsementDetails':endorseData,
        'user_type':this.appService.user_type
      } 
      
      let tempDialogRef = this.dialog.open(CourseDialogComponent, {
        width: popup_width,
        disableClose:false,
        data: popupDta
      });

      tempDialogRef.componentInstance.onEndorsing.subscribe((evt) => {
        this.populateEndorsements();
      });
  }

  /*
   * open popup
   * 
  */
  openPinnerListPopup() {
      let popup_width:any = '615px';

      let popupDta= {
        'doerID': this.doer_id,
      } 
      
      let tempDialogRef = this.dialog.open(PinnerListDialogComponent, {
        width: popup_width,
        disableClose:false,
        data: popupDta
      });
  }

   /*
   	   * return an array to represent review ratings
	   * @param ratingVal = rating value
	   * 
   */ 
   countratingArray(ratingVal) {
   	 let tempArray = []; 	
   	 for(let i=1;i<=ratingVal;i++) {
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
   	 this.commonservice.postHttpCall({url:'/doer-endorsed-category', data:{'doer_id':this.doer_id}, contenttype:"application/json"}).then(result=>this.onpopulateEndorsementsSuccess(result));
   }

   /*
   	   * on populate Endorsements Success
	   * @param response = response from api
	   * 
   */
   onpopulateEndorsementsSuccess(response) {
   	 if(response.status==1) {
   	 	this.endorsmentDetails = response.data;
   	 }
   }

   /*
	   * like Doer
	   * @param evt = event information
   */
   likeDoer(evt) {
	    //console.log(doerId);
	    if(evt.target.classList.contains('liked')){
	      evt.target.classList.remove('liked');
	    }
	    else {
	      evt.target.classList.add('liked'); 
	    }
	    this.commonservice.postHttpCall({url:'/pinners/mark-and-unmark-as-favourite-doer', data:{'doer_id':this.doer_id}, contenttype:"application/json"}).then(result=>this.onlikeDoerSuccess(result));	  	
   }

  /*
   * on like Doer Success Function
   * @param response = response from api
  */
  onlikeDoerSuccess(response) {
    if(response.status==1) {
      this.responseMessageSnackBar(response.msg)
    }
  }

  /*
   * snackbar message populate
   * @param res_class = where to show snackbar
   * @param message = message to show
  */
  public responseMessageSnackBar(message,res_class=''){
    this.snackBar.open(message,'', {
        duration: 4000,
        horizontalPosition:'right',       
        panelClass:res_class
    });
  }

  getToInvitePins() {
    localStorage.setItem('doerID',btoa(this.doer_id));
    let tempdoerIdUrl;
    this.route.params.subscribe(params => {
      tempdoerIdUrl = params['doer_id'];      
    });
    this.router.navigate(['/doer-details/'+tempdoerIdUrl+'/invite-to-pin']);
  }

  invitewhenNotLoggedIn() {
    Swal({
        title: "Please Login or Register as a pinner to send Invite",
        text: '',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        cancelButtonColor: "#bad141", 
        confirmButtonText: 'Register',
        // allowOutsideClick: false,
        cancelButtonText: 'LOGIN'
        }).then((result) => {
          let tempDismissReason:any = result['dismiss'] || null;          
          if (result.value) {
            this.router.navigate(['/register']);
          } else if(tempDismissReason=='cancel') {
            localStorage.setItem('doerPublicProfileId',btoa(this.doer_id));
            this.router.navigate(['/login']);
          } else {}
    })
  }

  hireDoerPins() {
    localStorage.setItem('doerID',btoa(this.doer_id));
    let tempdoerIdUrl;
    this.route.params.subscribe(params => {
      tempdoerIdUrl = params['doer_id'];      
    });
    this.router.navigate(['/doer-details/'+tempdoerIdUrl+'/hire-doer']);
  }
  

  goToChat(doer_id){
    localStorage.removeItem('doer_id');
    localStorage.removeItem('pin_id');
    var pin_id = '0';

    localStorage.setItem('doer_id',btoa(doer_id));
    localStorage.setItem('pin_id',btoa(pin_id));
    this.router.navigate(['/pinner/chat']);
  }

}
