import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { CommonService } from '../../../../../commonservice';
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globalconstant } from '../../../../../global_constant';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-raise-dispute-form',
  templateUrl: './raise-dispute-form.component.html',
  styleUrls: ['./raise-dispute-form.component.scss']
})
export class RaiseDisputeFormComponent implements OnInit {

  @Input('isHiddenPinId') isHiddenPinId;

  @ViewChild('popUpVar') popupref;

  dispute_pin_form: FormGroup;
  types:any = [
    {value: 'Scam/Fraud', viewValue: 'Scam/Fraud'},
    {value: 'Prohibited Pin', viewValue: 'Prohibited Pin'},
    {value: 'Inappropriate Content', viewValue: 'Inappropriate Content'},
    {value: 'Duplicate Listing', viewValue: 'Duplicate Listing'},
    {value: 'Copyright', viewValue: 'Copyright'},
    {value: 'Rendering Service', viewValue: 'Rendering Service'},
    {value: 'Payment Related', viewValue: 'Payment Related'},
    {value: 'Other', viewValue: 'Other'},
  ];

  pin_milestones:any  = [
      //{value: '', viewValue: 'All'},
  ];

  imgUrl = '';
  imageObj:any;
  uploadedFileName:any = '';
  pin_id_title:any = '';
  pin_title:any = '';
  pin_slug:any = '';
  active_doer_id:any;
  pinDetails: any;

  constructor( public gbConstant: Globalconstant, public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar,  private _fb: FormBuilder,private router: Router) {

   }

  ngOnInit() {
    this.dispute_pin_form = this._fb.group({
        dispute_pin_id: [this.isHiddenPinId, Validators.required],
        dispute_reason_type: ['', Validators.required],
        dispute_reason_desc: ['', Validators.required],
        imgUrl: ['']
      });
  }

  get f() { return this.dispute_pin_form.controls; }

  togglePopup(pinDetails = null) {
    this.dispute_pin_form.patchValue({
      dispute_pin_id: this.isHiddenPinId,
    });
    this.getpinMilestone(this.isHiddenPinId);
  	if (this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement, 'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
  	} else {
  		this.renderer.addClass(this.popupref.nativeElement, 'opened');
  		this.renderer.addClass(document.body, 'popup-open');
    }

    this.pinDetails = pinDetails;
  }


  getpinMilestone(val){
    this.commonservice.postHttpCall({url:'/pinners/pin-milestone',data:{pin_id: val}, contenttype:"application/json"}).then(result=>this.getpinMilestoneSuccess(result));
  }

  getpinMilestoneSuccess(response){
    console.log('response',response);
    if (response.status==1) {
      this.pin_title = response.pin_data.title;
      this.pin_slug = response.pin_data.slug;
      this.active_doer_id = response.active_doer_id;
      for (var i = response.data.length - 1; i >= 0; i--) {
        this.pin_milestones.push(response.data[i]);
        this.pin_id_title = response.pin_data.title+' , '+response.pin_data.pin_unique_id;
      }
      console.log(this.pin_milestones);
    }
  }

  onDelete(e) {
      this.imageObj = '';
  }

  accptFile(e) {
      this.imageObj = e.target.files[0];
      this.imgUrl = '';
      this.uploadedFileName = this.imageObj.name;
  }

  disputePinadd(form){
    if(form.valid) {
      let fd = new FormData();
      let values = form.value;
      Object.keys(values).forEach(function(key) {
          if(key=='pImg'){
              fd.append(key, values[key].formatted);
          } else{
            fd.append(key, values[key]);
          }
        });
      if(this.imageObj){
        fd.append('dispute_file',this.imageObj);
      }
      this.commonservice.postHttpCall({url:'/pinners/dispute-pin-by-pinner', data:fd, contenttype:"form-data"}).then(result=>this.disputeSuccess(result));
    } else {
        //this.isformSubmitted = false;
        console.log('required field');
      }
  }

  disputeSuccess(response){
    if(response.status==1){
      var postData = {  'sender_id':  atob(localStorage.getItem('frontend_user_id')),
                        'reciver_id': this.active_doer_id,
                        'pin_id' : this.isHiddenPinId,
                        'title' : 'Uh oh.  A dispute on Pin '+this.pin_title+' has been raised.',
                        'link': 'doer/quotation-preview/'+this.pin_slug,
                        'show_in_todo':1,
                        'todo_title' : ' A dispute on Pin '+this.pin_title+' has been raised. A PinDo Admin will be in touch soon to help.',
                        'todo_link': 'doer/quotation-preview/'+this.pin_slug,
                        //'user_title': 'We are sorry you have had to dispute Pin '+this.pin_title+'.  A PinDo admin will be in touch soon.',
                        'user_title': 'Your claim has been received and you will receive a response shortly.',
                        'emailTemplateSlug':'dispute_claim',
                        'userEmailTemplateSlug': 'dispute_claim_send_by_doer',
                        'user_link': 'pinner/my-pins',

                        'PIN_UNIQUE_ID': this.pinDetails['pin_unique_id'],
                        'PINDETAILSURL': 'doer/quotation-preview/' + this.pinDetails['slug'],
                        'HOME_PAGE_LINK': 'doer/community-home',
                        'ACTIVITY_PAGE_LINK': 'doer/dashboard',
                        'MYPINS_PAGE_LINK': 'doer/my-pins',
                        'PIN_A_JOB_PAGE': 'FIND A JOB',
                        'PIN_A_JOB_PAGE_LINK': 'public-pins'
                      };

      var postDataPinner = {  'sender_id':  atob(localStorage.getItem('frontend_user_id')),
                        'reciver_id': atob(localStorage.getItem('frontend_user_id')),
                        'pin_id' : this.isHiddenPinId,
                        'title' : 'Uh oh.  A dispute on Pin '+this.pin_title+' has been raised.',
                        'link': 'doer/quotation-preview/'+this.pin_slug,
                        'show_in_todo':1,
                        'todo_title' : ' A dispute on Pin '+this.pin_title+' has been raised. A PinDo Admin will be in touch soon to help.',
                        'todo_link': 'doer/quotation-preview/'+this.pin_slug,
                        //'user_title': 'We are sorry you have had to dispute Pin '+this.pin_title+'.  A PinDo admin will be in touch soon.',
                        'user_title': 'Your claim has been received and you will receive a response shortly.',
                        'emailTemplateSlug':'dispute_claim',
                        'userEmailTemplateSlug': 'dispute_claim_send_by_doer',
                        'user_link': 'pinner/my-pins',

                        'PIN_UNIQUE_ID': this.pinDetails['pin_unique_id'],
                        'PINDETAILSURL': 'pinner/active-quotation-details/' + this.pinDetails['slug'] + '/' + btoa(this.active_doer_id),
                        'HOME_PAGE_LINK': 'community/community-home',
                        'ACTIVITY_PAGE_LINK': 'pinner/dashboard',
                        'MYPINS_PAGE_LINK': 'pinner/my-pins',
                        'PIN_A_JOB_PAGE': 'PIN A JOB',
                        'PIN_A_JOB_PAGE_LINK': 'pinner/create-new-pin',
                      };

      //this.gbConstant.notificationSocket.emit("post-dispute-notification-email",response.dataEmail);
      this.gbConstant.notificationSocket.emit("post-notification-to-doer",postData);
      setTimeout(()=>{
        this.gbConstant.notificationSocket.emit("post-notification-to-pinner-himself",postDataPinner);
      },3000);

      this.togglePopup();
      this.responseMessageSnackBar(response.msg);
    }
    else{
      this.responseMessageSnackBar(response.msg,'error');
    }
    this.router.navigate(['/pinner/dashboard']);
  }

  public responseMessageSnackBar(message,res_class:any='',vertical_position:any='bottom'){
      this.snackBar.open(message,'', {
          duration: 6000,
          horizontalPosition:'right',
          verticalPosition:vertical_position,
          panelClass:res_class
      });
  }

}
