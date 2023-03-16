import { Component, Inject, AfterViewInit, OnInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { PublicPinsComponent } from "../public-pins.component";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../commonservice';
import { MatSnackBar } from '@angular/material';
declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'choose-login-status',
    templateUrl: './choose-login-status.component.html',
    styleUrls: ['./choose-login-status.component.scss']
})
export class ChooseLoginStatus implements OnInit {

    form: FormGroup;
    description: string;
    display_data: any = {};
    chooseAnonymous = 0;
    anonymousSignUp: FormGroup;
    countAnonymouschosen = 0;
    submitted = false;
    user_det: any;

    constructor(
        public commonservice: CommonService,
        public snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        public renderer: Renderer2,
        private dialogRef: MatDialogRef<ChooseLoginStatus>,
        @Inject(MAT_DIALOG_DATA) public data: any) {


    }

    ngOnInit() {
        console.log('this.data', this.data);
        this.display_data = this.data;

    }
    ngAfterViewinit() {

    }

    /**
     * Go to login
     */
    goToLogin() {
        this.close();
        this.router.navigate(['login']);

    }

    /**
     * Closes choose login status
     */
    close() {
        this.dialogRef.close();
    }




    get f() { return this.anonymousSignUp.controls; }

    /**
     * Chooses anonymousignup
     */
    chooseAnonymousignup() {
        this.close();
        this.router.navigate(['register']);
        /*this.countAnonymouschosen++;
        this.chooseAnonymous = 1;
        if(this.countAnonymouschosen==1) {
            this.anonymousSignUp = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                first_name: ['', Validators.required],
                last_name: ['', Validators.required]
            });
        }
        if(localStorage.getItem('slug')) {
            localStorage.removeItem('slug')
        }*/
    }

    /**
     * Determines whether submit on
     * @param frmElm 
     */
    onSubmit(frmElm) {
        this.submitted = true;
        if (frmElm.valid) {
            //this.close();
            //this.router.navigate(['public-pins/apply-pins/'+this.display_data+'/'+response.data.new_user_inserted_id]);
            //frmElm.reset();
            //$('.popupHeader').find('.btn-back').trigger('click');   
            this.user_det = btoa(JSON.stringify(frmElm.value));
            this.commonservice.postHttpCall({ url: '/create-anonymous-doer', data: frmElm.value, contenttype: "application/json" }).then((result) => this.onSubmitSuccess(result, frmElm));

        }
    }

    /**
     * Determines whether submit success on
     * @param response 
     * @param frmElm 
     */
    onSubmitSuccess(response, frmElm) {
        if (response.status == 0) {
            this.responseMessageSnackBar(response.msg, 'error');
        }
        if (response.status == 1) {
            this.close();
            //frmElm.reset();
            frmElm.submitted = false;
            //console.log('public-pins/apply-pins/'+this.display_data+'/'+response.data.new_user_inserted_id);
            //console.log(document.body.classList);
            /*if (document.body.classList.contains('popup-open')){
                this.renderer.removeClass(document.body, 'popup-open');  
            }*/
            $('.popupHeader').find('.btn-back').trigger('click');
            this.router.navigate(['public-pins/apply-pins/' + this.display_data + '/' + this.user_det]);
            //this.router.navigate(['public-pins/apply-pins/'+this.display_data+'/'+response.data.new_user_inserted_id]);
        }
    }

    /**
     * Responses message snack bar
     * @param message 
     * @param [res_class] 
     */
    responseMessageSnackBar(message, res_class = '') {
        this.snackBar.open(message, '', {
            duration: 4000,
            horizontalPosition: 'right',
            panelClass: res_class
        });
    }



}
