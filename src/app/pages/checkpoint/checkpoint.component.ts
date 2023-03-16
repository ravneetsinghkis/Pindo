import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.scss']
})
export class CheckpointComponent implements OnInit {

  action: string;
  invitationId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private commonService: CommonService,
    public globalconstant: Globalconstant,
    private appService: AppComponent,
  ) {
    route.queryParams.subscribe(data => {
      this.action = data.action;
      this.invitationId = route.snapshot.paramMap.get('id');

      switch (this.action) {
        case 'doer-activate':
          this.processAdminDoerAcrivate();
          break;
      
        default:
          this.router.navigate(['/']);
          break;
      }
    });
  }

  ngOnInit() {

  }

  processAdminDoerAcrivate() {
    this.commonService.loginByInvitation(this.invitationId, this.action).then(response => {
      if (response.status) {
        this.commonService.setAccountDataToStorage(response);
  
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
  
        this.globalconstant.userData = response.data;
  
        this.commonService.islogin = 1;
        this.commonService.countSessionTimeOut = 0;
        this.commonService.changeFunction(this.commonService.islogin);
  
        this.appService.user_type = response.data.user_type;        
        localStorage.setItem("profile_activate_id", this.invitationId);
        this.router.navigate(['/doer/account-settings'], { queryParams: {action: this.action} });
      } else {
        this.responseMessageSnackBar(response.msg, 'error');
        this.router.navigate(['/']);
      }
    })
    .catch(error => console.log(error));
  }

  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }  

}
