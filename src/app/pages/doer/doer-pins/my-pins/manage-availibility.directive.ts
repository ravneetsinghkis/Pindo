import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';

@Directive({
    selector: '[appCompareDateStrings]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: CompareDateValidatorDirective,
        multi: true
    }]
})
export class CompareDateValidatorDirective implements Validator {
    constructor() {
        //console.log('asdasd',this.doerprof.avlList);
    }
    validate(datesGruop: AbstractControl): { [key: string]: any } | null {       
        let frmDate = datesGruop.get('start_date');
        let toDate = datesGruop.get('end_date');
        
        if (frmDate && toDate && (frmDate.value!='' && frmDate.value!=null) && (toDate.value!='' && toDate.value!=null)){            
            let start_date_custom = frmDate.value;
            let end_date_custom = toDate.value;

            var momentA = _moment(start_date_custom,"DD/MM/YYYY");
            var momentB = _moment(end_date_custom,"DD/MM/YYYY");
            

            let flag = false;

            if (momentA > momentB) {
                flag = true;
            }
            else if (momentA < momentB) {
                console.log('momentB');
            }
            else {
                /*flag = true;*/
            }
            
            if(flag){
                return { 'notEqual': true };
            }
            
        }

        return null;
    }
   
// tslint:disable-next-line:eofline
}