import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonService }      from '../../../../../commonservice';
import { Globalconstant } from '../../../../../global_constant';
@Component({
  selector: 'app-referred-doer',
  templateUrl: './referred-doer.component.html',
  styleUrls: ['./referred-doer.component.css']
})
export class ReferredDoerComponent implements OnInit {
  
  @Input()	
  doerListing;	

  constructor(public commonservice:CommonService,public gbConst:Globalconstant) {
  	
  }

  ngOnInit() {

  }

  ngAfterViewInit(){
  	console.log(this.doerListing);
  }

  convertToarray(num,checkType) {
    let checkVal;
    if(checkType == 'filled') {
      checkVal = num;
    }
    else {
      checkVal = 5-num;
    }
    let tempArray = [];
    for(let initVal = 1;initVal<=checkVal;initVal++) {      
      if(checkType == 'filled') {
        let tempObj = {
          'indexVal': initVal-1
        }
        tempArray.push(tempObj);
      }
      else {
        let tempObj = {
          'indexVal': num
        }
        tempArray.push(tempObj);
        num++;
      }
    }
    return tempArray;
  }
}
