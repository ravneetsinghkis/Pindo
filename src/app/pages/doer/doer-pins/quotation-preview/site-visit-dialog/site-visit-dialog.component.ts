import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-visit-dialog',
  templateUrl: './site-visit-dialog.component.html',
  styleUrls: ['./site-visit-dialog.component.scss']
})
export class SiteVisitDialogComponent implements OnInit {

  siteVisitForm: FormGroup;
  siteVisitFormSubmitted: boolean = false;
  pin_slug: string;

  constructor(
    public dialogRef: MatDialogRef<SiteVisitDialogComponent>,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public globalConstant: Globalconstant,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.pin_slug) {
      this.pin_slug = data.pin_slug
    }
  }

  ngOnInit() {
    this.generateSiteVisitForm();
  }

  generateSiteVisitForm() {
    let message = "This Pin can't be quoted until I see the site but I am interested in doing the job. Let's schedule a visit to see exactly what you want done.";

    this.siteVisitForm = this.fb.group({
      message: [message, [Validators.required]],
    });
  }

  /**
   * Get form controls
   */
  get siteVisitFormControls() {
    return this.siteVisitForm.controls;;
  }

  notifySiteVisit() {
    this.siteVisitFormSubmitted = true;

    if (this.siteVisitForm.valid) {
      let formValues = this.siteVisitForm.value;
      formValues.pin_id = this.pin_slug;

      this.commonservice.postHttpCall({ 
        url: '/doers/inform-site-visit-to-pinner', 
        data: formValues,
        contenttype: 'application/json' 
      })
      .then(result => this.notifySentSuccess(result))
      .catch(error => console.log(error));
    }
  }

  notifySentSuccess(response) {
    if (response.status == 1) {
      this.responseMessageSnackBar(response.msg, 'orangeSnackBar');
      this.closeDialog();
      this.router.navigate(["/doer/dashboard"]);
    } else {
      this.responseMessageSnackBar(response.msg, 'error');
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

  closeDialog() {
    this.dialogRef.close();
  }

}
