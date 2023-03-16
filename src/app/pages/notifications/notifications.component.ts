import { Component, OnInit } from '@angular/core';
import { Globalconstant }      from '../../global_constant';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/commonservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	public allNotifications = [];
	public pageCount = 1;
  	public limit     = 20;
  	public totalNotifyCount;any;
  	public page      = 1;
  	checkedAll = false;
  	toremoveImg = [];

	constructor(private globalContant:Globalconstant,public commonservice: CommonService,private router: Router) {
		// this.getAllNotification();
	}

	ngOnInit() {
		this.getAllNotification();
	}

	getAllNotification(){
		var postData = {'access_token': localStorage.getItem('frontend_token'),'limit':this.limit,'pageCount':this.pageCount};
 		var pubSocketCall     =1;
		this.globalContant.notificationSocket.emit("post-all-notification", postData);
		this.globalContant.notificationSocket.on("get-all-notification", (response)=>{

			if (pubSocketCall==1) {
				if (response.status==1) {
					console.log(response.data.rows);
					// if (this.page==0) {
					// 	this.allNotifications = response.data.rows;
					// }else 
					if(this.pageCount==1) {
						this.allNotifications = response.data.rows;
					}else {        
						for(let index in response.data.rows) {
							if(index!='insert')
							this.allNotifications.push(response.data.rows[index]);
						}              
					}
 					this.totalNotifyCount = response.data.count;
				  }
				  console.log(this.allNotifications);
			}
			pubSocketCall=0;

 		});
	}

	selectAllImages() {
	  	if(this.checkedAll) {	  	
	  	  	const tempArr = this.allNotifications.map((val,index,arr) => {
	  	  		val['checkboxStatus'] = true;
	  	  		this.toremoveImg.push(val['id']);
	  	  		return val;
	  	  	});
	  	  	this.allNotifications = [...tempArr];
	  	  	 	
	  	} else {
	  		this.toremoveImg = [];
	  		const tempArr = this.allNotifications.map((val,index,arr) => {
	  	  		val['checkboxStatus'] = false;
	  	  		return val;
	  	  	});
	  	  	this.allNotifications = [...tempArr];
	  	}	  	
	}

	checkuncheckToRemove(indexVal) {  	
	  	if(this.allNotifications[indexVal]['checkboxStatus']) {
	  		this.toremoveImg.push(this.allNotifications[indexVal]['id']);
	  		if(this.toremoveImg.length === this.allNotifications.length) {
	  			this.checkedAll = true;
	  		}
	  	}
	  	else {
	  		// console.log(this.allNotifications[indexVal]['id']);
	  		const tempArr = this.toremoveImg.filter((val) => {
	  			if(val !== this.allNotifications[indexVal]['id']) {
	  				return val
	  			}
	  		});  		
	  		this.toremoveImg = [...tempArr];
	  		// console.log(this.toremoveImg);
	  		this.checkedAll = false;
	  	}
	}


	onScroll(){
		console.log('on scroll load notification');
		if(this.allNotifications.length<(this.totalNotifyCount-1)){
	        this.pageCount = this.pageCount+1;
			this.getAllNotification();
	    } 
 	}


	removeNotification(id=''){
		if(id!='') {
			this.toremoveImg.push(id);
		}
		let confirmBtnColor = "#bad141";
		if(parseInt(atob(localStorage.getItem('user_type')))==2){
			confirmBtnColor = "#E6854A";
		}
		Swal({
	      title: "Are you sure you want to delete this notification?",
	      text: '',
	      showCancelButton: true,
	      confirmButtonColor: confirmBtnColor,
	      confirmButtonText: 'Ok',
	      cancelButtonText: 'Cancel'
	      }).then((result) => {
	        if (result.value) {
	          	var postData = {'access_token': localStorage.getItem('frontend_token'),
							'notification_id':this.toremoveImg};
		 		var pubSocketCall1 = 1;
				this.globalContant.notificationSocket.emit("post-remove-notification", postData);
				this.globalContant.notificationSocket.on("get-remove-notification", (res)=>{
					if (pubSocketCall1==1) {
						if (res.status==1) {
							// this.page  = 0;
							// this.getAllNotificationAfterRemove();
							this.allNotifications.forEach(element => {
								if(this.toremoveImg.indexOf(element.id)!==-1){
									this.allNotifications.splice(this.allNotifications.indexOf(element),1);
								}
							});
							this.toremoveImg = [];

							this.getAllNotification();
						}
					}
					pubSocketCall1=0;
				}); 
	 		} 
	    });
 }

	getAllNotificationAfterRemove(){
		var postData = {'access_token': localStorage.getItem('frontend_token'),'limit':this.limit,'pageCount':this.pageCount};
 		var pubSocketCall     =1;
		this.globalContant.notificationSocket.emit("post-after-remove-notification", postData);
		this.globalContant.notificationSocket.on("get-after-remove-notification", (response)=>{
          console.log(response);
			if (pubSocketCall==1) {
				if (response.status==1) {
 					this.allNotifications = response.data.rows;
 					this.checkedAll = false;
				}
			}
			pubSocketCall=0;

 		});

	}

	  /**
   * Goto todo link
   * @param toDetails 
   */
  gotoTodoLink(toDetails) {
	//   console.log(toDetails);
    if (toDetails.link == 'doer/chat' || toDetails.link == 'pinner/chat') {
      let user_type = toDetails.todo_link=='pinner/chat'?1:2; 
      this.commonservice.commonChatRedirectionMethod(toDetails.notification_from, user_type, toDetails.pin_id);
    } else {
      this.router.navigate(['/'+toDetails.link]);
    }
  }
	
}
