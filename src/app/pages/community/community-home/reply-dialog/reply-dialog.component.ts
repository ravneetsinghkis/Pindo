import { Component, OnInit, Inject, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { Globalconstant } from '../../../../global_constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'reply-dialog',
  templateUrl: 'reply-dialog.html',
})

export class ReplyDialog {
  // @Output()	listingPopulated = new EventEmitter();
  reply_id: any;
  threadid: any;
  rplycomments: any;
  postid: any;
  currentPostDetails: any;

  constructor(public dialogRef: MatDialogRef<ReplyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    private ref: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    public myGlobals: Globalconstant) { }

  ngOnInit() {
    this.reply_id = this.data.replyid;
    this.threadid = this.data.threadid;
    this.postid = this.data.postid;
    this.currentPostDetails = this.data.currentPostDetails;
  }

  //--------Reply comments------------
  comment_add(reply_id, threadid, postid) {
    if (this.rplycomments.trim() == "") {
      this.rplycomments = this.rplycomments.trim();
      this.responseMessageSnackBar("comment can't blank", "error");
      return;
    }

    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/add-comment',
      data: {
        post_id: postid,
        comment: this.rplycomments,
        is_reply: 1,
        postCommentId: reply_id,
        thread_id: threadid,

        'VISIT_PINDO_URL': environment.chatUrl + ( this.currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'HOME_PAGE_LINK': environment.chatUrl + ( this.currentPostDetails.user.user_type == 1 ? '/community/community-home' : '/doer/community-home' ),
        'ACTIVITY_PAGE_LINK': environment.chatUrl + ( this.currentPostDetails.user.user_type == 1 ? '/pinner/dashboard' : '/doer/dashboard' ),
        'MYPINS_PAGE_LINK': environment.chatUrl + ( this.currentPostDetails.user.user_type == 1 ? '/pinner/my-pins' : '/doer/my-pins' ),
        'PIN_A_JOB_PAGE_LINK': environment.chatUrl + ( this.currentPostDetails.user.user_type == 1 ? '/pinner/create-new-pin' : '/public-pins' ),
        'PIN_A_JOB_PAGE': this.currentPostDetails.user.user_type == 1 ? 'PIN A JOB' : 'FIND A JOB',
        'SITEURL': environment.chatUrl,
      },
      contenttype: "application/json"
    }).
      then(result => {
        if (result.status == 1) {

          this.dialogRef.close(result);
          this.responseMessageSnackBar(result.msg);
          // this.listingPopulated.emit(true);
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
  }

  /**
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close('close');
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