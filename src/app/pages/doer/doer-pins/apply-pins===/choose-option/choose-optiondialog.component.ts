import {Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, OnDestroy, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { CommonService }      from '../../../../../commonservice';
import * as moment from 'moment';

@Component({
    selector: 'course-dialog',
    templateUrl: './choose-optiondialog.component.html',
    styleUrls: ['./choose-optiondialog.component.scss']
})
export class CourseDialogComponent implements OnInit {

    form: FormGroup;
    description:string;
    display_data:any = {};

    @Output() onAddNewMilestoneReqstSend = new EventEmitter();
    @Output() onChoosePaymentMethod = new EventEmitter();
    @Output() onSendingQuotaionBeforeHire = new EventEmitter();
    

    chosenSkipOption: string;
    chosenPaymentOptionModel:any;

    skipOptions: string[] = ['Normal Milestone', 'Additional Milestone'];
    chosenPaymentOption = ['Accept by Check','Accept in Cash','Accept by Bank Account'];

    constructor(
        public commonservice:CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) { 


    }

    /*getskipOptions() {
        this.chosenPaymentOption = [];
        let tempData = this.display_data['totalData'];
        if(tempData['accept_payment_by_cards']==1) {
            this.chosenPaymentOption.push('Accept by Bank Account')
        }
        if(tempData['accept_payment_by_cash']==1) {
            this.chosenPaymentOption.push('Accept in Cash')
        }
        if(tempData['accept_payment_by_cheque']==1) {
            this.chosenPaymentOption.push('Accept in Check');
        }
        return this.chosenPaymentOption;
    }*/

    ngOnInit() {
        console.log('this.data',this.data);
        this.display_data = this.data;
        this.chosenPaymentOption = [];
        if(this.display_data['option'] == 'choose_payment') {
            let tempData = this.display_data['totalData'];
            if(tempData['accept_payment_by_cards']==1) {
                this.chosenPaymentOption.push('Accept by Bank Account')
            }
            if(tempData['accept_payment_by_cash']==1) {
                this.chosenPaymentOption.push('Accept in Cash')
            }
            if(tempData['accept_payment_by_cheque']==1) {
                this.chosenPaymentOption.push('Accept by Check');
            }
        }
        
        let payment_method = this.display_data['payment_method'];
        if(payment_method==3) {
            this.skipOptions = ['Additional Milestone'];
        }
        else {
            this.skipOptions = ['Normal Milestone', 'Additional Milestone']; 
        }
    }
    ngAfterViewinit(){
        
    }

    ngOnDestroy() {  }
    

    close() {
        this.dialogRef.close();
    }

    applyChoose() {
        let mlstnType:any;
        if(this.chosenSkipOption=='Normal Milestone') {            
            mlstnType = 0;
        }
        else if(this.chosenSkipOption=='Additional Milestone') {
            mlstnType = 1;
        }
        this.sendCreateNewMilestoneReqst(this.chosenSkipOption);
    }

    choosePaymentMethod() {
        let tempObj = {
            'PaymentVal':this.chosenPaymentOptionModel
        }
        this.onChoosePaymentMethod.emit(tempObj);
        this.close();
    }

    /*nevigateToActivePinListing(){
        this.router.navigate(['pinner/my-pins']);
    }*/

    

    sendCreateNewMilestoneReqst(mlstnType){        
        this.onAddNewMilestoneReqstSend.emit(mlstnType);
        this.close();
        //this.commonservice.postHttpCall({url:'/doers/request-add-milestone', data:{'milestone_type':mlstnType,'quotation_id':this.display_data.totalData}, contenttype:"application/json"}).then(result=>this.onsendCreateNewMilestoneReqstSuccess(result));
    }

    onsendCreateNewMilestoneReqstSuccess(response) {
        if(response.status==1) {
            this.responseMessageSnackBar(response.msg,'orangeSnackBar');
            this.onAddNewMilestoneReqstSend.emit(true);
            this.close();
        }
    }

    proceedToChargePinner() {
        this.onSendingQuotaionBeforeHire.emit(true);
        this.close();
    }

    preventQuotation() {
        this.onSendingQuotaionBeforeHire.emit(false);
        this.close();
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
