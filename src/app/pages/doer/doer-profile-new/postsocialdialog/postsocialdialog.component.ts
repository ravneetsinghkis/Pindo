import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
import { ActivatedRoute } from '@angular/router';
import { Globalconstant } from 'src/app/global_constant';

@Component({
  selector: 'app-postsocialdialog',
  templateUrl: './postsocialdialog.component.html',
  styleUrls: ['./postsocialdialog.component.scss']
})
export class PostsocialdialogComponent implements OnInit {

  linkText: any;
  title: any;
  frontendURL: any;

  constructor(
    public dialogRef: MatDialogRef<PostsocialdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public commonservice: CommonService,
    public route: ActivatedRoute,
    public globalconstant: Globalconstant
  ) {
    this.frontendURL = globalconstant.frontend_url;
    // this.frontendURL = 'https://www.pindoit.com/';
    this.linkText = data.slug;
    // this.linkText = 'https://www.google.com';
  }

  ngOnInit() {
    this.title = 'Check out my Doer recommendation on PinDo.';
  }

  onSuccess() {
    this.snackBar.open('Profile link has successfully been copied to your clipboard!', '', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'orangeSnackBar',
    });
  }

  onError() {
    this.snackBar.open('Profile link could not be copied. Something went wrong!', '', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'error',
    });
  }

  share() {
    window.open('http://www.facebook.com/sharer.php?u=' + this.frontendURL + '/socialShare/fbShare.php?slug=' + this.linkText, '_blank', 'height = 470, width = 700');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
