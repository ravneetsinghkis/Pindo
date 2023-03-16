import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormControl } from '@angular/forms';
declare var $;
@Component({
  selector: 'app-pinner-control',
  templateUrl: './pinner-control.component.html',
  styleUrls: ['./pinner-control.component.scss']
})
export class PinnerControlComponent implements OnInit {
  @Input()
  isControltHidden;
  profile_details: any = [];
  list_privacy: any = [];
  user_id: any;
  fnamecoomunity: any = true;
  fnamecontact: any = true;
  fnamepublicprofile:any = true;
  lnamecoomunity: any = true;
  lnamecontact: any = true;
  lnamepublicprofile:any = true;
  unamecoomunity: any = true;
  unamecontact: any = true;
  unamepublicprofile:any = true;
  priaddcoomunity: any = true;
  priaddcontact: any = true;
  priaddpublicprofile:any = true;
  biocoomunity: any = true;
  biocontact: any = true;
  biopublicprofile:any = true;
  interestcoomunity: any = true;
  interestcontact: any = true;
  interestpublicprofile:any = true;
  summarystatcoomunity: any = true;
  summarystatcontact: any = true;
  summarystatpublicprofile:any = true;
  post_pin_reviewscoomunity: any = true;
  post_pin_reviewscontact: any = true;
  post_pin_reviewspublicprofile:any = true;
  profile_photocontact: any = true;
  profile_photocoomunity: any = true;
  profile_photopublicprofile:any = true;
  contact_infocoomunity:any = true;
  contact_infocontact:any = true;
  contact_infopublicprofile:any = true;
  contactscoomunity:any = true;
  contactscontact:any = true;
  contactspublicprofile:any = true;
  commentscoomunity:any = true;
  commentscontact:any = true;
  commentspublicprofile:any = true;
  postscoomunity:any = true;
  postscontact:any = true;
  postspublicprofile:any = true;
  referralscoomunity:any = true;
  referralscontact:any = true;
  referralspublicprofile:any = true;
  column_value:any;
  columnfield:any;
  data:any;
  review_btn=true;
  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar) { }
  // fnamecoomunity = new FormControl();
  ngOnInit() {
    // this.fnamecontact = true ;
    // this.fnamecoomunityactive = true ;
    this.getProfileinfoDetails();
    ///this.getusercontrolinfo(this.user_id);

  }
  getProfileinfoDetails() {

    this.commonservice.postHttpCall({ url: '/pinners/get-basic-profile', data: {}, contenttype: "application/json" }).then(result => {
      this.profile_details = result.data
      console.log('user///////data', this.profile_details.id);
      this.user_id = this.profile_details.id;
      this.getusercontrolinfo(this.user_id);
    });
  }

  getusercontrolinfo(user_id) {

    console.log('user///////id', user_id);
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/list-privacy', data: { user_id: user_id }, contenttype: "application/json" }).then(result => {
      this.list_privacy = result.data
      console.log('user///////privacydata', this.list_privacy);
      if(result.data)
      {
         
        if(this.list_privacy.first_name == 0)
     {
       this.fnamecoomunity = false ;
       this.fnamecontact = false ;
       this.fnamepublicprofile = false ;
     }
     if(this.list_privacy.first_name == 1)
     {
      this.fnamecoomunity = true ;
      this.fnamecontact = false ;
      this.fnamepublicprofile = false ;
     }
     if(this.list_privacy.first_name == 2)
     {
      this.fnamecoomunity = false ;
      this.fnamecontact = true ;
      this.fnamepublicprofile = false ;
     }
     if(this.list_privacy.first_name == 3)
     {
      this.fnamecoomunity = false ;
      this.fnamecontact = false ;
      this.fnamepublicprofile = true ;
     }
     if(this.list_privacy.first_name == 4)
     {
      this.fnamecoomunity = true ;
      this.fnamecontact = true ;
      this.fnamepublicprofile = false ;
     }
     if(this.list_privacy.first_name == 5)
     {
      this.fnamecoomunity = false ;
      this.fnamecontact = true ;
      this.fnamepublicprofile = true ;
     }
     if(this.list_privacy.first_name == 6)
     {
      this.fnamecoomunity = true ;
      this.fnamecontact = false ;
      this.fnamepublicprofile = true ;
     }
     if(this.list_privacy.first_name == 7)
     {
      this.fnamecoomunity = true ;
      this.fnamecontact = true ;
      this.fnamepublicprofile = true ;
     }
     if(this.list_privacy.last_name == 0)
     {
       this.lnamecoomunity = false ;
       this.lnamecontact = false ;
       this.lnamepublicprofile = false ;
     }
     if(this.list_privacy.last_name == 1)
     {
      this.lnamecoomunity = true ;
      this.lnamecontact = false ;
      this.lnamepublicprofile = false ;
     }
     if(this.list_privacy.last_name == 2)
     {
      this.lnamecoomunity = false ;
      this.lnamecontact = true ;
      this.lnamepublicprofile = false ;
     }
     if(this.list_privacy.last_name == 3)
     {
      this.lnamecoomunity = false ;
      this.lnamecontact = false ;
      this.lnamepublicprofile = true
     }
     if(this.list_privacy.last_name == 4)
     {
      this.lnamecoomunity = true ;
      this.lnamecontact = true ;
      this.lnamepublicprofile = false
     }
     if(this.list_privacy.last_name == 5)
     {
      this.lnamecoomunity = false ;
      this.lnamecontact = true ;
      this.lnamepublicprofile = true
     }
     if(this.list_privacy.last_name == 6)
     {
      this.lnamecoomunity = true ;
      this.lnamecontact = false ;
      this.lnamepublicprofile = true
     }
     if(this.list_privacy.last_name == 7)
     {
      this.lnamecoomunity = true ;
      this.lnamecontact = true ;
      this.lnamepublicprofile = true ;
     }
     if(this.list_privacy.username == 0)
     {
       this.unamecoomunity = false ;
       this.unamecontact = false ;
       this.unamepublicprofile = false ;
     }
     if(this.list_privacy.username == 1)
     {
      this.unamecoomunity = true ;
      this.unamecontact = false ;
      this.unamepublicprofile = false ;
     }
     if(this.list_privacy.username == 2)
     {
      this.unamecoomunity = false ;
      this.unamecontact = true ;
      this.unamepublicprofile = false ;
     }
     if(this.list_privacy.username == 3)
     {
      this.unamecoomunity = false ;
      this.unamecontact = false ;
      this.unamepublicprofile = true ;
     }
     if(this.list_privacy.username == 4)
     {
      this.unamecoomunity = true ;
      this.unamecontact = true ;
      this.unamepublicprofile = false ;
     }
     if(this.list_privacy.username == 5)
     {
      this.unamecoomunity = false ;
      this.unamecontact = true ;
      this.unamepublicprofile = true ;
     }
     if(this.list_privacy.username == 6)
     {
      this.unamecoomunity = true ;
      this.unamecontact = false ;
      this.unamepublicprofile = true ;
     }
     if(this.list_privacy.username == 7)
     {
      this.unamecoomunity = true ;
      this.unamecontact = true ;
      this.unamepublicprofile = true ;
     }
     if(this.list_privacy.primary_address == 0)
     {
       this.priaddcoomunity = false ;
       this.priaddcontact = false ;
       this.priaddpublicprofile = false ;
     }
     if(this.list_privacy.primary_address == 1)
     {
      this.priaddcoomunity = true ;
      this.priaddcontact = false ;
      this.priaddpublicprofile = false ;
     }
     if(this.list_privacy.primary_address == 2)
     {
      this.priaddcoomunity = false ;
      this.priaddcontact = true ;
      this.priaddpublicprofile = false ;
     }
     if(this.list_privacy.primary_address == 3)
     {
      this.priaddcoomunity = false ;
      this.priaddcontact = false ;
      this.priaddpublicprofile = true ;
     }
     if(this.list_privacy.primary_address == 4)
     {
      this.priaddcoomunity = true ;
      this.priaddcontact = true ;
      this.priaddpublicprofile = false ;
     }
     if(this.list_privacy.primary_address == 5)
     {
      this.priaddcoomunity = false ;
      this.priaddcontact = true ;
      this.priaddpublicprofile = true ;
     }
     if(this.list_privacy.primary_address == 6)
     {
      this.priaddcoomunity = true ;
      this.priaddcontact = false ;
      this.priaddpublicprofile = true ;
     }
     if(this.list_privacy.primary_address == 7)
     {
      this.priaddcoomunity = true ;
      this.priaddcontact = true ;
      this.priaddpublicprofile = true ;
     }
     
     if(this.list_privacy.bio == 0)
     {
       this.biocoomunity = false ;
       this.biocontact = false ;
       this.biopublicprofile = false ;
     }
     if(this.list_privacy.bio == 1)
     {
      this.biocoomunity = true ;
      this.biocontact = false ;
      this.biopublicprofile = false ;
     }
     if(this.list_privacy.bio == 2)
     {
      this.biocoomunity = false ;
      this.biocontact = true ;
      this.biopublicprofile = false ;
     }
     if(this.list_privacy.bio == 3)
     {
      this.biocoomunity = false ;
      this.biocontact = false ;
      this.biopublicprofile = true
     }
     if(this.list_privacy.bio == 4)
     {
      this.biocoomunity = true ;
      this.biocontact = true ;
      this.biopublicprofile = false
     }
     if(this.list_privacy.bio == 5)
     {
      this.biocoomunity = false ;
      this.biocontact = true ;
      this.biopublicprofile = true
     }
     if(this.list_privacy.bio == 6)
     {
      this.biocoomunity = true ;
      this.biocontact = false ;
      this.biopublicprofile = true
     }
     if(this.list_privacy.bio == 7)
     {
      this.biocoomunity = true ;
      this.biocontact = true ;
      this.biopublicprofile = true
     }
     if(this.list_privacy.interest == 0)
     {
       this.interestcoomunity = false ;
       this.interestcontact = false ;
       this.interestpublicprofile = false ;
     }
     if(this.list_privacy.interest == 1)
     {
      this.interestcoomunity = true ;
      this.interestcontact = false ;
      this.interestpublicprofile = false;
     }
     if(this.list_privacy.interest == 2)
     {
      this.interestcoomunity = false ;
      this.interestcontact = true ;
      this.interestpublicprofile =false ;
     }
     if(this.list_privacy.interest == 3)
     {
      this.interestcoomunity = false ;
      this.interestcontact = false ;
      this.interestpublicprofile = true ;
     }
     if(this.list_privacy.interest == 4)
     {
      this.interestcoomunity = true ;
      this.interestcontact = true ;
      this.interestpublicprofile = false ;
     }
     if(this.list_privacy.interest == 5)
     {
      this.interestcoomunity = false ;
      this.interestcontact = true ;
      this.interestpublicprofile = true ;
     }
     if(this.list_privacy.interest == 6)
     {
      this.interestcoomunity = true ;
      this.interestcontact = false ;
      this.interestpublicprofile = true ;
     }
     if(this.list_privacy.interest == 7)
     {
      this.interestcoomunity = true ;
      this.interestcontact = true ;
      this.interestpublicprofile = true ;
     }

     if(this.list_privacy.summary_statistics == 0)
     {
       this.summarystatcoomunity = false ;
       this.summarystatcontact = false ;
       this.summarystatpublicprofile = false ;
     }
     if(this.list_privacy.summary_statistics == 1)
     {
      this.summarystatcoomunity = true ;
      this.summarystatcontact = false ;
      this.summarystatpublicprofile = false ;
     }
     if(this.list_privacy.summary_statistics == 2)
     {
      this.summarystatcoomunity = false ;
      this.summarystatcontact = true ;
      this.summarystatpublicprofile = false ;
     }
     if(this.list_privacy.summary_statistics == 3)
     {
      this.summarystatcoomunity = false ;
      this.summarystatcontact = false ;
      this.summarystatpublicprofile = true ;
     }
     if(this.list_privacy.summary_statistics == 4)
     {
      this.summarystatcoomunity = true ;
      this.summarystatcontact = true ;
      this.summarystatpublicprofile = false ;
     }
     if(this.list_privacy.summary_statistics == 5)
     {
      this.summarystatcoomunity = false ;
      this.summarystatcontact = true ;
      this.summarystatpublicprofile = true
     }
     if(this.list_privacy.summary_statistics == 6)
     {
      this.summarystatcoomunity = true ;
      this.summarystatcontact = false ;
      this.summarystatpublicprofile = true
     }
     if(this.list_privacy.summary_statistics == 7)
     {
      this.summarystatcoomunity = true ;
      this.summarystatcontact = true ;
      this.summarystatpublicprofile = true
     }
     if(this.list_privacy.post_pin_reviews == 0)
     {
       this.post_pin_reviewscoomunity = false ;
       this.post_pin_reviewscontact = false ;
       this.post_pin_reviewspublicprofile = false ;
     }
     if(this.list_privacy.post_pin_reviews == 1)
     {
      this.post_pin_reviewscoomunity = true ;
      this.post_pin_reviewscontact = false ;
      this.post_pin_reviewspublicprofile = false ;
     }
     if(this.list_privacy.post_pin_reviews == 2)
     {
      this.post_pin_reviewscoomunity = false ;
      this.post_pin_reviewscontact = true ;
      this.post_pin_reviewspublicprofile = false ;
     }
     if(this.list_privacy.post_pin_reviews == 3)
     {
      this.post_pin_reviewscoomunity = false ;
      this.post_pin_reviewscontact = false ;
      this.post_pin_reviewspublicprofile = true ;
     }
     if(this.list_privacy.post_pin_reviews == 4)
     {
      this.post_pin_reviewscoomunity = true ;
      this.post_pin_reviewscontact = true ;
      this.post_pin_reviewspublicprofile = false ;
     }
     if(this.list_privacy.post_pin_reviews == 5)
     {
      this.post_pin_reviewscoomunity = false ;
      this.post_pin_reviewscontact = true ;
      this.post_pin_reviewspublicprofile = true ;
     }
     if(this.list_privacy.post_pin_reviews == 6)
     {
      this.post_pin_reviewscoomunity = true ;
      this.post_pin_reviewscontact = false ;
      this.post_pin_reviewspublicprofile = true ;
     }
     if(this.list_privacy.post_pin_reviews == 7)
     {
      this.post_pin_reviewscoomunity = true ;
      this.post_pin_reviewscontact = true ;
      this.post_pin_reviewspublicprofile = true ;
     }
    if(this.list_privacy.profile_photo == 0)
     {
       this.profile_photocoomunity = false ;
       this.profile_photocontact = false ;
       this.profile_photopublicprofile = false ;
     }
     if(this.list_privacy.profile_photo == 1)
     {
      this.profile_photocoomunity = true ;
      this.profile_photocontact = false ;
      this.profile_photopublicprofile = false ;
     }
     if(this.list_privacy.profile_photo == 2)
     {
      this.profile_photocoomunity = false ;
      this.profile_photocontact = true ;
      this.profile_photopublicprofile = false ;
     }
     if(this.list_privacy.profile_photo == 3)
     {
      this.profile_photocoomunity = false ;
      this.profile_photocontact = false ;
      this.profile_photopublicprofile = true ;
     }
     if(this.list_privacy.profile_photo == 4)
     {
      this.profile_photocoomunity = true ;
      this.profile_photocontact = true ;
      this.profile_photopublicprofile = false ;
     }
     if(this.list_privacy.profile_photo == 5)
     {
      this.profile_photocoomunity = false ;
      this.profile_photocontact = true ;
      this.profile_photopublicprofile = true ;
     }
     if(this.list_privacy.profile_photo == 6)
     {
      this.profile_photocoomunity = true ;
      this.profile_photocontact = false ;
      this.profile_photopublicprofile = true ;
     }
     if(this.list_privacy.profile_photo == 7)
     {
      this.profile_photocoomunity = true ;
      this.profile_photocontact = true ;
      this.profile_photopublicprofile = true ;
     }
     if(this.list_privacy.contact_info == 0)
     {
       this.contact_infocoomunity = false ;
       this.contact_infocontact = false ;
       this.contact_infopublicprofile = false ;
     }
     if(this.list_privacy.contact_info == 1)
     {
      this.contact_infocoomunity = true ;
      this.contact_infocontact = false ;
      this.contact_infopublicprofile = false ;
     }
     if(this.list_privacy.contact_info == 2)
     {
      this.contact_infocoomunity = false ;
      this.contact_infocontact = true ;
      this.contact_infopublicprofile = false ;
     }
     if(this.list_privacy.contact_info == 3)
     {
      this.contact_infocoomunity = false ;
      this.contact_infocontact = false ;
      this.contact_infopublicprofile = true ;
     }
     if(this.list_privacy.contact_info == 4)
     {
      this.contact_infocoomunity = true ;
      this.contact_infocontact = true ;
      this.contact_infopublicprofile = false ;
     }
     if(this.list_privacy.contact_info == 5)
     {
      this.contact_infocoomunity = false ;
      this.contact_infocontact = true ;
      this.contact_infopublicprofile = true ;
     }
     if(this.list_privacy.contact_info == 6)
     {
      this.contact_infocoomunity = true ;
      this.contact_infocontact = false ;
      this.contact_infopublicprofile = true ;
     }
     if(this.list_privacy.contact_info == 7)
     {
      this.contact_infocoomunity = true ;
      this.contact_infocontact = true ;
      this.contact_infopublicprofile = true ;
     }
     if(this.list_privacy.contacts == 0)
     {
       this.contactscoomunity = false ;
       this.contactscontact = false ;
       this.contactspublicprofile = false ;
     }
     if(this.list_privacy.contacts == 1)
     {
      this.contactscoomunity = true ;
      this.contactscontact = false ;
      this.contactspublicprofile = false ;
     }
     if(this.list_privacy.contacts == 2)
     {
      this.contactscoomunity = false ;
      this.contactscontact = true ;
      this.contactspublicprofile = false ;
     }
     if(this.list_privacy.contacts == 3)
     {
      this.contactscoomunity = false ;
      this.contactscontact = false ;
      this.contactspublicprofile = true ;
     }
     if(this.list_privacy.contacts == 4)
     {
      this.contactscoomunity = true ;
      this.contactscontact = true ;
      this.contactspublicprofile = false ;
     }
     if(this.list_privacy.contacts == 5)
     {
      this.contactscoomunity = false ;
      this.contactscontact = true ;
      this.contactspublicprofile = true ;
     }
     if(this.list_privacy.contacts == 6)
     {
      this.contactscoomunity = true ;
      this.contactscontact = false ;
      this.contactspublicprofile = true ;
     }
     if(this.list_privacy.contacts == 7)
     {
      this.contactscoomunity = true ;
      this.contactscontact = true ;
      this.contactspublicprofile = true ;
     }
     if(this.list_privacy.comments == 0)
     {
       this.commentscoomunity = false ;
       this.commentscontact = false ;
       this.commentspublicprofile = false ;
     }
     if(this.list_privacy.comments == 1)
     {
      this.commentscoomunity = true ;
      this.commentscontact = false ;
      this.commentspublicprofile = false ;
     }
     if(this.list_privacy.comments == 2)
     {
      this.commentscoomunity = false ;
      this.commentscontact = true ;
      this.commentspublicprofile = false ;
     }
     if(this.list_privacy.comments == 3)
     {
      this.commentscoomunity = false ;
      this.commentscontact = false ;
      this.commentspublicprofile = true ;
     }
     if(this.list_privacy.comments == 4)
     {
      this.commentscoomunity = true ;
      this.commentscontact = true ;
      this.commentspublicprofile = false ;
     }
     if(this.list_privacy.comments == 5)
     {
      this.commentscoomunity = false ;
      this.commentscontact = true ;
      this.commentspublicprofile = true ;
     }
     if(this.list_privacy.comments == 6)
     {
      this.commentscoomunity = true ;
      this.commentscontact = false ;
      this.commentspublicprofile = true ;
     }
     if(this.list_privacy.comments == 7)
     {
      this.commentscoomunity = true ;
      this.commentscontact = true ;
      this.commentspublicprofile = true ;
     }
     
     if(this.list_privacy.posts == 0)
     {
       this.postscoomunity = false ;
       this.postscontact = false ;
       this.postspublicprofile = false ;
     }
     if(this.list_privacy.posts == 1)
     {
      this.postscoomunity = true ;
      this.postscontact = false ;
      this.postspublicprofile = false ;
     }
     if(this.list_privacy.posts == 2)
     {
      this.postscoomunity = false ;
      this.postscontact = true ;
      this.postspublicprofile = false ;
     }
     if(this.list_privacy.posts == 3)
     {
      this.postscoomunity = true ;
      this.postscontact = true ;
      this.postspublicprofile = true ;
     }
     if(this.list_privacy.posts == 4)
     {
      this.postscoomunity = true ;
      this.postscontact = true ;
      this.postspublicprofile = false ;
     }
     if(this.list_privacy.posts == 5)
     {
      this.postscoomunity = false ;
      this.postscontact = true ;
      this.postspublicprofile = true ;
     }
     if(this.list_privacy.posts == 6)
     {
      this.postscoomunity = true ;
      this.postscontact = false ;
      this.postspublicprofile = true ;
     }
     if(this.list_privacy.posts == 7)
     {
      this.postscoomunity = true ;
      this.postscontact = true ;
      this.postspublicprofile = true ;
     }
     if(this.list_privacy.referrals == 0)
     {
       this.referralscoomunity = false ;
       this.referralscontact = false ;
       this.referralspublicprofile = false ;
     }
     if(this.list_privacy.referrals == 1)
     {
      this.referralscoomunity = true ;
      this.referralscontact = false ;
      this.referralspublicprofile = false ;
     }
     if(this.list_privacy.referrals == 2)
     {
      this.referralscoomunity = false ;
      this.referralscontact = true ;
      this.referralspublicprofile = false ;
     }
     if(this.list_privacy.referrals == 3)
     {
      this.referralscoomunity = true ;
      this.referralscontact = true ;
      this.referralspublicprofile = true ;
     }
     if(this.list_privacy.referrals == 4)
     {
      this.referralscoomunity = true ;
      this.referralscontact = true ;
      this.referralspublicprofile = false ;
     }
     if(this.list_privacy.referrals == 5)
     {
      this.referralscoomunity = false ;
      this.referralscontact = true ;
      this.referralspublicprofile = true ;
     }
     if(this.list_privacy.referrals == 6)
     {
      this.referralscoomunity = true ;
      this.referralscontact = false ;
      this.referralspublicprofile = true ;
     }
     if(this.list_privacy.referrals == 7)
     {
      this.referralscoomunity = true ;
      this.referralscontact = true ;
      this.referralspublicprofile = true ;
     }

      }
    
    });
  }


  onChange(userid, type, columnname, accesstype) {

    console.log('accesstype',accesstype);
    console.log('fnamecoomunity',this.fnamecoomunity);
    console.log('fnamecontact',this.fnamecontact);
    console.log('fnamepublicprofile',this.fnamepublicprofile);
  

    if (accesstype == 'fnamecoomunity' || accesstype == 'fnamecontact' || accesstype == 'fnamepublicprofile') {
        
       if (this.fnamecoomunity == false && this.fnamecontact == false && this.fnamepublicprofile == false)
       {
        this.column_value = 0;
      }
      
      if (this.fnamecoomunity == true && (this.fnamecontact == false || this.fnamecontact == undefined) && (this.fnamepublicprofile == false || this.fnamepublicprofile == undefined)) {
        this.column_value = 1;
      }
      if ((this.fnamecoomunity == false || this.fnamecoomunity == undefined)  && this.fnamecontact == true && (this.fnamepublicprofile == false || this.fnamepublicprofile == undefined ) ) {
        this.column_value = 2;
      }

      if ((this.fnamecoomunity == false || this.fnamecoomunity == undefined ) && (this.fnamecontact == false || this.fnamecontact == undefined ) && this.fnamepublicprofile == true ) {
        this.column_value = 3;
      }
      
      if (this.fnamecoomunity == true  && this.fnamecontact == true && (this.fnamepublicprofile == false || this.fnamepublicprofile == undefined) ) {
        this.column_value = 4;
      }

      if ((this.fnamecoomunity == false || this.fnamecoomunity == undefined ) && this.fnamecontact == true && this.fnamepublicprofile == true ) {
        this.column_value = 5;
      }

      if (this.fnamecoomunity == true  && (this.fnamecontact == false || this.fnamecontact == undefined ) && this.fnamepublicprofile == true ) {
        this.column_value = 6;
      }

      if (this.fnamecoomunity == true  && this.fnamecontact == true && this.fnamepublicprofile == true ) {
        this.column_value = 7;
      }
      this.data = {"first_name":this.column_value}
    }
    if (accesstype == 'lnamecoomunity' || accesstype == 'lnamecontact' || accesstype == 'lnamepublicprofile') {
      if (this.lnamecoomunity == false && this.lnamecontact == false && this.lnamepublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.lnamecoomunity == true && (this.lnamecontact == false || this.lnamecontact == undefined) && (this.lnamepublicprofile == false || this.lnamepublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.lnamecoomunity == false || this.lnamecoomunity == undefined)  && this.lnamecontact == true && (this.lnamepublicprofile == false || this.lnamepublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.lnamecoomunity == false || this.lnamecoomunity == undefined ) && (this.lnamecontact == false || this.lnamecontact == undefined ) && this.lnamepublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.lnamecoomunity == true  && this.lnamecontact == true && (this.lnamepublicprofile == false || this.lnamepublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.lnamecoomunity == false || this.lnamecoomunity == undefined ) && this.lnamecontact == true && this.lnamepublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.lnamecoomunity == true  && (this.lnamecontact == false || this.lnamecontact == undefined ) && this.lnamepublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.lnamecoomunity == true  && this.lnamecontact == true && this.lnamepublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"last_name":this.column_value}
    }
    if (accesstype == 'unamecoomunity' || accesstype == 'unamecontact' || accesstype == 'unamepublicprofile') {
      if (this.unamecoomunity == false && this.unamecontact == false && this.unamepublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.unamecoomunity == true && (this.unamecontact == false || this.unamecontact == undefined) && (this.unamepublicprofile == false || this.unamepublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.unamecoomunity == false || this.unamecoomunity == undefined)  && this.unamecontact == true && (this.unamepublicprofile == false || this.unamepublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.unamecoomunity == false || this.unamecoomunity == undefined ) && (this.unamecontact == false || this.unamecontact == undefined ) && this.unamepublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.unamecoomunity == true  && this.unamecontact == true && (this.unamepublicprofile == false || this.unamepublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.unamecoomunity == false || this.unamecoomunity == undefined ) && this.unamecontact == true && this.unamepublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.unamecoomunity == true  && (this.unamecontact == false || this.unamecontact == undefined ) && this.unamepublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.unamecoomunity == true  && this.unamecontact == true && this.unamepublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"username":this.column_value}
    }
    if (accesstype == 'priaddcoomunity' || accesstype == 'priaddcontact' || accesstype == 'priaddpublicprofile') {
      if (this.priaddcoomunity == false && this.priaddcontact == false && this.priaddpublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.priaddcoomunity == true && (this.priaddcontact == false || this.priaddcontact == undefined) && (this.priaddpublicprofile == false || this.priaddpublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.priaddcoomunity == false || this.priaddcoomunity == undefined)  && this.priaddcontact == true && (this.priaddpublicprofile == false || this.priaddpublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.priaddcoomunity == false || this.priaddcoomunity == undefined ) && (this.priaddcontact == false || this.priaddcontact == undefined ) && this.priaddpublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.priaddcoomunity == true  && this.priaddcontact == true && (this.priaddpublicprofile == false || this.priaddpublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.priaddcoomunity == false || this.priaddcoomunity == undefined ) && this.priaddcontact == true && this.priaddpublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.priaddcoomunity == true  && (this.priaddcontact == false || this.priaddcontact == undefined ) && this.priaddpublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.priaddcoomunity == true  && this.priaddcontact == true && this.priaddpublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"primary_address":this.column_value}
    }
    if (accesstype == 'summarystatcoomunity' || accesstype == 'summarystatcontact' || accesstype == 'summarystatpublicprofile') {
      if (this.summarystatcoomunity == false && this.summarystatcontact == false && this.summarystatpublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.summarystatcoomunity == true && (this.summarystatcontact == false || this.summarystatcontact == undefined) && (this.summarystatpublicprofile == false || this.summarystatpublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.summarystatcoomunity == false || this.summarystatcoomunity == undefined)  && this.summarystatcontact == true && (this.summarystatpublicprofile == false || this.summarystatpublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.summarystatcoomunity == false || this.summarystatcoomunity == undefined ) && (this.summarystatcontact == false || this.summarystatcontact == undefined ) && this.summarystatpublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.summarystatcoomunity == true  && this.summarystatcontact == true && (this.summarystatpublicprofile == false || this.summarystatpublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.summarystatcoomunity == false || this.summarystatcoomunity == undefined ) && this.summarystatcontact == true && this.summarystatpublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.summarystatcoomunity == true  && (this.summarystatcontact == false || this.summarystatcontact == undefined ) && this.summarystatpublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.summarystatcoomunity == true  && this.summarystatcontact == true && this.summarystatpublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"summary_statistics":this.column_value}
    }
    if (accesstype == 'biocoomunity' || accesstype == 'biocontact' || accesstype == 'biopublicprofile') {
      if (this.biocoomunity == false && this.biocontact == false && this.biopublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.biocoomunity == true && (this.biocontact == false || this.biocontact == undefined) && (this.biopublicprofile == false || this.biopublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.biocoomunity == false || this.biocoomunity == undefined)  && this.biocontact == true && (this.biopublicprofile == false || this.biopublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.biocoomunity == false || this.biocoomunity == undefined ) && (this.biocontact == false || this.biocontact == undefined ) && this.biopublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.biocoomunity == true  && this.biocontact == true && (this.biopublicprofile == false || this.biopublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.biocoomunity == false || this.biocoomunity == undefined ) && this.biocontact == true && this.biopublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.biocoomunity == true  && (this.biocontact == false || this.biocontact == undefined ) && this.biopublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.biocoomunity == true  && this.biocontact == true && this.biopublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"bio":this.column_value}
    }

    if (accesstype == 'interestcoomunity' || accesstype == 'interestcontact' || accesstype == 'interestpublicprofile') {
      if (this.interestcoomunity == false && this.interestcontact == false && this.interestpublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.interestcoomunity == true && (this.interestcontact == false || this.interestcontact == undefined) && (this.interestpublicprofile == false || this.interestpublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.interestcoomunity == false || this.interestcoomunity == undefined)  && this.interestcontact == true && (this.interestpublicprofile == false || this.interestpublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.interestcoomunity == false || this.interestcoomunity == undefined ) && (this.interestcontact == false || this.interestcontact == undefined ) && this.interestpublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.interestcoomunity == true  && this.interestcontact == true && (this.interestpublicprofile == false || this.interestpublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.interestcoomunity == false || this.interestcoomunity == undefined ) && this.interestcontact == true && this.interestpublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.interestcoomunity == true  && (this.interestcontact == false || this.interestcontact == undefined ) && this.interestpublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.interestcoomunity == true  && this.interestcontact == true && this.interestpublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"interest":this.column_value}
    }

    if (accesstype == 'post_pin_reviewscoomunity' || accesstype == 'post_pin_reviewscontact' || accesstype =='post_pin_reviewspublicprofile') {
      if (this.post_pin_reviewscoomunity == false && this.post_pin_reviewscontact == false && this.post_pin_reviewspublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.post_pin_reviewscoomunity == true && (this.post_pin_reviewscontact == false || this.post_pin_reviewscontact == undefined) && (this.post_pin_reviewspublicprofile == false || this.post_pin_reviewspublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.post_pin_reviewscoomunity == false || this.post_pin_reviewscoomunity == undefined)  && this.post_pin_reviewscontact == true && (this.post_pin_reviewspublicprofile == false || this.post_pin_reviewspublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.post_pin_reviewscoomunity == false || this.post_pin_reviewscoomunity == undefined ) && (this.post_pin_reviewscontact == false || this.post_pin_reviewscontact == undefined ) && this.post_pin_reviewspublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.post_pin_reviewscoomunity == true  && this.post_pin_reviewscontact == true && (this.post_pin_reviewspublicprofile == false || this.post_pin_reviewspublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.post_pin_reviewscoomunity == false || this.post_pin_reviewscoomunity == undefined ) && this.post_pin_reviewscontact == true && this.post_pin_reviewspublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.post_pin_reviewscoomunity == true  && (this.post_pin_reviewscontact == false || this.post_pin_reviewscontact == undefined ) && this.post_pin_reviewspublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.post_pin_reviewscoomunity == true  && this.post_pin_reviewscontact == true && this.post_pin_reviewspublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"post_pin_reviews":this.column_value}
    }

    if (accesstype == 'profile_photocoomunity' || accesstype == 'profile_photocontact' || accesstype == 'profile_photopublicprofile') {
      if (this.profile_photocoomunity == false && this.profile_photocontact == false && this.profile_photopublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.profile_photocoomunity == true && (this.profile_photocontact == false || this.profile_photocontact == undefined) && (this.profile_photopublicprofile == false || this.profile_photopublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.profile_photocoomunity == false || this.profile_photocoomunity == undefined)  && this.profile_photocontact == true && (this.profile_photopublicprofile == false || this.profile_photopublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.profile_photocoomunity == false || this.profile_photocoomunity == undefined ) && (this.profile_photocontact == false || this.profile_photocontact == undefined ) && this.profile_photopublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.profile_photocoomunity == true  && this.profile_photocontact == true && (this.profile_photopublicprofile == false || this.profile_photopublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.profile_photocoomunity == false || this.profile_photocoomunity == undefined ) && this.profile_photocontact == true && this.profile_photopublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.profile_photocoomunity == true  && (this.profile_photocontact == false || this.profile_photocontact == undefined ) && this.profile_photopublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.profile_photocoomunity == true  && this.profile_photocontact == true && this.profile_photopublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"profile_photo":this.column_value}
    }

    if (accesstype == 'contact_infocoomunity' || accesstype == 'contact_infocontact' || accesstype == 'contact_infopublicprofile') {
      if (this.contact_infocoomunity == false && this.contact_infocontact == false && this.contact_infopublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.contact_infocoomunity == true && (this.contact_infocontact == false || this.contact_infocontact == undefined) && (this.contact_infopublicprofile == false || this.contact_infopublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.contact_infocoomunity == false || this.contact_infocoomunity == undefined)  && this.contact_infocontact == true && (this.contact_infopublicprofile == false || this.contact_infopublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.contact_infocoomunity == false || this.contact_infocoomunity == undefined ) && (this.contact_infocontact == false || this.contact_infocontact == undefined ) && this.contact_infopublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.contact_infocoomunity == true  && this.contact_infocontact == true && (this.contact_infopublicprofile == false || this.contact_infopublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.contact_infocoomunity == false || this.contact_infocoomunity == undefined ) && this.contact_infocontact == true && this.contact_infopublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.contact_infocoomunity == true  && (this.contact_infocontact == false || this.contact_infocontact == undefined ) && this.contact_infopublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.contact_infocoomunity == true  && this.contact_infocontact == true && this.contact_infopublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"contact_info":this.column_value}
    }


    if (accesstype == 'contactscoomunity' || accesstype == 'contactscontact' || accesstype == 'contactspublicprofile') {
      if (this.contactscoomunity == false && this.contactscontact == false && this.contactspublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.contactscoomunity == true && (this.contactscontact == false || this.contactscontact == undefined) && (this.contactspublicprofile == false || this.contactspublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.contactscoomunity == false || this.contactscoomunity == undefined)  && this.contactscontact == true && (this.contactspublicprofile == false || this.contactspublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.contactscoomunity == false || this.contactscoomunity == undefined ) && (this.contactscontact == false || this.contactscontact == undefined ) && this.contactspublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.contactscoomunity == true  && this.contactscontact == true && (this.contactspublicprofile == false || this.contactspublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.contactscoomunity == false || this.contactscoomunity == undefined ) && this.contactscontact == true && this.contactspublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.contactscoomunity == true  && (this.contactscontact == false || this.contactscontact == undefined ) && this.contactspublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.contactscoomunity == true  && this.contactscontact == true && this.contactspublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"contacts":this.column_value}
    }

    if (accesstype == 'commentscoomunity' || accesstype == 'commentscontact' || accesstype == 'commentspublicprofile') {
      if (this.commentscoomunity == false && this.commentscontact == false && this.commentspublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.commentscoomunity == true && (this.commentscontact == false || this.commentscontact == undefined) && (this.commentspublicprofile == false || this.commentspublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.commentscoomunity == false || this.commentscoomunity == undefined)  && this.commentscontact == true && (this.commentspublicprofile == false || this.commentspublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.commentscoomunity == false || this.commentscoomunity == undefined ) && (this.commentscontact == false || this.commentscontact == undefined ) && this.commentspublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.commentscoomunity == true  && this.commentscontact == true && (this.commentspublicprofile == false || this.commentspublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.commentscoomunity == false || this.commentscoomunity == undefined ) && this.commentscontact == true && this.commentspublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.commentscoomunity == true  && (this.commentscontact == false || this.commentscontact == undefined ) && this.commentspublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.commentscoomunity == true  && this.commentscontact == true && this.commentspublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"comments":this.column_value}
    } 
    if (accesstype == 'postscoomunity' || accesstype == 'postscontact' || accesstype == 'postspublicprofile') {
      if (this.postscoomunity == false && this.postscontact == false && this.postspublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.postscoomunity == true && (this.postscontact == false || this.postscontact == undefined) && (this.postspublicprofile == false || this.postspublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.postscoomunity == false || this.postscoomunity == undefined)  && this.postscontact == true && (this.postspublicprofile == false || this.postspublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.postscoomunity == false || this.postscoomunity == undefined ) && (this.postscontact == false || this.postscontact == undefined ) && this.postspublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.postscoomunity == true  && this.postscontact == true && (this.postspublicprofile == false || this.postspublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.postscoomunity == false || this.postscoomunity == undefined ) && this.postscontact == true && this.postspublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.postscoomunity == true  && (this.postscontact == false || this.postscontact == undefined ) && this.postspublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.postscoomunity == true  && this.postscontact == true && this.postspublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"posts":this.column_value}
    }

    if (accesstype == 'referralscoomunity' || accesstype == 'referralscontact' || accesstype == 'referralspublicprofile') {
      if (this.referralscoomunity == false && this.referralscontact == false && this.referralspublicprofile == false)
      {
       this.column_value = 0;
     }
     
     if (this.referralscoomunity == true && (this.referralscontact == false || this.referralscontact == undefined) && (this.referralspublicprofile == false || this.referralspublicprofile == undefined)) {
       this.column_value = 1;
     }
     if ((this.referralscoomunity == false || this.referralscoomunity == undefined)  && this.referralscontact == true && (this.referralspublicprofile == false || this.referralspublicprofile == undefined ) ) {
       this.column_value = 2;
     }

     if ((this.referralscoomunity == false || this.referralscoomunity == undefined ) && (this.referralscontact == false || this.referralscontact == undefined ) && this.referralspublicprofile == true ) {
       this.column_value = 3;
     }
     
     if (this.referralscoomunity == true  && this.referralscontact == true && (this.referralspublicprofile == false || this.referralspublicprofile == undefined) ) {
       this.column_value = 4;
     }

     if ((this.referralscoomunity == false || this.referralscoomunity == undefined ) && this.referralscontact == true && this.referralspublicprofile == true ) {
       this.column_value = 5;
     }

     if (this.referralscoomunity == true  && (this.referralscontact == false || this.referralscontact == undefined ) && this.referralspublicprofile == true ) {
       this.column_value = 6;
     }

     if (this.referralscoomunity == true  && this.referralscontact == true && this.referralspublicprofile == true ) {
       this.column_value = 7;
     }
      this.data = {"referrals":this.column_value}

    }

  console.log("//////////////json",JSON.stringify(this.data));
  
  var model ={data:JSON.stringify(this.data)}
  console.log("model",model);

  this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-privacy', data:model, contenttype: "application/json" }).then(result => {
    this.list_privacy = result.data
    console.log('user///////privacysetupdate', this.list_privacy);
    if(result.status == 200 ) {
      this.responseMessageSnackBar(result.msg);   
     
    }else{
      this.responseMessageSnackBar(result.msg,'error');   
     
    }

  });
   

  }
  public responseMessageSnackBar(message,res_class=''){
    this.snackBar.open(message,'', {
        duration: 4000,
        horizontalPosition:'right',       
        panelClass:res_class
    });
  }


}
