import { Component, OnInit } from '@angular/core';
import { CommonService }      from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../global_constant';
import { Router,ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-hire-doer',
  templateUrl: './hire-doer.component.html',
  styleUrls: ['./hire-doer.component.scss']
})
export class HireDoerComponent implements OnInit {

  pinList = [];	
  totalDoerSelected = 0;
  inviteDoerModel = {};	
  selectedDoers = [];
  baseUrl:any;
  doer_Id:any;

  constructor( public commonservice:CommonService,public gbConst:Globalconstant,public snackBar: MatSnackBar,public router: Router,private route: ActivatedRoute) {
    this.baseUrl =  gbConst.uploadUrl; 
  	
    this.doer_Id = window.atob(localStorage.getItem('doerID'));
    console.log(this.doer_Id);
    this.populatePins();
    //get activate route
    this.route.params.subscribe(params => {
      this.doer_Id = window.atob(params['doer_id']);      
    });
    console.log(this.doer_Id);
    //localStorage.removeItem('doerID');
  }

  ngOnInit() {

  }

  populatePins() {  	
  	this.commonservice.postHttpCall({url:'/pinners/pin-listing',data:{'doer_id':this.doer_Id}, contenttype:"application/json"}).then((data) => this.onpopulatePinsSuccess(data));
  }

  onpopulatePinsSuccess(response) {
  	if(response.status==1) {
  		this.pinList = response.data;
  	}
  }


  hireDoerForPin() {
    console.log(this.selectedDoers[0]['title']);
    if(this.selectedDoers.length==1){
      this.commonservice.postHttpCall({url:'/pinners/direct-hire-doer-from-public-profile',data:{'doer_id':this.doer_Id,'pin_id':this.selectedDoers}, contenttype:"application/json"}).then((data) => this.hireDoerSuccess(data));
    }
    else if(this.selectedDoers.length==0){
      this.responseMessageSnackBar('Please select one pin to hire doer.','error');
    }
    else{
      this.responseMessageSnackBar('Please select only one pin to hire doer.','error');
    }
    
  }

  hireDoerSuccess(response) {
    if(response.status==1) {
       var postData = {   'sender_id':  atob(localStorage.getItem('frontend_user_id')),
                          'reciver_id': this.doer_Id, 
                          'title' : ' has hired you for the pin '+this.selectedDoers[0]['title'],
                          'pin_id' : this.selectedDoers[0]['id'],
                          'link': 'doer/apply-pins/'+this.selectedDoers[0]['slug'],
                          'emailTemplateSlug':'hire_doer_without_quotation',
                          'user_title': ' You have hired the doer for this pin '+this.selectedDoers[0]['title'],
                          'userEmailTemplateSlug': 'hire_doer_without_quotation_for_pinner',
                          'user_link': 'pinner/active-quotations/'+btoa(this.selectedDoers[0]['id'])};
                          
    this.gbConst.notificationSocket.emit("post-notification-to-doer",postData);

    setTimeout(()=>{
      this.gbConst.notificationSocket.emit("post-notification-to-pinner-himself",postData); 
    },3000)

    this.responseMessageSnackBar(response.msg);
      //this.router.navigate(['/services']);
    }
  }

  /**on invite doer to pin success
   *
   * @param response = response from api
   * 
  */
  oninviteDoerToPinSuccess(response) {
    if(response.status==1) {
      this.responseMessageSnackBar(response.msg);
      this.router.navigate(['/services']);
    }
  }

  /**getLoginStatus
   * formatLabel 
   *
   * @param elm = search input field reference
   * 
  */
  getLoginStatus(){
    if(typeof(localStorage.getItem('access_token'))!='undefined' && atob(localStorage.getItem('user_type'))=='2'){
      //this.router.navigate(['/doer/apply-pins/'+Pin_id_slug]);
      return 2;
    }
    else if(typeof(localStorage.getItem('access_token'))!='undefined' && atob(localStorage.getItem('user_type'))=='1'){
      return 1;
    }
    else{
      //this.openDialog(Pin_id_slug);
      return 0;
    }
  }

  selectedDoer(index) {

  	let tempName = this.pinList[index].id;  	
    console.log(this.pinList[index]); 	
  	this.totalDoerSelected = (this.inviteDoerModel[tempName]==true) ? this.totalDoerSelected+1 : this.totalDoerSelected-1;
    //this.selectedDoers.push(tempName);
    let flagALreadyHas = false;
    if(this.inviteDoerModel[tempName]==true) {
      this.selectedDoers.push(this.pinList[index]);
    }
    else {
      for(let x = 0;x<this.selectedDoers.length;x++) {
        if(this.selectedDoers[x].id == tempName) {
          this.selectedDoers.splice(x,1);
        }
      }
      
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

}
