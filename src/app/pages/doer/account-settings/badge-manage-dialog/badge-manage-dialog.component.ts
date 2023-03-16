import { Component, OnInit, Inject, ViewChild, AfterViewInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { InsuredDoerComponent } from './../insured-doer/insured-doer.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
declare var $: any;
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';

declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'badge-manage-dialog',
  templateUrl: 'badge-manage-dialog.html',
})

export class BadgeManageDialog implements OnInit, AfterViewInit {
  [x: string]: any;
  badgeData: any = [];
  img_url: any;

  @ViewChild('insuredDoerInfo')
  private insuredDoerInfo: InsuredDoerComponent;

  constructor(public dialogRef: MatDialogRef<BadgeManageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, public commonservice: CommonService, public renderer: Renderer2, public el: ElementRef, private ref: ChangeDetectorRef, public snackBar: MatSnackBar, public myGlobals: Globalconstant
  ) {

  }

  ngOnInit() {
    this.populateBadge();
  }

  populateBadge() {
    const sendData = {
      url: '/api/pinner/list-manage-badges',
      data: {}
    };
    this.commonservice.postCommunityHttpCall(sendData).then(res => {
      if (res.status == 1) {
        this.badgeData = res.data.rows;
      }
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log('insuredDoerInfo', this.insuredDoerInfo);
  }

  closeDialog(): void {
    this.dialogRef.close();
    // $("#nb-global-spinner").hide();
  }

  toggleParentPopup(profileSlug, id, slug) {
    if (profileSlug === 'InsuredDoerComponent') {
      this.insuredDoerInfo.badgeID = id;
      this.insuredDoerInfo.togglePopup();
    }
  }

  refreshMethod(e) {
    this.populateBadge();
  }
}
