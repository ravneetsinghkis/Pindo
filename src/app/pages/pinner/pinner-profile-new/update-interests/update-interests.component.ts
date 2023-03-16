import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../../commonservice';
import { MatSnackBar } from '@angular/material';
import { Globalconstant } from '../../../../global_constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'update-interests',
  templateUrl: './update-interests.component.html',
  styleUrls: ['./update-interests.component.css']
})
export class UpdateInterestsComponent implements OnInit {

  @ViewChild('popUpVar') popupref;
  @Input() userinterest;
  @Output() listingPopulatedInterest = new EventEmitter();

  allparent_category = [];
  interestHold: any;
  listOfAllSubcategory = [];
  oldUserInterestItem = [];
  oldSelectedInterestedItem = [];
  selectedInterestedItem = [];
  user_id: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public myGlobals: Globalconstant,
    public commonservice: CommonService, public renderer: Renderer2,
    public el: ElementRef, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getALlCategorylist();
    this.getAllSubCategory();
    this.user_id = atob(localStorage.getItem('frontend_user_id'));
  }

  /**
    * popup open and close
    */
  togglePopup() {
    if (this.popupref.nativeElement.classList.contains('opened')) {
      this.renderer.removeClass(this.popupref.nativeElement, 'opened');
      this.renderer.removeClass(document.body, 'popup-open');
    } else {
      this.oldUserInterestItem = this.userinterest;
      this.pushPreviousSelectedInterestedItem();
      this.setCheckOrUncheckCategory();
      // this.getAllSubCategory();
      // this.getALlCategorylist();

      this.renderer.addClass(this.popupref.nativeElement, 'opened');
      this.renderer.addClass(document.body, 'popup-open');
    }
  }

  /**
   * News format array create
   */
  pushPreviousSelectedInterestedItem() {
    this.selectedInterestedItem = [];
    this.oldSelectedInterestedItem = [];
    this.oldUserInterestItem.forEach((element, i) => {
      this.selectedInterestedItem.push({
        'id': element.id,
        'user_id': element.user_id,
        'category_id': element.category_id,
        'category_name': element.category.name
      });
      this.oldSelectedInterestedItem.push(element.category_id)
    });
  }

  /**
   * Gets all categorylist
   */
  getALlCategorylist() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-all-category',
      data: {}, contenttype: "application/json"
    })
      .then(result => {
        if (result.status == 1) {
          this.allparent_category = result.data.rows;
          this.setCheckOrUncheckCategory();
        }
      });
  }

  /**
 * Gets all sub category listing
 */
  getAllSubCategory() {
    this.commonservice.postCommunityHttpCall({
      url: '/api/pinner/get-only-child-category',
      data: {}, contenttype: "application/json"
    })
      .then(result => {
        if (result.status == 1) {
          this.listOfAllSubcategory = result.data.rows;
        }
      });
  }

  /**
   * Sets check or uncheck category
   */
  setCheckOrUncheckCategory() {
    this.allparent_category.forEach((parentElement, pIndex) => {
      parentElement.child_category.forEach((childElement, cIndex) => {

        this.allparent_category[pIndex].child_category[cIndex].isSelect = false;
        this.selectedInterestedItem.forEach((element, i) => {
          if (element.category_id == childElement.id) {
            this.allparent_category[pIndex].child_category[cIndex].isSelect = true;
            return;
          }
        });
      });
    });
  }

  /**
   * Searchs subcategory for interest using key word
   * @param event 
   */
  searchInterest(event) {
    if (event.target.value) {
      //filter the value from total user and store into array
      this.interestHold = this.listOfAllSubcategory.filter(
        el =>
          el.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
      );
    } else {
      this.interestHold = [];
    }
  }

  /**
   * Sets interest by search
   * @param subcategory 
   */
  setInterestBySearch(subcategory) {
    let index = this.selectedInterestedItem.findIndex(index =>
      subcategory.id == index.category_id
    )
    if (index == -1) {
      this.selectedInterestedItem.push({ 'id': subcategory.id, 'user_id': this.user_id, 'category_id': subcategory.id, 'category_name': subcategory.name });
      this.setCheckOrUncheckCategory();
    }

  }

  /**
   * Sets or un set interest item
   * @param subcategory 
   */
  setOrUnSetInterestItem(subcategory) {
    let index = this.selectedInterestedItem.findIndex(index =>
      subcategory.id == index.category_id
    )

    if (index == -1) {
      this.selectedInterestedItem.push({ 'id': subcategory.id, 'user_id': this.user_id, 'category_id': subcategory.id, 'category_name': subcategory.name });
    } else {
      this.selectedInterestedItem.splice(index, 1);
    }
    this.setCheckOrUncheckCategory();
  }

  /**
   * Submit interest of update interests component
   */
  submitInterest() {
    let newArryInterest = [];
    this.selectedInterestedItem.forEach(elementVal => {
      newArryInterest.push(elementVal.category_id);
    })
    if (newArryInterest.length == 0) {
      this.responseMessageSnackBar("please chosse one", "error");
    } else {
      this.commonservice.postCommunityHttpCall({
        url: '/api/pinner/add-edit-user-interest',
        data: { category_id: newArryInterest },
        contenttype: "application/json"
      })
        .then(result => {
          if (result.status == 1) {
            this.togglePopup();
            this.responseMessageSnackBar(result.msg);
            this.listingPopulatedInterest.emit(true);
          }
        });
    }

  }
  /**
   * Deletes interest from interest list
   */
  deleteInterest(dat, index) {
    this.selectedInterestedItem.splice(index, 1);
    this.setCheckOrUncheckCategory();
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

  /**
   * Closes modal
   */
  closeModal() {
    if (!this.checkValueUpdateORNot()) {
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
    * Checks value update ornot
    * @returns true if value update ornot 
    */
  checkValueUpdateORNot(): boolean {
    let oldCategory: any = this.oldSelectedInterestedItem;
    let newCategory: any = [];

    this.selectedInterestedItem.forEach((element, i) => {
      newCategory.push(element.category_id);
    });

    if (JSON.stringify(newCategory) == JSON.stringify(oldCategory)) {
      return true;
    }
    else {
      return false;
    }
  }



}
