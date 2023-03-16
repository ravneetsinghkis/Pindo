import { Component, OnInit, Inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { wordCountlimit } from './../../grouprequired-validator';
import { Globalconstant } from '../../../../global_constant';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
declare var $: any;

@Component({
  selector: 'create-report-dialog',
  templateUrl: 'create-report-dialog.html',
})

export class CreateReportDialog {
  submitted: boolean = false;
  create_report: FormGroup;
  msgCountNumb: number = 500;
  user_type: any;
  loginUserId: any;

  constructor(public dialogRef: MatDialogRef<CreateReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder, public commonservice: CommonService, public snackBar: MatSnackBar, public myGlobals: Globalconstant
  ) {

    this.user_type = parseInt(atob(localStorage.getItem('user_type')));
    this.loginUserId = window.atob(localStorage.getItem('frontend_user_id'));

  }

  ngOnInit() {
    this.createPostFormBuild();
    console.log('this.data', this.data);
  }
  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close();

  }
  /**
 * Creates post form build
 */
  createPostFormBuild() {
    this.create_report = this.fb.group({
      message: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
  }
  /**
  * Dubmit the form with form data
  * @param val 
  */
  onSubmitCreateReport(val) {
    let link = this.data.user.user_type == 1 ? 'community/community-home' : 'doer/community-home';
    this.submitted = true;
    let title = 'We need to inform you that post ' + this.data.title;

    if (this.create_report.invalid) {
      return;
    } else if (val.message.trim() == "") {
      val.message = this.create_report.controls.message.value.trim();
      this.create_report.controls.message.setErrors({ error: true });
      this.create_report.patchValue({
        message: val.message
      });
      return;
    }
    if (this.data.parent_category != null) {
      title += ' - ' + this.data.parent_category.name + ' was reported as inappropriate.';
    } else {
      title += ' was reported as inappropriate.';
    }
    this.commonservice.postCommunityHttpCall({ url: '/api/pinner/add-logs', data: { log_type: 'post report', log_value: this.data.id, description: val.message }, contenttype: "application/json" }).then(result => {
      if (result.status == 1) {
        this.closeDialog();

        var postData = {
          'sender_id': this.loginUserId,
          'reciver_id': this.data.user_id,
          'post_id': this.data.id,
          'title': title,
          //'title':'We need to inform you that post '+this.data.title+' was reported as inappropriate.',
          'link': link,
          'show_in_todo': 0,
          /*'todo_title':'You’ve received a quote from Doer. Wait for more or hire now!',
          'todo_link': 'pinner/active-quotation-details/',*/
        };
        this.myGlobals.notificationSocket.emit("post-community-notification", postData);
        this.responseMessageSnackBar(result.msg);
      }
    });


  }
  /**
     * Words count function for text area
     * @param event 
     */
  wordCountFunc(event) {
    setTimeout(() => {
      const msgValLength = this.create_report.controls.message.value.length;

      if (msgValLength !== 0) {
        this.msgCountNumb = 500 - msgValLength;
        if (this.msgCountNumb < 0) {
          this.submitted = true;
          this.msgCountNumb = 0;
        }

      } else {
        this.msgCountNumb = 500;
        return false;
      }
    }, 100);

  }
  /**
   * Responses message snack bar for show alert
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