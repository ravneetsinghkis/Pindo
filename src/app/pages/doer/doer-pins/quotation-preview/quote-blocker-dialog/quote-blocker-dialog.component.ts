import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/commonservice';
import { Globalconstant } from 'src/app/global_constant';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-quote-blocker-dialog',
  templateUrl: './quote-blocker-dialog.component.html',
  styleUrls: ['./quote-blocker-dialog.component.scss']
})
export class QuoteBlockerDialogComponent implements OnInit {

  constructor(
		public commonservice: CommonService,
		public gbConstant: Globalconstant,
		private router: Router,
		private route: ActivatedRoute,
		public snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<QuoteBlockerDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any    
  ) { }

  ngOnInit() {
    
  }

  goToAccountPaymentSettings(paymentTyoe: string) {
    if (paymentTyoe == 'online') {      
      localStorage.setItem("open_payment_popup", "1");
    } else if (paymentTyoe == 'offline') {    
      localStorage.setItem("open_accept_payment_popup", "1");
    }
    
    this.dialogRef.close();
    this.router.navigate(['/doer/account-settings']);
  }

}
