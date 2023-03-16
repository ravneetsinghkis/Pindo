import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { InviteDialog } from '../invite-dialog/invite-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/commonservice';
import Swal from 'sweetalert2';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-open-pindo',
  templateUrl: './open-pindo.component.html',
  styleUrls: ['./open-pindo.component.scss']
})
export class OpenPindoComponent implements OnInit {

  OpenPindo: FormGroup;
  ID: any;
  Pname: any;
  category: any;
  subcategory: any;
  msgText: any;
  service: any = '';
  send: any = 'both';
  submitted: boolean;
  ckEditorConfig = {};

  constructor(public dialogRef: MatDialogRef<OpenPindoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public globalconstant: Globalconstant
  ) {
    this.ckEditorConfig = {
      uiColor: '#ffffff',
      toolbar: [
        ['-', 'Bold', 'Italic', 'Underline'],
        {
          name: 'paragraph',
          items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
        },
        {
          name: 'links',
          items: [ 'Link', 'Unlink', 'Anchor' ]
        }
      ],
      height: 200,
      removePlugins: 'elementspath',
      resize_enabled: false
    };

    this.submitted = false;

    this.OpenPindo = this.fb.group({
      send1: [''],
      service: [''],
      message: ['', Validators.compose([Validators.required])],
    });
    const primary = localStorage.getItem('primary_name');
    const secondary = localStorage.getItem('secondary_name');
    this.service = primary + ' > ' + secondary;
    this.category = data.category;
    this.subcategory = data.subcategory;
    this.ID = data.ID;
    this.Pname = data.Pname;
    const pin_link = this.globalconstant.frontend_url + '/public-pins/' + data.slug;
    this.msgText = 'Hi! I have created a Pin and am searching for a Doer who performs work in ' + primary + ' > ' + secondary + '. My Pin Summary can be found here.\n<a href="' + pin_link + '">' + this.Pname + '</a>';
  }

  ngOnInit() {
  }

  onSend() {
    this.submitted = true;
    if (this.OpenPindo.invalid) {
      return;
    }
    const sendData = {
      url: '/api/pinner/post-to-pindo-feed',
      data: {
        'receiver_id': 0,
        'target_id': 0,
        'category_id': this.category,
        'subcategory_id': this.subcategory,
        'title': 'Searching For',
        'type': 'searching',
        'pin_id': this.ID,
        'message': this.msgText,
        'send_to': this.send,
      }
    };
    this.commonservice.postCommunityHttpCall(sendData).then((res) => {
      if (res.status === 1) {
        this.closeDialog();
        this.snackBar.open(res.msg, '', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: '',
        });
      } else {
        Swal({
          title: res.msg,
          confirmButtonColor: '#bad141',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
