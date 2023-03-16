import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';
import { DoerProfileComponent } from './doer-profile.component'
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
    constructor(public doerprof:DoerProfileComponent) {
        //console.log('asdasd',this.doerprof.avlList);
    }
    validate(datesGruop: AbstractControl): { [key: string]: any } | null {       
        const frmDate = datesGruop.get('start_date');
        const toDate = datesGruop.get('end_date');
        
        if (frmDate && toDate && frmDate.value!='' && toDate.value!='' && (toDate.value!=null) && (frmDate.value!=null)){            
            console.log();
            let start_date_custom = frmDate.value;
            let totalstartDate = this.formatDate(start_date_custom);
            let end_date_custom = toDate.value;
            let totalendDate = this.formatDate(end_date_custom);
            let tempObj = this.doerprof.avlList;

            var momentA = _moment(totalstartDate,"DD/MM/YYYY");
            var momentB = _moment(totalendDate,"DD/MM/YYYY");

            for (let property in tempObj) {
                if (tempObj.hasOwnProperty(property)) {

                    console.log(tempObj[property]);
                    let end_date = tempObj[property].end_date;
                    let start_date = tempObj[property].start_date;
                    end_date = _moment(end_date).format("DD/MM/YYYY");
                    start_date = _moment(start_date).format("DD/MM/YYYY");
                    end_date = _moment(end_date,"DD/MM/YYYY");
                    start_date = _moment(start_date,"DD/MM/YYYY");
                    
                    if((start_date.isBetween(momentA, momentB)) || (end_date.isBetween(momentA, momentB)) || (momentA.isBetween(start_date, end_date)) || (momentB.isBetween(start_date, end_date)) || (momentB.isSame(start_date)) || (momentA.isSame(start_date)) || (momentA.isSame(end_date)) || (momentB.isSame(end_date))) {
                        return { 'inRange': true };
                    } 
                    
                    
                }
            }

            

            /*var compareDate = _moment("15-08-2018", "DD/MM/YYYY");
            console.log('compareDate',compareDate)
            let agnflag_start = compareDate.isBetween(momentA, momentB);
            console.log(agnflag_start);*/
            

            let flag = false;

            if (momentA > momentB) {
                //console.log('greater check');
                flag = true;
            }
            else if (momentA < momentB) {
                console.log('momentB');
            }
            else {
                //flag = true;
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