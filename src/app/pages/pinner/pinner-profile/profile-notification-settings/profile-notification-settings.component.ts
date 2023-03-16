import { Component, OnInit, Input, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { FormControl } from '@angular/forms';
declare var $;
@Component({
  selector: 'app-profile-notification-settings',
  templateUrl: './profile-notification-settings.component.html',
  styleUrls: ['./profile-notification-settings.component.scss']
})
export class ProfileNotificationSettingsComponent implements OnInit {
  @Input()
  isControltHidden;
  profile_details: any = [];
  user_id: any;
  
  likes_push_notification:any = true;
  //comments:any;
  messages_push_notification:any = true;
  invite_to_connect_push_notification:any = true;
  accepts_push_notification:any = true;
  new_add_community:any = true;
  invite_to_join_pindo_push_notification:any = true;
  column_value:any;
  data:any;
  comment_push_notification:any = true;
  list_privacy: any = [];
  constructor(public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getProfileinfoDetails();
  }

  getProfileinfoDetails() {

    this.commonservice.postHttpCall({ url: '/pinners/get-basic-profile', data: {}, contenttype: "application/json" }).then(result => {
      this.profile_details = result.data
      console.log('user///////data', this.profile_details.id);
      this.user_id = this.profile_details.id;
      this.getusercontrolinfonotification(this.user_id);
    });
  }
  getusercontrolinfonotification(user_id) {

    console.log('user///////nid', user_id);
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/list-privacy', data: { user_id: user_id }, contenttype: "application/json" }).then(result => {
      this.list_privacy = result.data
      console.log('user///////privacydata', this.list_privacy);
      if(result.data)
      {
         
        if(this.list_privacy.likes_push_notification == 0)
     {
       this.likes_push_notification = false ;
       
     }
     if(this.list_privacy.likes_push_notification == 1)
     {
      this.likes_push_notification = true ;
      
     }
     if(this.list_privacy.comment_push_notification == 0)
     {
      this.comment_push_notification = false ;
      
     }
     if(this.list_privacy.comment_push_notification == 1)
     {
      this.comment_push_notification = true ;
      
     }
     if(this.list_privacy.messages_push_notification == 0)
     {
       this.messages_push_notification = false ;
       
     }
     if(this.list_privacy.messages_push_notification == 1)
     {
      this.messages_push_notification = true ;
      
     }
     if(this.list_privacy.accepts_push_notification == 0)
     {
      this.accepts_push_notification = false ;
      
     }
     if(this.list_privacy.accepts == 1)
     {
      this.accepts_push_notification = true ;
      
     }
     if(this.list_privacy.new_add_community == 0)
     {
       this.new_add_community = false ;
       
     }
     if(this.list_privacy.new_add_community == 1)
     {
      this.new_add_community = true ;
      
     }
     if(this.list_privacy.invite_to_join_pindo_push_notification == 0)
     {
      this.invite_to_join_pindo_push_notification = false ;
     
     }
     if(this.list_privacy.invite_to_join_pindo_push_notification == 1)
     {
      this.invite_to_join_pindo_push_notification = true ;
      
     }
     if(this.list_privacy.invite_to_connect_push_notification == 0)
     {
       this.invite_to_connect_push_notification = false ;
       
     }
     if(this.list_privacy.invite_to_connect_push_notification == 1)
     {
      this.invite_to_connect_push_notification = true ;
      
     }
     

      }
     
    // console.log('liksed',this.likes);
     

    });
  }

  onChange(userid, type, columnname, accesstype) {

    if (accesstype == 'likes_push_notification') {
      if (this.likes_push_notification == true ) {
        this.column_value = 1;
      }
      if (this.likes_push_notification == false ) {
        this.column_value = 0;
      }
      this.data = {"likes_push_notification":this.column_value}
    }
    if (accesstype == 'comment_push_notification') {
      if (this.comment_push_notification == true) {
        this.column_value = 1;
      }
      if (this.comment_push_notification == false ) {
        this.column_value = 0;
      }
      this.data = {"comment_push_notification":this.column_value}
     
    }
    if (accesstype == 'messages_push_notification') {
      if (this.messages_push_notification == true) {
        this.column_value = 1;
      }
      if (this.messages_push_notification == false ) {
        this.column_value = 0;
      }
      this.data = {"messages_push_notification":this.column_value}
     
    }
    if (accesstype == 'invite_to_connect_push_notification') {
      if (this.invite_to_connect_push_notification == true) {
        this.column_value = 1;
      }
      if (this.invite_to_connect_push_notification == false ) {
        this.column_value = 0;
      }
      this.data = {"invite_to_connect_push_notification":this.column_value}
     
    }
    if (accesstype == 'accepts_push_notification') {
      if (this.accepts_push_notification == true) {
        this.column_value = 1;
      }
      if (this.accepts_push_notification == false ) {
        this.column_value = 0;
      }
      this.data = {"accepts_push_notification":this.column_value}
     
    }
    if (accesstype == 'new_add_community') {
      if (this.new_add_community == true) {
        this.column_value = 1;
      }
      if (this.new_add_community == false ) {
        this.column_value = 0;
      }
      this.data = {"new_add_community":this.column_value}
     
    }
    if (accesstype == 'invite_to_join_pindo_push_notification') {
      if (this.invite_to_join_pindo_push_notification == true) {
        this.column_value = 1;
      }
      if (this.invite_to_join_pindo_push_notification == false ) {
        this.column_value = 0;
      }
      this.data = {"invite_to_join_pindo_push_notification":this.column_value}
     
    }
    

  console.log("//////////////json",JSON.stringify(this.data));
  
  var model ={data:JSON.stringify(this.data)}
  console.log("model",model);

  this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-notification-setting', data:model, contenttype: "application/json" }).then(result => {
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
