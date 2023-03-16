import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } 	from '@angular/core';
import {ActivatedRoute,Router} 	from '@angular/router';
import {AppComponent} 			from '../../../app.component';
import {Globalconstant} 		from '../../../global_constant';
import {CommonService} 			from '../../../commonservice';
import { Location } 			from '@angular/common';
import * as moment 				from 'moment-timezone';
import * as _ 					from 'underscore';
import * as io from 'socket.io-client';
// declare var io:any;
declare var $;

@Component({
  selector: 'app-pinner-chat',
  templateUrl: './pinner-chat.component.html',
  styleUrls: ['./pinner-chat.component.scss']
})

export class PinnerChatComponent implements OnInit {
	public chatform:FormGroup;
    chatValue:AbstractControl;
    public searchform:FormGroup;
    searchValue:AbstractControl;
    attachment_file:AbstractControl;
	public chatImage       	= '';
	public files           	= '';
	public doerPublicDatas 	= [];
	public saveChatData 	= '';
	public pinTitle 		= '';
	public pinDate  		= '';
	public pinUniqueId 		= '';
	public pinCount 		= 0;
	public chatDatas		= [];
	public pinnerId 		= '';
	public pinId 			= 0;
	public doerId 			= 0;
	public search_value 	= '';
	public pinDatas     	= [];
	public doerDatas    	= [];
	public doerCount    	= 0;
	public doerSlug     	= 0;
	public lastChatCount 	= 0;
	public sendChatCount 	= 0;
	public doerMessageCount = 0;
	public doerCountSlug    = 0;
	public publicDoerId    	= 0;
	public doerName      	= '';
	public pinSlug       	= '';
	public temp_currentDate = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
	public _yesterday 		= this.temp_currentDate.setDate(this.temp_currentDate.getDate()-1);
	public yesterDay 		= this._yesterday;
	public currentDate 		= new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
	public reciveMessage    = 0;
	public searchCount 		= 0;
	public sendChatConn     = 1;
	public leftPanelDatas 	= [];
	public leftFlug       	= 0;
	public disbale_msg_textarea = false;

	public typeSocket;
 	public imgUrl:any;
	public chatFileUpload:any;
	public tempObjString:any;

	private socket;
	private chatSocket;
	public innerWidth:any;
	public innerChatGrid = false;
	public DoerChatgrid = false;
	public chatFlag = false;

	constructor(private appService:AppComponent,private globalConstant:Globalconstant,
		private commonService:CommonService, fb:FormBuilder,private _location: Location, private router:Router) {
		this.socket  = io.connect(this.appService.CHAT_URL+"/pinnerChats");
		this.socket.emit('joinPinnerChatRoom',"pinner");
		this.socket.on("err",(res) => console.log(res));

		setTimeout(()=>{
			this.chatSocket  = io.connect(this.appService.CHAT_URL+"/sendChat");
			this.chatSocket.on("err",(res) => console.log(res));

			this.chatSocket.on('get-private-chat-from-doer',(res) =>{
				console.log("from constructor get-private-chat-from-doer", res);
				if (this.sendChatConn==1) {
					if (res.pin_id!=0) {
						if ((this.pinId == res.pin_id) && (this.doerId == res.sender_id) ) {
							console.log("calling getChatList from constructor");
							this.getChatList(res.pin_id,res.sender_id);
						}else{
							this.reciveMessage=1;
							this.getPinList();
						}
					}else{
						if (this.publicDoerId == res.sender_id) {
							this.getPublicChatList(res.pin_id,res.sender_id);
						}else{
							this.reciveMessage=1;
							this.getPublicDoerList();
						}
					}
					setTimeout(()=>{
						this.leftPanelList();
					},1000);

				}
				this.sendChatConn=0;
			});

			this.chatSocket.on('recieve-private-chat-from-doer-to-pinner',(res) =>{

			});
		},600);


		this.imgUrl = this.globalConstant.uploadUrl;
		this.chatFileUpload = this.globalConstant.chatFileUploadUrl;
		this.getPublicPinner();
		this.getPinList();
		this.getPublicDoerList();

		// this.chatform = fb.group({
    //         'chatValue': ['', Validators.compose([Validators.required])],
    //     });

        this.chatform = fb.group({
            'chatValue': 	['', Validators.compose([Validators.required])],
            'attachment_file': ['', Validators.compose([])],
            'pin_id' : 		['', Validators.compose([])],
  			'pinner_id' : 	['', Validators.compose([])],
  			'doer_id' : 	['', Validators.compose([])],
        });

		this.searchform = fb.group({
        	'searchValue' : ['', Validators.compose([])],
        });

        this.searchValue  = this.searchform.controls['searchValue'];
	}

	ngOnInit() {
		/*setTimeout(()=>{
			this.leftPanelList();
		},1500);*/

		let postData = { 'reciver_id': atob(localStorage.getItem('frontend_user_id')) };
		this.globalConstant.notificationSocket.emit('post-pinner-header-msg-count', postData);
		// console.log("emitted from pinner");
	}

	leftPanelList(){

		this.leftPanelDatas = this.pinDatas.concat(this.doerPublicDatas);
		this.leftPanelDatas = _.sortBy(this.leftPanelDatas, 'updated_at');
		this.leftPanelDatas = this.leftPanelDatas.reverse();
		console.log(this.leftPanelDatas);
		setTimeout(function(){
			$('#content-left-scroll').mCustomScrollbar('scrollTo',$('.left-panel').find('.mCSB_container').find('.people').find('.person:eq(0)'));
		},500);

	}

	encode(doer_id){
	    return btoa(doer_id);
	}

	backClicked() {
		var doer_Id:any = this.encode(this.doerId);
		var link = '/pinner/active-quotation-details/'+this.pinSlug+'/'+doer_Id;
		console.log(link);
		this.router.navigate([link]);
  	}

	ngAfterViewInit() {
		setTimeout(()=>{
	 		$("#content-left-scroll").mCustomScrollbar({theme:"minimal-dark"});
			$("#content-middle-scroll").mCustomScrollbar({theme:"minimal-dark"});
			$("#content-right-scroll").mCustomScrollbar({theme:"minimal-dark"});
		 },100);

		 $(window).resize(function(){
			$('.chat').mCustomScrollbar('scrollTo', 'bottom');
		});

	}
	//######################### Get Pin Details For Chat List ###################//
	//######################## Get Public Pinner ###########################//
	getPublicPinner(){
		if ("doer_id" in localStorage) {

 			var pub_doer_id   = atob(localStorage.getItem('doer_id'));
			var pub_pin_id    = atob(localStorage.getItem('pin_id'));
			var pub_pinner_id = atob(localStorage.getItem('frontend_user_id'));

			var postData = {'pub_pinner_id':pub_pinner_id,
							'pub_doer_id': pub_doer_id,
							'pub_pin_id': pub_pin_id,
							'user_type':2};

			var pubSocketCall     =1;
			this.socket.emit("post-pub-pin-list",postData);
			this.socket.on("get-pub-pin-list",(res)=>{
				if (pubSocketCall==1) {
					if(res.status==1) {
						localStorage.removeItem('doer_id');
    					localStorage.removeItem('pin_id');
    					window.location.reload();
	 				}
				}
				pubSocketCall=0;
			});

		}else if ("pinner_id" in localStorage) {

 			var pub_doer_id   = atob(localStorage.getItem('pinner_id'));
			var pub_pin_id    = atob(localStorage.getItem('pin_id'));
			var pub_pinner_id = atob(localStorage.getItem('frontend_user_id'));

			var postData = {'pub_pinner_id':pub_pinner_id,
							'pub_doer_id': pub_doer_id,
							'pub_pin_id': pub_pin_id,
							'user_type':1};

			var pubSocketCall     =1;
			this.socket.emit("post-pub-pin-list",postData);
			this.socket.on("get-pub-pin-list",(res)=>{
				if (pubSocketCall==1) {
					if(res.status==1) {
						localStorage.removeItem('pinner_id');
    					localStorage.removeItem('pin_id');
    					window.location.reload();
	 				}
				}
				pubSocketCall=0;
			});

		}else{
			let frontend_token = localStorage.getItem('frontend_token');
	        let postData	   = {'access_token':frontend_token};
			var socketConn1    = 1;
			this.socket.emit("post-last-chat-data",postData);
			this.socket.on("get-last-chat-data",(res)=>{
				console.log("from getPublicPinner", res);
				if (socketConn1==1) {
					if(res.status==1) {
						 if (res.data !=null) {
						 	setTimeout(()=>{
						 		this.lastChatCount = 1;
						 		if (res.data.pin_id!=0) {
 						 			this.activePin(res.data.login_id,res.data.chat_id,res.data.pin);
						 		}else{
 						 			this.activePublicDoer(res.data.login_id,res.data.doerList)
						 		}
						 	},600);
						 }else{
						 	this.disbale_msg_textarea = true;
						 }
					}
				}
				socketConn1 = 0;
			});
		}
	}


	//######################### Get Pinner List Search by Title ########################//
	searchByTitle(){
		this.search_value  = this.searchform.controls['searchValue'].value;
		this.reciveMessage = 1;
		this.searchCount   = 1;
 		this.getPinList();
 		this.getPublicDoerList();
 		if (this.search_value=='') {
 			this.mgCustombar();
 		}
	}

	//######################### Display The Doers Grid ########################//
	showDoerSection()
	{
		this.DoerChatgrid = true;
	}


	//######################### Hide The Doers Grid ########################//
	hideDoerSection()
	{
		this.DoerChatgrid = false;
	}


	//######################### Get Pinner Dynamic width ########################//
	getScreenSize(){
		this.innerWidth = window.innerWidth;

		if(parseInt(this.innerWidth) < 770 && this.chatFlag === true )
		{
			this.innerChatGrid = true;
		}

		this.chatFlag = true;
	}

	//######################### Close Pinner Chatbox ########################//
	closeChatbox(){
		this.innerChatGrid = false;
	}

 	//######################### Start Pin List Chat Details ###########################//
	getPinList(){
		//this.reciveMessage = 1;
		console.log("pinList is called")
		this.DoerChatgrid = false;
		// this.getScreenSize();
		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,"searchValue":this.search_value};
        var socketCall     = 1;
		this.socket.emit("post-chat-pin-list",postData);
		this.socket.on("get-chat-pin-list",(res)=>{
			// TODO: check pub_doer_id in array
			if (socketCall==1) {
				if(res.status==1) {
					this.pinDatas = res.data;
					this.sendChatConn = 1;

					if (this.reciveMessage==1) {
 				 		setTimeout(()=>{
					 		for (var i = 0; i < this.pinDatas.length; i++) {
								for (var i = 0; i < this.pinDatas.length; i++) {
									if (this.pinDatas[i].pin_id != this.pinId) {
									 	if ($("#liID_"+this.pinDatas[i].pin_id).hasClass("person per-job ng-star-inserted active")) {
									 		$("#liID_"+this.pinDatas[i].pin_id).removeClass("person per-job ng-star-inserted active");
									 		$("#liID_"+this.pinDatas[i].pin_id).addClass("person per-job ng-star-inserted");
									 	}
			 						}
						 		}
					 		}
					 		$('.chat').mCustomScrollbar('scrollTo','bottom');
					 		$("#liID_"+this.pinId).addClass("person per-job ng-star-inserted active");
					 		this.reciveMessage = 0;
					 	},500);
					}

					this.leftPanelList();
					/*setTimeout(function(){
 						$('#content-left-scroll').mCustomScrollbar('scrollTo',$('.left-panel').find('.mCSB_container').find('.people').find('.person:eq(0)'));
			 		},100);*/
 				}
			}
			socketCall=0;
		});
 	}

	activePin(pinner_id,doer_id,pinData){
		this.DoerChatgrid = false;
		this.getScreenSize();
		setTimeout(()=>{
 			//var RooM = pinner_id+"_"+doer_id+"_"+pinData.id;
 			var RooM = pinner_id+"_"+doer_id;
			this.chatSocket.emit('joinSendChatRoom',RooM);
		},300);
  		this.pinCount    	= 1;
		this.doerSlug 		= 1;
		this.pinTitle 	 	= pinData.title;
		this.pinDate  		= pinData.created_at;
		this.pinUniqueId 	= pinData.pin_unique_id;
		this.pinId 			= pinData.id;
		this.pinnerId 		= pinner_id;
		this.doerCountSlug  = 0;
		this.pinSlug        = pinData.slug;

		//----------- This is used for active Pinner List Left pannel ----------//
		for (var i = 0; i < this.pinDatas.length; i++) {
			if (this.pinDatas[i].pin_id != this.pinId) {
			 	if ($("#liID_"+this.pinDatas[i].pin_id).hasClass("person per-job ng-star-inserted active")) {
			 		$("#liID_"+this.pinDatas[i].pin_id).removeClass("person per-job ng-star-inserted active");
			 		$("#liID_"+this.pinDatas[i].pin_id).addClass("person per-job ng-star-inserted");
			 	}
 			}
 		}
 		$("#liID_"+this.pinId).addClass("person per-job ng-star-inserted active");
 		$("#right_id").removeClass("user-sidebar right_class");
		$("#right_id").addClass("user-sidebar");

 		for (var i = 0; i < this.doerPublicDatas.length; i++) {
	 		$("#lid_"+this.doerPublicDatas[i].pub_doer_id).removeClass("per-user person ng-star-inserted active");
	 		$("#lid_"+this.doerPublicDatas[i].pub_doer_id).addClass("per-user person ng-star-inserted");
 		}
 		//----------- This is used for active Pinner List Left pannel ----------//

 		this.getActiveDoerList(this.pinId,doer_id);
 	}

	getActiveDoerList(pinId,doer_id){
		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,"pin_id":pinId};
        var socketCon      = 1;
		this.socket.emit("post-chat-doer-list",postData);
		this.socket.on("get-chat-doer-list",(res)=>{
			if (socketCon==1) {
				if(res.status==1) {
					this.doerDatas = res.data;
					this.doerCount = this.doerDatas.length;
 				}
			}
			socketCon=0;
		});

		this.chatform.patchValue({
            pin_id:pinId,
        });
        this.chatform.patchValue({
            doer_id:doer_id,
        });
        this.chatform.patchValue({
            pinner_id:this.pinnerId,
        });

		setTimeout(()=>{
	 		this.chatDatas = [];
	 	    this.mgCustombar();
	 	    this.activeDoer(doer_id);
	 	},500);
	}

	activeDoer(doer_id){
 		//----------- This is used for active Pinner List Left pannel ----------//
 		if (this.doerDatas.length!=0) {
 			for (var i = 0; i < this.doerDatas.length; i++) {
				if (this.doerDatas[i].doerList.id != doer_id) {
				 	if ($("#li_"+this.doerDatas[i].doerList.id).hasClass("person ng-star-inserted active")) {
				 		$("#li_"+this.doerDatas[i].doerList.id).removeClass("person ng-star-inserted active");
				 		$("#li_"+this.doerDatas[i].doerList.id).addClass("person ng-star-inserted");
				 	}
				}
	 		}
	 		$("#li_"+doer_id).addClass("person ng-star-inserted active");
 		}
		 //----------- This is used for active Pinner List Left pannel ----------//
		console.log("calling getChatList from activeDoer", this.pinId, doer_id);
 		this.getChatList(this.pinId,doer_id);
	}

	getChatList(pinId,doer_id){
		console.log({pinId:pinId, doer_id:doer_id});
		this.doerId = doer_id;
		this.pinnerId;
		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,'doer_id':this.doerId, 'pin_id':pinId};
		var socketConn 	   = 1;
		this.socket.emit("post-pinner-chat-list",postData);
		this.socket.on("get-pinner-chat-list",(res)=>{
			console.log("from getChatList", pinId, doer_id, atob(localStorage.getItem('frontend_user_id')), res);
			if (socketConn==1) {
				if(res.status==1) {
					this.chatDatas = res.data;
					this.sendChatConn = 1;
					this.publicDoerId = 0;
				}
			}
			socketConn = 0;
		});
		var pinnerId = atob(localStorage.getItem('frontend_user_id'));
		this.chatform.patchValue({
            pin_id:this.pinId,
        });
        this.chatform.patchValue({
            doer_id:this.doerId,
        });
        this.chatform.patchValue({
            pinner_id:pinnerId,
        });

	 	setTimeout(()=>{
	 		$('.chat').mCustomScrollbar('scrollTo','bottom');
			this.readMassage(doer_id,pinId);
	 	},500);
	}

	//######################## End Pin List Chat Details #############################//


	//######################## Start Public Doer Chat Details ########################//
	getPublicDoerList(){
 		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,'pin_id':0,"searchValue":this.search_value};
        var socketCallDoer     = 1;
		this.socket.emit("post-chat-public-doer-list",postData);
		this.socket.on("get-chat-public-doer-list",(res)=>{
			if (socketCallDoer==1) {
				if(res.status==1) {
					this.doerPublicDatas = res.data;
					this.sendChatConn = 1;
					this.leftPanelList();

 				}
			}
			socketCallDoer=0;
		});


 		if (this.reciveMessage==1) {
 			setTimeout(()=>{
		 		for (var i = 0; i < this.doerPublicDatas.length; i++) {
					if (this.doerPublicDatas[i].pub_doer_id != this.publicDoerId) {
					 	if ($("#lid_"+this.doerPublicDatas[i].pub_doer_id).hasClass("per-user person ng-star-inserted active")) {
					 		$("#lid_"+this.doerPublicDatas[i].pub_doer_id).removeClass("per-user person ng-star-inserted active");
					 		$("#lid_"+this.doerPublicDatas[i].pub_doer_id).addClass("per-user person ng-star-inserted");
					 	}
					}
		 		}
		 		$("#lid_"+this.publicDoerId).addClass("per-user person ng-star-inserted active");
		 		this.reciveMessage = 0 ;
		 	},500);
		}
	}

	activePublicDoer(pub_pinner_id,publicDoerData){
		console.log("publicDoerData", publicDoerData);
		this.getScreenSize();
		setTimeout(()=>{
			let pinner_id = atob(localStorage.getItem('frontend_user_id'));
			//var RooM = pinner_id+"_"+publicDoerData.id+"_0";


			if (publicDoerData.user_type==2) {
				var RooM = pinner_id+"_"+publicDoerData.id+"_0";
			}else{

				if (pinner_id>publicDoerData.id) {
					var RooM = pinner_id+"_"+publicDoerData.id;
				}else{
					var RooM = publicDoerData.id+"_"+pinner_id;
				}

			}


			this.chatSocket.emit('joinSendChatRoom',RooM);
		},300);

		this.doerCountSlug  = 1;
		this.pinCount    	= 0;
		this.doerSlug 		= 0;
		this.doerName       = publicDoerData.name;
		this.pinId          = 0;

 		//----------- This is used for active Pinner List Left pannel ----------//
		for (var i = 0; i < this.doerPublicDatas.length; i++) {
			if (this.doerPublicDatas[i].pub_doer_id != publicDoerData.id) {
  			 	if ($("#lid_"+this.doerPublicDatas[i].pub_doer_id).hasClass("per-user person ng-star-inserted active")) {
			 		$("#lid_"+this.doerPublicDatas[i].pub_doer_id).removeClass("per-user person ng-star-inserted active");
			 		$("#lid_"+this.doerPublicDatas[i].pub_doer_id).addClass("per-user person ng-star-inserted");
			 	}
			}
 		}
 		$("#lid_"+publicDoerData.id).addClass("per-user person ng-star-inserted active");

 		for (var i = 0; i < this.pinDatas.length; i++) {
			$("#liID_"+this.pinDatas[i].pin_id).removeClass("person per-job ng-star-inserted active");
			$("#liID_"+this.pinDatas[i].pin_id).addClass("person per-job ng-star-inserted");
 		}
 		$("#right_id").removeClass("user-sidebar");
 		$("#right_id").addClass("user-sidebar right_class");
 		//----------- This is used for active Pinner List Left pannel ----------//
 		var pin_id = 0;
 		this.mgCustombar();
 		setTimeout(()=>{
	 		this.getPublicChatList(pin_id,publicDoerData.id);
	 	},300);
 	}

	getPublicChatList(pinId,doer_id){

		this.doerId = doer_id;
		this.publicDoerId = doer_id;
		this.pinnerId = atob(localStorage.getItem('frontend_user_id'));
		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,'doer_id':this.doerId, 'pin_id':pinId};

		var socketConn 	   = 1;
		this.socket.emit("post-pinner-chat-list",postData);
		this.socket.on("get-pinner-chat-list",(res)=>{
			console.log("from getPublicChatList", res);
			if (socketConn==1) {
				if(res.status==1) {
					this.chatDatas = res.data;
					this.sendChatConn = 1;
				}
			}
			socketConn = 0;
		});

		this.chatform.patchValue({
            pin_id:this.pinId,
        });
        this.chatform.patchValue({
            doer_id:this.doerId,
        });
        this.chatform.patchValue({
            pinner_id:this.pinnerId,
        });

	 	setTimeout(()=>{
	 		$('.chat').mCustomScrollbar('scrollTo','bottom');
			this.readMassage(doer_id,pinId);
	 	},500);
	}

	//######################## End Public Doer Chat Details ########################//

	//######################### Read Massage For Doer ###########################//
	readMassage(doerId,pinId){
 		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,'doer_id':doerId, 'pin_id':pinId};
		var socketConn = 1;
		this.socket.emit("post-read-chat-data",postData);
		this.socket.on("get-read-chat-data",(res)=>{
			console.log('from readMassage', res);
			if (socketConn==1) {
				if(res.status==1) {
					for (var i = 0; i < this.doerDatas.length; i++) {
						if (this.doerDatas[i].pub_doer_id == doerId) {
						 	 this.doerMessageCount = this.doerDatas[i].Count;
						 	 this.doerDatas[i].Count = 0;
						}
			 		}

			 		setTimeout(()=>{
				 		for (var i = 0; i < this.pinDatas.length; i++) {
							if (this.pinDatas[i].pin_id == pinId) {
							 	this.pinDatas[i].Count =(this.pinDatas[i].Count-this.doerMessageCount);
							}
				 		}
				 	},500);

			 		for (var i = 0; i < this.doerPublicDatas.length; i++) {
						if (this.doerPublicDatas[i].pub_doer_id == this.publicDoerId) {
						 	 this.doerPublicDatas[i].Count = 0;
						}
			 		}

			 		setTimeout(()=>{
			 			this.globalConstant.notificationSocket.emit("post-pinner-read-count-chat-data",{'reciver_id':atob(localStorage.getItem('frontend_user_id'))});
			 		}, 1500)

			 		this.disbale_msg_textarea = false;
				}
			}
			socketConn = 0;
		});
	}


	//######################### Save Chat Data using Enter Key ###########################//
	keyPressOnTextArea(key){
      if(key.keyCode == 13){
        key.preventDefault();
        $('#subbtn').trigger('click');
      }
    }

	sendChat(chatVal){
		console.log(chatVal);
		if (chatVal.chatValue!='' || this.chatImage != '') {
			let fd = new FormData();
			var item = {};
			Object.keys(chatVal).forEach(function(key) {
				item[key] = (chatVal[key] == null)?'':chatVal[key];
				fd.append(key, chatVal[key]);
			});

			if (this.chatImage != '') {
	          fd.append('attachment_file',this.chatImage);
	        }

			this.commonService.postChatHttpCall({url:'/pinner-chat-save', data:fd, contenttype:'fromdata'})
							  .then(result=>this.supportSucessfunction(result));
		}
	}

	supportSucessfunction(res){
		console.log('res',res);
		if(res.status==1) {
			let chat_link= res.user_type==1?'pinner/chat':'doer/chat';
			this.chatform.patchValue({
	            chatValue:'',
	        });
			this.chatImage = '';
			this.reciveMessage = 1;

			if (res.data.pin_id==0) {
				this.getPublicDoerList();
				setTimeout(()=>{
					this.getPublicChatList(0,res.data.reply_to);
				},500);
 			}else{
				this.getPinList();

				setTimeout(()=>{
					this.activeDoer(res.data.reply_to);
 				},500);
 			}

			let privateChatData = {'sender_id':res.data.reply_from,'reciver_id':res.data.reply_to, 'pin_id':res.data.pin_id};



			setTimeout(()=>{
				this.chatSocket.emit('send-private-chat-to-pinner',privateChatData);
			},100)


			setTimeout(()=>{
				this.chatSocket.emit('send-private-chat-to-doer',privateChatData);
			},200)

			setTimeout(()=>{
				this.chatSocket.emit('send-private-chat-from-pinner-to-doer',{'reciver_id':res.data.reply_to});
 			},500);

 			setTimeout(()=>{
 				let notiChatdata = {'reciver_id':res.data.reply_to};
				this.globalConstant.notificationSocket.emit('post-doer-header-message-notification',notiChatdata);
 			},800);


			setTimeout(()=>{
				let notiChatdata = {'reciver_id':res.data.reply_to};
				this.globalConstant.notificationSocket.emit('post-pinner-header-message-notification',notiChatdata);
			},1100);

			if (res.data.pin_id==0) {

				var postData = {  'sender_id':  res.data.reply_from,
	              'reciver_id': res.data.reply_to,
	              'pin_id' : res.data.pin_id,

	              'title' : 'You’ve got a message!',
	              'link': chat_link,
	              'show_in_todo':1,
	              'todo_title':'You’ve got a message!',
	              'todo_link': chat_link,
	              'emailTemplateSlug':'',

	              'user_title':'Thank you for your message. We’ve received it and will get back to you shortly!',
	              'user_link': 'pinner/chat',
	              'user_todo_title':'Thank you for your message. We’ve received it and will get back to you shortly!',
	              'user_todo_link': 'pinner/chat',
	          	  'userEmailTemplateSlug': ''
	          	};
			}
			else{
				var postData = {  'sender_id':  res.data.reply_from,
	              'reciver_id': res.data.reply_to,
	              'pin_id' : res.data.pin_id,

	              'title' : 'Pin '+this.pinTitle+' has received a comment. Check it out!',
	              'link': chat_link,
	              'show_in_todo':1,
	              'todo_title':'Pin '+this.pinTitle+' has received a comment. Check it out!',
	              'todo_link': chat_link,
	              'emailTemplateSlug':'',

	              'user_title':'Thank you for your message. We’ve received it and will get back to you shortly!',
	              'user_link': 'pinner/chat',
	              'user_todo_title':'Thank you for your message. We’ve received it and will get back to you shortly!',
	              'user_todo_link': 'pinner/chat',
	          	  'userEmailTemplateSlug': ''
	          	};
			}

		    this.globalConstant.notificationSocket.emit("post-notification-to-doer",postData);

		    /*setTimeout(()=>{
		      this.globalConstant.notificationSocket.emit("post-notification-to-pinner-himself",postData);
		    },3000)*/

			/*setTimeout(()=>{
				this.leftPanelList();
			},1500);*/
		}
	}


	public onChange(fileInput: any){
		this.files = [].slice.call(fileInput.target.files);
		var filename = this.readURL(fileInput.target);
		if (fileInput.target.files && fileInput.target.files[0]) {
			this.chatImage = fileInput.target.files[0];
		}
   	}


	public readURL(input) {
	    var url = input.value;
	    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	    if (input.files && input.files && (
	      ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "gif" || ext == "pdf" || ext == "doc" || ext == "docx"
	      )) {
				var total_filename = [];
				var total_html = 'Attached files:';
				for(var i=0;i<input.files.length;i++){
					let fName=input.files[i].name.replace(/^.*\\/, "");
					total_html +='<span>'+ fName + '</span>';

					total_filename.push(input.files[i].name);
				}
					if(total_html!='Attached files:'){
					$(input).parent().find('.file-name').html(total_html);
					$(input).parent().parent().find('.fileUpload-error').html( "");
				}
	    } else {
	      $(input).val("");
	      $(input).parent().parent().find('.fileUpload-error').html( "Only image/pdf/doc/docx formats are allowed!");
	    }
  	}

	mgCustombar(){
		setTimeout(()=>{
	 		$("#content-left-scroll").mCustomScrollbar({theme:"minimal-dark"});
			$("#content-middle-scroll").mCustomScrollbar({theme:"minimal-dark"});
			$("#content-right-scroll").mCustomScrollbar({theme:"minimal-dark"});
	 	},100);
	}
}
