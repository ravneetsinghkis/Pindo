import { Component, OnInit, Input, AfterViewInit, ViewChild, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Globalconstant } from '../../../global_constant';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-public-pin-details',
  templateUrl: './public-pin-details.component.html',
  styleUrls: ['./public-pin-details.component.scss']
})
export class PublicPinDetailsComponent implements OnInit {

  addressLink: any;
  baseCompUrl: any;
  dynamic_form_data: any;
  @ViewChild('popUpVar')
  popupref;
  isMsgExists: any;

  @Input('pinSlug')
  pinSlug;

  @Output() applyCLicked = new EventEmitter();

  pinDetails = {};
  showView: boolean = false;
  constructor(public commonservice: CommonService, private router: Router, private route: ActivatedRoute, public renderer: Renderer2, public el: ElementRef, public snackBar: MatSnackBar, public globalconstant: Globalconstant) {
    this.baseCompUrl = globalconstant.uploadUrl;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.showView = true;
  }

  /**
   * Toggles popup
   * @param [slugVal] 
   */
  togglePopup(slugVal = '') {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      this.router.navigate(['/public-pins']);
      console.log(localStorage.getItem('Y-cord'));
      // window.scroll({ 
      //   top: Number(localStorage.getItem('Y-cord')), 
      //   left: 0, 
      //   behavior: 'smooth' 
      // });
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
      //console.log(slugVal);
      this.populatePindetails(slugVal);
      this.router.navigate(['/public-pins/' + slugVal]);
    }
  }

  /**
   * Populates pindetails
   * @param slugVal 
   */
  populatePindetails(slugVal) {
    this.commonservice.postHttpCall({ url: '/get-pin-details', data: { 'slug': slugVal }, contenttype: 'application/json' }).then((result) => this.populatePindetailsSuccess(result));
  }

  /**
   * Populates pindetails success
   * @param response 
   */
  populatePindetailsSuccess(response) {
    if (response.status == 1) {
      this.pinDetails = response.data;
      this.checkMsg(response.data.pinner_id);

      if (this.pinDetails['dynamicForm'] == '["no data"]') {
        this.dynamic_form_data = null;
      } else {
        this.dynamic_form_data = JSON.parse(this.pinDetails['dynamicForm']);
      }
      console.log('this.dynamic_form_data', this.dynamic_form_data);
      this.addressLink = this.pinDetails['address'];
      const address = this.addressLink.replace(/\,/g, '');
      this.addressLink = address.replace(/\ /g, '%20');
      this.addressLink = `https://maps.google.com/maps?q=${this.addressLink}`;
    }
  }

  checkMsg(id) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-is-message-sent',
      data: {
        user_id: id
      }
    }).then(res => {
      this.isMsgExists = res.data;
      console.log('********MSGGGGGG***********', this.isMsgExists);
      
    });
  }
  /**
   * Gets add link
   * @param addressLink 
   * @returns  
   */
  getAddLink(addressLink) {
    if (addressLink != null) {
      let tempaddress = addressLink;
      const address = tempaddress.replace(/\,/g, '');
      tempaddress = address.replace(/\ /g, '%20');
      tempaddress = `https://maps.google.com/maps?q=${tempaddress}`;
      return tempaddress;
    }
  }

  /**
   * Toggles parent click
   * @param [slugVal] 
   */
  toggleParentClick(slugVal = '') {

    if (slugVal == '') {
      this.applyCLicked.emit(this.pinDetails['id']);
    } else {
      $('body').removeClass('popup-open');
      this.router.navigate(['/doer/apply-pins/' + slugVal]);
    }
  }

  /**
   * Gets login status
   * @returns  
   */
  getLoginStatus() {
    if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '2') {
      return 2;
    } else if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '1') {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Go to chat
   * @param pinner_id 
   * @param pin_id 
   */
  goToChat(pinner_id, pin_id) {

    const pub_pinner_id = pinner_id;
    const pub_pin_id = pin_id;
    const pub_doer_id = atob(localStorage.getItem('frontend_user_id'));

    const postData = {
      'pub_pinner_id': pub_pinner_id,
      'pub_doer_id': pub_doer_id,
      'pub_pin_id': pub_pin_id
    };

    this.globalconstant.notificationSocket.emit('save-log-last-message-data', postData);
    this.globalconstant.notificationSocket.on('get-log-last-message-data', (res) => {
      localStorage.setItem('pinner_id_again', btoa(pinner_id));
      this.router.navigate(['/doer/chat']);
    });
  }

}
