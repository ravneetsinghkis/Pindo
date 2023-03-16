import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crew-application',
  templateUrl: './crew-application.component.html',
  styleUrls: ['./crew-application.component.scss']
})
export class CrewApplicationComponent implements OnInit {

  @ViewChild('popUpVar') popupref;  
  @ViewChild('formDirective') formDirective: NgForm;

  applicationForm: FormGroup;
  isFormSubmitted: boolean = false;
  userType: number = 1;
  attachedFiles = [];

  constructor(
    private commonservice: CommonService,
    private renderer: Renderer2,
    private el: ElementRef,
    private snackBar: MatSnackBar,
    private myGlobals: Globalconstant,
    private fb: FormBuilder
  ) {
    this.userType = +atob(localStorage.getItem("user_type"));
  }

  ngOnInit() {
    this.generateForm();
  }

  generateForm() {
    this.applicationForm = this.fb.group({
      personalDetails: new FormControl('', [Validators.required]),
    });
  }

  get formControls() {
    return this.applicationForm.controls;
  }

  attachmentUpload(files) {
    this.attachedFiles.push(...files);
  }

  deleteFile(index) {
    this.attachedFiles.splice(index, 1);
  }  

  applyAsCrewMember() {
    this.isFormSubmitted = true;

    if (this.applicationForm.valid) {
      let formData = new FormData();

      formData.append('personalDetails', this.applicationForm.get('personalDetails').value);
      this.attachedFiles.map(file => formData.append('files[]', file));

      this.commonservice.postHttpCall({
        url: '/apply-for-crew-member', 
        data: formData,
        contenttype: 'form-data'
      })
      .then(resp => {
        if (resp.status == 1) {
          this.applicationForm.reset();
          this.formDirective.resetForm();
          this.togglePopup();
          Swal({
            html: resp.message,
            confirmButtonColor: this.userType == 1 ? '#BAD141' : '#E6854A',
            confirmButtonText: 'close',
          });
        } else {
          this.responseMessageSnackBar(resp.message, "error");
        }
      })
      .catch(error => console.log('error', error))
    }
  }

  /**
   * Toggles popup
   */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
      this.attachedFiles = [];
    } else {
      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }  

  closeModal() {
    this.togglePopup();
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
