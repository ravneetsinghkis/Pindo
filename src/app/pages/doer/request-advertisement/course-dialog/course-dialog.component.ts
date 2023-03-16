import {Component, Inject, AfterViewInit, OnInit, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";
import {AdvertisementComponent} from "../request-advertisement.component";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { CommonService }      from '../../../../commonservice';
import * as moment from 'moment';

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
        this.populateCategoryList();
    }
    ngAfterViewinit(){
        
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
        this.commonservice.postHttpCall({url:'/get-doer-category-list', data:{'doer_id':this.display_data}, contenttype:"application/json"}).then(result=>this.onCategoryPopulateSuccess(result));
    }

    onCategoryPopulateSuccess(response) {
        if(response.status==1) {
            this.categoryList = response.data;            
        }
    }

    populateSubCategory() {
        this.commonservice.postHttpCall({url:'/sub-category-list-with-endorsed', data:{'parent_category_id':this.selected,'doer_id':this.display_data}, contenttype:"application/json"}).then(result=>this.onSubCategoryPopulateSuccess(result));
    }

    onSubCategoryPopulateSuccess(response) {
        if(response.status == 1) { 
            for(let indexVal in response.data) {
                if(response.data[indexVal]['endorsed']==1) {
                    this.selectedSubCats.push(response.data[indexVal]);
                }
            }                    
            this.subCategoryList = response.data;
        }   
    }

    onCatSelect() {
        this.subCategoryList = [];
        this.selectedSubCats = [];
        this.populateSubCategory();
    } 

    endorseDoer() {
        this.commonservice.postHttpCall({url:'/pinners/endorse-doer', data:{'parent_category_id':this.selected,'doer_id':this.display_data,'category_id':this.selectedSubCats}, contenttype:"application/json"}).then(result=>this.onendorseDoerSuccess(result));
    }

    onendorseDoerSuccess(response) {
        if(response.status==1) {
            this.responseMessageSnackBar(response.msg,'orangeSnackBar');
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
