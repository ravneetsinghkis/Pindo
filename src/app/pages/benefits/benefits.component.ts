import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonService } from '../../commonservice';
declare var $: any;

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss']
})
export class BenefitsComponent implements OnInit, AfterViewInit {
  benifitsContPinner = [];
  benifitsContDoer = [];
  afterInit = false;

  constructor(public commonservice: CommonService) {
    this.getBenefits();
  }

  /**
   * on init
   */
  ngOnInit() {
  }

  /**
   * after view init
   */
  ngAfterViewInit() {
    this.afterInit = true;
  }

  /**
   * Gets benefits
   */
  getBenefits() {
    this.commonservice.postHttpCall({ url: '/get-benefits', contenttype: "application/json" }).then(result => this.ongetBenefitsSuccess(result));
  }

  /**
   * Ongets benefits success
   * @param response 
   */
  ongetBenefitsSuccess(response) {
    if (response.status == 1) {
      this.benifitsContPinner = response.data.filter(val => {
        if ((val['slug'] == 'benefits-pinner')) {
          return val;
        }
      });
      this.benifitsContPinner = this.benifitsContPinner['0'];
      this.benifitsContDoer = response.data.filter(val => {
        if ((val['slug'] == 'benefits-doer')) {
          return val;
        }
      });
      this.benifitsContDoer = this.benifitsContDoer['0'];
      console.log(this.benifitsContPinner);
    }
  }

  /**
   * Changes tab
   * @param tab 
   */
  changeTab(tab) {
    console.log(tab)
    $(document).find('.mat-tab-label:nth-child(' + tab + ')').trigger('click')
    //$('#'+tab).trigger('click');
  }

}
