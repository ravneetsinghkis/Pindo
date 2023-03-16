import { Component, OnInit } from '@angular/core';
import { CommonService }      from '../../../commonservice';
import {MatSnackBar} from '@angular/material';
import { Globalconstant } from '../../../global_constant';
declare var jQuery: any;
declare var $: any;
 

@Component({
  selector: 'app-pinner-transactions',
  templateUrl: './pinner-transactions.component.html',
  styleUrls: ['./pinner-transactions.component.scss']
})
export class PinnerTransactionsComponent implements OnInit {

  baseCompUrl:any;
  toggleFilterBool:boolean = false;
  transaction:any;
  csv_data = [];
  eachrow = {};

   options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      useBom: true,
      noDownload: false,
      headers: ["Date", "Pin Id", "Pin Details", "Assigned Doer", "Payment Mode", "Expense", "Refund"]
    };

  filterPinModel = {
    'searchby':'',
    'start_date': '',
    'end_date': ''
  }

  filterByColName = 'created_at';
  orderBy = 'DESC';
  isSmallLoaderEnabled = false;	

  transactionList = [];
  pinAutocomplete = [];

  constructor( public commonservice:CommonService,public gbConst:Globalconstant ) {
    this.baseCompUrl = gbConst.uploadUrl;
    this.transaction = 'Transaction'+ new Date();
    this.populateTransactions();

  }

  ngOnInit() {
  }

  onClickedOutside(evt) {
    let tempLengthCheck = $(evt.target).parents('.cdk-overlay-container').length;
    let checkIfautocomplete = $(evt.target).parents('.autocomplete_list').length || evt.target.classList.contains('autocomplete_list');    
    if(tempLengthCheck>0 || checkIfautocomplete || checkIfautocomplete>0) {}
    else {
      this.toggleFilterBool = false;
    }  
    //this.toggleFilterBool = false;
  }

  downloadCsv(){
    console.log($("#transactionId button").trigger('click'));    
  }
  
  encodeDoerId(doer_id){
    return btoa(doer_id);
  }

  toggleFilter() {
    this.toggleFilterBool = !this.toggleFilterBool;
  }

  filterPinSubmit(frmElm) {
    if(frmElm.valid) {
      this.isSmallLoaderEnabled = false;
      this.filterByColName = 'created_at';
      this.orderBy = 'DESC';
      this.populateTransactions();
      this.toggleFilterBool = false;      
    }
  }

  clearForm(frmElm) { 
    frmElm.reset();   
    frmElm.submitted = false;
    this.filterPinModel['searchby'] = '';
    this.filterPinModel['start_date'] = '';
    this.filterPinModel['end_date'] = '';
    this.populateTransactions();
    this.toggleFilterBool = false;
  }

  populateTransactions() {
    this.commonservice.postHttpCall({url:'/pinners/transactions', data:{'totalFilters':this.filterPinModel,'filterByColName':this.filterByColName,'orderBy':this.orderBy}, contenttype:"application/json"}).then((data) => this.populateTransactionsSuccess(data));
  }

  populateTransactionsSuccess(response) {
    if(response.status==1) {
      this.transactionList = response.data;
      this.csv_data = [];
      for (var i = 0; this.transactionList.length > i; i++) {
        this.eachrow = {
          created_at: this.transactionList[i].created_at, 
          pin_unique_id: this.transactionList[i].pin_unique_id,
          title: this.transactionList[i].title,
          name: this.transactionList[i].name,
          payment_method: (this.transactionList[i].payment_method == null || this.transactionList[i].payment_method == 0) ? 'null': this.transactionList[i].payment_method,
          amount: this.transactionList[i].amount,
          refund_to_pinner: this.transactionList[i].refund_to_pinner == 1 ? 'Refund':'',
        };
        this.csv_data.push(this.eachrow);
      }
    }
  }

  searchPin(evt) {
    let searchString = evt.target.value;
    searchString = searchString.trim();
    if(searchString!='') {
      let checkStringLen = searchString.split('');
      this.isSmallLoaderEnabled = true;
      $('#mat-spinner').show();
      setTimeout(()=> {
        this.populateAutocompletePin(searchString);
      },500);      
    }
    else {
      this.pinAutocomplete = [];
    }
  }

  populateAutocompletePin(searchStrng) {
    this.commonservice.postHttpCall({url:'/pinners/transaction-serch-autocomplete', data:{'searchby':searchStrng}, contenttype:"application/json"},this.isSmallLoaderEnabled).then(result=>this.onpopulateAutocompletePinSuccess(result));
  }

  onpopulateAutocompletePinSuccess(response) {
    if(response.status==1) {
      this.pinAutocomplete = response.data;
      $('#mat-spinner').hide();
    }    
  }

  populateString(strngVal) {   
    this.filterPinModel['searchby'] = strngVal.trim();
    this.pinAutocomplete = [];
  }

  triggerClear() {
    this.filterPinModel['searchby'] = '';
    this.filterPinModel['start_date'] = '';
    this.filterPinModel['end_date'] = '';
    this.filterByColName = 'created_at';
    this.orderBy = 'DESC';
    this.populateTransactions();    
  }

  filterByColumn(clmnName,evt) {
    this.filterByColName = clmnName;
    if($(evt.target).hasClass('hasDesc')) {      
      this.orderBy = 'ASC';
      $(evt.target).removeClass('hasDesc').addClass('hasAsc');
    }
    else if($(evt.target).hasClass('hasAsc')) {
      this.orderBy = 'DESC';
      $(evt.target).removeClass('hasAsc').addClass('hasDesc');
    }
    else {      
      $('.filterasc_desc.sortAppl').removeClass('hasDesc hasAsc sortAppl');
      this.orderBy = 'DESC';
      $(evt.target).toggleClass('sortAppl').addClass('hasDesc');
    }
    this.populateTransactions();     
  }

}
