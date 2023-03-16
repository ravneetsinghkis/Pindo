import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../global_constant';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-invite-to-pin',
  templateUrl: './invite-to-pin.component.html',
  styleUrls: ['./invite-to-pin.component.scss']
})
export class InviteToPinComponent implements OnInit, AfterViewInit {

  pinList = [];
  totalDoerSelected = 0;
  inviteDoerModel = {};
  selectedDoers = [];
  baseUrl: any;
  doer_Id: any;
  afterInit = false;

  constructor(public commonservice: CommonService, public gbConst: Globalconstant, public snackBar: MatSnackBar, public router: Router) {
    this.baseUrl = gbConst.uploadUrl;
    let tempUrl: any = this.router.url.split('/');
    tempUrl = tempUrl[tempUrl.length - 2];
    console.log(tempUrl);
    if (localStorage.getItem('inviteDoerList') && tempUrl == 'multiple-doer') {
      this.doer_Id = JSON.parse(localStorage.getItem('inviteDoerList'));
    } else {
      this.doer_Id = window.atob(localStorage.getItem('doerID'));
    }

    this.populatePins();
    //localStorage.removeItem('doerID');
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    let tempUrl = this.router.routerState.snapshot.url;
    if (tempUrl != '/pinner/create-new-pin' && localStorage.getItem('inviteDoerList')) {
      localStorage.removeItem('inviteDoerList');
    }
  }

  ngAfterViewInit() {
    this.afterInit = true;
  }

  populatePins() {
    this.commonservice.postHttpCall({ url: '/pinners/pin-listing', data: { 'doer_id': this.doer_Id }, contenttype: 'application/json' }).then((data) => this.onpopulatePinsSuccess(data));
  }

  onpopulatePinsSuccess(response) {
    if (response.status == 1) {
      this.pinList = response.data;
    }
  }

  inviteDoerToPin() {
    this.commonservice.postHttpCall({ url: '/pinners/invite-doer-from-public-profile', data: { 'doer_id': this.doer_Id, 'pin_id': this.selectedDoers }, contenttype: 'application/json' }).then((data) => this.oninviteDoerToPinSuccess(data));
  }

  /**on invite doer to pin success
   *
   * @param response = response from api
   * 
  */
  oninviteDoerToPinSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg);
      if (this.selectedDoers.length > 1) {
        this.router.navigate(['/pinner/my-pins']);
      } else {
        let tempEncryptedPinId = btoa(this.selectedDoers['0']['id']);
        this.router.navigate([`/pinner/active-quotations/${tempEncryptedPinId}`]);
      }

    }
  }

  /**getLoginStatus
   * formatLabel 
   *
   * @param elm = search input field reference
   * 
  */
  getLoginStatus() {
    if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '2') {
      //this.router.navigate(['/doer/apply-pins/'+Pin_id_slug]);
      return 2;
    } else if (typeof (localStorage.getItem('access_token')) != 'undefined' && atob(localStorage.getItem('user_type')) == '1') {
      return 1;
    } else {
      //this.openDialog(Pin_id_slug);
      return 0;
    }
  }

  selectedDoer(index) {
    let tempName = this.pinList[index].id;
    this.totalDoerSelected = (this.inviteDoerModel[tempName] == true) ? this.totalDoerSelected + 1 : this.totalDoerSelected - 1;
    //this.selectedDoers.push(tempName);
    let flagALreadyHas = false;
    if (this.inviteDoerModel[tempName] == true) {
      this.selectedDoers.push(this.pinList[index]);
    } else {
      for (let x = 0; x < this.selectedDoers.length; x++) {
        if (this.selectedDoers[x].id == tempName) {
          this.selectedDoers.splice(x, 1);
        }
      }

    }
  }

  /*
   * snackbar message populate
   * @param res_class = where to show snackbar
   * @param message = message to show
  */
  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }

}
