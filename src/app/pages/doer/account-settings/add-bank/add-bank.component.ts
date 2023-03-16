import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/commonservice';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.scss']
})
export class AddBankComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  @ViewChild('bankForm') bankForm : NgForm;

  @Output() bankAddedStripe = new EventEmitter();

  backAccountDetailsAddOrUpdateForm: FormGroup;

  isformSubmitted: boolean = false;
  doer_profile_type: number;

  types: any = [
		{ value: 'individual', viewValue: 'Individual' },
		{ value: 'company', viewValue: 'Company' }
	];

  constructor(
    public commonservice: CommonService,
    public renderer: Renderer2,
    public el: ElementRef,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {
    this.generateBankForm();
  }

  generateBankForm() {
    this.backAccountDetailsAddOrUpdateForm = this.fb.group({
			account_holder_name: ['', Validators.required],
			type               : ['individual', Validators.required],
			account_number     : ['', Validators.required],
			routing_number     : ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
		});
  }

  get formControls() {
    return this.backAccountDetailsAddOrUpdateForm.controls;
  }

  addBankDetails() {
    this.isformSubmitted = true;

    if (this.backAccountDetailsAddOrUpdateForm.valid) {
      this.commonservice.postHttpCall({
				url: '/doers/save-standard-bank-details',
				data: this.backAccountDetailsAddOrUpdateForm.value,
				contenttype: "form-data"
			})
			.then(result => {
        if (result.status) {
          this.togglePopup();
          this.bankAddedStripe.emit(true);
          this.bankForm.resetForm();
          this.responseMessageSnackBar(result.msg, 'orangeSnackBar');
        } else {
          this.responseMessageSnackBar(result.msg, 'error');
        }
      })
      .catch(error => console.log(error));
    }
  }

  togglePopup() {
    let bank_type = this.doer_profile_type == 1 ? "individual" : "company";
    this.backAccountDetailsAddOrUpdateForm.patchValue({
      type: bank_type
    });
    
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  responseMessageSnackBar(message, res_class: any = '', vertical_position: any = 'bottom') {
    this.snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: vertical_position,
      panelClass: res_class
    });
  }

}
