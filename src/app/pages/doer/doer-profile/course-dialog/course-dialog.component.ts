import { Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../commonservice';
import * as moment from 'moment';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent implements OnInit {

    submitted = false;
    @ViewChild('form') form;
    createFolder: FormGroup;
    inEditMode = false;

    constructor(
        public commonservice: CommonService,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {


    }

    /**
     * on init
     */
    ngOnInit() {
        console.log('this.data', this.data);
        if (this.data) {
            this.inEditMode = true;
        }
        else {
            this.inEditMode = false;
        }
        this.createForm();
    }

    /**
     * after viewinit
     */
    ngAfterViewinit() {

    }

    /**
     * Saves course dialog component
     */
    save() {
        this.dialogRef.close();
    }

    /**
     * Closes course dialog component
     */
    close() {
        this.dialogRef.close();
    }

    /**
     * Creates form
     */
    createForm() {
        this.createFolder = this.formBuilder.group({
            folderName: [(this.data) ? this.data['folder_name'] : '', Validators.required],
            description: [(this.data) ? this.data['description'] : '']
        });
    }

    get formRef() {
        return this.createFolder.controls;
    }

    /**
     * Determines whether submit on
     * @param [typeOfSubmit] 
     * @returns  
     */
    onSubmit(typeOfSubmit = '') {
        this.submitted = true;
        // stop here if form is invalid
        if (this.createFolder.invalid) {
            return;
        }

        //this.form.resetForm();
        //this.submitted = false;        
        //alert('SUCCESS!! :-)\n\n' + this.createFolder.controls.folderName.value)
        if (!this.inEditMode) {
            let tempData = {
                'folderName': this.createFolder.controls.folderName.value,
                'description': this.createFolder.controls.description.value
            }
            this.createFolderHttp(tempData, typeOfSubmit);
        }
        else {
            let tempData = {
                'old_name': this.data['folder_name'],
                'new_name': this.createFolder.controls.folderName.value,
                'description': this.createFolder.controls.description.value,
                'folder_id': this.data['id'],
            }
            this.editFolder(tempData, typeOfSubmit);
        }
    }

    /**
     * Edits folder
     * @param datatoSend 
     * @param typeOfSubmit 
     */
    editFolder(datatoSend, typeOfSubmit) {
        this.commonservice.postHttpCall({ url: '/doers/rename-folder', data: datatoSend, contenttype: "application/json" }).then(result => this.editFolderSuccess(result, typeOfSubmit));
    }

    /**
     * Edits folder success
     * @param response 
     * @param [typeOfSubmit] 
     */
    editFolderSuccess(response, typeOfSubmit = '') {
        if (response.status == 1) {
            this.responseMessageSnackBar(response.msg,'orangeSnackBar');
            this.commonservice.filterNewFolderCreation('folderCreated');
            this.data = null;

            if (typeOfSubmit === 'continue') {
                this.form.resetForm();
                this.submitted = false;
            }
            else {
                this.close();
            }
        }
        else if (response.status == 0) {
            this.close();
            this.responseMessageSnackBar(response.msg, 'error');
        }
    }

    /**
     * Creates folder http
     * @param datatoSend 
     * @param typeOfSubmit 
     */
    createFolderHttp(datatoSend, typeOfSubmit) {
        this.commonservice.postHttpCall({ url: '/doers/create-folder', data: datatoSend, contenttype: "application/json" }).then(result => this.onCreateFolderSuccess(result, typeOfSubmit));
    }

    /**
     * Determines whether create folder success on
     * @param response 
     * @param typeOfSubmit 
     */
    onCreateFolderSuccess(response, typeOfSubmit) {
        if (response.status == 1) {
            this.responseMessageSnackBar(response.msg,'orangeSnackBar');
            this.commonservice.filterNewFolderCreation('folderCreated');
            if (typeOfSubmit === 'continue') {
                this.form.resetForm();
                this.submitted = false;
            }
            else {
                this.close();
            }
        }
    }

    /**
     * Responses message snack bar
     * @param message 
     * @param [res_class] 
     * @param [vertical_position] 
     */
    public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
        this.snackBar.open(message, '', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: vertical_position,
            panelClass: res_class
        });
    }

}
