import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';

@Component({
  selector: 'app-request-community',
  templateUrl: './request-community.component.html',
  styleUrls: ['./request-community.component.scss']
})
export class RequestCommunityComponent implements OnInit {

  @ViewChild('formDirective') formDirective: NgForm;
  requestCommunityForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<RequestCommunityComponent>,
    private fb: FormBuilder,
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.generateForm();
  }

  generateForm() {
    this.requestCommunityForm = this.fb.group({
      description: new FormControl('', [Validators.required])
    });
  }

  submitRequest() {
    this.submitted = true;

    if (this.requestCommunityForm.valid) {
      this.commonService.postHttpCall({
        url: '/submit-community-request',
        data: this.requestCommunityForm.value,
        contenttype: 'application/json'
      })
      .then((result) => {
        if (result.status) {
          this.responseMessageSnackBar(result.msg);
          this.closeDialog();
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      });
    }
  }

  closeDialog() {
    this.formDirective.resetForm();
    this.dialogRef.close();
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
