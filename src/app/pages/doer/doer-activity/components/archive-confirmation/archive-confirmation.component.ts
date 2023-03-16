import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { CommonService } from 'src/app/commonservice';

@Component({
  selector: 'app-archive-confirmation',
  templateUrl: './archive-confirmation.component.html',
  styleUrls: ['./archive-confirmation.component.scss']
})
export class ArchiveConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ArchiveConfirmationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonservice: CommonService, 
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  /**
   * Archive Invitation
   * 
   * @param invitationId string
   */
  archiveInvitation(invitationId: string) {
    this.commonservice.postHttpCall({ 
      url: '/archive-invitation', 
      data: { 
        id: invitationId
      }, 
      contenttype: 'application/json' 
    })
    .then((response) => {
      if (response.status == 1) {
        this.closeDialog(response.data);
        this.responseMessageSnackBar(response.message,'orangeSnackBar');
      }
    })
    .catch(error => console.log(error));
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
   * Closes dialog
   */
  closeDialog(data): void {
    this.dialogRef.close(data);
  }   

}
