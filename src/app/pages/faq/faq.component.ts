import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  //accordion expand start
  step = 0;
  public FaqLists:any;
  allfaqOriginal = [];
  selectedIndex:any=0;
  searchVal:any='';
  FaqListsDoer = [];
  originalFaqListsDoer = [];

  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  // accordion expand end

  constructor(public commonservice:CommonService,public snackBar: MatSnackBar,private router: Router) { 
    this.getFAQList();
  }

  ngOnInit() {

  }

  changeTab(tab) {
    //$('#'+tab).trigger('click');
    $(document).find('.mat-tab-label:nth-child('+tab+')').trigger('click')
  }

  getFAQList() {
    let tempSelectedVal:any;
    if(this.selectedIndex==0) {
      tempSelectedVal = 'Pinner'
    }
    else {
      tempSelectedVal = 'Doer'
    }
    this.commonservice.postHttpCall({url:'/get-faq-list', data:{'selectedTab':tempSelectedVal}, contenttype:"application/json"}).then(result=>this.faqDetailsSuccess(result));
  }

  faqDetailsSuccess(response){
    if(response.status == 1){
      if(this.selectedIndex==0) {
        this.FaqLists = response.data;
        this.allfaqOriginal = response.data;
      }
      else {
        this.FaqListsDoer = response.data;
        this.originalFaqListsDoer = response.data;
      }
      //window.scrollTo(500, 0);
    }
  }

  searchPin(e) {    
    $('#mat-spinner').show();
    if(e.target.value.trim()!='') {
      let tempQuestArr:any;
      if(this.selectedIndex==0) {
        tempQuestArr = this.allfaqOriginal.filter((vals)=> vals['question'].toLowerCase().includes(e.target.value.toLowerCase()) || vals['answer'].toLowerCase().includes(e.target.value.toLowerCase()));
        this.FaqLists = tempQuestArr;
      }
      else {
        tempQuestArr = this.originalFaqListsDoer.filter((vals)=> vals['question'].toLowerCase().includes(e.target.value.toLowerCase()) || vals['answer'].toLowerCase().includes(e.target.value.toLowerCase()));
        this.FaqListsDoer = tempQuestArr;
      }
      $('#mat-spinner').hide();
    }
    else {
      if(this.selectedIndex==0) {
        this.FaqLists = this.allfaqOriginal;
      }
      else {
        this.FaqListsDoer = this.originalFaqListsDoer;
      }
      $('#mat-spinner').hide();
    }
  }

  onTabChange() {     
    this.clearSearchText();  
    this.getFAQList(); 
  }

  clearSearchText() {
    this.searchVal = '';    
    this.FaqLists = this.allfaqOriginal;
    this.FaqListsDoer = this.originalFaqListsDoer;
  }

}
