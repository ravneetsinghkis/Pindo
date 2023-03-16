import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';
import { CrewApplicationComponent } from 'src/app/shared/crew-application/crew-application.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crew-membership',
  templateUrl: './crew-membership.component.html',
  styleUrls: ['./crew-membership.component.scss']
})
export class CrewMembershipComponent implements OnInit {

  @ViewChild('crewApplication')
  private crewApplication: CrewApplicationComponent;

  userType: number = 0;
  termsCheck: boolean = false;
  pageTitle: string = "PinDo Crew Membership";
  pageContent;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private commonservice: CommonService,
  ) {
    this.userType = +atob(localStorage.getItem("user_type"));
  }

  ngOnInit() {
    this.getPageData();
  }

  getPageData() {
    this.commonservice.postHttpCall({
      url:'/get-cms-details', 
      data:{
        'slug': "pindo-crew-membership"
      }, 
      contenttype: "application/json"
    })
    .then(result=> {
      if (result.status == 1) {
        this.pageTitle = result.data.title;
        this.pageContent = result.data.content;
      }
    })
    .catch(error => console.log(error));
  }

  openApplication() {
    if (!this.userType) {
      Swal({
        title: "",
        text: "Please register as either a Pinner or Doer to become a Crew Member. Then complete the Crew Member application form in Account Settings.",
        confirmButtonColor: "#BAD141",
        allowOutsideClick: false
      })
      .then(resp => {
        this.router.navigate(["/register"]);
      });

      return;
    }

    // if (!this.termsCheck) {
    //   this.responseMessageSnackBar("Please check terms and conditions", "error");
    //   return;
    // }

    this.crewApplication.togglePopup();
  }

  public responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

}
