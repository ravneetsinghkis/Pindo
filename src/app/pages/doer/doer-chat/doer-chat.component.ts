import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { Globalconstant } from '../../../global_constant';
import { CommonService } from '../../../commonservice';
import { Location } from '@angular/common';
import * as moment from 'moment-timezone';
//import * as io from 'socket.io-client';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as io from 'socket.io-client';
// declare var io: any;
declare var $;

@Component({
	selector: 'app-doer-chat',
	templateUrl: './doer-chat.component.html',
	styleUrls: ['./doer-chat.component.scss']
})
export class DoerChatComponent implements OnInit {
	public chatform: FormGroup;
	chatValue: AbstractControl;
	attachment_file: AbstractControl;
	public searchform: FormGroup;
	searchValue: AbstractControl;
	private socket;
	private chatSocket;
	public pinnerData = [];
	public pubPinnerData = [];
	isMsgExists: any = [];
	public saveChatData = '';
	public pinTitle = '';
	public pinDate = '';
	public pinUniqueId = '';
	public pinCount = 0;
	public chatDatas = [];
	public pinnerId = '';
	public pinner_ID = 0;
	public pinId = 0;
	public doerId = 0;
	public pinSlug = '';
	public search_value = '';
	public tempObjString: any;
	public temp_currentDate = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
	public _yesterday = this.temp_currentDate.setDate(this.temp_currentDate.getDate() - 1);
	public yesterDay = this._yesterday;
	public currentDate = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));
	public reciveMessage = 0;
	public pub_pinner_id = 0;
	public pub_pin_id = 0;
	public disbale_msg_textarea = false;
	public searchCount = 0;
	public sendChatConn = 1;
	public index = 0;
	public userCountflug = 0;
	public imgUrl: any;
	public chatImage = '';
	public files = '';
	private typeSocket;
	public scall = 1;
	public socCall = 1;

	public TypingName: any;

	public showNoDataDetails = false;
	public innerWidth: any;
	public innerChatGrid = false;
	public chatFlag = false;
	public quoteDetails: any = [];

	constructor(private appService: AppComponent, private globalConstant: Globalconstant,
		private commonService: CommonService, fb: FormBuilder, private _location: Location, private router: Router, public commonservice: CommonService) {
		this.pinner_ID = Number((localStorage.getItem('pinner_id_another')));
		this.pinId = Number(atob(localStorage.getItem('pin_id')));
		this.pinSlug = localStorage.getItem('slug');
		console.log(this.pinner_ID, this.pinId, this.pinSlug);

		this.index = 0;
		this.socket = io.connect(this.appService.CHAT_URL + '/doerChats');
		this.socket.emit('joinDoerChatRoom', 'doer');
		this.socket.on('err', (res) => console.log(res));


		setTimeout(() => {
			this.chatSocket = io.connect(this.appService.CHAT_URL + '/sendChat');
			this.chatSocket.on('err', (res) => console.log(res));

			this.chatSocket.on('get-private-chat-from-pinner', (res) => {
				if (this.sendChatConn == 1) {
					if ((res.pin_id != 0) && (this.pinId == res.pin_id)) {
						this.getChatData(res.sender_id, res.pin_id);
					} else if ((this.pinnerId == res.sender_id) && (this.pinId == res.pin_id)) {
						this.getChatData(res.sender_id, res.pin_id);
					} else {
						this.reciveMessage = 1;
						this.getPinnerList();
					}
				}
				this.sendChatConn = 0;
			});

			this.chatSocket.on('recieve-private-chat-from-pinner-to-doer', (res) => {
				/*setTimeout(()=>{
					if (res.reciver_id==atob(localStorage.getItem('frontend_user_id'))) {
	 					this.reciveMessage=1;
						this.getPinnerList();
 					}
				},500);*/
			});
		}, 600);


		//this.lastChatDetails();
		this.getPinnerList();
		this.getLastChatAndMessageInitiate();
		this.imgUrl = this.globalConstant.uploadUrl;
		this.chatform = fb.group({
			'chatValue': ['', Validators.compose([Validators.required])],
		});

		this.chatform = fb.group({
			'chatValue': ['', Validators.compose([Validators.required])],
			'attachment_file': ['', Validators.compose([])],
			'pin_id': ['', Validators.compose([])],
			'pinner_id': ['', Validators.compose([])],
			'doer_id': ['', Validators.compose([])],
		});



		this.searchform = fb.group({
			'searchValue': ['', Validators.compose([])],
		});

		this.searchValue = this.searchform.controls['searchValue'];

		this.pinTitle = '';
		this.pinDate = '';
		this.pinUniqueId = '';

		// this.checkMsg(this.pinner_ID, this.pinId);
	}

	checkMsg(pinner_id, pin_id) {
		this.commonservice.postCommunityHttpCall({
			url: '/api/pinner/get-is-message-sent',
			data: {
				'user_id': pinner_id,
				'pin_id': pin_id
			}
		}).then(res => {
			this.isMsgExists = res.data;
		});
	}
	/**
	 * on init
	 */
	ngOnInit() {
		let postData = { 'reciver_id': atob(localStorage.getItem('frontend_user_id')) };
		this.globalConstant.notificationSocket.emit('post-doer-header-msg-count', postData);
		console.log("emitted from doer");
	}

	/**
	 * Backs clicked
	 */
	backClicked() {
		var link = '/doer/apply-pins/' + this.pinSlug;
		this.router.navigate([link]);
		//this._location.back();
	}

	/**
	 * after view init
	 */
	ngAfterViewInit() {

		setTimeout(() => {
			$('#content-left-scroll').mCustomScrollbar({ theme: 'minimal-dark' });
			$('#content-middle-scroll').mCustomScrollbar({ theme: 'minimal-dark' });
			$('#content-right-scroll').mCustomScrollbar({ theme: 'minimal-dark' });
		}, 1000);

        $(window).resize(function(){
			$('.chat').mCustomScrollbar('scrollTo', 'bottom');
		});


	}

	//######################## Get Last Chat and Message Initiate Function ###########################//

	/**
	 * Gets last chat and message initiate
	 */
	getLastChatAndMessageInitiate() {
		if ('pinner_id_again' in localStorage) {
			localStorage.removeItem('pinner_id_again');
			window.location.reload();
		} else {

			let frontend_token = localStorage.getItem('frontend_token');
			let postData = { 'access_token': frontend_token };
			this.socket.emit('post-last-chat-data', postData);
			this.socket.on('get-last-chat-data', (res) => {
				if (res.status == 1) {
					if (res.data != 'null') {
						setTimeout(() => {
							if (res.data.pin_id != 0) {
								this.getChat(res.data.login_id, res.data.chat_id, res.data.pin, res.mdata.id);
							} else {
								this.getPinnerChat(res.data.login_id, res.data.chat_id, res.data.user, res.mdata.id);
							}
						}, 600);
					}
				} else {
					this.pinCount = 0;
					this.disbale_msg_textarea = true;
				}
			});
		}
	}


	//######################### Get Pinner List Search by Title ########################//

	/**
	 * Searchs by title
	 */
	searchByTitle() {
		this.search_value = this.searchform.controls['searchValue'].value;
		this.reciveMessage = 1;
		this.searchCount = 1;
		this.userCountflug = 0;
		this.pinCount = 0;
		this.getPinnerList();
		setTimeout(() => {
			$('.chat').mCustomScrollbar('scrollTo', 'bottom');
		}, 500);
	}



	//######################### Get Pinner Dynamic width ########################//
	getScreenSize() {
		this.innerWidth = window.innerWidth;

		if (parseInt(this.innerWidth) < 770 && this.chatFlag === true) {
			this.innerChatGrid = true;
		}

		this.chatFlag = true;
	}

	//######################### Close Pinner Chatbox ########################//
	closeChatbox() {
		this.innerChatGrid = false;
	}

	//######################### Get All Pinner List For Chat ###########################//

	/**
	 * Gets pinner list
	 * @param [smallloader]
	 */
	async getPinnerList(smallloader = false) {
		if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
			$('.total_loader').show();
		}
		let frontend_token = localStorage.getItem('frontend_token');
		let postData = { 'access_token': frontend_token, 'searchValue': this.search_value };
		this.socket.emit('post-chat-pinner-list', postData);
		this.socket.on('get-chat-pinner-list', async (res) => {
			$('.total_loader').hide();
			if (res.status == 1) {
				this.pinnerData = res.data;

				console.log(this.pinnerData);

				for (const ele of this.pinnerData) {
					await this.commonservice.postCommunityHttpCall({
						url: '/api/pinner/get-is-message-sent',
						data: {
							'user_id': ele.pub_pinner_id,
							'pin_id': ele.pin_id
						}
					}).then(res => {
						this.isMsgExists.push(res.data);
					});

					if (ele.pin) {
						await this.commonservice.postHttpCall({ url: '/doers/quotation-preview', data: { 'slug': ele.pin.slug }, contenttype: 'application/json' }).then(response => {
							if (response.status == 1) {
								if (response.data) {
									this.quoteDetails.push(response.data);
								} else {
									this.quoteDetails.push({
										'pin_details': {
											'status': -1
										},
										'status': -1
									});
								}
							}
						});
					} else {
						this.quoteDetails.push({
							'pin_details': {
								'status': 2
							},
							'status': 0
						});
					}
				}
				console.log(this.isMsgExists, this.quoteDetails);


				this.sendChatConn = 1;

				if (this.searchCount == 1) {
					if (this.pinnerData.length == 0) {
						this.pinCount = 0;
						this.disbale_msg_textarea = true;
					} else {
						this.searchCount = 0;
						this.pinCount = 1;
						this.disbale_msg_textarea = false;
					}
				}

				if (this.reciveMessage == 1) {
					setTimeout(() => {
						for (var i = 0; i < this.pinnerData.length; i++) {
							if (this.pinnerData[i].id != this.index) {
								if ($('#liID_' + this.pinnerData[i].id).hasClass('person ng-star-inserted active')) {
									$('#liID_' + this.pinnerData[i].id).removeClass('person ng-star-inserted active');
									$('#liID_' + this.pinnerData[i].id).addClass('person ng-star-inserted');
								}
							}
						}
						$('#liID_' + this.index).addClass('person ng-star-inserted active');
						this.reciveMessage = 0;
					}, 500);
				}

				setTimeout(function () {
					$('#content-left-scroll').mCustomScrollbar('scrollTo', $('.seller-left').find('.mCSB_container').find('.people').find('.person:eq(0)'));
				}, 500);
			}

			if (this.pinnerData.length == 0) {
				this.showNoDataDetails = true;
			}
		});
	}

	//######################### Get All Chat List Data ###########################//

	/**
	 * Gets chat
	 * @param doer_id
	 * @param pinner_id
	 * @param pinData
	 * @param index
	 */
	getChat(doer_id, pinner_id, pinData, index) {

		setTimeout(() => {
			//var RooM = pinner_id+"_"+doer_id+"_"+pinData.id;
			var RooM = pinner_id + '_' + doer_id;
			console.log(RooM);

			this.chatSocket.emit('joinSendChatRoom', RooM);
		}, 300);


		this.pinTitle = pinData.title;
		this.pinDate = pinData.created_at;
		this.pinUniqueId = pinData.pin_unique_id;
		this.pinCount = 1;
		this.userCountflug = 0;
		this.pinnerId = pinner_id;
		this.doerId = doer_id;
		this.pinId = pinData.id;
		this.index = index;
		this.pinSlug = pinData.slug;

		//----------- This is used for active Pinner List Left pannel ----------//
		for (var i = 0; i < this.pinnerData.length; i++) {
			if (this.pinnerData[i].id != this.index) {

				if ($('#liID_' + this.pinnerData[i].id).hasClass('person ng-star-inserted active')) {
					$('#liID_' + this.pinnerData[i].id).removeClass('person ng-star-inserted active');
					$('#liID_' + this.pinnerData[i].id).addClass('person ng-star-inserted');
				}
			}
		}
		$('#liID_' + this.index).addClass('person ng-star-inserted active');
		//----------- This is used for active Pinner List Left pannel ----------//

		this.chatform.patchValue({
			pin_id: this.pinId,
		});
		this.chatform.patchValue({
			doer_id: this.doerId,
		});
		this.chatform.patchValue({
			pinner_id: this.pinnerId,
		});

		this.getChatData(this.pinnerId, this.pinId);
	}

	//######################### Get All Chat List Data ###########################//

	/**
	 * Gets pinner chat
	 * @param doer_id
	 * @param pinner_id
	 * @param userData
	 * @param index
	 */
	getPinnerChat(doer_id, pinner_id, userData, index) {
		console.log(userData);
		setTimeout(() => {

			if (userData.user_type == 1) {
				var RooM = pinner_id + '_' + doer_id + '_0';
			} else {

				if (pinner_id > doer_id) {
					var RooM = pinner_id + '_' + doer_id + '_0';
				} else {
					var RooM = doer_id + '_' + pinner_id + '_0';
				}

			}
			console.log(RooM);
			this.chatSocket.emit('joinSendChatRoom', RooM);
		}, 300)
		this.pinCount = 0;
		this.pinnerId = pinner_id;
		this.doerId = doer_id;
		this.pinId = 0;
		this.index = index;
		this.userCountflug = 1;
		this.pinTitle = userData.name;

		//----------- This is used for active Pinner List Left pannel ----------//
		for (var i = 0; i < this.pinnerData.length; i++) {
			if (this.pinnerData[i].id != this.index) {
				if ($('#liID_' + this.pinnerData[i].id).hasClass('person ng-star-inserted active')) {
					$('#liID_' + this.pinnerData[i].id).removeClass('person ng-star-inserted active');
					$('#liID_' + this.pinnerData[i].id).addClass('person ng-star-inserted');
				}
			}
		}
		$('#liID_' + this.index).addClass('person ng-star-inserted active');
		//----------- This is used for active Pinner List Left pannel ----------//

		this.chatform.patchValue({
			pin_id: this.pinId,
		});
		this.chatform.patchValue({
			doer_id: this.doerId,
		});
		this.chatform.patchValue({
			pinner_id: this.pinnerId,
		});

		this.getChatData(this.pinnerId, this.pinId);
	}


	//######################### Get Chat Details Data ###########################//

	/**
	 * Gets chat data
	 * @param pinnerId
	 * @param pinId
	 * @param [smallloader]
	 */
	getChatData(pinnerId, pinId, smallloader = false) {

		this.getScreenSize();
		if (($('.total_loader').css('display') == 'block' || $('.total_loader').css('display') != 'inline-block') && !smallloader) {
			$('.total_loader').show();
		}
		let frontend_token = localStorage.getItem('frontend_token');
		let postData = { 'access_token': frontend_token, 'pinner_id': pinnerId, 'pin_id': pinId };
		this.socket.emit('post-deor-chat-list', postData);
		this.socket.on('get-deor-chat-list', (res) => {
			$('.total_loader').hide();
			if (res.status == 1) {
				this.chatDatas = res.data;
				this.sendChatConn = 1;
				this.mgCustombar();
			}
		});

		if (this.chatDatas.length == 0) {
			this.showNoDataDetails = true;
		}

		setTimeout(() => {
			this.disbale_msg_textarea = false;
			$('.chat').mCustomScrollbar('scrollTo', 'bottom');
			//this.readMassage(pinnerId,pinId);
			for (var i = 0; i < this.pinnerData.length; i++) {
				if (this.pinnerData[i].pin_id == pinId) {
					this.pinnerData[i].Count = 0;
				}
			}
		}, 500);

		setTimeout(() => {
			this.globalConstant.notificationSocket.emit('post-doer-read-count-chat-data', { 'reciver_id': atob(localStorage.getItem('frontend_user_id')) });
		}, 1500);
		setTimeout(() => {
			this.socket.removeListener();

		}, 2000);
	}

	//######################### Save Chat Data using Enter Key ###########################//

	/**
	 * Keys press on text area
	 * @param key
	 */
	keyPressOnTextArea(key) {
		if (key.keyCode == 13) {
			key.preventDefault();
			$('#subbtn').trigger('click');
		}
	}

	//######################### Send Message Data ###########################//

	/**
	 * Sends chat
	 * @param chatVal
	 */
	sendChat(chatVal) {
		if (chatVal.chatValue != '' || this.chatImage != '') {
			let fd = new FormData();
			var item = {};
			Object.keys(chatVal).forEach(function (key) {
				item[key] = (chatVal[key] == null) ? '' : chatVal[key];
				fd.append(key, chatVal[key]);
			});

			if (this.chatImage != '') {
				fd.append('attachment_file', this.chatImage);
			}

			this.commonService.postChatHttpCall({ url: '/doer-chat-save', data: fd, contenttype: 'fromdata' }).then(result => this.supportSucessfunction(result));
		}
	}

	//######################### Send Message Success Function ###########################//

	/**
	 * Supports sucessfunction
	 * @param res
	 */
	supportSucessfunction(res) {
		if (res.status == 1) {
			let chat_link = res.user_type == 1 ? 'pinner/chat' : 'doer/chat';
			this.chatform.patchValue({
				chatValue: '',
				attachment_file: '',
			});

			this.chatImage = '';
			this.reciveMessage = 1;
			this.getPinnerList();
			setTimeout(() => {
				this.getChatData(res.data.reply_to, res.data.pin_id);
			}, 500);

			let privateChatData = { 'sender_id': res.data.reply_from, 'reciver_id': res.data.reply_to, 'pin_id': res.data.pin_id };

			this.chatSocket.emit('send-private-chat-to-doer', privateChatData);
			this.chatSocket.emit('send-private-chat-to-pinner', privateChatData);

			setTimeout(() => {
				this.chatSocket.emit('send-private-chat-from-doer-to-pinner', { 'reciver_id': res.data.reply_to });
			}, 100);

			setTimeout(() => {
				let notiChatdata = { 'reciver_id': res.data.reply_to };
				this.globalConstant.notificationSocket.emit('post-pinner-header-message-notification', notiChatdata);
			}, 1000);


			setTimeout(() => {
				let notiChatdata = { 'reciver_id': res.data.reply_to };
				this.globalConstant.notificationSocket.emit('post-doer-header-message-notification', notiChatdata);
			}, 1500);

			if (this.pinId == 0) {
				var postData = {
					'sender_id': res.data.reply_from,
					'reciver_id': res.data.reply_to,
					'pin_id': res.data.pin_id,

					'title': 'You’ve got a message!',
					'link': chat_link,
					'show_in_todo': 1,
					'todo_title': 'You’ve got a message!',
					'todo_link': chat_link,
					'emailTemplateSlug': '',

					'doer_show_in_todo': 1,
					'doer_title': 'Thank you for your message. We’ve received it and will get back to you shortly!',
					'doer_link': 'doer/chat',
					'doer_todo_title': 'Thank you for your message. We’ve received it and will get back to you shortly!',
					'doer_todo_link': 'doer/chat',
					'userEmailTemplateSlug': ''
				};
			}
			else {
				var postData = {
					'sender_id': res.data.reply_from,
					'reciver_id': res.data.reply_to,
					'pin_id': res.data.pin_id,

					'title': 'Pin ' + this.pinTitle + ' has received a comment. Check it out!',
					'link': chat_link,
					'show_in_todo': 1,
					'todo_title': 'Pin ' + this.pinTitle + ' has received a comment. Check it out!',
					'todo_link': chat_link,
					'emailTemplateSlug': '',

					'doer_show_in_todo': 1,
					'doer_title': 'Thank you for your message. We’ve received it and will get back to you shortly!',
					'doer_link': 'doer/chat',
					'doer_todo_title': 'Thank you for your message. We’ve received it and will get back to you shortly!',
					'doer_todo_link': 'doer/chat',
					'userEmailTemplateSlug': ''
				};
			}

			this.globalConstant.notificationSocket.emit('post-notification-to-pinner', postData);

			/*setTimeout(()=>{
				this.globalConstant.notificationSocket.emit("post-notification-to-doer-himself",postData);
			},3000)*/
		}
	}



	//######################### For Manual Custom Call Scroll bar ###########################//
	public mgCustombar() {
		$('#content-left-scroll').mCustomScrollbar({ theme: 'minimal-dark' });
		$('#content-middle-scroll').mCustomScrollbar({ theme: 'minimal-dark' });
		$('#content-right-scroll').mCustomScrollbar({ theme: 'minimal-dark' });
	}

	//######################### Select and Upload Attachment ###########################//

	/**
	 * Determines whether change on
	 * @param fileInput
	 */
	public onChange(fileInput: any) {
		this.files = [].slice.call(fileInput.target.files);
		var filename = this.readURL(fileInput.target);
		if (fileInput.target.files && fileInput.target.files[0]) {
			this.chatImage = fileInput.target.files[0];
		}
	}


	/**
	 * Reads url
	 * @param input
	 */
	public readURL(input) {
		var url = input.value;
		var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
		if (input.files && input.files && (
			ext == 'png' || ext == 'jpeg' || ext == 'jpg' || ext == 'gif' || ext == 'pdf' || ext == 'doc' || ext == 'docx'
		)) {
			var total_filename = [];
			var total_html = 'Attached files:';
			for (var i = 0; i < input.files.length; i++) {
				let fName = input.files[i].name.replace(/^.*\\/, '');
				total_html += '<span>' + fName + '</span>';

				total_filename.push(input.files[i].name);
			}
			if (total_html != 'Attached files:') {
				$(input).parent().find('.file-name').html(total_html);
				$(input).parent().parent().find('.fileUpload-error').html('');
			}
		} else {
			$(input).val('');
			$(input).parent().parent().find('.fileUpload-error').html('Only image/pdf/doc/docx formats are allowed!');
		}
	}


	//######################### Read Massage For Doer ###########################//
	/*readMassage(pinnerId,pinId){
		let frontend_token = localStorage.getItem('frontend_token');
        let postData	   = {'access_token':frontend_token,'pinner_id':pinnerId, 'pin_id':pinId};
 		this.socket.emit("post-read-chat-data",postData);
		this.socket.on("get-read-chat-data",(res)=>{
 			if(res.status==1) {
				for (var i = 0; i < this.pinnerData.length; i++) {
					if (this.pinnerData[i].pin_id == pinId) {
					 	 this.pinnerData[i].Count = 0;
					}
		 		}

		 		setTimeout(()=>{
		 			this.globalConstant.notificationSocket.emit("post-doer-read-count-chat-data",{'reciver_id':atob(localStorage.getItem('frontend_user_id'))});
				},1500);
 			}

			setTimeout(()=>{
				this.socket.removeListener();
 			},2000);

		});
	}*/
}
