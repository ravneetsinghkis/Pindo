import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import { CommonService } from 'src/app/commonservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-select-type-register',
  templateUrl: './select-type-register.component.html',
  styleUrls: ['./select-type-register.component.scss']
})
export class SelectTypeRegisterComponent implements OnInit {
  public enableNextStep = false;
  public selectType = '';
  public stepToEnable = '';
  public referral_code = '';
  autocompleteData: any;
  dataSubscription: Subscription;

  showPasswords: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private snackBar: MatSnackBar,
  ) {
    //get activate route
    /*this.route.params.subscribe(params => {
      console.log('fdsfsdf',params);
      if(params['reff_code']){
        this.stepToEnable = 'doershow';
      }
    });*/
    if(localStorage.getItem('preselectedType')){
      this.selectRegisterType(localStorage.getItem('preselectedType'));
      if(localStorage.getItem('preselectedType') == 'doer' ){
        setTimeout(()=>{
          $('#circleSelect2').prop("checked", true);
        },1000)
      }
      else{
        setTimeout(()=>{
          $('#circleSelect1').prop("checked", true);
        },1000)
      }
      localStorage.removeItem('preselectedType')
    }

    // Check for crew invitation
    if (localStorage.getItem("invitation_id")) {
      this.commonService.postHttpCall({
        url: '/get-invitation-details',
        data: {
          id  : localStorage.getItem("invitation_id"),
          type: localStorage.getItem("invitation_status"),
        },
        contenttype: 'application/json'
      })
      .then((response) => {
        if (response.status == 1) {
          let data = response.data.invitation;
          this.autocompleteData = data;

          if (data.user_type == 1) {
            this.stepToEnable = "pinnershow";
          } else if (data.user_type == 2) {
            this.stepToEnable = "doershow";
          }
        } else {
          this.responseMessageSnackBar(response.message, "error");
        }
      })
      .catch(error => console.log(error));
    }

    if (localStorage.getItem("admin_create_doer")) {
      this.stepToEnable = "doershow";
      this.showPasswords = false;
    }
  }

  ngOnInit() {
  }

  selectRegisterType(selectedVal) {

    this.selectType = selectedVal;
    this.enableNextStep = true;
  }
  enableNextStepFunc(recievVal) {
    this.stepToEnable = recievVal+'show';
  }

  toggleBackStep() {
    this.stepToEnable = '';
    this.enableNextStep = false;
  }


  /**
   * Responses message snack bar
   * @param message
   * @param [res_class]
   * @param [vertical_position]
   */
  responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

}
