import { Component,OnInit,AfterViewInit } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators,EmailValidator} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../app.component';
import {Title} from "@angular/platform-browser";
import { CommonService } 			from '../../commonservice';
import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'reset-password',
	templateUrl: 'reset-password.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent  { 
	
	public userdata:any = {};
	public success_msg = '';
  public reg_class = '';
  public errorMsg  = '';
	public pageLoder = false;
  public activate_email;any;
  public user = {};
  public formLoadedFlag = false;
  
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
		this.titleService.setTitle('Pindo | Reset Password');

    //get activate route
    this.route.params.subscribe(params => {
      this.activate_email = params['authtoken'];
    });

    
	}

  ngOnInit(){
    this.user = {
        email: this.activate_email,
        password: '',
        confirm_password: ''
    }
  }

  
  ngAfterViewInit() {
    setTimeout(() => this.formLoadedFlag = true, 0);
  }
  

	resetFunction(values,validcheck) {
		//console.log(values);
		if(validcheck){
			this.pageLoder = true;
      let tosendObj = {
        "password": values.password,
        "confirm_password": values.confirmPassword,
        "token": this.activate_email
      }
			console.log(tosendObj);
	    this.commonService.postHttpCall({url:'/update-password', data:tosendObj}).then(result=>this.loginSuccess(result));
		}
	}

	loginSuccess(response) {
  		
  	    if(response.status==1)
      	{
      		this.reg_class = "alert alert-success";
      		this.success_msg = response.message;
          this.responseMessageSnackBar(response.msg);     		

            
      	}
      	else
      	{
      		/*this.reg_class = "alert alert-danger";*/
      		//this.success_msg = response.message;
          this.responseMessageSnackBar(response.msg,'error');   
          //this.responseMessageSnackBar(response.msg);
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