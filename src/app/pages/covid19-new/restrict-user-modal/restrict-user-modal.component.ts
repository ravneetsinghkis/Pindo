import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-restrict-user-modal',
  templateUrl: './restrict-user-modal.component.html',
  styleUrls: ['./restrict-user-modal.component.scss']
})
export class RestrictUserModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RestrictUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
