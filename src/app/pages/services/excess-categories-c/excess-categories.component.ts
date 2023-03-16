import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-excess-categories',
  templateUrl: './excess-categories.component.html',
  styleUrls: ['./excess-categories.component.scss']
})
export class ExcessCategoriesComponent implements OnInit {

  parent_category = [];
  parent_name: any;

  constructor(public dialogRef: MatDialogRef<ExcessCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.parent_category = data.list.slice(1);
      this.parent_name = data.cat_name;
    }

  ngOnInit() {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
