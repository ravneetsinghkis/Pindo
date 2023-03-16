import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-all-categories-dialog',
  templateUrl: './all-categories-dialog.component.html',
  styleUrls: ['./all-categories-dialog.component.scss']
})
export class AllCategoriesDialogComponent implements OnInit {

  categories: any = [];

  constructor(
    public dialogRef: MatDialogRef<AllCategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.categories) {      
      this.categories = data.categories;
    }
  }

  ngOnInit() {
  }

  /**
   * Close the dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }  

}
