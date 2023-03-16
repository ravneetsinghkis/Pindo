import {Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import { InviteDoerComponent } from "../invite-doer.component";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { CommonService }      from '../../../../../commonservice';
import * as moment from 'moment';

@Component({
    selector: 'course-dialog',
    templateUrl: './choose-skip-optiondialog.component.html',
    styleUrls: ['./choose-skip-optiondialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    form: FormGroup;
    description:string;
    display_data:any = {};

    chosenSkipOption: string;
    skipOptions: string[] = ['Invite at least one doer', 'Make the pin Public', 'Leave anyway'];
    constructor(
        public commonservice:CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) { 


    }

    ngOnInit() {
        console.log('this.data',this.data);
        this.display_data = this.data;
    }
    ngAfterViewinit(){
        
    }

    ngOnDestroy() { console.log('asdasdasd') }


    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    applyChoose() {
        console.log('asdasd',this.chosenSkipOption);
        if(this.chosenSkipOption=='Make the pin Public') {
            this.close();
            this.markAsPublicPin();
        }
        else if(this.chosenSkipOption=='Leave anyway') {
            this.close();
            this.router.navigate(['pinner/dashboard']);
        }
        else {
           this.close(); 
        }
    }

    /*nevigateToActivePinListing(){
        this.router.navigate(['pinner/dashboard']);
    }*/

    inviteDoer(pin_id){
        this.router.navigate(['pinner/invite-doer/'+pin_id]);
        console.log('pinner/invite-doer/'+pin_id);
    }

    markAsPublicPin(){
        this.commonservice.postHttpCall({url:'/pinners/mark-as-public-pin', data:{'pin_id':this.display_data}, contenttype:"application/json"}).then(result=>this.publicPinSuccess(result));
    }

    publicPinSuccess(response){
        console.log(response);
        if(response.status==1){
            this.responseMessageSnackBar(response.msg);            
            this.router.navigate(['pinner/dashboard']);
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
