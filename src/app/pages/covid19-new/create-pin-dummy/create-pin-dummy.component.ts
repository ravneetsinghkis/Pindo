import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';
import { AppComponent } from 'src/app/app.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import { QuickRegistrationComponent } from '../quick-registration/quick-registration.component';
@Component({
  selector: 'app-create-pin-dummy',
  templateUrl: './create-pin-dummy.component.html',
  styleUrls: ['./create-pin-dummy.component.scss']
})
export class CreatePinDummyComponent implements OnInit {

  pinCreationOrUpdate: string = 'CREATE A NEW PIN';

  constructor(
    private router: Router, 
    public commonservice: CommonService, 
    public globalconstant: Globalconstant,    
    private appService: AppComponent,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,    
  ) { }

  ngOnInit() {    
    if (this.appService.user_type) {
      this.router.navigate(["/"]);
    } else {
      this.openRegistrationModal(1);
    }
  }

  /**
   * Open Registration Modal
   * @param rem string
   * @param item string
   */
	openRegistrationModal(user_type: number) {		
		const dialogRef = this.dialog.open(QuickRegistrationComponent, {
			width: '400px',
			panelClass: 'comnDialog-panel',
      data: { user_type: user_type },
      disableClose: true
    });
    
		dialogRef.afterClosed().subscribe(result => {
      if (result && result.loginData) {        
        this.loginAfterRegistration(result.loginData);
      }
		});
  }  

  /**
   * Bodys param
   * @param loginData
   */
  loginAfterRegistration(loginData) {
    this.commonservice.postHttpCall({ url: '/login', data: loginData }).then(result => this.loginSuccess(result));
  }

  /**
   * Login Success
   * @param response json
   */
  loginSuccess(response) {
    if (response.status == 1) {
      //After Login //
      localStorage.setItem('frontend_user_id', btoa(response.data.id));
      localStorage.setItem('x-access-token', response.access_token);
      localStorage.setItem('frontend_token', response.token);
      localStorage.setItem('user_type', btoa(response.data.user_type));
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('user_first_name', response.data.first_name);
      localStorage.setItem('company_name', response.data.company_name);
      localStorage.setItem('user_name', response.data.username);
      localStorage.setItem('profile_type', btoa(response.data.profile_type));

      if (response.primary_address != null) {
        if (response.primary_address.address != null) {
          let formatted_address = response.primary_address.address + ' ' + response.primary_address.city + ', ' + response.primary_address.state + ' ' + response.primary_address.zipcode;
          this.commonservice.setHeaderAddress(formatted_address, response.primary_address.lat, response.primary_address.lng);
        } else {
          this.commonservice.getCurrentLocation();
        }

      } else {
        this.commonservice.getCurrentLocation();
      }

      this.globalconstant.userData = response.data;

      this.commonservice.islogin = 1;
      this.commonservice.countSessionTimeOut = 0;
      this.commonservice.changeFunction(this.commonservice.islogin);

      this.appService.user_type = response.data.user_type;

      if (response.data.user_type == '1') {        
        this.router.navigate(['/pinner/create-new-pin']);        
      } else if (response.data.user_type == '2') {
        this.router.navigate(['/doer/account-settings']);   
        this.getProfileDetails();     
      }
    }
    else {
      this.responseMessageSnackBar(response.msg, 'error');
    }
  }  

  /**
   * Get Profile Details
   */
	getProfileDetails() {
		this.commonservice.postHttpCall({
			url: '/doers/get-basic-details',
			data: {},
			contenttype: 'application/json'
		})
			.then(result => {
				if (result.data.is_volunteer == 1) {
					if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || result.data.range_in_miles == null || result.services.length == 0) {
						this.profileCompletionAlertPopupVolunteer();
					}
				} else {
					if (result.data.mobile_no == null || result.data.email == null || result.data.address == null || (result.data.accept_payment_by_bank == 0 && result.data.accept_payment_by_cards == 0 && result.data.accept_payment_by_cash == 0 && result.data.accept_payment_by_cheque == 0) || result.data.range_in_miles == null || result.data.admin_commission_charge_by == null || result.services.length == 0 || (result.data.stripe_customer_id == null && result.data.stripe_user_id == null)) {
						this.profileCompletionAlertPopupStandard();
					}
				}

				localStorage.setItem('is_volunteer', result.data.is_volunteer);
			});
	}

  /**
   * Profile Completion Alert Popup Volunteer
   */
	profileCompletionAlertPopupVolunteer() {
		Swal({
			title: 'Complete Profile',
			html: `<div style="text-align: justify">To connect with Pinners and bid for jobs, please go to ACCOUNT SETTINGS and fill in the following required fields:</div>
            <br/>
            <ul style="text-align: left">
              <span style="font-weight: bold; text-decoration: underline;">To be seen by Pinners</span>
              <li>Contact Information: Add a primary phone number</li>
              <li>Location Settings: Add address and range of service</li>
              <li>Services Offered: At least one selected</li>
              <br/>
              <span style="font-weight: bold; text-decoration: underline;">To Quote and be Hired</span>
              <li>How Pinners Pay You: At least one selected (credit card, bank, cash, check)</li>
			        <li>How to Pay PinDo: Add credit card</li>
			        <li>How to Receive Electronic Payments: Add bank account</li>
            </ul>`,
			width: 850,
			confirmButtonColor: '#E6854A',
			confirmButtonText: 'OK',
		}).then((res) => {
			if (res.value) {
				this.router.navigate(['/doer/account-settings']);
			}
		});
	}

  /**
   * Profile Completion Alert Popup Standard
   */
	profileCompletionAlertPopupStandard() {
		Swal({
			title: 'Complete Profile',
			html: `<div style="text-align: justify">To connect with Pinners and bid for jobs, please go to ACCOUNT SETTINGS and fill in the following required fields:</div>
            <br/>
            <ul style="text-align: left">
              <span style="font-weight: bold; text-decoration: underline;">To be seen by Pinners</span>
              <li>Contact Information: Add a primary phone number</li>
              <li>Location Settings: Add address and range of service</li>
              <li>Services Offered: At least one selected</li>
              <br/>
              <span style="font-weight: bold; text-decoration: underline;">To Quote and be Hired</span>
              <li>How Pinners Pay You: At least one selected (credit card, bank, cash, check)</li>
              <li>How to Pay PinDo: Add credit card</li>
              <li>How to Receive Electronic Payments: Add bank account</li>
            </ul>`,
			width: 850,
			confirmButtonColor: '#E6854A',
			confirmButtonText: 'OK',
		}).then((res) => {
			if (res.value) {
				this.router.navigate(['/doer/account-settings']);
			}
		});
  }   
  
  /**
   * Responses message snack bar
   * @param message
   * @param [res_class]
   */
  public responseMessageSnackBar(message, res_class = '') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      panelClass: res_class
    });
  }     

}
