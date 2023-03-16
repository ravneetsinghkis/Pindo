import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
declare var $: any;
import { CommonService } from '../../../../../commonservice';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'endorse-services-dialog',
  templateUrl: 'endorse-services-dialog.html',
})
export class EndorseServicesDialog {
  endroesmentList: any = [];
  allCategoryList: any = [];
  endorse_doer_user_id: number;
  endorse_name: string = '';
  submitted_endorse_details: any = [];
  update_endorse_details_category: any = [];

  constructor(
    public dialogRef: MatDialogRef<EndorseServicesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public commonservice: CommonService
  ) {
    this.endorse_doer_user_id = data.id;
    this.endorse_name = data.name;
  }
  ngOnInit() {
    this.getDoerCategoryListByDoerIdApi();
  }

  /**
   * Gets doer category list by doer id api
   */
  getDoerCategoryListByDoerIdApi() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/doer-categories',
        data: { doer_id: this.endorse_doer_user_id },
        contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.allCategoryList = result.data;
          this.checkOrUncheckedChildCategory('selected');
          this.getDoerEndoresmentListApi();
        }
      });
  }

  /**
   * Gets doer endoresment list api
   */
  getDoerEndoresmentListApi() {
    this.commonservice.postCommunityHttpCall(
      {
        url: '/api/pinner/get-doer-endorsement-list',
        data: { endorsed_to_doer_id: this.endorse_doer_user_id }, contenttype: 'application/json'
      })
      .then(result => {
        if (result.status == 1) {
          this.endroesmentList = result.data;
          for (let i = 0; i < this.endroesmentList.length; i++) {
            for (let j = 0; j < this.endroesmentList[i].child.length; j++) {
              let tempObj = {
                parent_cat_id: this.endroesmentList[i].child[j].child_category.parent_id,
                category_id: this.endroesmentList[i].child[j].child_category.id
              }
              this.submitted_endorse_details.push(tempObj);
            }
          }
          this.checkOrUncheckedChildCategory('selected');
        }
      });
  }

  /**
   * Adds or edit doer endoresment doer
   */
  addOrEditDoerEndoresmentDoer() {
    this.checkOrUncheckedChildCategory('update');
    if (this.update_endorse_details_category.length == 0) {
      this.responseMessageSnackBar('Please choose atlease one category', 'error');
    } else {
      this.commonservice.postCommunityHttpCall(
        {
          url: '/api/pinner/endorse-doer',
          data: {
            endorsed_to_doer_id: this.endorse_doer_user_id,
            categories: this.update_endorse_details_category,
            VISIT_PINDO_URL: environment.chatUrl + '/doer/community-home',
            HOME_PAGE_LINK: environment.chatUrl + '/doer/community-home',
            ACTIVITY_PAGE_LINK: environment.chatUrl + '/doer/dashboard',
            MYPINS_PAGE_LINK: environment.chatUrl + '/doer/my-pins',
            PIN_A_JOB_PAGE_LINK: environment.chatUrl + '/doer/public-pins',
            PIN_A_JOB_PAGE: 'FIND A JOB',
            SITEURL: environment.chatUrl,
          },
          contenttype: 'application/json'
        })
        .then(result => {
          if (result.status == 1) {
            this.responseMessageSnackBar(result.msg, 'orangeSnackBar');
            this.dialogRef.close('success');
          } else {
            this.responseMessageSnackBar(result.msg, 'error');
          }
        });
    }
  }

  /**
   * Checks or unchecked child category
   * @param callFrom
   */
  checkOrUncheckedChildCategory(callFrom) {
    this.update_endorse_details_category = [];
    for (let i = 0; i < this.allCategoryList.length; i++) {
      for (let j = 0; j < this.allCategoryList[i].child.length; j++) {
        if (callFrom != 'update') {
          if (this.submitted_endorse_details.length > 0) {
            for (let k = 0; k < this.submitted_endorse_details.length; k++) {
              if (this.submitted_endorse_details[k].category_id == this.allCategoryList[i].child[j].child_category.id) {
                this.allCategoryList[i].child[j].child_category.isSelected = true;
                break;
              } else {
                this.allCategoryList[i].child[j].child_category.isSelected = false;
              }
            }
          } else {
            this.allCategoryList[i].child[j].child_category.isSelected = false;
          }
        } else {
          if (this.allCategoryList[i].child[j].child_category.isSelected) {
            let tempObj = {
              parent_cat_id: this.allCategoryList[i].child[j].child_category.parent_id,
              category_id: this.allCategoryList[i].child[j].child_category.id
            }
            this.update_endorse_details_category.push(tempObj);
          }
        }

      }
    }
  }

  /**
   * Changes category selected status
   * @param parentIndex
   * @param childIndex
   */
  changeCategorySelectedStatus(parentIndex, childIndex) {
    this.allCategoryList[parentIndex].child[childIndex].child_category.isSelected = !this.allCategoryList[parentIndex].child[childIndex].child_category.isSelected;
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
   * Closes dialog
   */
  closeDialog(): void {
    this.dialogRef.close('close');
  }

}
