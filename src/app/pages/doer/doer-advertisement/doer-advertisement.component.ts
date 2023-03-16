import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestAdvertisementComponent } from './request-advertisement/request-advertisement.component';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../global_constant';

@Component({
  selector: 'app-doer-advertisement',
  templateUrl: './doer-advertisement.component.html',
  styleUrls: ['./doer-advertisement.component.css']
})
export class DoerAdvertisementComponent implements OnInit {

  @ViewChild('requestAdd') private requestAdd: RequestAdvertisementComponent;

  requestAddshow: boolean = false;
  isaddrequested: boolean = false;
  filterByColName = 'created_at';
  pageCount = 1;
  pinLimit = 10;
  orderBy = 'DESC';
  baseCompUrl = '';
  requestedAdds = [];



  constructor(public commonservice: CommonService, public snackBar: MatSnackBar, public gbConst: Globalconstant) {
    this.baseCompUrl = gbConst.uploadUrl;

  }

  /**
   * on init
   */
  ngOnInit() {
    this.gerDoerRequestedAdds();
  }

  /**
   * Toggles parent popup
   */
  toggleParentPopup() {
    this.requestAdd.togglePopup();
  }

  /**
   * Filters by column
   * @param clmnName 
   * @param evt 
   */
  filterByColumn(clmnName, evt) {
    this.filterByColName = clmnName;
    this.pageCount = 1;
    // if($(evt.target).hasClass('hasDesc')) {      
    //   this.orderBy = 'ASC';
    //   $(evt.target).removeClass('hasDesc').addClass('hasAsc');
    // }
    // else if($(evt.target).hasClass('hasAsc')) {
    //   this.orderBy = 'DESC';
    //   $(evt.target).removeClass('hasAsc').addClass('hasDesc');
    // }
    // else {      
    //   $('.filterasc_desc.sortAppl').removeClass('hasDesc hasAsc sortAppl');
    //   this.orderBy = 'DESC';
    //   $(evt.target).toggleClass('sortAppl').addClass('hasDesc');
    // }
  }

  /**
   * Gers doer requested adds
   */
  gerDoerRequestedAdds() {
    this.commonservice.postHttpCall({ url: '/doers/get-requested-adds', data: { 'page': this.pageCount, 'limit': this.pinLimit, 'filterByColName': this.filterByColName, 'orderBy': this.orderBy }, contenttype: "application/json" }).then((data) => this.gerDoerRequestedAddsSuccess(data));

  }

  /**
   * Opens dialog
   * @param response 
   */
  openDialog(response) {
    console.log(response);
  }


  /**
   * Gers doer requested adds success
   * @param response 
   */
  gerDoerRequestedAddsSuccess(response) {
    //console.log(response);
    this.requestedAdds = [];
    if (response.status == 1) {
      this.isaddrequested = true;
      if (this.pageCount == 1) {
        this.requestedAdds = response.data;
      }
      else {
        for (let index in response.data) {
          this.requestedAdds.push(response.data[index]);
        }
      }
    }
  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.requestAdd.currentValue.subscribe(value => {
      this.gerDoerRequestedAdds();
    });
  }

}
