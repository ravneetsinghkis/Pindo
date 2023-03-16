import {Component, Inject, AfterViewInit, OnInit, ViewEncapsulation,Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {PinnerPaymentSettingsComponent} from "../pinner-payment-settings.component";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { CommonService }      from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import * as moment from 'moment';
declare var jQuery: any;
declare var $: any;
declare var io: any;

@Component({
    selector: 'verify-bank',
    templateUrl: './verify-bank.component.html',
    styleUrls: ['./verify-bank.component.scss']
})
export class VerifyBankComponent implements OnInit {

    @Output() onVerifyingBankAccount = new EventEmitter();
    originalSubcategoryList = [];

    basicDetailsFormModel = {
        first_deposite:'',
        second_deposite:'',
    };

    display_data:any = {}; 
    constructor(
        public commonservice:CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        public gbConst:Globalconstant,
        private dialogRef: MatDialogRef<VerifyBankComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) { 

    }

    ngOnInit() {
        //console.log('this.data',this.data);
        this.display_data = this.data;
        console.log('this.data',this.display_data);
    }
    ngAfterViewinit(){
        console.log('asdasdasd');
    }

    close() {
        this.dialogRef.close();
    }


    /*VerifyBankAccount(values,validcheck,totForm,submitType) {
        console.log(values);
        if(validcheck){ 
            this.commonservice.postHttpCall({url:'/get-doer-category-list', data:values, contenttype:"application/json"}).then(result=>this.onCategoryPopulateSuccess(result));
        }
    }*/

    /*****************************************************************************
    *                       VERIFY PINNER BANK DETAILS                           *
    ******************************************************************************/
    verifyBankAccount(values,validcheck,totForm,submitType){
        console.log('bank_dtls',this.display_data.bank_details.id);
        console.log(values);
        let temObj = {
            id:this.display_data.bank_details.id,
            first_deposite:parseInt(values.first_deposite),
            second_deposite:parseInt(values.second_deposite)
        };
        console.log('temObj',temObj);
        if(validcheck){ 
            this.commonservice.postHttpCall({url:'/pinners/verify-bank-account', data:temObj, contenttype:"application/json"}).then((data) => this.verifyBankDetailSuccess(data));
        }
    }

    verifyBankDetailSuccess(response) {
        console.log('pinner bank details',response);
        this.close();
        if(response.status==1) {
            //this.cardList = response.data;
            this.onVerifyingBankAccount.emit(true);
            this.responseMessageSnackBar(response.msg);
        }
        else{
            this.responseMessageSnackBar(response.msg,'error');
        }
    }

    public responseMessageSnackBar(message,res_class:any='',vertical_position:any='bottom'){
        this.snackBar.open(message,'', {
            duration: 4000,
            horizontalPosition:'right',
            verticalPosition:vertical_position,       
            panelClass:res_class
        });
    }

}
