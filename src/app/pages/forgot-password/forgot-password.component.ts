import { Component } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators,EmailValidator} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../app.component';
import {Title} from "@angular/platform-browser";
import { CommonService } 			from '../../commonservice';
import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'forgot-password',
	templateUrl: 'forgot-password.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent  { 
	
	public userdata:any = {};
	public success_msg = '';
  public reg_class = '';
  public errorMsg  = '';
	public pageLoder = false;
  public activate_email;any;

  public email='';
	constructor(
        public snackBar: MatSnackBar,
        private route: ActivatedRoute,
				private router: Router,
				private appService: AppComponent, 
        private titleService: Title,
  			public commonService:CommonService
			)
	{
    window.scrollTo(0,0);
		// Change Page Title
		this.titleService.setTitle('Pindo | Login');

    //get activate route
    this.route.params.subscribe(params => {
      this.activate_email = params['user_email'];
    });

    if(this.activate_email)
      this.activateAccount();
	}

  activateAccount(){
    this.commonService.postHttpCall({url:'/activate-account', data:{'account_verification_code':this.activate_email}}).then(result=>this.activateSuccess(result));
  }

  activateSuccess(response) {
      if(response.status==1)
      {
        this.appService.reg_class = "alert alert-success";
        this.appService.success_msg = response.message;  
      }
      else
      {
        this.appService.reg_class = "alert alert-danger";
        this.appService.success_msg = response.message;
      }
      this.router.navigate(['/login']);
  }

	loginFunction(values,validcheck,frm_obj) {
		console.log(values);
		if(validcheck){
			this.pageLoder = true;
			console.log(values);
	    	this.commonService.postHttpCall({url:'/forgot-password', data:values}).then(result=>this.loginSuccess(result));
		}
	}

	loginSuccess(response) {
  		
  	    if(response.status==1)
      	{
      		
          this.responseMessageSnackBar(response.msg,);
      	}
      	else
      	{
      		/*this.reg_class = "alert alert-danger";*/
      		this.success_msg = response.message;
          this.responseMessageSnackBar(response.msg,'error');
      	}
  }

  public responseMessageSnackBar(message,res_class=''){
    this.snackBar.open(message,'', {
        duration: 4000,
        horizontalPosition:'right',       
        panelClass:res_class
    });
  }
}