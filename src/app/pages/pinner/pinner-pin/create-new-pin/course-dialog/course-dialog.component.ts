import {Component, Inject, Output, AfterViewInit, OnInit, ViewEncapsulation, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import { DynamicFormComponent } from "../components/dynamic-form/dynamic-form.component";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { CommonService }      from '../../../../../commonservice';
import * as moment from 'moment';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

    @Output() publicPinMarker = new EventEmitter();
    @Output() emergencyPinMarker = new EventEmitter();
    form: FormGroup;
    description:string;
    display_data:any = {};
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


    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    nevigateToActivePinListing(){
        this.router.navigate(['pinner/my-pins']);
    }

    inviteDoer(pin_id){
        this.router.navigate(['pinner/invite-doer/'+pin_id]);
        console.log('pinner/invite-doer/'+pin_id);
    }

    markAsPublicPin(pin_id){
        this.commonservice.postHttpCall({url:'/pinners/mark-as-public-pin', data:{'pin_id':pin_id}, contenttype:"application/json"}).then(result=>this.publicPinSuccess(result));
    }

    publicPinSuccess(response){
        console.log(response);
        if(response.status==1){
            this.responseMessageSnackBar(response.msg);
            this.router.navigate(['pinner/my-pins']);
        }
        else{
            this.responseMessageSnackBar(response.msg,'error');
        }

    }

    emergencyPinChecker(datatoemit) {
        this.emergencyPinMarker.emit(datatoemit);
        this.dialogRef.close();
    }

    publicPinChecker(datatoemit) {
        this.publicPinMarker.emit(datatoemit);
        this.dialogRef.close();
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
