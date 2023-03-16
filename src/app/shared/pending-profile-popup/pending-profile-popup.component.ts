import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-pending-profile-popup',
  templateUrl: './pending-profile-popup.component.html',
  styleUrls: ['./pending-profile-popup.component.scss']
})
export class PendingProfilePopupComponent implements OnInit {

  userType: number;

  constructor(
    public dialogRef: MatDialogRef<PendingProfilePopupComponent>,
    public myGlobals: Globalconstant    
  ) { }

  ngOnInit() {
    this.userType = +atob(localStorage.getItem("user_type"));
  }

  closeDialog() {
    this.dialogRef.close('save');
  }  

}
