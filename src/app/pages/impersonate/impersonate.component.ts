import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../../commonservice';
import { AppComponent } from '../../app.component';
import { MatSnackBar } from "@angular/material";
import { Globalconstant } from '../../global_constant';

declare var $: any;
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.scss']
})
export class ImpersonateComponent implements OnInit {
  benifitsContPinner = [];
  benifitsContDoer = [];
  token: any;
  success_msg: any = '';
  reg_class: any = '';
  returnUrl: any = '';
  environment: any = environment;

  constructor(public appService: AppComponent, public globalconstant: Globalconstant, public commonService: CommonService, public snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      // console.log('token', params['token']);

    });
  }

  ngOnInit() {
    this.loginFunction();
  }



  loginFunction() {
    console.log();
    this.commonService.postHttpCall({ url: '/check-imparsonate-token', data: { 'access-token': this.token } }).then(result => this.loginSuccess(result));

  }

  loginSuccess(response) {
    // console.log('imparsonate', response);
    if (response.status == 1) {
      this.reg_class = "alert alert-success";
      this.success_msg = response.message;
      localStorage.clear();
      //After Login //

      localStorage.setItem('frontend_user_id', btoa(response.data.user_details.id));
      localStorage.setItem('frontend_token', response.data.token);
      localStorage.setItem('x-access-token', response.data.x_access_token);
      localStorage.setItem('user_type', btoa(response.user_type));
      localStorage.setItem('name',response.data.user_details.name); 
      localStorage.setItem('user_first_name',response.data.user_details.first_name);
      localStorage.setItem('company_name', response.data.user_details.company_name);
      localStorage.setItem('user_name', response.data.user_details.username);
      localStorage.setItem('profile_type', btoa(response.data.user_details.profile_type));
      // this.commonService.setAccountDataToStorage(response);
      // console.log('response.data.type',response.user_type);
      
      if (response.primary_address != null) {
        if (response.primary_address.address != null) {
          let formatted_address = response.primary_address.address + ' ' + response.primary_address.city + ', ' + response.primary_address.state + ' ' + response.primary_address.zipcode;
          this.commonService.setHeaderAddress(formatted_address, response.primary_address.lat, response.primary_address.lng);
        } else {
          this.commonService.getCurrentLocation();
        }

      } else {
        this.commonService.getCurrentLocation();
      }


      this.globalconstant.userData = response.data.user_details;

      this.commonService.islogin = 1;
      this.commonService.countSessionTimeOut = 0;
      this.commonService.changeFunction(this.commonService.islogin);

      this.appService.user_type = response.user_type;
      if (response.data.user_type == '1') {
        if (this.returnUrl)
          this.router.navigate([this.returnUrl]);
        else {
          this.router.navigate(['/pinner/account-settings']);
        }

      } else {
        if (this.returnUrl)
          this.router.navigate([this.returnUrl]);
        else {
          this.router.navigate(['/doer/account-settings']);
        }
      }

      //Onesignal
      //this.oneSingalPush(); 
    }
    else {
      //this.reg_class = "alert alert-danger";
      this.success_msg = response.message;
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }


}