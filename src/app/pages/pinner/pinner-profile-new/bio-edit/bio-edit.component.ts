import { Component, OnInit, ViewChild, ElementRef,Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { CommonService } from '../../../../commonservice';
import {MatSnackBar} from '@angular/material';
import { FormGroup, FormBuilder, Validators }  from '@angular/forms';
import Swal from 'sweetalert2'
import { Globalconstant } from 'src/app/global_constant';
@Component({
  selector: 'bio-edit',
  templateUrl: './bio-edit.component.html',
  styleUrls: ['./bio-edit.component.css']
})
export class BioEditComponent implements OnInit {
  @ViewChild('popUpVar') popupref;	
  submitted:boolean = false;
  bio_update: FormGroup;
  @Input() biodescription ;
  @Output()	listingPopulated = new EventEmitter();
  ckEditorConfig = {};

  constructor( public commonservice: CommonService,private fb: FormBuilder,
     public renderer: Renderer2, public el: ElementRef, 
     public snackBar: MatSnackBar, public myGlobals: Globalconstant ) {
      this.ckEditorConfig = {
        uiColor: '#ffffff',
        toolbar: [
          ['-', 'Bold', 'Italic', 'Underline'],
          {
            name: 'paragraph',
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent']
          },
        ],
        height: 200,
        removePlugins: 'elementspath',
        resize_enabled: false
      };
      }
 
  ngOnInit() {
    this.createPostFormBuild();
  }
  /**
   * for form validation
   */
  createPostFormBuild(){
    this.bio_update = this.fb.group({
      bioedit:  [''],
     });
  }
  /**
   * close popup
   */
  togglePopup() {
  	if (this.popupref.nativeElement.classList.contains('opened')){
  		this.renderer.removeClass(this.popupref.nativeElement, 'opened');
  		this.renderer.removeClass(document.body, 'popup-open');
  	} else {
      this.bio_update.patchValue({
        bioedit: this.biodescription,
      });
  		this.renderer.addClass(this.popupref.nativeElement, 'opened');
  		this.renderer.addClass(document.body, 'popup-open');
  	}
  }

  /**
   * Closes modal
   */
  closeModal(){
    if(this.checkValueUpdateORNot()){
      Swal({
        title: this.myGlobals.updateDataBackAlertMsg,
        text: '',
        //type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bad141',
        confirmButtonText: 'YES',
        cancelButtonText: 'BACK',
      }).then((resultswal) => {
        if (resultswal.value) {
           this.togglePopup();
        }
      })
    } else {
      this.togglePopup();
    }
  }

  /**
   * submit the user bio information
   * @param biodesc 
   */
  onSubmitUpdateBioInformation(){
    this.submitted = true;
    
    if (this.bio_update.invalid) {
      return ;
    } 
    // else if(this.bio_update.get('bioedit').value.trim()==''){
    //   this.bio_update.patchValue({
    //     bioedit: this.bio_update.get('bioedit').value.trim(),
    //   });
    //   return;
    // }
    else {
      let bio_details =this.bio_update.get('bioedit').value;
      if(bio_details!=''){
       bio_details = bio_details.trim();
     }
      this.commonservice.postCommunityHttpCall({ 
        url: '/api/pinner/add-edit-user-bio', 
        data:{bio:bio_details}, 
        contenttype: "application/json" })
        .then(result => { 
        if (result.status == 1) {
          this.togglePopup();
          this.responseMessageSnackBar(result.msg);
          this.listingPopulated.emit(true);
        }
      }); 
    }
  }

    /**
   * Checks value update ornot
   * @returns true if value update ornot 
   */
  checkValueUpdateORNot():boolean{
    if(this.bio_update.get('bioedit').value!=this.biodescription){
        return true;
      }
      else {
        return false;
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

}