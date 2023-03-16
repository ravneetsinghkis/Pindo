import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {

  invitationStatus: string;
  invitationId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {
    this.route.params.subscribe(data => {
      this.invitationStatus = data.type;
      this.invitationId = data.slug;      
    });
  }

  ngOnInit() {
    if (!this.invitationStatus && ! this.invitationId) {
      this.router.navigate(["/"]);
    } else {
      localStorage.setItem("invitation_status", this.invitationStatus);
      localStorage.setItem("invitation_id", this.invitationId);
      this.router.navigate(["/register"]);      
    }
  }

}
