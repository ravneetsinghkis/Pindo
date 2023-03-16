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
        
        if (frmDate && toDate && frmDate.value!='' && toDate.value!='' && (toDate.value!=null) && (frmDate.value!=null)){            
            
            /*let start_date_custom = frmDate.value;
            console.log(start_date_custom);
            let totalstartDate = this.formatDate(start_date_custom);
            let end_date_custom = toDate.value;
            let totalendDate = this.formatDate(end_date_custom);*/

            var momentA = _moment(frmDate.value,"DD/MM/YYYY");
            var momentB = _moment(toDate.value,"DD/MM/YYYY");
            

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

    formatDate(obj) {
      //console.log(obj);
      let _year = obj._i.year;
      let _month = obj._i.month+1;
      let _date = obj._i.date;      
      if(_month.toString().length==1){
        _month = '0'+_month;
      }
      let tot_date = [_date,_month,_year].join('/');
      return tot_date;
    }
// tslint:disable-next-line:eofline
}