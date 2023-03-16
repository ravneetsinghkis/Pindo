import {Component, Inject, AfterViewInit, OnInit, ViewEncapsulation,Output,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {DoerPublicProfileComponent} from "../doer-public-profile.component";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { CommonService }      from '../../../commonservice';
import { Globalconstant } from '../../../global_constant';
import * as moment from 'moment';
declare var jQuery: any;
declare var $: any;
declare var io: any;

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent implements OnInit {
    categoryList = [];
    subCategoryList = [];
    display_data:any = {};
    selectedSubCats = [];
    selected = '';
    selectedDoerId:any;
    endorsedItems = [];
    baseCompUrl:any;
    loggedinDoerId:any;
    @Output() onEndorsing = new EventEmitter();
    originalSubcategoryList = [];

    constructor(
        public commonservice:CommonService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        public gbConst:Globalconstant,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any ) { 

    }

    ngOnInit() {
        //console.log('this.data',this.data);
        this.display_data = this.data;
        console.log('this.data',this.display_data);
        this.populateCategoryList();
        //console.log(this.display_data['endorsementDetails']);
        this.baseCompUrl = this.gbConst.uploadUrl;
        setTimeout(()=>{
            $(".totalendorsescroll").mCustomScrollbar();
        },0);   
        this.loggedinDoerId = atob(localStorage.getItem('frontend_user_id'));
        console.log(atob(localStorage.getItem('frontend_user_id')));     
    }
    ngAfterViewinit(){
        // console.log('asdasdasd');
    }

    save() {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

    selectedSubCatsChange(evt,indexVal) {
        console.log(evt.target.checked);
        if(evt.target.checked) {      
            this.selectedSubCats.push(this.subCategoryList[indexVal]);
        }
        else {
            this.selectedSubCats.splice(indexVal,1);
        }
    }

    populateCategoryList() {
        this.commonservice.postHttpCall({url:'/get-doer-category-list', data:{'doer_id':this.display_data['doerID']}, contenttype:"application/json"}).then(result=>this.onCategoryPopulateSuccess(result));
    }

    onCategoryPopulateSuccess(response) {
        if(response.status==1) {
            this.categoryList = response.data;            
        }
    }

    populateSubCategory() {
        this.commonservice.postHttpCall({url:'/sub-category-list-with-endorsed', data:{'parent_category_id':this.selected,'doer_id':this.display_data['doerID']}, contenttype:"application/json"}).then(result=>this.onSubCategoryPopulateSuccess(result));
    }

    onSubCategoryPopulateSuccess(response) {
        if(response.status == 1) { 
            for(let indexVal in response.data) {
                if(response.data[indexVal]['endorsed']==1) {
                    this.selectedSubCats.push(response.data[indexVal]);
                }
            }                    
            this.subCategoryList = response.data;
            this.originalSubcategoryList = [...this.subCategoryList];
        }   
    }

    onCatSelect() {
        this.originalSubcategoryList = [];
        this.subCategoryList = [];
        this.selectedSubCats = [];
        this.populateSubCategory();
    } 

    endorseDoer() {
        let newlySelected = [];
        for(let i = this.originalSubcategoryList.length-1;i >= 0; i--) {
            let tempExistFlag = false;
            for(let selectedIndex = 0;selectedIndex < this.selectedSubCats.length; selectedIndex++) {            
                if(this.selectedSubCats[selectedIndex]['id'] == this.originalSubcategoryList[i]['id']) {
                    tempExistFlag = true;                
                }
            }
            if(tempExistFlag) {
                this.originalSubcategoryList.splice(i,1);
            }
        }        
        newlySelected = this.selectedSubCats.filter(val => {
            if(val['endorsed'] == 0) {
                return val;
            }
        });
        // console.log(this.originalSubcategoryList,newlySelected);
        this.commonservice.postHttpCall({url:'/doers/endorse-doer', data:{'parent_category_id':this.selected,'doer_id':this.display_data['doerID'],'newlyAdded':newlySelected,'removed':this.originalSubcategoryList}, contenttype:"application/json"}).then(result=>this.onendorseDoerSuccess(result));
    }

    onendorseDoerSuccess(response) {
        if(response.status==1) {
            /*var postData = {  'sender_id' :  atob(localStorage.getItem('frontend_user_id')),
                          'reciver_id': this.display_data['doerID'], 
                          'title'     : 'Holla! You just received an endorsement from a fellow Doer. Nice.',
                          'link'      : 'doer/dashboard',
                          'show_in_todo':1,
                          'todo_title': 'Cool. A fellow Doer just endorsed you. Accept it and consider returning the favor.',
                          'todo_link': 'doer/account-setting',
                          'emailTemplateSlug':'endorse_submitted_by_doer'};
                      
            this.gbConst.notificationSocket.emit("post-endorse-notification-to-doer",postData);*/
            this.responseMessageSnackBar(response.msg);
            this.onEndorsing.emit(true);
        }
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

    removeEndorsement(id) {
        this.commonservice.postHttpCall({url:'/pinners/remove-endorsed-category', data:{'endorsed_id':id}, contenttype:"application/json"}).then(result=>this.onremoveEndorsementSuccess(result));   
    }

    onremoveEndorsementSuccess(response) {
        if(response.status==1) {
            this.close();
            this.responseMessageSnackBar(response.msg);
            this.commonservice.filterEndorsement('Remove Endorsement');
        }
    }

}