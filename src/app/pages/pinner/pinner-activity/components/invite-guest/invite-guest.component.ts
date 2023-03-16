import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/commonservice';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { Globalconstant } from 'src/app/global_constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite-guest',
  templateUrl: './invite-guest.component.html',
  styleUrls: ['./invite-guest.component.scss']
})
export class InviteGuestComponent implements OnInit {
  @ViewChild('clipboardElem') clipboardElem: ElementRef;

  invitationForm: FormGroup;
  allparent_category: any = [];
  parentcategory = "";
  child_cat_list: any = [];
  subcategory_id: any = [];
  invitationFormSubmitted: boolean = false;
  crewMemberDetails: any;
  userData: any;
  contactData: any;
  isDoerSelected: boolean = true;

  constructor(
    private fb: FormBuilder,
    private commonservice: CommonService,
    private snackBar: MatSnackBar,
    private globalconstant: Globalconstant,
    public dialogRef: MatDialogRef<InviteGuestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userData = this.globalconstant.userData;

    if (data.crewMemberDetails) {
      this.crewMemberDetails = data.crewMemberDetails;
    }
  }

  ngOnInit() {
    this.generateInvitationForm();
    this.getALlCategorylist();
    this.getUserData();
  }

	/**
	 * Populates user data
	 */
	getUserData() {
		this.commonservice.postHttpCall({
      url: '/pinners/get-contact-info',
      data: {},
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.contactData = result.data;
      }
    });
	}

  /**
   * Generate invitation form
   */
  generateInvitationForm() {
    this.invitationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userType: ['2', [Validators.required]],
      companyName: [''],
      email: ['', [Validators.required, Validators.email]],
      category: ['', [Validators.required]],
      subcategory: ['', [Validators.required]],
      message: [''],
    });
  }

  fillInvitationForm(data) {
    this.invitationForm.patchValue({
      firstName  : data.first_name,
      lastName   : data.last_name,
      userType   : data.user_type,
      companyName: data.company_name,
      email      : data.email_address,
      category   : data.category,
      subcategory: data.subcategory,
      message    : data.message,
    });

    this.changeUserType(+data.user_type);
  }

  /**
   * Return form controls
   */
  get invitationFormControls() {
    return this.invitationForm.controls;
  }

  /**
   * Fetch all category list
   */
  getALlCategorylist() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/parent-category',
      data: {},
      contenttype: 'application/json'
    })
    .then(result => {
      if (result.status == 1) {
        this.allparent_category = result.data.rows;

        if (Object.keys(this.data.invitationData).length != 0) {
          this.fillInvitationForm(this.data.invitationData);
        }
      }
    });
  }


  /**
   * Submit invitation form
   */
  submitInvitation() {
    this.invitationFormSubmitted = true;

    if (this.invitationForm.valid) {
      let formValues = this.invitationForm.value;

      this.commonservice.postHttpCall({
        url: '/send-invitation',
        data: formValues,
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.responseMessageSnackBar(result.message);
          this.dialogRef.close({
            data: result
          });
        } else {
          this.responseMessageSnackBar(result.message, "error");
        }
      });
    }
  }

  /**
   * Copy Invitation To Clipboard
   */
  copyInvitationToClipboard() {
    if (this.invitationForm.valid) {
      let formValues = this.invitationForm.value;

      this.commonservice.postHttpCall({
        url: '/save-invitation',
        data: formValues,
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.clipboardElem.nativeElement.value = result.data.message;
          this.clipboardElem.nativeElement.select();
          document.execCommand('copy');
          this.clipboardElem.nativeElement.setSelectionRange(0, 0);
          this.responseMessageSnackBar(result.message);
          this.dialogRef.close({
            data: result
          });
        } else {
          this.responseMessageSnackBar(result.message, "error");
        }
      });
    } else {
      this.responseMessageSnackBar("Please complete your form before copy.", "error");
    }
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

  /**
   * Watch user type change to update validation
   * @param userType integer
   */
  changeUserType(userType: number) {
    switch (userType) {
      case 1:
          this.isDoerSelected = false;
          this.invitationForm.controls['category'].setValidators(null);
          this.invitationForm.controls['subcategory'].setValidators(null);
        break;

      case 2:
          this.isDoerSelected = true;
          this.invitationForm.controls['category'].setValidators([Validators.required]);
          this.invitationForm.controls['subcategory'].setValidators([Validators.required]);
        break;
    }

    this.invitationForm.controls['category'].updateValueAndValidity();
    this.invitationForm.controls['subcategory'].updateValueAndValidity();
  }


  /**
   * Category Value Change
   * @param value string
   */
  categoryValueChange(value) {
    if (! value.length) {
      return;
    }

    const selectedCat = this.allparent_category.find(category => category.name == value);

    if (selectedCat) {
      this.child_cat_list = [];
      this.subcategory_id = [];

      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/child-category',
        data: {
          parent_id: selectedCat.id
        },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.child_cat_list = result.data.rows;
        }
      });
    }
  }

}
