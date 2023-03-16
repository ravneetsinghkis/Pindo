import { startWith } from 'rxjs/operators';
import { BadgeManageDialog } from './badge-manage-dialog/badge-manage-dialog.component';
import { AccountSettingPaymentMethodComponent } from './account-setting-payment-method/account-setting-payment-method.component';
import { PrivacySettingsComponent } from './privacy-settings/privacy-settings.component';
import { EmailSettingsComponent } from './email-settings/email-settings.component';
import Swal from 'sweetalert2';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/commonservice';
import { AccountSettingBasicDetailsComponent } from './account-setting-basic-details/account-setting-basic-details.component';
import { AccountSettingContactInformationComponent } from './account-setting-contact-information/account-setting-contact-information.component';
import { AccountSettingLocatioInformationComponent } from './account-setting-location-information/account-setting-location-information.component';
import { Globalconstant } from 'src/app/global_constant';
import { AccountSettingOpeningHoursComponent } from './account-setting-opening-hours/account-setting-opening-hours.component';
import { MatSnackBar } from '@angular/material';
import { AccountSettingServicesComponent } from './account-setting-services/account-setting-services.component';
import { AddAlbumComponent } from './add-album/add-album.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddBankComponent } from './add-bank/add-bank.component';
import { Observable, Subscription } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/layout/pending-changes.guard';
import { VerifyBankComponent } from './verify-bank/verify-bank.component';
import { CrewApplicationComponent } from '../../../shared/crew-application/crew-application.component';
import { AdminDoerPasswordSetupComponent } from './admin-doer-password-setup/admin-doer-password-setup.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  basicDetails: boolean = false;
  profileBadgesDetails: any = [];
  doerProfileHoursOfOperationDetails: any = [];
  cardDetails: any = [];
  badge_url: string = '';
  password_changed_date: any;
  URL: any;

  dummyInsurance: boolean = false;
  dummyLicence: boolean = false;
  dummyService: boolean = false;
  dummyOpeningHours: boolean = false;
  dummyProfilePayment: boolean = false;
  dummyContactinformation: boolean = false;
  dummyCertificates: boolean = false;

  profilePasswordInformationComplete: Boolean = true;
  profileBasicInformationComplete: Boolean = false;
  profileContactInformationComplete: Boolean = false;
  profileLocationInformationComplete: Boolean = false;
  profileServiceOfferedInformationComplete: Boolean = false;
  profileBadgesInformationComplete: Boolean = false;
  profileHouresOfOperationInformationComplete: Boolean = false;
  profileAcceptPaymentMethodInformationComplete: Boolean = false;
  profilePhotoGalleryInformationComplete: Boolean = false;
  // profileNotificationInformationComplete: Boolean = false;
  profilePaymentInformationComplete: Boolean = false;
  profileEmailSettingInformationComplete: Boolean = true;
  profilePrivacySettingInformationComplete: Boolean = true;

  leftFilterBoxOpen: boolean = false;

  doer_id: string;
  gallery_data = [];
  gallery_url: any;

  isVolunteer: any = 0;

  isOpenEmergencyService: any = 0;
  emergencyService: any = [
    { value: 1, text: 'Yes, I am available for emergency services' },
    { value: 0, text: 'No, I don’t provide emergency service' }
  ];

  stripePendingRequirements = [];

  stripeAccountConnected: boolean = false;

  doerBankAccounts = [];
  doerBankTotal: number = 0;
  doerCreditCardTotal: number = 0;
  doer_profile_type;
  admin_commission_charge_by: number = 0;

  logOutClickedSubscription: Subscription;
  logoutInitiated: boolean = false;

  isCrewMember: boolean = false;
  showSendProfileToDoer: boolean = false;

  @ViewChild('accountSettingBasicDetails')
  private accountSettingBasicDetails: AccountSettingBasicDetailsComponent;

  @ViewChild('contactInfo')
  private contactInfo: AccountSettingContactInformationComponent;

  @ViewChild('locationInfo')
  private locationInfo: AccountSettingLocatioInformationComponent;

  @ViewChild('accountSettingOpeningHours')
  private accountSettingOpeningHours: AccountSettingOpeningHoursComponent;

  @ViewChild('updatePaymentMethodInfo')
  private updatePaymentMethodInfo: AccountSettingPaymentMethodComponent;

  @ViewChild('addDoerService')
  private addDoerService: AccountSettingServicesComponent;

  @ViewChild('emailSettingsInfo')
  private emailSettingsInfo: EmailSettingsComponent;

  @ViewChild('addPaymentMethodInfo')
  private addPaymentMethodInfo: AddPaymentMethodComponent;

  @ViewChild('addAlbumInfo')
  private addAlbumInfo: AddAlbumComponent;

  @ViewChild('privacySettingsInfo')
  private privacySettingsInfo: PrivacySettingsComponent;

  @ViewChild('changePasswordInfo')
  private changePasswordInfo: ChangePasswordComponent;

  @ViewChild('AddBankComponentInfo')
  private AddBankComponentInfo: AddBankComponent;

  @ViewChild('verifyBankAccountInfo')
  private verifyBankAccountInfo: VerifyBankComponent;

  @ViewChild('crewApplication')
  private crewApplication: CrewApplicationComponent;  

  constructor(
    public dialog: MatDialog,
    public myGlobals: Globalconstant,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.doer_id = atob( localStorage.getItem("frontend_user_id") );
    this.badge_url = this.myGlobals.uploadUrl + '/badges/';
    this.gallery_url = this.myGlobals.uploadUrl + '/doer_gallery/';
    this.getBadges();
    this.getCardList();
    this.getEmergencyServices();
    this.getGalleryPhoto();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.action) {
        switch (params.action) {
          case 'doer-activate':
            this.showAccountActivatePopup();
            break;    
        }
      }
    });

    this.logOutClickedSubscription = this.commonservice._listnerForLogoutClicked.subscribe(data => {
      this.logoutInitiated = !!data;
    });

    let checkVolunteer = window.setInterval(() => {
      if (localStorage.getItem('is_volunteer') != null) {
        this.isVolunteer = localStorage.getItem('is_volunteer');
        window.clearInterval(checkVolunteer);
      }
    }, 1000);

    if (localStorage.getItem("open_payment_popup") == "1") {
      this.toggleParentPopup('addPaymentMethodInfo');
    }

    if (localStorage.getItem("open_accept_payment_popup") == "1") {
      this.toggleParentPopup('updatePaymentMethodInfo');
    }

    if (localStorage.getItem("admin_create_doer")) {
      this.showSendProfileToDoer = true;
    }

    this.getStripeRequirements();
  }

  toggleParentPopup(profileSlug, card = true, id = 'default') {
    if (profileSlug == 'basicDetails') {
      this.accountSettingBasicDetails.togglePopup();
    } else if (profileSlug == 'EmailSettingsComponent') {
      this.emailSettingsInfo.togglePopup();
    } else if (profileSlug == 'updatePaymentMethodInfo') {
      this.updatePaymentMethodInfo.togglePopup();
    } else if (profileSlug == 'contactInfo') {
      this.contactInfo.togglePopup();
    } else if (profileSlug == 'locationInfo') {
      this.locationInfo.togglePopup();
    } else if (profileSlug == 'profileOpeningHours') {
      this.accountSettingOpeningHours.togglePopup();
    } else if (profileSlug == 'addDoerService') {
      this.addDoerService.togglePopup();
    } else if (profileSlug == 'addAlbumInfo') {
      if (card != true) {
        this.addAlbumInfo.edit_data = card;
        this.addAlbumInfo.album_id = id;
        this.addAlbumInfo.isAddOrEdit = 'edit';
      }
      this.addAlbumInfo.togglePopup();
    } else if (profileSlug == 'changePasswordInfo') {
      this.changePasswordInfo.togglePopup();
    } else if (profileSlug == 'addPaymentMethodInfo') {
      this.addPaymentMethodInfo.isAddOrEdit = 'add';
      this.addPaymentMethodInfo.cardDetails = card;
      this.addPaymentMethodInfo.payment_method_title = "add payment method";
      this.addPaymentMethodInfo.defaultCheckboxLabel = "Select this method to pay PinDo for Pin related fees and advertising";
      this.addPaymentMethodInfo.hideBank = false;
      this.addPaymentMethodInfo.creditCardCount = this.doerCreditCardTotal;
      this.addPaymentMethodInfo.togglePopup();
    } else if (profileSlug == 'addPaymentMethodInfo2') {
      this.addPaymentMethodInfo.isAddOrEdit = 'add';
      this.addPaymentMethodInfo.cardDetails = card;
      this.addPaymentMethodInfo.payment_method_title = "add credit card";
      this.addPaymentMethodInfo.defaultCheckboxLabel = "Select this card to pay PinDo for Pin related fees and advertising";
      this.addPaymentMethodInfo.hideBank = true;
      this.addPaymentMethodInfo.creditCardCount = this.doerCreditCardTotal;
      this.addPaymentMethodInfo.togglePopup();
    } else if (profileSlug == 'editPaymentMethodInfo') {
      this.addPaymentMethodInfo.isAddOrEdit = 'edit';
      if (id == 'bank') {
        this.addPaymentMethodInfo.siblingMsg = 'bank_account';
        this.addPaymentMethodInfo.showPaymentMethodType = 'bank_account';
      } else {
        this.addPaymentMethodInfo.siblingMsg = 'credit_card';
        this.addPaymentMethodInfo.showPaymentMethodType = 'credit_card';
      }
      this.addPaymentMethodInfo.cardDetails = card;
      this.addPaymentMethodInfo.admin_commission_charge_by = this.admin_commission_charge_by;
      this.addPaymentMethodInfo.creditCardCount = this.doerCreditCardTotal;
      this.addPaymentMethodInfo.togglePopup();
    } else if (profileSlug == 'PrivacySettingsComponent') {
      this.privacySettingsInfo.togglePopup();
    } else if(profileSlug == 'CrewApplicationComponent') {
      this.crewApplication.togglePopup();
    }
  }

  viewProfile() {
    this.router.navigate(['/doer/manage-profile']);
  }

  getGalleryPhoto() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-doer-profile-photo-gallery',
      data: { user_id: atob(localStorage.getItem('frontend_user_id')) },
      contenttype: 'application/json'
    })
      .then(res => {
        if (res.status == 1) {
          this.gallery_data = res.data.rows;
          if (res.data.rows.length > 0) {
            this.profilePhotoGalleryInformationComplete = true;
          } else {
            this.profilePhotoGalleryInformationComplete = false;
          }
        }
      });
  }

  editAlbum(id) {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-doer-profile-single-photo-gallery-details',
      data: { id: id },
      contenttype: 'application/json'
    }).then(res => {
      if (res.status == 1) {
        this.toggleParentPopup('addAlbumInfo', res.data, id);
      }
    });
  }

  badgeManageOpenDialog(): void {
    const dialogRef = this.dialog.open(BadgeManageDialog, {
      width: '800px',
      panelClass: 'comnDialog-panel',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.getBadges();
    });
  }

  deleteCard(card) {
    if (card.is_primary == 1) {
      Swal({
        title: 'Please add a secondary method of payment before deleting the primary!',
        text: '',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#E6854A',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal({
      title: 'Are you sure you want to DELETE this payment method?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'YES',
      cancelButtonText: 'NO'
    }).then(resultswal => {
      if (resultswal.value) {
        if (card.object == 'card') {
          this.commonservice
            .postHttpCall({
              url: '/doers/remove-card',
              data: { card_id: card.object_id },
              contenttype: 'application/json'
            })
            .then(res => {
              if (res.status == 1) {
                this.snackBar.open(res.msg, '', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  panelClass: 'orangeSnackBar'
                });
                this.getCardList();
                this.addPaymentMethodInfo.getBankCardDetails();
                this.updatePaymentMethodInfo.populateListing();
                this.checkHowYouPayPindo();
              } else {
                this.snackBar.open(res.msg, '', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  panelClass: 'error'
                });
              }
            });
        } else {
          this.commonservice
            .postHttpCall({
              url: '/doers/remove-bank',
              data: { card_id: card.object_id },
              contenttype: 'application/json'
            }).then(res => {
              if (res.status == 1) {
                this.snackBar.open(res.msg, '', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  panelClass: 'orangeSnackBar'
                });
                this.getCardList();
                this.addPaymentMethodInfo.isCheckedPrimary = false;
                this.addPaymentMethodInfo.bankAccountExists = false;
                this.addPaymentMethodInfo.getBankCardDetails();
                this.updatePaymentMethodInfo.populateListing();
                this.checkHowYouPayPindo();
              } else {
                this.snackBar.open(res.msg, '', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  panelClass: 'error'
                });
              }
            });
        }
      }
    });
  }

  getAccountSettingUpdateDetailsByType(event, msg) {
    if (msg == 'passwordUpdate') {
      this.accountSettingBasicDetails.getProfileDetails();
    } else if (msg == 'paymentInformation' && event) {
      this.refreshCardList('refresh');
    }
  }

  getProfileBasicDetails(result) {
    this.password_changed_date = result.data.last_password_changed_time;

    if (result.data.name) {
      if (result.data.profile_type == 1 && result.data.username) {
        this.profileBasicInformationComplete = true;
      }
      if (result.data.profile_type == 2 && result.data.company_name) {
        this.profileBasicInformationComplete = true;
      }
    } else {
      this.profileBasicInformationComplete = false;
    }

    if (result.data.stripe_user_id) {
      this.stripeAccountConnected = true;
      this.checkHowYouPayPindo();
    }

    this.doer_profile_type = result.data.profile_type || 1;
    this.admin_commission_charge_by = result.data.admin_commission_charge_by;
    this.isCrewMember = result.data.crew_id ? true : false;
  }

  /**
   * Gets profile contact details
   * @param result
   */
  getProfileContactDetails(result) {
    if (result.email && result.mobile_no) {
      this.profileContactInformationComplete = true;
    } else {
      this.profileContactInformationComplete = false;
    }
  }

  getProfileLocationDetails(e) {
    if (e == true) {
      this.profileLocationInformationComplete = true;
    } else {
      this.profileLocationInformationComplete = false;
    }
  }

  getServicesOfferedDetails(e) {
    this.getBadges();
    if (e == true) {
      this.profileServiceOfferedInformationComplete = true;
    } else {
      this.profileServiceOfferedInformationComplete = false;
    }
  }

  lengthUpdate(event, profileSlug) {
    if (profileSlug == 'profileInsurance') {
      this.dummyInsurance = event;
    } else if (profileSlug == 'profileLicense') {
      this.dummyLicence = event;
    } else if (profileSlug == 'profileCertificates') {
      this.dummyCertificates = event;
    } else if (profileSlug == 'profileOpeningHours') {
      this.dummyOpeningHours = event;
      if (event == true) {
        this.profileHouresOfOperationInformationComplete = true;
      } else {
        this.profileHouresOfOperationInformationComplete = false;
      }
    } else if (profileSlug == 'profilePayment') {
      if (event == true) {
        this.profileAcceptPaymentMethodInformationComplete = true;
      } else {
        this.profileAcceptPaymentMethodInformationComplete = false;
      }
      this.dummyProfilePayment = event;
    } else if (profileSlug == 'DoerServices') {
      this.dummyService = event;
    }
  }

  refreshCardList(e) {
    if (e == 'refresh') {
      this.getCardList();
      this.accountSettingBasicDetails.getProfileDetails();
      // this.updatePaymentMethodInfo.credit_flag = true;
    } else {
      this.URL = e;
    }
  }

  refreshGalleryList(e) {
    if (e == true) {
      this.getGalleryPhoto();
    } else {

    }
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

  /**
   * Sets emergency services
   */
  public setEmergencyServices(e) {
    this.commonservice
      .postHttpCall({
        url: '/doers/update-emergency-service',
        data: { emergency: e },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.responseMessageSnackBar(result.msg, 'orangeSnackBar');
        }
      });
  }

  /**
   * Gets badges
   */
  getBadges() {
    this.commonservice
      .postHttpCall({
        url: '/doers/get-doer-badges',
        contenttype: 'application/json',
        data: { doer_id: this.doer_id },
      })
      .then(result => {
        if (result.status == 1) {
          // this.profileBadgesDetails = result.data;
          this.profileBadgesDetails = this.commonservice.removeDuplicates(result.data, 'badge_id');
          this.getBadgesDetails();
        }
      });
  }

  getBadgesDetails() {
    let flag = 0;
    const sendData = {
      url: '/api/pinner/list-manage-badges',
      data: {}
    };
    this.commonservice.postCommunityHttpCall(sendData).then(res => {
      if (res.status == 1) {
        for (const badge of res.data.rows) {
          if (badge.is_applied == 1) {
            flag = 1;
            break;
          }
        }

        for (const badge of res.data.rows) {
          if (badge.name == 'COVID-19 HELP') {
            localStorage.setItem('badge', btoa(badge.id));
          }

          if (badge.name == 'COVID-19 HELP' && localStorage.getItem('is_volunteer') == '1' && badge.is_recieved == 0) {
            this.commonservice.postHttpCall({
              url: '/doers/volunteer-badge-add',
              data: {
                'badge_id': badge.id
              },
              contenttype: 'application/json'
            }).then(res => {
              this.commonservice
                .postHttpCall({
                  url: '/doers/get-doer-badges',
                  contenttype: 'application/json',
                  data: { doer_id: this.doer_id },
                })
                .then(result => {
                  if (result.status == 1) {
                    // this.profileBadgesDetails = result.data;
                    this.profileBadgesDetails = this.commonservice.removeDuplicates(result.data, 'badge_id');
                  }
                });
            });
          }
        }

        if (flag == 1) {
          this.profileBadgesInformationComplete = true;
        } else {
          this.profileBadgesInformationComplete = false;
        }
      }
    });
  }

  /**
   * Gets emergency services
   */
  public getEmergencyServices() {
    this.commonservice
      .postHttpCall({
        url: '/doers/get-emergency-service',
        data: {},
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.isOpenEmergencyService = result.data.emergency;
        }
      });
  }

  getCardList() {
    this.commonservice
      .postHttpCall({
        url: '/doers/get-cards',
        data: {},
        contenttype: 'application/json'
      })
      .then(res => {
        if (res.status == 1) {
          this.cardDetails = res.data;
          // if (res.data.length > 0) {
          //   this.profilePaymentInformationComplete = true;
          // } else {
          //   this.profilePaymentInformationComplete = false;
          // }
          let flag = 0;
          for (const card of res.data) {
            if (card['object'] == 'bank_account') {
              flag = 1;
              break;
            }
          }
          if (flag == 1) {
            this.addPaymentMethodInfo.bank_exists = true;
          } else {
            this.addPaymentMethodInfo.bank_exists = false;
          }

          this.doerBankTotal = 0;
          this.doerCreditCardTotal = 0;
          this.doerBankAccounts = [];
          
          for (const item of res.data) {
            if (item['object'] == 'bank_account') {
              this.doerBankTotal++;
              this.doerBankAccounts.push(item);
            } else if (item['object'] == 'card') {
              this.doerCreditCardTotal++;
            }
          }

          this.checkHowYouPayPindo();

          this.updatePaymentMethodInfo.populateListing();
        }
      });
  }

  /**
    * Lefts filter tgl
    * @param clickItem
    */
  leftFilterTgl(clickItem) {
    clickItem.stopPropagation();
    if (this.leftFilterBoxOpen === false) {
      this.leftFilterBoxOpen = true;
    } else {
      this.leftFilterBoxOpen = false;
    }
  }

  /**
   * Lefts filter over click
   * @param clickItem
   */
  leftFilterOverClick(clickItem) {
    clickItem.stopPropagation();
    clickItem.preventDefault();
    this.leftFilterBoxOpen = false;
  }

  /**
   * Get stripe pending requrements
   */
  getStripeRequirements() {
    this.commonservice.getHttpCall({
      url: '/doers/stripe-pending-requirements',
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.stripePendingRequirements = result.requirements;
      }
    })
    .catch(error => console.log(error));;
  }

  openBankFormPopup() {
    this.AddBankComponentInfo.doer_profile_type = this.doer_profile_type;
    this.AddBankComponentInfo.togglePopup();
  }

  	/**
	 * Reditect to user after bank success
	 * @param status boolean
	 */
	bankAddedRedirectStripe(status) {
    if (this.stripeAccountConnected) {
      this.refreshCardList("refresh");
    } else {
      this.addPaymentMethodInfo.goToStripe();
    }
  }

  	/**
	 * Reditect to user after bank success
	 * @param status boolean
	 */
	bankAddedSuccess(status) {
    this.refreshCardList("refresh");
  }

  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away

    // Skip checking if user is clicked on logout
    if (this.logoutInitiated) {
      return true;
    }

    const isVolunteerProfile = +this.isVolunteer;

    if ((! this.profileContactInformationComplete ||
      ! this.profileLocationInformationComplete ||
      ! this.profileServiceOfferedInformationComplete) &&
      isVolunteerProfile
    ) {
      return false;
    } else if ((! this.profileContactInformationComplete ||
      ! this.profileLocationInformationComplete ||
      ! this.profileServiceOfferedInformationComplete ||
      ! this.profilePaymentInformationComplete ||
      ! this.profileAcceptPaymentMethodInformationComplete) &&
      ! isVolunteerProfile
    ) {
      return false;
    } else {
      return true;
    }

  }

  verifyBank(bank_id) {
    localStorage.setItem('bank_id', bank_id);
    this.verifyBankAccountInfo.togglePopup();
  }


  checkHowYouPayPindo() {
    if (this.doerBankTotal > 0 && this.stripeAccountConnected) {
      this.profilePaymentInformationComplete = true;
    } else if (this.doerCreditCardTotal > 0) {
      this.profilePaymentInformationComplete = true;
    } else {
      this.profilePaymentInformationComplete = false;
    }
  }


  listenEditBankModal(bank) {
    this.toggleParentPopup('editPaymentMethodInfo', bank, 'bank')
  }

  listenDeleteBank(bank) {
    this.deleteCard(bank);
  }

  showSendProfileToDoerPopup() {
    Swal({
      title: 'Send Profile to Doer',
      text: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6854A',
      confirmButtonText: 'SEND',
      cancelButtonText: 'CANCEL'
    }).then(resultswal => {
      if (resultswal.value) {
        this.commonservice
        .postHttpCall({
          url: '/doers/send-profile-to-doer',
          data: {
            doer_id: this.doer_id
          },
          contenttype: 'application/json'
        })
        .then(res => {
          if (res.status == 1) {
            this.responseMessageSnackBar(res.msg, 'orangeSnackBar');
          } else {
            this.responseMessageSnackBar(res.msg, 'error');
          }
        });
      }
    });
  }

  showAccountActivatePopup() {
    const siteVisitDialogRef = this.dialog.open(AdminDoerPasswordSetupComponent, {
      width: '545px',
      disableClose: true,
      panelClass: 'comnDialog-panel',
      data: {
        
      }
    });
  }

  ngOnDestroy() {
    if (this.logOutClickedSubscription) {
      this.logOutClickedSubscription.unsubscribe();
    }
	}

}
