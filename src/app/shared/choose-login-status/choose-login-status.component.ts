import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/commonservice';
declare var $: any;

@Component({
    selector: 'choose-login-status',
    templateUrl: './choose-login-status.component.html',
    styleUrls: ['./choose-login-status.component.scss']
})
export class ChooseLoginStatus implements OnInit {

    constructor(
        public commonservice: CommonService,
        private router: Router,
        private route: ActivatedRoute,
        public renderer: Renderer2,
        private dialogRef: MatDialogRef<ChooseLoginStatus>,
        @Inject(MAT_DIALOG_DATA) public data: any) {


    }

    ngOnInit() {
        console.log(this.data);
    }

    ngAfterViewinit() { }

    /**
     * Closes choose login status
     */
    close() {
        this.dialogRef.close();
    }

    gotoChooseState(type) {
        this.dialogRef.close();
        if (type == 1) {
            this.router.navigate(['login']);
        } else {
            this.router.navigate(['register']);
        }
    }

}
